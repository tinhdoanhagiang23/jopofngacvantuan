-- BƯỚC NÂNG CẤP: theo dõi theo vị trí việc làm (VTVL), Biểu 01/02/B1 và bấm giờ
-- Cách dùng: Supabase > SQL Editor > New query > dán toàn bộ > Run. Chạy lại nhiều lần vẫn an toàn.
-- File này CHỈ có cấu trúc bảng, không có dữ liệu công việc.

-- 1. Bổ sung cột cho bảng công việc
alter table public.tasks add column if not exists ma_cv text;            -- mã công việc Biểu A2 (CV.NV.BTGTU.VP.25.01 ...)
alter table public.tasks add column if not exists vai_tro text default 'Chủ trì';  -- Chủ trì / Phối hợp
alter table public.tasks add column if not exists nhom_sp text;          -- nhóm loại văn bản A–G (Biểu 02, CV 3001)
alter table public.tasks add column if not exists muc_do smallint;       -- mức độ phức tạp 1–6 (I–VI)
alter table public.tasks add column if not exists loai_sp text;          -- tên loại sản phẩm hiển thị (Công văn, Lượt bảo đảm kỹ thuật...)
alter table public.tasks add column if not exists so_ky_hieu text;       -- số, ký hiệu văn bản
alter table public.tasks add column if not exists ngay_ban_hanh date;    -- ngày ban hành văn bản
alter table public.tasks add column if not exists so_phut integer;       -- thời gian thực tế (phút), cộng dồn khi bấm giờ
alter table public.tasks add column if not exists timer_start timestamptz; -- đang bấm giờ từ lúc nào (null = không bấm)
alter table public.tasks add column if not exists ngay_hoan_thanh date;  -- ngày hoàn thành thực tế (tính hệ số tiến độ)
alter table public.tasks add column if not exists nguon text;            -- nguồn dữ liệu (nạp ngược, nhập tay...)

update public.tasks set vai_tro = case when chu_tri is false then 'Phối hợp' else 'Chủ trì' end where vai_tro is null;
update public.tasks set ngay_hoan_thanh = ngay_kt where trang_thai = 'Hoàn thành' and ngay_hoan_thanh is null;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'tasks_nhom_sp_chk') then
    alter table public.tasks add constraint tasks_nhom_sp_chk check (nhom_sp is null or nhom_sp in ('A','B','C','D','E','F','G'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'tasks_muc_do_chk') then
    alter table public.tasks add constraint tasks_muc_do_chk check (muc_do is null or muc_do between 1 and 6);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'tasks_vai_tro_chk') then
    alter table public.tasks add constraint tasks_vai_tro_chk check (vai_tro is null or vai_tro in ('Chủ trì','Phối hợp'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'tasks_so_phut_chk') then
    alter table public.tasks add constraint tasks_so_phut_chk check (so_phut is null or so_phut >= 0);
  end if;
end $$;
create index if not exists idx_tasks_ma_cv on public.tasks (ma_cv);

-- 2. Danh mục công việc (Biểu A2) và định mức phút/sản phẩm (Biểu 02)
create table if not exists public.dm_cong_viec (
    ma text primary key,              -- CV.NV.BTGTU.VP.25.01
    ma_nv text,                       -- NV.BTGTU.VP.25
    ten_nv text,                      -- tên nhiệm vụ (Biểu A1)
    ma_vtvl text,                     -- TG.T-CM 05.11
    ten text not null,                -- tên công việc
    san_pham text, don_vi_tinh text, chat_luong text, can_cu text,
    thu_tu integer,
    hien_thi boolean default true,    -- hiện trong danh sách chọn
    created_at timestamptz default now()
);
create table if not exists public.dinh_muc (
    nhom text not null check (nhom in ('A','B','C','D','E','F','G')),
    muc smallint not null check (muc between 1 and 6),
    phut integer check (phut is null or phut >= 0),
    primary key (nhom, muc)
);

alter table public.dm_cong_viec enable row level security;
alter table public.dinh_muc enable row level security;
drop policy if exists "dn - dm_cong_viec" on public.dm_cong_viec;
drop policy if exists "dn - dinh_muc" on public.dinh_muc;
create policy "dn - dm_cong_viec" on public.dm_cong_viec for all to authenticated using (true) with check (true);
create policy "dn - dinh_muc" on public.dinh_muc for all to authenticated using (true) with check (true);

-- 3. Định mức mặc định (đề xuất đã dùng cho Biểu 02 kỳ 01/10/2025–30/9/2026; sửa được trong phần mềm)
insert into public.dinh_muc (nhom, muc, phut) values
 ('A',1,45),('A',2,90),('A',3,180),('A',4,360),('A',5,null),('A',6,null),
 ('B',1,null),('B',2,120),('B',3,240),('B',4,480),('B',5,960),('B',6,null),
 ('C',1,60),('C',2,180),('C',3,360),('C',4,720),('C',5,1440),('C',6,2400),
 ('D',1,null),('D',2,240),('D',3,480),('D',4,960),('D',5,1920),('D',6,null),
 ('E',1,null),('E',2,null),('E',3,480),('E',4,960),('E',5,1920),('E',6,null),
 ('F',1,null),('F',2,null),('F',3,960),('F',4,1440),('F',5,2400),('F',6,4800),
 ('G',1,null),('G',2,120),('G',3,240),('G',4,480),('G',5,960),('G',6,null)
on conflict (nhom, muc) do nothing;

-- 4. Thiết lập mặc định cho phần Vị trí việc làm (sửa được trong phần mềm)
insert into public.config (key, value) values
 ('vtvl_ma', 'TG.T-CM 05.11'),
 ('vtvl_ten', 'Chuyên viên về chuyển đổi số'),
 ('vtvl_to_chuc', 'Văn phòng Ban'),
 ('vtvl_quy_gio', '1904'),
 ('vtvl_ty_le_phoi_hop', '0.3')
on conflict (key) do nothing;
