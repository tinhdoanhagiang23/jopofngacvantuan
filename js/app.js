/* Giao diện chính: đăng nhập, điều hướng, các trang và xuất báo cáo. */
(function () {
  "use strict";
  const C = Core, esc = Charts.esc;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const STATUS_COLOR = { "Hoàn thành": "#1A9651", "Đang thực hiện": "#E67E22", "Chưa thực hiện": "#7D3C98", "Trễ hạn": "#C8102E" };
  const APP = { version: "2.0", year: "2026", dev: { name: "Ngạc Văn Tuấn", role: "Chuyên viên Văn phòng", org: "Ban Tuyên giáo Tỉnh ủy Tuyên Quang", phone: "0946657445", email: "ngacvantuan.hg@gmail.com" } };

  const IC = {
    home: '<path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1.2"/><circle cx="3.5" cy="12" r="1.2"/><circle cx="3.5" cy="18" r="1.2"/>',
    next: '<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4M9 15h6m-2.5-2.5L15 15l-2.5 2.5"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.2 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    info: '<circle cx="12" cy="12" r="9.5"/><path d="M12 11v5.5M12 7.8v.1"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/>',
    check: '<path d="m4 12.5 5 5L20 6.5"/>',
    dl: '<path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M4 20h16"/>',
    ul: '<path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 20h16"/>',
    brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="1.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    wand: '<path d="m15 4 1 2 2 1-2 1-1 2-1-2-2-1 2-1zM4 20 14 10"/>',
  };
  const ico = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;

  const S = { tasks: [], cfg: {}, page: "dash", filters: { kw: "", ts: "", loai: "", use: false, tu: "", den: "", ma: "" }, tab: 0, vtab: 0, nwtSel: null, ready: false,
    dm: [], dmMap: new Map(), dinhMuc: null, vtvlOk: false };
  const NAV = [["dash", "Tổng quan", "home"], ["tasks", "Công việc", "list"], ["nwt", "Nhiệm vụ tuần tới", "next"],
    ["reports", "Báo cáo & Xuất file", "file"], ["vtvl", "Vị trí việc làm", "brief"], ["cbcc", "Đánh giá CBCC", "star", true], ["settings", "Cài đặt", "cog"], ["about", "Giới thiệu", "info"]];

  // ───────────── tiện ích ─────────────
  function toast(msg, err) {
    const t = document.createElement("div"); t.className = "toast" + (err ? " err" : ""); t.textContent = msg;
    $("#toasts").appendChild(t); setTimeout(() => t.remove(), err ? 6000 : 3200);
  }
  const busy = (on) => $("#busy").classList.toggle("hidden", !on);
  async function guard(fn, okMsg) {
    busy(true);
    try { const r = await fn(); if (okMsg) toast(okMsg); return r; }
    catch (e) { console.error(e); toast(vnErr(e), true); }
    finally { busy(false); }
  }
  function vnErr(e) {
    const m = (e && e.message) || String(e);
    if (/Invalid login/i.test(m)) return "Sai email hoặc mật khẩu.";
    if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return "Không kết nối được máy chủ. Kiểm tra mạng hoặc trạng thái Supabase.";
    if (/JWT|permission|row-level|401|403/i.test(m)) return "Không có quyền truy cập dữ liệu — hãy đăng nhập lại.";
    return "Lỗi: " + m;
  }
  function msgDlg(html, buttons) {
    return new Promise((res) => {
      const d = $("#msgDlg");
      d.innerHTML = `<div class="dlg"><div>${html}</div><div class="dlg-foot">${buttons.map((b, i) =>
        `<button class="btn ${b.cls || ""}" data-i="${i}">${b.label}</button>`).join("")}</div></div>`;
      d.onclose = () => res(null);
      d.addEventListener("click", (e) => { const b = e.target.closest("button[data-i]"); if (b) { d.close(); res(buttons[+b.dataset.i].v); } }, { once: true });
      d.showModal();
    });
  }
  const confirmDlg = (html, ok = "Xóa") => msgDlg(html, [{ label: "Hủy", v: false }, { label: ok, cls: "primary", v: true }]).then(Boolean);
  const alertDlg = (html) => msgDlg(html, [{ label: "Đóng", cls: "primary", v: true }]);
  function saveBlob(blob, name) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  const safe = (s) => String(s).replace(/[\s/\\:]+/g, "_");
  const pill = (t) => `<span class="pill" style="--c:${STATUS_COLOR[t] || "#6B7280"}">${esc(t)}</span>`;
  const gioStr = (t) => [t.gio_bd || "", t.gio_kt || ""].filter(Boolean).join(" – ") || "Cả ngày";
  const inRange = (tasks, tu, den) => tasks.filter((t) => t.ngay_kt >= tu && t.ngay_bd <= den);
  const orgCfg = () => ({ cap_uy: S.cfg.cap_uy || "", ten_don_vi: S.cfg.ten_don_vi || "", dia_danh: S.cfg.dia_danh || "" });
  const loaiList = () => Array.from(new Set([...C.LOAI_CV, ...S.tasks.map((t) => t.loai).filter(Boolean)]));
  const opts = (arr, cur) => arr.map((a) => `<option${a === cur ? " selected" : ""}>${esc(a)}</option>`).join("");
  const trunc = (s, n) => { s = String(s || ""); return s.length > n ? s.slice(0, n - 1) + "…" : s; };

  // ───────────── vị trí việc làm: tiện ích chung ─────────────
  const cfgN = (k, d) => { const v = parseFloat(String(S.cfg[k] ?? "").replace(",", ".")); return Number.isFinite(v) ? v : d; };
  const vtvlMa = () => (S.cfg.vtvl_ma || "TG.T-CM 05.11").trim();
  const tyLePh = () => cfgN("vtvl_ty_le_phoi_hop", 0.3);
  const quyGio = () => cfgN("vtvl_quy_gio", 1904) || 1904;
  const maNgan = (ma) => String(ma || "").replace(/^CV\.NV\.BTGTU\./, "");
  const laCuaToi = (ma) => { const d = S.dmMap.get(ma); return !!d && (d.ma_vtvl || "").trim() === vtvlMa(); };
  const fmtNum = (x, n = 1) => (Math.round(x * 10 ** n) / 10 ** n).toLocaleString("vi-VN");
  function setDm(rows) { S.dm = rows || []; S.dmMap = new Map(S.dm.map((d) => [d.ma, d])); }
  function setDinhMuc(rows) {
    const o = {}; C.NHOM_SP.forEach((k) => { o[k] = [null, null, null, null, null, null]; });
    (rows || []).forEach((r) => { if (o[r.nhom] && r.muc >= 1 && r.muc <= 6) o[r.nhom][r.muc - 1] = r.phut == null ? null : +r.phut; });
    S.dinhMuc = rows && rows.length ? o : JSON.parse(JSON.stringify(C.DM_PHUT_MAC_DINH));
  }
  let DM_OPTS_CACHE = null;
  function dmOptions(cur) {
    if (!DM_OPTS_CACHE) {
      const mine = [], other = [], o = (d) => `<option value="${esc(d.ma)}">${esc(maNgan(d.ma))} – ${esc(trunc(d.ten, 100))}</option>`;
      S.dm.forEach((d) => { if ((d.ma_vtvl || "").trim() === vtvlMa()) mine.push(d); else if (d.hien_thi !== false) other.push(d); });
      DM_OPTS_CACHE = `<option value="">— Chưa gắn mã —</option>` +
        (mine.length ? `<optgroup label="Vị trí việc làm của tôi (${esc(vtvlMa())})">${mine.map(o).join("")}</optgroup>` : "") +
        (other.length ? `<optgroup label="Công việc khác">${other.map(o).join("")}</optgroup>` : "");
    }
    let h = DM_OPTS_CACHE;
    if (cur) {
      const tag = `<option value="${esc(cur)}">`;
      h = h.includes(tag) ? h.replace(tag, `<option value="${esc(cur)}" selected>`)
        : h + `<option value="${esc(cur)}" selected>${esc(maNgan(cur))} – ${esc(trunc((S.dmMap.get(cur) || {}).ten || "(không có trong danh mục)", 90))}</option>`;
    }
    return h;
  }
  const resetDmCache = () => { DM_OPTS_CACHE = null; };
  const nhomOpts = (cur, blank) => `<option value="">${blank || "—"}</option>` + C.NHOM_SP.map((k) => `<option value="${k}"${k === cur ? " selected" : ""} title="${esc(C.NHOM_SP_TEN[k])}">${k} – ${esc(C.NHOM_SP_NGAN[k])}</option>`).join("");
  const mucOpts = (cur, short) => `<option value="">—</option>` + [1, 2, 3, 4, 5, 6].map((m) => `<option value="${m}"${+cur === m ? " selected" : ""}>${short ? C.MUC_LA_MA[m] : `Mức ${C.MUC_LA_MA[m]} – ${C.MUC_TEN[m]}`}</option>`).join("");

  // ───────────── bấm giờ ─────────────
  const fmtDur = (ms) => { const s = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return (h ? h + ":" + C.pad(m) : String(m)) + ":" + C.pad(x); };
  const runningTask = () => S.tasks.find((t) => t.timer_start);
  function promptNum(html, def) {
    return new Promise((res) => {
      const d = $("#msgDlg");
      d.innerHTML = `<form class="dlg" method="dialog"><div>${html}</div><input type="number" id="pnV" min="0" value="${def}" style="margin-top:12px;width:170px">
        <div class="dlg-foot"><button class="btn" value="x">Hủy</button><button class="btn primary" value="ok">Đồng ý</button></div></form>`;
      d.returnValue = ""; d.onclose = () => res(d.returnValue === "ok" ? Math.max(0, parseInt($("#pnV").value, 10) || 0) : null);
      d.showModal(); $("#pnV").select();
    });
  }
  async function startTimer(t) {
    const cur = runningTask();
    if (cur && cur.id !== t.id && !(await stopTimer(cur))) return;
    const d = { timer_start: new Date().toISOString() };
    if (t.trang_thai === "Chưa thực hiện") d.trang_thai = "Đang thực hiện";
    const r = await guard(() => DB.Tasks.update(t.id, d), "Bắt đầu bấm giờ.");
    if (r) { Object.assign(t, r); timerChanged(); }
  }
  async function stopTimer(t) {
    const ms = Date.now() - new Date(t.timer_start).getTime();
    let add = Math.max(1, Math.round(ms / 60000));
    if (!(ms > 0) || add > 600) {
      const v = await promptNum(`Lần bấm giờ cho <b>${esc(trunc(t.title, 80))}</b> kéo dài <b>${fmtDur(ms)}</b> — có thể bạn quên dừng.<br>Nhập số phút thực tế cần cộng vào:`, Math.min(Math.max(add, 0), 480));
      if (v === null) return false; add = v;
    }
    const tong = (+t.so_phut || 0) + add;
    const r = await guard(() => DB.Tasks.update(t.id, { timer_start: null, so_phut: tong }), `Đã dừng — cộng ${add} phút (tổng ${tong} phút).`);
    if (r) { Object.assign(t, r); timerChanged(); return true; }
    return false;
  }
  function timerChanged() {
    renderTimerBar();
    if (S.page === "tasks" && $("#tBody")) drawTasks();
    else if (S.page === "dash") go("dash");
  }
  function renderTimerBar() {
    let bar = $("#timerBar");
    if (!bar) { bar = document.createElement("div"); bar.id = "timerBar"; bar.className = "timer-bar hidden"; document.body.appendChild(bar); }
    const t = runningTask();
    if (!t || !S.ready) { bar.classList.add("hidden"); return; }
    bar.innerHTML = `${ico("clock")}<div class="tb-t"><b data-tm="${esc(t.timer_start)}">0:00</b><span>${esc(trunc(t.title, 60))}</span></div>
      <button class="btn sm" id="tbStop">${ico("stop")} Dừng</button>`;
    bar.classList.remove("hidden");
    $("#tbStop").onclick = () => stopTimer(t);
    tick();
  }
  function tick() { $$("[data-tm]").forEach((el) => { el.textContent = fmtDur(Date.now() - new Date(el.dataset.tm).getTime()); }); }
  setInterval(tick, 1000);

  // ───────────── khởi động / đăng nhập ─────────────
  function show(id) { ["setup", "login", "app"].forEach((x) => $("#" + x).classList.toggle("hidden", x !== id)); }

  async function enterApp() {
    busy(true);
    try {
      const [tasks, cfg, dm, dmuc] = await Promise.all([DB.Tasks.all(), DB.Config.all(), DB.Dm.all(), DB.DinhMuc.all()]);
      S.tasks = tasks; S.cfg = cfg; S.ready = true;
      S.vtvlOk = dm !== null && dmuc !== null && (!tasks.length || "ma_cv" in tasks[0]);
      setDm(dm); setDinhMuc(dmuc); resetDmCache();
      show("app"); buildShell(); go(S.page); renderTimerBar();
      if (!S.vtvlOk) toast("Chưa nâng cấp cơ sở dữ liệu cho phần Vị trí việc làm — chạy file sql/03_nang_cap_vi_tri_viec_lam.sql trên Supabase.", true);
      if (!cfg.ten) { toast("Hãy nhập họ tên của bạn ở mục Cài đặt."); go("settings"); }
    } catch (e) { console.error(e); show("login"); $("#lgErr").textContent = vnErr(e); }
    finally { busy(false); }
  }

  function boot() {
    if (!DB.init()) { show("setup"); return; }
    DB.Auth.onChange((s) => { if (!s && S.ready) { S.ready = false; show("login"); } });
    DB.Auth.session().then((s) => (s ? enterApp() : show("login"))).catch(() => show("login"));
  }

  $("#setupForm").addEventListener("submit", (e) => {
    e.preventDefault(); DB.saveConn($("#setUrl").value, $("#setKey").value); boot();
  });
  $("#resetConn").addEventListener("click", (e) => { e.preventDefault(); DB.clearConn(); location.reload(); });
  $("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault(); $("#lgErr").textContent = ""; $("#lgBtn").disabled = true;
    try { await DB.Auth.signIn($("#lgEmail").value.trim(), $("#lgPass").value); $("#lgPass").value = ""; await enterApp(); }
    catch (er) { $("#lgErr").textContent = vnErr(er); }
    finally { $("#lgBtn").disabled = false; }
  });

  function buildShell() {
    $("#menuBtn").innerHTML = ico("menu"); $("#logoutBtn").innerHTML = ico("out");
    $("#nav").innerHTML = NAV.map(([id, l, ic, soon]) =>
      `<button data-p="${id}" class="${soon ? "soon" : ""}">${ico(ic)}<span>${l.replace("&", "&amp;")}</span>${soon ? "<em>Sắp có</em>" : ""}</button>`).join("");
    refreshUser();
  }
  function refreshUser() {
    const n = S.cfg.ten || "Chưa nhập tên";
    $("#uName").textContent = n; $("#uRole").textContent = S.cfg.chuc_vu || "Chuyên viên";
    $("#uAvatar").textContent = n.trim().split(/\s+/).pop().charAt(0).toUpperCase();
  }
  $("#nav").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-p]"); if (!b) return;
    if (b.classList.contains("soon")) { toast("Mục Đánh giá cán bộ, công chức sẽ được bổ sung ở bản sau."); return; }
    go(b.dataset.p); closeMenu();
  });
  const closeMenu = () => { $("#sidebar").classList.remove("open"); $("#scrim").classList.remove("show"); };
  $("#menuBtn").addEventListener("click", () => { $("#sidebar").classList.add("open"); $("#scrim").classList.add("show"); });
  $("#scrim").addEventListener("click", closeMenu);
  $("#logoutBtn").addEventListener("click", async () => {
    if (await confirmDlg("Đăng xuất khỏi thiết bị này?", "Đăng xuất")) { await DB.Auth.signOut(); S.ready = false; renderTimerBar(); show("login"); }
  });

  function go(p) {
    S.page = p;
    $$("#nav button").forEach((b) => b.classList.toggle("on", b.dataset.p === p));
    const nav = NAV.find((n) => n[0] === p); $("#tbTitle").textContent = nav ? nav[1] : "";
    const R = { dash: pageDash, tasks: pageTasks, nwt: pageNwt, reports: pageReports, vtvl: pageVtvl, settings: pageSettings, about: pageAbout }[p];
    $("#content").innerHTML = ""; window.scrollTo(0, 0);
    if (R) R($("#content"));
  }

  const head = (t, sub, right) => `<div class="page-head"><div><h1>${t}</h1>${sub ? `<p>${sub}</p>` : ""}</div>${right || ""}</div>`;
  const stat = (l, v, c, s) => `<div class="card stat" style="--c:${c}"><small>${l}</small><strong>${v}</strong><span>${s || "&nbsp;"}</span></div>`;

  // ───────────── TỔNG QUAN ─────────────
  function pageDash(root) {
    const t0 = C.today(), tasks = S.tasks, tong = tasks.length;
    const cnt = {}; tasks.forEach((t) => { cnt[t.trang_thai] = (cnt[t.trang_thai] || 0) + 1; });
    const ht = cnt["Hoàn thành"] || 0, pt = tong ? Math.round((ht / tong) * 100) : 0;
    const y = t0.getFullYear(), tot = [], done = [];
    for (let m = 1; m <= 12; m++) {
      const mt = inRange(tasks, `${y}-${C.pad(m)}-01`, `${y}-${C.pad(m)}-${C.pad(C.lastDay(y, m))}`);
      tot.push(mt.length); done.push(mt.filter((t) => t.trang_thai === "Hoàn thành").length);
    }
    const cats = [], tw = [], dw = [];
    for (let w = 7; w >= 0; w--) {
      const mon = C.addDays(C.mondayOf(t0), -7 * w), wt = inRange(tasks, C.iso(mon), C.iso(C.addDays(mon, 6)));
      cats.push("T" + C.isoWeek(mon)[0]); tw.push(wt.length); dw.push(wt.filter((t) => t.trang_thai === "Hoàn thành").length);
    }
    const loai = {}; tasks.forEach((t) => { const k = t.loai || "Khác"; loai[k] = (loai[k] || 0) + 1; });
    const ds = C.iso(t0), today = tasks.filter((t) => t.ngay_bd <= ds && t.ngay_kt >= ds);
    // Vị trí việc làm — kỳ đang diễn ra (01/10 năm trước – 30/9)
    const namKy = t0.getMonth() >= 9 ? y + 1 : y, ky = C.kyRange("Kỳ VTVL (01/10–30/9)", { nam: namKy });
    const kyTasks = tasksVtvl(ky.tu, ky.den);
    const b1 = C.tongHopB1(kyTasks, { dinhMuc: S.dinhMuc, tyLePh: tyLePh() });
    let gioToi = 0, spToi = 0; b1.forEach((r) => { if (laCuaToi(r.ma)) { gioToi += r.gioTong; spToi += r.sl; } });
    const chuaGan = kyTasks.filter((t) => !t.ma_cv).length;
    const daQua = Math.min(1, Math.max(0.01, (C.daysBetween(ky.tu, t0) + 1) / 365));
    const run = runningTask();
    const vtvlHtml = S.vtvlOk ? `<div class="section-label">Vị trí việc làm — ${esc(ky.nhan)} (${esc(S.cfg.vtvl_ten || vtvlMa())})</div>
      <div class="grid g4">${stat("VĂN BẢN CHỦ TRÌ", spToi, "#C8102E", "đếm vào Biểu 02")}
        ${stat("GIỜ THEO VTVL", fmtNum(gioToi), "#0D1B2A", `≈ ${fmtNum(gioToi / quyGio(), 2)} người/năm`)}
        ${stat("SO VỚI TIẾN ĐỘ NĂM", Math.round((gioToi / (quyGio() * daQua)) * 100) + "%", "#F5A623", `quỹ ${fmtNum(quyGio(), 0)} giờ × ${Math.round(daQua * 100)}% thời gian kỳ`)}
        ${stat("CHƯA GẮN MÃ", chuaGan, chuaGan ? "#E67E22" : "#1A9651", chuaGan ? '<a href="#" id="dTag">gắn mã ngay →</a>' : "đã gắn đủ")}</div>` : "";
    root.innerHTML = `
      <div class="page-head"><div><h1>Xin chào, ${esc(S.cfg.ten || "bạn")}!</h1>
        <p>${C.VN_THU[C.weekday(t0)]}, ngày ${t0.getDate()} tháng ${t0.getMonth() + 1} năm ${t0.getFullYear()}</p></div>
        <button class="btn primary" id="dAdd">${ico("plus")} Thêm công việc</button></div>
      ${run ? `<div class="card run-card">${ico("clock")}<div><small>ĐANG BẤM GIỜ</small><b>${esc(run.title)}</b></div><strong data-tm="${esc(run.timer_start)}">0:00</strong><button class="btn" id="dStop">${ico("stop")} Dừng</button></div>` : ""}
      <div class="grid g5">
        ${stat("TỔNG CÔNG VIỆC", tong, "#2A5298", "toàn bộ")}${stat("HOÀN THÀNH", ht, "#1A9651", pt + "% tổng số")}
        ${stat("ĐANG THỰC HIỆN", cnt["Đang thực hiện"] || 0, "#E67E22")}${stat("CHƯA THỰC HIỆN", cnt["Chưa thực hiện"] || 0, "#7D3C98")}
        ${stat("TRỄ HẠN", cnt["Trễ hạn"] || 0, "#C8102E", cnt["Trễ hạn"] ? "cần xử lý" : "")}</div>
      <div class="grid g-12" style="margin-top:14px">
        <div class="card"><h3>Trạng thái công việc</h3>${Charts.donut(C.TRANG_THAI.map((k) => [k, cnt[k] || 0, STATUS_COLOR[k]]))}</div>
        <div class="card"><h3>Tiến độ theo tháng — ${y}</h3>${Charts.bars(Array.from({ length: 12 }, (_, i) => "T" + (i + 1)), [["Tổng", "#2A5298", tot], ["Hoàn thành", "#1A9651", done]])}</div></div>
      <div class="grid g2" style="margin-top:14px">
        <div class="card"><h3>Phân loại công việc</h3>${Charts.hbars(Object.entries(loai), "#C8102E")}</div>
        <div class="card"><h3>Xu hướng 8 tuần gần nhất</h3>${Charts.line(cats, [["Tổng", "#2A5298", tw], ["Hoàn thành", "#1A9651", dw]])}</div></div>
      ${vtvlHtml}
      <div class="section-label">Công việc hôm nay</div>
      <div class="card">${today.length ? today.map((t) => `<div class="today-item"><div class="tm">${esc(gioStr(t))}</div><div class="tt">${esc(t.title)}</div>${pill(t.trang_thai)}</div>`).join("")
        : '<p class="muted" style="margin:0">Không có công việc nào hôm nay.</p>'}</div>`;
    $("#dAdd").onclick = () => taskDialog();
    if ($("#dStop")) $("#dStop").onclick = () => stopTimer(run);
    if ($("#dTag")) $("#dTag").onclick = (e) => { e.preventDefault(); S.vtab = 1; go("vtvl"); };
    tick();
  }

  // ───────────── CÔNG VIỆC ─────────────
  function pageTasks(root) {
    const f = S.filters;
    root.innerHTML = head("Lịch & Quản lý công việc", "Thêm, sửa, theo dõi toàn bộ công việc của bạn.", `<button class="btn primary" id="tAdd">${ico("plus")} Thêm công việc</button>`) + `
      <div class="card flat filters">
        <input id="fKw" placeholder="Tìm theo tiêu đề, địa điểm…" value="${esc(f.kw)}">
        <select id="fTs"><option value="">Tất cả trạng thái</option>${opts(C.TRANG_THAI, f.ts)}</select>
        <select id="fLoai"><option value="">Tất cả loại</option>${opts(loaiList(), f.loai)}</select>
        <select id="fMa"><option value="">Mọi mã công việc</option><option value="__none"${f.ma === "__none" ? " selected" : ""}>Chưa gắn mã</option><option value="__mine"${f.ma === "__mine" ? " selected" : ""}>Thuộc VTVL của tôi</option></select>
        <label class="f row"><input type="checkbox" id="fUse"${f.use ? " checked" : ""}> Lọc ngày</label>
        <input type="date" id="fTu" value="${f.tu}"><input type="date" id="fDen" value="${f.den}">
      </div>
      <div class="table-wrap cardwrap"><table class="tbl cards"><thead><tr><th>Ngày</th><th>Giờ</th><th>Công việc</th><th>Loại</th><th>Trạng thái</th><th>Địa điểm</th><th></th></tr></thead><tbody id="tBody"></tbody></table></div>
      <p class="hint" id="tCount" style="margin-top:10px"></p>`;
    if (!f.tu) { f.tu = C.iso(new Date(C.today().getFullYear(), C.today().getMonth(), 1)); f.den = C.iso(C.today()); $("#fTu").value = f.tu; $("#fDen").value = f.den; }
    $("#tAdd").onclick = () => taskDialog();
    const upd = () => { f.kw = $("#fKw").value; f.ts = $("#fTs").value; f.loai = $("#fLoai").value; f.ma = $("#fMa").value; f.use = $("#fUse").checked; f.tu = $("#fTu").value; f.den = $("#fDen").value; drawTasks(); };
    ["fKw", "fTs", "fLoai", "fMa", "fUse", "fTu", "fDen"].forEach((id) => $("#" + id).addEventListener(id === "fKw" ? "input" : "change", upd));
    $("#tBody").addEventListener("click", async (e) => {
      const b = e.target.closest("[data-a]"); if (!b) return;
      const id = +b.dataset.id, t = S.tasks.find((x) => x.id === id); if (!t) return;
      if (b.dataset.a === "edit") taskDialog(t);
      if (b.dataset.a === "play") return startTimer(t);
      if (b.dataset.a === "stop") return stopTimer(t);
      if (b.dataset.a === "done") {
        if (t.timer_start && !(await stopTimer(t))) return;
        const d = { trang_thai: "Hoàn thành" }; if (!t.ngay_hoan_thanh) d.ngay_hoan_thanh = C.iso(C.today());
        const r = await guard(() => DB.Tasks.update(id, d), "Đã đánh dấu hoàn thành.");
        if (r) { Object.assign(t, r); drawTasks(); }
      }
      if (b.dataset.a === "del" && await confirmDlg(`Xóa công việc <b>${esc(t.title)}</b>?<br><span class="muted">Không thể hoàn tác.</span>`)) {
        const ok = await guard(async () => { await DB.Tasks.remove(id); return true; }, "Đã xóa công việc.");
        if (ok) { S.tasks = S.tasks.filter((x) => x.id !== id); drawTasks(); }
      }
    });
    drawTasks();
  }
  function drawTasks() {
    const f = S.filters; let rows = S.tasks.slice();
    if (f.use && f.tu && f.den) rows = inRange(rows, f.tu, f.den);
    const kw = f.kw.trim().toLowerCase();
    if (kw) rows = rows.filter((t) => t.title.toLowerCase().includes(kw) || (t.dia_diem || "").toLowerCase().includes(kw) || (t.so_ky_hieu || "").toLowerCase().includes(kw));
    if (f.ts) rows = rows.filter((t) => t.trang_thai === f.ts);
    if (f.loai) rows = rows.filter((t) => t.loai === f.loai);
    if (f.ma === "__none") rows = rows.filter((t) => !t.ma_cv);
    else if (f.ma === "__mine") rows = rows.filter((t) => laCuaToi(t.ma_cv));
    rows.sort((a, b) => (b.ngay_bd + (b.gio_bd || "")).localeCompare(a.ngay_bd + (a.gio_bd || "")) || b.id - a.id);
    $("#tBody").innerHTML = rows.length ? rows.map((t) => {
      const d1 = C.fmtD(t.ngay_bd), d2 = C.fmtD(t.ngay_kt);
      return `<tr><td data-l="Ngày">${d1 === d2 ? d1 : d1 + " → " + d2}</td><td data-l="Giờ">${esc(gioStr(t))}</td>
        <td class="ttl">${esc(t.title)}${subLine(t)}</td><td data-l="Loại">${esc(t.loai || "")}</td><td class="st">${pill(t.trang_thai)}</td>
        <td data-l="Địa điểm">${esc(t.dia_diem || "")}</td>
        <td class="act"><div class="tbl-actions">
          ${t.timer_start ? `<button class="icon-btn red" title="Dừng bấm giờ" data-a="stop" data-id="${t.id}">${ico("stop")}</button>`
            : `<button class="icon-btn" title="Bắt đầu bấm giờ" data-a="play" data-id="${t.id}" style="color:#2A5298">${ico("play")}</button>`}
          ${t.trang_thai !== "Hoàn thành" ? `<button class="icon-btn" title="Đánh dấu hoàn thành" data-a="done" data-id="${t.id}" style="color:#1A9651">${ico("check")}</button>` : ""}
          <button class="icon-btn" title="Sửa" data-a="edit" data-id="${t.id}">${ico("edit")}</button>
          <button class="icon-btn red" title="Xóa" data-a="del" data-id="${t.id}">${ico("trash")}</button></div></td></tr>`;
    }).join("") : `<tr><td colspan="7" class="empty">Không có công việc nào phù hợp.</td></tr>`;
    const ph = rows.reduce((a, t) => a + (+t.so_phut || 0), 0);
    $("#tCount").textContent = `Tổng: ${rows.length} công việc` + (ph ? ` · thời gian đã ghi nhận ${fmtNum(ph / 60)} giờ` : "");
    tick();
  }
  function subLine(t) {
    const p = [];
    if (t.ma_cv) p.push(`<span class="tag${laCuaToi(t.ma_cv) ? " mine" : ""}" title="${esc((S.dmMap.get(t.ma_cv) || {}).ten || "")}">${esc(maNgan(t.ma_cv))}</span>`);
    if (t.nhom_sp) p.push(`<span class="tag grey">${esc(t.nhom_sp)}${t.muc_do ? "·" + C.MUC_LA_MA[t.muc_do] : ""}${C.laPhoiHop(t) ? " · PH" : ""}</span>`);
    if (t.so_ky_hieu) p.push(`<span class="muted">${esc(t.so_ky_hieu)}</span>`);
    if (t.timer_start) p.push(`<span class="tag run">${ico("clock")} <b data-tm="${esc(t.timer_start)}">0:00</b></span>`);
    if (t.so_phut) p.push(`<span class="muted">${t.so_phut} phút</span>`);
    return p.length ? `<div class="sub">${p.join(" ")}</div>` : "";
  }

  // ───────────── HỘP THOẠI THÊM / SỬA ─────────────
  function taskDialog(task) {
    const d = task || {}, t0 = C.iso(C.today()), dlg = $("#taskDlg");
    const v = (x) => esc(x == null ? "" : x);
    dlg.innerHTML = `<form class="dlg" id="tForm" novalidate>
      <h2>${task ? "Sửa công việc" : "Thêm công việc mới"}</h2>
      <div class="form-grid">
        <label class="f span2">Tiêu đề (*)<input id="f_title" value="${v(d.title)}" required maxlength="500"></label>
        <label class="f span2">Loại công việc<select id="f_loai">${opts(loaiList(), d.loai || "Khác")}</select></label>
        <label class="f">Từ ngày<input type="date" id="f_bd" value="${d.ngay_bd || t0}" required></label>
        <label class="f">Đến ngày<input type="date" id="f_kt" value="${d.ngay_kt || d.ngay_bd || t0}" required></label>
        <label class="f">Ưu tiên<select id="f_uu">${opts(C.UU_TIEN, d.uu_tien || "Bình thường")}</select></label>
        <label class="f">Trạng thái<select id="f_ts">${opts(C.TRANG_THAI, d.trang_thai || "Chưa thực hiện")}</select></label>
        <label class="f">Giờ bắt đầu<input type="time" id="f_gbd" value="${v(d.gio_bd)}"></label>
        <label class="f">Giờ kết thúc<input type="time" id="f_gkt" value="${v(d.gio_kt)}"></label>
        <label class="f">Địa điểm<input id="f_dd" value="${v(d.dia_diem)}"></label>
        <label class="f">Người phụ trách<input id="f_pt" value="${v(d.nguoi_pt)}"></label>
      </div>
      <div class="section-label" style="margin-top:18px">Thông tin cho Mẫu báo cáo CBCC VP (không bắt buộc)</div>
      <div class="form-grid">
        <label class="f">Lãnh đạo giao<input id="f_ldg" value="${v(d.lanh_dao_giao)}"></label>
        <label class="f">Thời hạn yêu cầu hoàn thành<input type="date" id="f_han" value="${v(d.thoi_han_vb)}"></label>
        <label class="f">Lãnh đạo thẩm định, duyệt<input id="f_ldtd" value="${v(d.lanh_dao_tham_dinh)}"></label>
        <label class="f">Phối hợp (nếu có)<input id="f_ph" value="${v(d.phoi_hop)}"></label>
        <label class="f span4">Kết quả thực hiện<input id="f_kq" value="${v(d.ket_qua)}"></label>
        <label class="f span4">Ghi chú<textarea id="f_gc" rows="2">${v(d.ghi_chu)}</textarea></label>
      </div>
      ${S.vtvlOk ? `<div class="section-label" style="margin-top:18px">Vị trí việc làm — dùng cho Biểu 01, 02, B1 và chấm điểm KPI</div>
      <div class="form-grid">
        <label class="f span4">Mã công việc (Biểu A2)<select id="f_macv">${dmOptions(d.ma_cv || "")}</select></label>
        <label class="f">Vai trò<select id="f_vt">${opts(C.VAI_TRO, d.vai_tro || (d.chu_tri === false ? "Phối hợp" : "Chủ trì"))}</select></label>
        <label class="f">Nhóm loại văn bản<select id="f_nhom">${nhomOpts(d.nhom_sp || "", "— Không phải văn bản")}</select></label>
        <label class="f">Mức độ phức tạp<select id="f_muc">${mucOpts(d.muc_do)}</select></label>
        <label class="f">Loại sản phẩm<input id="f_lsp" list="f_lspL" value="${v(d.loai_sp)}" placeholder="VD: Công văn, Lượt bảo đảm kỹ thuật"><datalist id="f_lspL">${[...Object.values(C.NHOM_SP_NGAN), ...C.LOAI_SP_KT].map((x) => `<option value="${esc(x)}">`).join("")}</datalist></label>
        <label class="f">Số, ký hiệu văn bản<input id="f_skh" value="${v(d.so_ky_hieu)}" placeholder="VD: 55-CV/BTGTU"></label>
        <label class="f">Ngày ban hành<input type="date" id="f_nbh" value="${v(d.ngay_ban_hanh)}"></label>
        <label class="f">Thời gian thực tế (phút)<input type="number" min="0" id="f_phut" value="${v(d.so_phut)}" placeholder="bấm giờ tự cộng"></label>
        <label class="f">Ngày hoàn thành thực tế<input type="date" id="f_nht" value="${v(d.ngay_hoan_thanh)}"></label>
        <div class="span4 hint" id="f_dmInfo" style="margin:0"></div>
        <div class="span4"><button type="button" class="btn sm" id="f_goiy">${ico("wand")} Gợi ý nhóm, số ký hiệu từ tiêu đề</button></div>
      </div>` : ""}
      <div class="form-err" id="f_err"></div>
      <div class="dlg-foot"><button type="button" class="btn" id="f_cancel">Hủy</button><button type="submit" class="btn primary" id="f_save">Lưu công việc</button></div>
    </form>`;
    dlg.showModal();
    $("#f_cancel").onclick = () => dlg.close();
    $("#f_bd").addEventListener("change", () => { if ($("#f_kt").value < $("#f_bd").value) $("#f_kt").value = $("#f_bd").value; });
    $("#f_ts").addEventListener("change", () => { if ($("#f_ts").value === "Hoàn thành" && $("#f_nht") && !$("#f_nht").value) $("#f_nht").value = C.iso(C.today()); });
    if (S.vtvlOk) {
      const info = () => {
        const nhom = $("#f_nhom").value, muc = +$("#f_muc").value, ph = $("#f_vt").value === "Phối hợp", dm = S.dmMap.get($("#f_macv").value);
        let h = dm ? `<b>${esc(maNgan(dm.ma))}</b>: ${esc(dm.ten)}${dm.san_pham ? ` — <i>Sản phẩm: ${esc(dm.san_pham)}</i>` : ""}<br>` : "";
        if (nhom && muc) {
          const p = C.dmPhut(S.dinhMuc, nhom, muc);
          h += p == null ? `<span style="color:var(--red)">Chưa có định mức cho nhóm ${nhom} – mức ${C.MUC_LA_MA[muc]} (sửa ở Vị trí việc làm → Định mức).</span>`
            : `Định mức Biểu 02: <b>${p} phút</b>/sản phẩm${ph ? ` · vai trò phối hợp tính ${Math.round(p * tyLePh())} phút (${Math.round(tyLePh() * 100)}%)` : ""}.`;
        } else if (nhom || muc) h += `<span style="color:var(--orange)">Văn bản cần chọn đủ nhóm và mức độ phức tạp.</span>`;
        else h += "Sản phẩm không phải văn bản: tính theo thời gian thực tế (phút đã ghi hoặc ước tính từ giờ bắt đầu – kết thúc).";
        $("#f_dmInfo").innerHTML = h;
      };
      ["f_macv", "f_nhom", "f_muc", "f_vt"].forEach((id) => $("#" + id).addEventListener("change", info)); info();
      $("#f_nhom").addEventListener("change", () => { const k = $("#f_nhom").value; if (k && !$("#f_lsp").value) $("#f_lsp").value = C.NHOM_SP_NGAN[k]; });
      $("#f_goiy").onclick = () => {
        const tt = $("#f_title").value + " " + $("#f_kq").value;
        const k = C.goiYNhom($("#f_title").value), so = C.timSoKyHieu(tt);
        if (k && !$("#f_nhom").value) { $("#f_nhom").value = k; if (!$("#f_lsp").value) $("#f_lsp").value = C.NHOM_SP_NGAN[k]; }
        if (so && !$("#f_skh").value) $("#f_skh").value = so;
        if (/phối hợp|tham mưu một phần/i.test($("#f_title").value)) $("#f_vt").value = "Phối hợp";
        info(); toast(k || so ? "Đã gợi ý — kiểm tra lại trước khi lưu." : "Không nhận ra nhóm/số ký hiệu từ tiêu đề.");
      };
    }
    $("#tForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = $("#f_title").value.trim(), bd = $("#f_bd").value, kt = $("#f_kt").value;
      if (!title) return ($("#f_err").textContent = "Vui lòng nhập tiêu đề!");
      if (!bd || !kt) return ($("#f_err").textContent = "Vui lòng chọn ngày bắt đầu và kết thúc.");
      if (kt < bd) return ($("#f_err").textContent = "Ngày kết thúc không được trước ngày bắt đầu.");
      const data = { title, loai: $("#f_loai").value, uu_tien: $("#f_uu").value, ngay_bd: bd, ngay_kt: kt,
        gio_bd: $("#f_gbd").value || null, gio_kt: $("#f_gkt").value || null, dia_diem: $("#f_dd").value.trim() || null,
        nguoi_pt: $("#f_pt").value.trim() || null, trang_thai: $("#f_ts").value, ket_qua: $("#f_kq").value.trim() || null,
        ghi_chu: $("#f_gc").value.trim() || null, lanh_dao_giao: $("#f_ldg").value.trim() || null, thoi_han_vb: $("#f_han").value || null,
        lanh_dao_tham_dinh: $("#f_ldtd").value.trim() || null, phoi_hop: $("#f_ph").value.trim() || null };
      if (S.vtvlOk) {
        const nhom = $("#f_nhom").value || null, muc = $("#f_muc").value ? +$("#f_muc").value : null, phut = $("#f_phut").value;
        if ((nhom && !muc) || (!nhom && muc)) return ($("#f_err").textContent = "Văn bản cần chọn đủ nhóm loại và mức độ phức tạp (hoặc để trống cả hai).");
        if (phut !== "" && (!(+phut >= 0) || +phut > 100000)) return ($("#f_err").textContent = "Thời gian thực tế (phút) không hợp lệ.");
        Object.assign(data, { ma_cv: $("#f_macv").value || null, vai_tro: $("#f_vt").value, chu_tri: $("#f_vt").value === "Chủ trì", nhom_sp: nhom, muc_do: muc,
          loai_sp: $("#f_lsp").value.trim() || null, so_ky_hieu: $("#f_skh").value.trim() || null, ngay_ban_hanh: $("#f_nbh").value || null,
          so_phut: phut === "" ? null : Math.round(+phut), ngay_hoan_thanh: $("#f_nht").value || (data.trang_thai === "Hoàn thành" ? kt : null) });
      }
      if (!task) data.truc = C.goiYTruc(title);
      $("#f_save").disabled = true;
      const r = await guard(() => (task ? DB.Tasks.update(task.id, data) : DB.Tasks.insert(data)), "Đã lưu công việc.");
      $("#f_save").disabled = false;
      if (!r) return;
      if (task) Object.assign(S.tasks.find((x) => x.id === task.id), r); else S.tasks.push(r);
      dlg.close(); go(S.page);
    });
  }

  // ───────────── NHIỆM VỤ TUẦN TỚI ─────────────
  async function pageNwt(root) {
    const nm = C.addDays(C.mondayOf(C.today()), 7), [w0, y0] = C.isoWeek(nm);
    root.innerHTML = head("Nhiệm vụ tuần tới", "Dùng cho mục 2 của Mẫu Tổng hợp BC của CBCC VP — lên kế hoạch trước cho tuần sau.") + `
      <div class="card"><div class="form-grid">
        <label class="f">Tuần (số ISO)<input type="number" id="nTuan" min="1" max="53" value="${w0}"></label>
        <label class="f">Năm<input type="number" id="nNam" min="2020" max="2100" value="${y0}"></label>
        <label class="f span2">Nội dung nhiệm vụ (*)<input id="nND" placeholder="Nội dung nhiệm vụ"></label>
        <label class="f span2">Phối hợp (nếu có)<input id="nPH"></label>
        <label class="f span2">Thời gian hoàn thành dự kiến<input id="nTG" placeholder="VD: Trước 15/07"></label>
      </div><div class="dlg-foot" style="position:static"><button class="btn hidden" id="nCancel">Hủy sửa</button><button class="btn primary" id="nAdd">${ico("plus")} <span id="nAddL">Thêm vào tuần tới</span></button></div></div>
      <div class="section-label" id="nCap"></div>
      <div class="table-wrap cardwrap"><table class="tbl cards"><thead><tr><th style="width:56px">STT</th><th>Nội dung</th><th>Phối hợp</th><th>Thời gian hoàn thành dự kiến</th><th></th></tr></thead><tbody id="nBody"></tbody></table></div>`;
    let rows = [], editing = null;
    const key = () => [+$("#nTuan").value, +$("#nNam").value];
    async function load() {
      const [w, y] = key();
      rows = (await guard(() => DB.Nwt.query(w, y))) || [];
      $("#nCap").textContent = `TUẦN ${w}/${y}: ${rows.length} NHIỆM VỤ DỰ KIẾN`;
      $("#nBody").innerHTML = rows.length ? rows.map((r, i) => `<tr><td class="num" data-l="STT">${i + 1}</td><td class="ttl">${esc(r.noi_dung)}</td>
        <td data-l="Phối hợp">${esc(r.phoi_hop || "—")}</td><td data-l="Thời gian">${esc(r.thoi_gian_hoan_thanh || "—")}</td>
        <td class="act"><div class="tbl-actions"><button class="icon-btn" data-a="edit" data-id="${r.id}" title="Sửa">${ico("edit")}</button>
        <button class="icon-btn red" data-a="del" data-id="${r.id}" title="Xóa">${ico("trash")}</button></div></td></tr>`).join("")
        : `<tr><td colspan="5" class="empty">Chưa có nhiệm vụ nào cho tuần này.</td></tr>`;
    }
    const reset = () => { editing = null; $("#nND").value = $("#nPH").value = $("#nTG").value = ""; $("#nAddL").textContent = "Thêm vào tuần tới"; $("#nCancel").classList.add("hidden"); };
    $("#nTuan").addEventListener("change", () => { reset(); load(); }); $("#nNam").addEventListener("change", () => { reset(); load(); });
    $("#nCancel").onclick = reset;
    $("#nAdd").onclick = async () => {
      const nd = $("#nND").value.trim(); if (!nd) return toast("Vui lòng nhập nội dung nhiệm vụ.", true);
      const [w, y] = key(), d = { noi_dung: nd, phoi_hop: $("#nPH").value.trim(), thoi_gian_hoan_thanh: $("#nTG").value.trim(), tuan: w, nam: y };
      const r = await guard(() => (editing ? DB.Nwt.update(editing, d) : DB.Nwt.insert(d)), editing ? "Đã cập nhật." : "Đã thêm nhiệm vụ.");
      if (r) { reset(); load(); }
    };
    $("#nBody").addEventListener("click", async (e) => {
      const b = e.target.closest("[data-a]"); if (!b) return;
      const r = rows.find((x) => x.id === +b.dataset.id); if (!r) return;
      if (b.dataset.a === "edit") {
        editing = r.id; $("#nND").value = r.noi_dung; $("#nPH").value = r.phoi_hop || ""; $("#nTG").value = r.thoi_gian_hoan_thanh || "";
        $("#nAddL").textContent = "Cập nhật nhiệm vụ"; $("#nCancel").classList.remove("hidden"); $("#nND").focus(); window.scrollTo(0, 0);
      } else if (await confirmDlg(`Xóa nhiệm vụ <b>${esc(r.noi_dung)}</b>?`)) {
        if (await guard(async () => { await DB.Nwt.remove(r.id); return true; }, "Đã xóa.")) { reset(); load(); }
      }
    });
    load();
  }

  // ───────────── BÁO CÁO & XUẤT FILE ─────────────
  function periodHtml(id, def) {
    const t = C.today(), ys = [];
    for (let y = t.getFullYear() - 5; y <= t.getFullYear() + 1; y++) ys.push(y);
    return `<div class="period" id="${id}">
      <label class="f">Kỳ báo cáo<select data-k="loai">${opts(C.KY_LOAI, def)}</select></label>
      <label class="f" data-for="Tuần">Chọn 1 ngày trong tuần<input type="date" data-k="ngay" value="${C.iso(t)}"></label>
      <label class="f" data-for="Tháng">Tháng<select data-k="thang">${Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}"${i === t.getMonth() ? " selected" : ""}>Tháng ${i + 1}</option>`).join("")}</select></label>
      <label class="f" data-for="Quý">Quý<select data-k="quy">${["I", "II", "III", "IV"].map((q, i) => `<option value="${i + 1}"${i === Math.floor(t.getMonth() / 3) ? " selected" : ""}>Quý ${q}</option>`).join("")}</select></label>
      <label class="f" data-for="Tháng,Quý,6 tháng đầu năm,9 tháng đầu năm,Năm,Kỳ VTVL (01/10–30/9)">Năm<select data-k="nam">${ys.map((y) => `<option${y === t.getFullYear() ? " selected" : ""}>${y}</option>`).join("")}</select></label>
      <label class="f" data-for="Tùy chọn">Từ ngày<input type="date" data-k="tu" value="${C.iso(new Date(t.getFullYear(), t.getMonth(), 1))}"></label>
      <label class="f" data-for="Tùy chọn">Đến ngày<input type="date" data-k="den" value="${C.iso(t)}"></label>
      <label class="f" data-for="Tùy chọn">Tên kỳ<input data-k="nhan" value="kỳ báo cáo"></label></div>`;
  }
  function periodGet(id) {
    const r = $("#" + id), g = (k) => $(`[data-k=${k}]`, r).value, loai = g("loai");
    return C.kyRange(loai, { ngay: C.parseISO(g("ngay")), thang: +g("thang"), quy: +g("quy"), nam: +g("nam"),
      tu: C.parseISO(g("tu")), den: C.parseISO(g("den")), nhan: g("nhan").trim() });
  }
  function periodWire(id, fn) {
    const r = $("#" + id), vis = () => { const l = $(`[data-k=loai]`, r).value; $$("[data-for]", r).forEach((x) => x.classList.toggle("hidden", !x.dataset.for.split(",").includes(l))); };
    r.addEventListener("change", () => { vis(); fn(); }); r.addEventListener("input", (e) => { if (e.target.dataset.k === "nhan") fn(); }); vis();
  }
  /** Công việc tính vào kỳ VTVL theo ngày sản phẩm (không tính trùng sang kỳ khác). */
  const tasksVtvl = (tu, den) => { const a = C.iso(tu), b = C.iso(den); return S.tasks.filter((t) => { const d = C.ngaySP(t); return d >= a && d <= b; }); };
  const tasksOf = (tu, den) => inRange(S.tasks, C.iso(tu), C.iso(den)).sort((a, b) => (a.ngay_bd + (a.gio_bd || "")).localeCompare(b.ngay_bd + (b.gio_bd || "")));

  function pageReports(root) {
    root.innerHTML = head("Báo cáo & Xuất file", "Xuất Word/Excel đúng mẫu quy định, tổng hợp tự động từ dữ liệu của bạn.") + `
      <div class="tabs" id="rTabs"><button>Mẫu Tổng hợp BC của CBCC VP (theo tuần)</button><button>Báo cáo tổng hợp theo kỳ</button><button>Đánh giá cán bộ (CV 1619)</button></div>
      <div id="rBody"></div>`;
    const draw = () => {
      $$("#rTabs button").forEach((b, i) => b.classList.toggle("on", i === S.tab));
      [tabCbcc, tabKy, tabCv][S.tab]($("#rBody"));
    };
    $("#rTabs").addEventListener("click", (e) => { const i = $$("#rTabs button").indexOf(e.target.closest("button")); if (i >= 0) { S.tab = i; draw(); } });
    draw();
  }

  function tabCbcc(root) {
    root.innerHTML = `<p class="hint">Xuất đúng bố cục Mẫu - Tổng hợp BC của CBCC VP: mục 1 lấy công việc thực hiện trong tuần đã chọn, mục 2 lấy danh sách ở trang Nhiệm vụ tuần tới.</p>
      <div class="card"><label class="f" style="max-width:260px">Tuần báo cáo — chọn 1 ngày bất kỳ trong tuần<input type="date" id="cDate" value="${C.iso(C.today())}"></label>
      <p id="cRng" style="font-weight:700;color:var(--navy);margin:12px 0 2px"></p><p id="cCnt" class="info-line" style="margin:0 0 14px"></p>
      <button class="btn primary" id="cGo">${ico("dl")} Xuất file Word theo Mẫu CBCC VP</button></div>`;
    const per = () => { const d = C.parseISO($("#cDate").value) || C.today(), mon = C.mondayOf(d); return [mon, C.addDays(mon, 6), C.addDays(mon, 7)]; };
    async function refresh() {
      const [mon, sun, nxt] = per(), [w, y] = C.isoWeek(mon), [w2, y2] = C.isoWeek(nxt);
      $("#cRng").textContent = `Khoảng ngày: ${C.fmtD(mon)} – ${C.fmtD(sun)}   ·   Tuần ISO: ${w}/${y}`;
      let n2 = "…"; $("#cCnt").textContent = `Mục 1 sẽ có ${tasksOf(mon, sun).length} công việc  ·  Mục 2: đang đếm…`;
      try { n2 = (await DB.Nwt.query(w2, y2)).length; } catch (e) { n2 = "?"; }
      $("#cCnt").textContent = `Mục 1 sẽ có ${tasksOf(mon, sun).length} công việc  ·  Mục 2 sẽ có ${n2} nhiệm vụ (tuần ${w2}/${y2})`;
    }
    $("#cDate").addEventListener("change", refresh);
    $("#cGo").onclick = () => guard(async () => {
      const [mon, sun, nxt] = per(), [w, y] = C.isoWeek(mon), [w2, y2] = C.isoWeek(nxt);
      const blob = await Reports.buildCbcc(S.cfg.ten || "", tasksOf(mon, sun), await DB.Nwt.query(w2, y2), w, y);
      saveBlob(blob, `BC_CBCC_Tuan${w}_${y}.docx`);
    }, "Đã tạo file Word — kiểm tra thư mục Tải xuống.");
    refresh();
  }

  function tabKy(root) {
    root.innerHTML = `<p class="hint">Báo cáo tổng hợp công tác theo tuần, tháng, quý, 6 tháng, 9 tháng hoặc năm — số liệu tự động từ dữ liệu của bạn.</p>
      ${periodHtml("kP", "Quý")}<div class="grid g4" id="kStats"></div>
      <div class="grid g2" style="margin:14px 0"><label class="f">Đề xuất mức xếp loại<select id="kXl">${opts(C.XL_MUC, C.XL_MUC[0])}</select></label></div>
      <div class="grid g2"><textarea id="kNx" rows="3" placeholder="Nhận xét, đánh giá bổ sung (không bắt buộc)"></textarea>
      <textarea id="kPh" rows="3" placeholder="Phương hướng nhiệm vụ tiếp theo (không bắt buộc) — mỗi dòng một ý"></textarea></div>
      <div class="table-wrap cardwrap" style="margin:14px 0"><table class="tbl cards"><thead><tr><th>Ngày</th><th>Nội dung</th><th>Loại</th><th>Trạng thái</th><th>Kết quả</th></tr></thead><tbody id="kBody"></tbody></table></div>
      <button class="btn primary" id="kGo">${ico("dl")} Xuất báo cáo Word theo kỳ</button>`;
    const calc = () => { const k = periodGet("kP"); return { k, d: C.tinhToanKy(tasksOf(k.tu, k.den), $("#kXl").value) }; };
    function refresh() {
      const { d } = calc();
      $("#kStats").innerHTML = stat("TỔNG CÔNG VIỆC", d.tong, "#2A5298") + stat("HOÀN THÀNH", d.ht, "#1A9651", d.pt + "%") + stat("TRỄ HẠN", d.tre, "#C8102E") +
        stat("ĐỀ XUẤT XẾP LOẠI", `<span style="font-size:16px;color:var(--navy)">${esc(d.xepLoai.replace(" nhiệm vụ", ""))}</span>`, "#F5A623");
      $("#kBody").innerHTML = d.tasks.length ? d.tasks.map((t) => `<tr><td data-l="Ngày">${C.fmtD(t.ngay_bd)}</td><td class="ttl">${esc(t.title)}</td><td data-l="Loại">${esc(t.loai || "")}</td><td class="st">${pill(t.trang_thai)}</td><td data-l="Kết quả">${esc(t.ket_qua || "")}</td></tr>`).join("")
        : `<tr><td colspan="5" class="empty">Chưa có công việc nào trong kỳ đã chọn.</td></tr>`;
    }
    periodWire("kP", refresh); $("#kXl").addEventListener("change", refresh);
    $("#kGo").onclick = () => guard(async () => {
      const { k, d } = calc();
      const blob = await Reports.buildKy(orgCfg(), S.cfg.ten || "", S.cfg.chuc_vu || "", k.tu, k.den, k.nhan, d, $("#kNx").value.trim(), $("#kPh").value.trim());
      saveBlob(blob, `BaoCao_${safe(k.nhan)}.docx`);
    }, "Đã tạo file Word — kiểm tra thư mục Tải xuống.");
    refresh();
  }

  // ── Đánh giá cán bộ CV 1619 ──
  function tabCv(root) {
    const PERS = [["ngay_sinh", "Ngày sinh", "VD: 15/03/1990"], ["chuc_vu_dang", "Chức vụ Đảng", "VD: Đảng viên"], ["chuc_vu_cq", "Chức vụ chính quyền", ""],
      ["chuc_vu_dt", "Chức vụ đoàn thể", "VD: Đoàn viên Công đoàn"], ["don_vi_ct", "Đơn vị công tác", ""]];
    root.innerHTML = `<p class="hint">Xuất file .xlsx đúng cấu trúc Bản tự đánh giá (MauDG) + Phụ lục 2 khối Đảng (PL2.khoiDang) theo Công văn 1619-CV/TU. Số dòng nhiệm vụ tự giãn theo đúng số việc thực tế.</p>
      ${periodHtml("vP", "Quý")}<p class="info-line" id="vInfo"></p>
      <div class="section-label">Thông tin cá nhân (lưu để dùng lại cho các kỳ sau)</div>
      <div class="card"><div class="form-grid">${PERS.map(([k, l, p]) => `<label class="f${k === "don_vi_ct" ? " span2" : ""}">${l}<input data-p="${k}" placeholder="${p}" value="${esc(S.cfg[k] || (k === "chuc_vu_cq" ? S.cfg.chuc_vu || "" : ""))}"></label>`).join("")}</div>
      <div class="dlg-foot" style="position:static;margin-top:10px"><button class="btn" id="vSavePers">Lưu thông tin cá nhân</button></div></div>
      <div class="section-label">Thông tin KPI từng nhiệm vụ trong kỳ</div>
      <p class="hint">Chọn Trục, Nhóm A/B, Nhóm độ khó N1–N5, số lượng và hệ số chất lượng cho từng việc. Trục chỉ được gợi ý theo từ khóa — bạn cần rà soát lại theo đúng nội dung thực tế.</p>
      <div class="table-wrap scroll"><table class="tbl kpi-table"><thead><tr><th>Nội dung</th><th>Trạng thái</th><th>Trục</th><th>Nhóm</th><th>Căn cứ giao việc</th><th title="Số lượng kế hoạch">SL KH</th><th title="Nhóm độ khó N1–N5">Độ khó</th><th title="Số lượng thực tế">SL TT</th><th title="Hệ số chất lượng">Hệ số CL</th></tr></thead><tbody id="vBody"></tbody></table></div>
      <p class="hint" style="margin-top:8px"><b>Độ khó:</b> ${C.NHOM_KHO_LIST.map((k) => `${k}: ${C.NHOM_KHO_GOI_Y[k]}`).join(" · ")}<br><b>Hệ số chất lượng:</b> ${C.HE_SO_CL_OPTS.map(([l, v]) => `${v}: ${l}`).join(" · ")}</p>
      <div id="vTruc" class="hint"></div>
      <div style="display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap"><button class="btn" id="vSuggest" title="Điền lại cột Trục theo từ khóa trong tên công việc (chưa lưu cho đến khi bấm Lưu)">Gợi ý lại Trục theo từ khóa</button><button class="btn" id="vMuc" title="Với việc đã gắn mức độ phức tạp I–VI ở phần Vị trí việc làm: I→N1, II→N2, III→N3, IV→N4, V–VI→N5 (chưa lưu cho đến khi bấm Lưu)">Gợi ý độ khó theo mức I–VI</button><button class="btn" id="vSaveRows">Lưu các chỉnh sửa vào công việc</button></div>
      <div class="section-label">Tỷ trọng điểm & kết quả dự kiến</div>
      <div class="card"><div class="grid g2"><label class="f">Điểm tối đa Nhóm A (thường xuyên)<input type="number" id="vMa" min="0" max="100" value="60"></label>
      <label class="f">Điểm tối đa Nhóm B (trọng tâm, then chốt)<input type="number" id="vMb" min="0" max="100" value="40"></label></div>
      <div class="score-grid" id="vScore"></div><div class="warn" id="vWarn"></div></div>
      <div class="section-label">Nhóm tiêu chí chung (mục I của MauDG)</div>
      <p class="hint">Đánh dấu các tiêu chí <b>KHÔNG đảm bảo</b> — để trống nếu tất cả đều đảm bảo.</p>
      <div id="vTc">${C.MAUDG_TIEUCHI.map(([so, ten, items]) => `<details class="tc-group"><summary>${so}. ${esc(ten)}</summary>${items.map((it) => `<label class="tc-item"><input type="checkbox" data-tc="${esc(it)}"><span>${esc(it)}</span></label>`).join("")}</details>`).join("")}</div>
      <div class="grid g2" style="margin-top:16px;align-items:end"><label class="f">Cá nhân tự đề xuất mức xếp loại chất lượng<select id="vXl">${opts(C.XL_MUC.slice(1), "")}</select></label>
      <div><button class="btn primary" id="vGo">${ico("dl")} Xuất file Excel — Đánh giá cán bộ (CV 1619)</button></div></div>`;

    let list = [];
    const row = (t, i) => {
      const hs = t.he_so_chat_luong == null ? 1 : Number(t.he_so_chat_luong), ke = t.so_luong_ke_hoach || 1;
      const tt = t.so_luong_thuc_te != null ? t.so_luong_thuc_te : (t.trang_thai === "Hoàn thành" ? ke : 0);
      return `<tr data-i="${i}"><td class="t">${esc(t.title)}</td><td>${pill(t.trang_thai)}</td>
        <td><select class="w-md" data-f="truc">${opts(C.TRUC_LIST, t.truc || C.goiYTruc(t.title))}</select></td>
        <td><select class="w-lg" data-f="nhom_ab">${C.NHOM_AB.map((n) => `<option value="${esc(n)}"${n === (t.nhom_ab || C.NHOM_AB[0]) ? " selected" : ""}>${esc(C.NHOM_SHORT[n])}</option>`).join("")}</select></td>
        <td><input class="w-xl" data-f="can_cu_nv" value="${esc(t.can_cu_nv || "")}"></td>
        <td><input class="w-sm" type="number" min="1" data-f="so_luong_ke_hoach" value="${ke}"></td>
        <td><select class="w-sm" data-f="nhom_kho">${opts(C.NHOM_KHO_LIST, t.nhom_kho || "N2")}</select></td>
        <td><input class="w-sm" type="number" min="0" data-f="so_luong_thuc_te" value="${tt}"></td>
        <td><select class="w-sm" data-f="he_so_chat_luong">${C.HE_SO_CL_OPTS.map(([l, v]) => `<option value="${v}" title="${esc(l)}"${v === hs ? " selected" : ""}>${v}</option>`).join("")}</select></td></tr>`;
    };
    const read = (tr, t) => {
      const g = (f) => $(`[data-f=${f}]`, tr).value, n = (f) => Math.max(0, parseInt(g(f), 10) || 0);
      return { truc: g("truc"), nhom_ab: g("nhom_ab"), can_cu_nv: g("can_cu_nv").trim() || null, so_luong_ke_hoach: Math.max(1, n("so_luong_ke_hoach")),
        nhom_kho: g("nhom_kho"), so_luong_thuc_te: n("so_luong_thuc_te"), he_so_chat_luong: parseFloat(g("he_so_chat_luong")) };
    };
    const rowsData = () => $$("#vBody tr[data-i]").map((tr) => ({ t: list[+tr.dataset.i], d: read(tr) }));
    const maxes = () => [Math.max(0, +$("#vMa").value || 0), Math.max(0, +$("#vMb").value || 0)];
    function score() {
      const rd = rowsData(), merged = rd.map(({ t, d }) => ({ ...t, ...d }));
      const ga = merged.filter((t) => t.nhom_ab === C.NHOM_AB[0]), gb = merged.filter((t) => t.nhom_ab === C.NHOM_AB[1]);
      const [ma, mb] = maxes(), a = C.tinhKpi(ga).kpi * ma, b = C.tinhKpi(gb).kpi * mb;
      $("#vScore").innerHTML = stat("ĐIỂM NHÓM A", a.toFixed(1), "#2A5298", `/ ${ma} · ${ga.length} việc`) + stat("ĐIỂM NHÓM B", b.toFixed(1), "#E67E22", `/ ${mb} · ${gb.length} việc`) + stat("TỔNG ĐIỂM", (a + b).toFixed(1), "#C8102E", "/ 100");
      $("#vWarn").textContent = ma + mb === 100 ? "" : `Tổng điểm tối đa hiện tại: ${ma + mb} — cần đúng bằng 100.`;
      const tc = {}; merged.forEach((t) => { tc[t.truc] = (tc[t.truc] || 0) + 1; });
      const mx = merged.length ? Math.max(...Object.values(tc)) / merged.length : 0;
      $("#vTruc").innerHTML = "Phân bổ theo Trục: " + C.TRUC_LIST.map((k) => `${k}: ${tc[k] || 0} việc`).join(" · ") +
        (merged.length >= 5 && mx >= 0.7 ? `<br><b style="color:var(--red)">Phần lớn công việc đang dồn vào 1 trục — hãy rà soát lại theo đúng nội dung thực tế từng việc (không chọn trục theo tên phòng hay chức danh).</b>` : "");
      $("#vXl").selectedIndex = C.xepLoaiTheoDiem(a + b);
    }
    function refresh() {
      const k = periodGet("vP"); list = tasksOf(k.tu, k.den);
      $("#vInfo").textContent = list.length ? `Kỳ đã chọn có ${list.length} công việc.` : "Chưa có công việc nào trong kỳ đã chọn — vào trang Công việc để thêm trước.";
      $("#vBody").innerHTML = list.length ? list.map(row).join("") : `<tr><td colspan="9" class="empty">Chưa có công việc nào trong kỳ.</td></tr>`;
      score();
    }
    async function saveRows(quiet) {
      const changes = rowsData().filter(({ t, d }) => Object.keys(d).some((k) => String(t[k] ?? "") !== String(d[k] ?? "")));
      if (!changes.length) { if (!quiet) toast("Không có thay đổi nào để lưu."); return true; }
      const res = await guard(() => Promise.all(changes.map(({ t, d }) => DB.Tasks.update(t.id, d))), quiet ? null : `Đã lưu ${changes.length} công việc.`);
      if (!res) return false;
      res.forEach((r) => Object.assign(S.tasks.find((x) => x.id === r.id), r));
      refresh(); return true;
    }
    const persObj = () => Object.fromEntries($$("[data-p]", root).map((i) => [i.dataset.p, i.value.trim()]));
    async function savePers(quiet) {
      const o = persObj(); const r = await guard(async () => { await DB.Config.setMany(o); return true; }, quiet ? null : "Đã lưu thông tin cá nhân.");
      if (r) Object.assign(S.cfg, o); return !!r;
    }
    periodWire("vP", refresh);
    $("#vBody").addEventListener("input", score); $("#vBody").addEventListener("change", score);
    $("#vMa").addEventListener("input", score); $("#vMb").addEventListener("input", score);
    $("#vSuggest").onclick = () => { $$("#vBody tr[data-i]").forEach((tr) => { $("[data-f=truc]", tr).value = C.goiYTruc(list[+tr.dataset.i].title); }); score(); toast("Đã gợi ý Trục — nhớ rà soát lại rồi bấm Lưu."); };
    $("#vMuc").onclick = () => {
      let n = 0;
      $$("#vBody tr[data-i]").forEach((tr) => { const t = list[+tr.dataset.i], nk = C.MUC_NHOM_KHO[t.muc_do]; if (nk) { $("[data-f=nhom_kho]", tr).value = nk; n++; } });
      score(); toast(n ? `Đã gợi ý độ khó cho ${n} việc theo mức I–VI — nhớ bấm Lưu.` : "Chưa có việc nào trong kỳ được gắn mức độ phức tạp.");
    };
    $("#vSavePers").onclick = () => savePers(false); $("#vSaveRows").onclick = () => saveRows(false);
    $("#vGo").onclick = async () => {
      if (!list.length) return alertDlg("Chưa có công việc nào trong kỳ đã chọn.");
      const [ma, mb] = maxes(); if (ma + mb !== 100) return alertDlg("Vui lòng chỉnh Điểm tối đa Nhóm A + Nhóm B cho đúng bằng 100 trước khi xuất.");
      if (!(await saveRows(true)) || !(await savePers(true))) return;
      const k = periodGet("vP"), kdb = $$("[data-tc]:checked", root).map((c) => c.dataset.tc);
      const info = { ten: S.cfg.ten || "", ngay_sinh: S.cfg.ngay_sinh, chuc_vu_dang: S.cfg.chuc_vu_dang, chuc_vu_cq: S.cfg.chuc_vu_cq || S.cfg.chuc_vu, chuc_vu_dt: S.cfg.chuc_vu_dt, don_vi_ct: S.cfg.don_vi_ct };
      guard(async () => {
        const blob = await Reports.buildCv1619(info, orgCfg(), list.map((t) => S.tasks.find((x) => x.id === t.id)), ma, mb, kdb, $("#vXl").value, `${k.nhan}, Năm ${k.den.getFullYear()}`);
        saveBlob(blob, `DanhGiaCanBo_${safe(k.nhan)}.xlsx`);
      }, "Đã tạo file Excel — kiểm tra thư mục Tải xuống.");
    };
    refresh();
  }

  // ───────────── VỊ TRÍ VIỆC LÀM ─────────────
  function pageVtvl(root) {
    root.innerHTML = head("Vị trí việc làm", `Theo dõi sản phẩm theo mã công việc Biểu A2, định mức Biểu 02 và xuất Biểu 01, 02, B1 — vị trí <b>${esc(S.cfg.vtvl_ten || "")}</b> (${esc(vtvlMa())}).`);
    if (!S.vtvlOk) {
      root.insertAdjacentHTML("beforeend", `<div class="note">Cơ sở dữ liệu chưa được nâng cấp. Vào Supabase → SQL Editor, chạy file <b>sql/03_nang_cap_vi_tri_viec_lam.sql</b>
        (và file nạp danh mục, dữ liệu Biểu 01 nếu có), sau đó tải lại trang.</div>`);
      return;
    }
    root.insertAdjacentHTML("beforeend", `<div class="tabs" id="vTabs"><button>Tổng hợp</button><button>Gắn mã hàng loạt</button><button>Danh mục công việc</button><button>Định mức & thiết lập</button><button>Xuất Biểu 01, 02, B1</button></div><div id="vBodyV"></div>`);
    const draw = () => { $$("#vTabs button").forEach((b, i) => b.classList.toggle("on", i === S.vtab)); [vtSum, vtTag, vtDm, vtDmuc, vtExp][S.vtab]($("#vBodyV")); };
    $("#vTabs").addEventListener("click", (e) => { const i = $$("#vTabs button").indexOf(e.target.closest("button")); if (i >= 0) { S.vtab = i; draw(); } });
    draw();
  }
  const kyMacDinh = () => { const t = C.today(); return t.getMonth() >= 9 ? t.getFullYear() : t.getFullYear(); };
  function vtPeriod(id) {
    const h = periodHtml(id, "Kỳ VTVL (01/10–30/9)");
    return h.replace(`<option selected>${C.today().getFullYear()}</option>`, `<option selected>${kyMacDinh()}</option>`);
  }
  const b1Opts = () => ({ dinhMuc: S.dinhMuc, tyLePh: tyLePh() });
  /** Sắp xếp mã: VTVL của tôi trước, rồi theo thứ tự danh mục. */
  const sortMa = (a, b) => (laCuaToi(b) - laCuaToi(a)) || (((S.dmMap.get(a) || {}).thu_tu ?? 9999) - ((S.dmMap.get(b) || {}).thu_tu ?? 9999)) || String(a).localeCompare(String(b));

  // ── Tab 1: Tổng hợp ──
  function vtSum(root) {
    root.innerHTML = `${vtPeriod("sP")}<div class="grid g5" id="sStats"></div>
      <div class="section-label">Khối lượng theo mã công việc (cách tính giống Biểu B1)</div>
      <div class="table-wrap"><table class="tbl"><thead><tr><th>Mã công việc</th><th>Tên công việc</th><th class="num">VB chủ trì</th><th class="num" title="Bình quân phút/SP theo định mức Biểu 02">Phút/SP<br>định mức</th>
        <th class="num" title="Bình quân phút thực tế của các văn bản chủ trì đã bấm giờ/ghi phút">Phút/SP<br>thực tế</th><th class="num">Phối hợp<br>(lượt)</th><th class="num">SP khác<br>(lượt)</th><th class="num">Giờ bổ sung</th><th class="num">Giờ tổng</th></tr></thead><tbody id="sBody"></tbody></table></div>
      <div class="grid g2" style="margin-top:14px"><div class="card"><h3>Giờ theo mã công việc</h3><div id="sChart"></div></div>
      <div class="card"><h3>Văn bản chủ trì theo nhóm × mức (Biểu 02)</h3><div class="table-wrap"><table class="tbl mini" id="sMat"></table></div></div></div>
      <div id="sWarn"></div>`;
    function refresh() {
      const k = periodGet("sP"), list = tasksVtvl(k.tu, k.den), m = C.tongHopB1(list, b1Opts());
      const khac = m.get("KHAC"); m.delete("KHAC");
      const keys = [...m.keys()].sort(sortMa);
      let mine = { sl: 0, ph: 0, kt: 0, gio: 0 };
      keys.forEach((ma) => { const r = m.get(ma); if (laCuaToi(ma)) { mine.sl += r.sl; mine.ph += r.slPH; mine.kt += r.slKT; mine.gio += r.gioTong; } });
      const chua = list.filter((t) => !t.ma_cv).length, ngay = C.daysBetween(k.tu, k.den) + 1;
      $("#sStats").innerHTML = stat("VĂN BẢN CHỦ TRÌ", mine.sl, "#C8102E", "VTVL của tôi") + stat("PHỐI HỢP", mine.ph, "#2A5298", `tính ${Math.round(tyLePh() * 100)}% định mức`) +
        stat("SẢN PHẨM KHÁC", mine.kt, "#7D3C98", "kỹ thuật, phần mềm…") + stat("GIỜ THEO VTVL", fmtNum(mine.gio), "#0D1B2A", `÷ ${fmtNum(quyGio(), 0)} = ${fmtNum(mine.gio / quyGio(), 2)} người` + (ngay < 360 ? " (kỳ chưa đủ 12 tháng)" : "")) +
        stat("CHƯA GẮN MÃ", chua, chua ? "#E67E22" : "#1A9651", chua ? "trong kỳ" : "đã gắn đủ");
      let tot = { sl: 0, ph: 0, kt: 0, bs: 0, g: 0 };
      $("#sBody").innerHTML = keys.length ? keys.map((ma) => {
        const r = m.get(ma), d = S.dmMap.get(ma) || {}, my = laCuaToi(ma);
        if (my) { tot.sl += r.sl; tot.ph += r.slPH; tot.kt += r.slKT; tot.bs += r.gioBoSung; tot.g += r.gioTong; }
        return `<tr${my ? ' class="mine-row"' : ""}><td><b>${esc(maNgan(ma))}</b>${my ? "" : `<br><small class="muted">${esc(d.ma_vtvl || "ngoài danh mục")}</small>`}</td><td>${esc(trunc(d.ten || "", 140))}</td>
          <td class="num">${r.sl}${r.thieuDM ? ` <span class="tag red" title="Văn bản chưa có định mức">+${r.thieuDM}</span>` : ""}</td><td class="num">${r.tbPhut || ""}</td><td class="num">${r.tbThucTe ?? ""}</td>
          <td class="num">${r.slPH || ""}</td><td class="num">${r.slKT || ""}</td><td class="num">${r.gioBoSung ? fmtNum(r.gioBoSung) : ""}</td><td class="num"><b>${fmtNum(r.gioTong)}</b></td></tr>`;
      }).join("") + `<tr class="tot"><td colspan="2">Cộng VTVL của tôi (${esc(vtvlMa())})</td><td class="num">${tot.sl}</td><td></td><td></td><td class="num">${tot.ph}</td><td class="num">${tot.kt}</td><td class="num">${fmtNum(tot.bs)}</td><td class="num">${fmtNum(tot.g)}</td></tr>`
        : `<tr><td colspan="9" class="empty">Chưa có công việc nào được gắn mã trong kỳ. Vào tab “Gắn mã hàng loạt”.</td></tr>`;
      $("#sChart").innerHTML = keys.length ? Charts.hbars(keys.map((ma) => [maNgan(ma), Math.round(m.get(ma).gioTong)]), "#C8102E") : '<p class="muted">Chưa có dữ liệu.</p>';
      const cnt = {}; list.forEach((t) => { if (laCuaToi(t.ma_cv) && C.coVanBan(t) && !C.laPhoiHop(t)) { const kk = t.nhom_sp + t.muc_do; cnt[kk] = (cnt[kk] || 0) + 1; } });
      $("#sMat").innerHTML = `<thead><tr><th>Nhóm</th>${[1, 2, 3, 4, 5, 6].map((x) => `<th class="num">${C.MUC_LA_MA[x]}</th>`).join("")}</tr></thead><tbody>` +
        C.NHOM_SP.map((g) => `<tr><td title="${esc(C.NHOM_SP_TEN[g])}"><b>${g}</b> ${esc(C.NHOM_SP_NGAN[g])}</td>${[1, 2, 3, 4, 5, 6].map((x) => {
          const n = cnt[g + x] || 0, p = C.dmPhut(S.dinhMuc, g, x);
          return `<td class="num${n && p == null ? " bad" : ""}" title="Định mức: ${p ?? "chưa có"} phút">${n || ""}${n ? `<small>×${p ?? "?"}</small>` : ""}</td>`;
        }).join("")}</tr>`).join("") + "</tbody>";
      const w = [];
      const thieu = list.filter((t) => (t.nhom_sp && !t.muc_do) || (!t.nhom_sp && t.muc_do));
      if (thieu.length) w.push(`${thieu.length} việc chỉ có nhóm hoặc chỉ có mức độ — cần chọn đủ cả hai.`);
      const khongPhut = list.filter((t) => t.ma_cv && !C.coVanBan(t) && C.phutThucTe(t).nguon === "chưa có");
      if (khongPhut.length) w.push(`${khongPhut.length} sản phẩm khác (không phải văn bản) chưa có thời gian — bấm giờ hoặc nhập số phút thì mới tính được vào giờ bổ sung.`);
      const chuaHt = list.filter((t) => laCuaToi(t.ma_cv) && t.trang_thai !== "Hoàn thành");
      if (chuaHt.length) w.push(`${chuaHt.length} việc thuộc VTVL chưa hoàn thành nhưng vẫn được tính — kiểm tra lại trạng thái.`);
      const qua = list.filter((t) => laCuaToi(t.ma_cv) && !C.coVanBan(t) && (t.so_phut === null || t.so_phut === undefined || t.so_phut === "") && C.phutTuGio(t) > 960);
      if (qua.length) w.push(`${qua.length} sản phẩm khác đang được ƯỚC TÍNH trên 16 giờ từ giờ bắt đầu – kết thúc (8 giờ × mỗi ngày làm việc), có thể cao hơn thực tế — vào tab Gắn mã hàng loạt, bỏ tích “Chỉ hiện việc chưa gắn mã” và nhập số phút thực tế.`);
      if (khac) w.push(`${khac.slThuc || (khac.sl + khac.slPH + khac.slKT)} việc đã đánh dấu “Không thuộc VTVL” — không tính vào số liệu.`);
      $("#sWarn").innerHTML = w.length ? `<div class="warn" style="margin-top:14px">${w.map(esc).join("<br>")}</div>` : "";
    }
    periodWire("sP", refresh); refresh();
  }

  // ── Tab 2: Gắn mã hàng loạt ──
  function vtTag(root) {
    root.innerHTML = `<div class="note"><b>Cách dùng:</b><br>
      <b>①</b> Tích chọn các việc <u>thuộc vị trí việc làm của bạn</u> → chọn mã ở thanh bên dưới → bấm <b>Gán cho dòng đã chọn</b>.
      <br><b>②</b> Việc nào là <u>văn bản</u> thì chọn Nhóm (A–G) <u>và</u> Mức (I–VI); việc kỹ thuật, phần mềm… để trống hai cột này, ghi số phút nếu biết.
      <br><b>③</b> Việc <u>không thuộc</u> vị trí việc làm (nâng lương, chi bộ, việc khác…) thì tích chọn rồi bấm <b>Đánh dấu “Không thuộc VTVL”</b> để không hiện lại ở đây.
      <br><b>④</b> Bấm <b>Lưu thay đổi</b>. Chưa bấm Lưu thì chưa ghi gì — tải lại tab là trở về như cũ.</div>
      ${vtPeriod("gP")}<div class="filters card flat" style="margin-bottom:10px"><label class="f row"><input type="checkbox" id="gOnly" checked> Chỉ hiện việc chưa gắn mã</label>
      <input id="gKw" placeholder="Lọc theo nội dung…"><span id="gCnt" class="muted"></span></div>
      <div class="table-wrap scroll"><table class="tbl kpi-table"><thead><tr><th><input type="checkbox" id="gAll" title="Chọn tất cả"></th><th>Ngày</th><th>Nội dung</th><th>Mã công việc</th><th>Vai trò</th><th>Nhóm</th><th>Mức</th><th>Số, ký hiệu</th><th title="Thời gian thực tế (phút)">Phút</th></tr></thead><tbody id="gBody"></tbody></table></div>
      <div class="card flat" style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        <b id="gSel">Đã chọn 0 dòng</b>
        <select id="gBulk" style="max-width:380px">${dmOptions("")}</select>
        <button class="btn sm" id="gBulkGo">Gán cho dòng đã chọn</button>
        <button class="btn sm" id="gKhac">Đánh dấu “Không thuộc VTVL”</button>
        <span style="flex:1"></span>
        <button class="btn" id="gSuggest" title="Chỉ điền ô đang trống của các dòng đã có mã thuộc VTVL của bạn">${ico("wand")} Gợi ý nhóm, mức, số ký hiệu</button><button class="btn primary" id="gSave">Lưu thay đổi</button></div>`;
    let list = [];
    const row = (t, i) => `<tr data-i="${i}"><td><input type="checkbox" class="gChk"></td><td class="nowrap">${C.fmtD(t.ngay_bd)}</td><td class="t">${esc(t.title)}</td>
      <td><select class="w-xl" data-f="ma_cv">${dmOptions(t.ma_cv || "")}</select></td>
      <td><select class="w-md" data-f="vai_tro">${opts(C.VAI_TRO, t.vai_tro || (t.chu_tri === false ? "Phối hợp" : "Chủ trì"))}</select></td>
      <td><select class="w-sm" data-f="nhom_sp">${nhomOpts(t.nhom_sp || "")}</select></td><td><select class="w-sm" data-f="muc_do">${mucOpts(t.muc_do, true)}</select></td>
      <td><input class="w-md" data-f="so_ky_hieu" value="${esc(t.so_ky_hieu || "")}"></td><td><input class="w-sm" type="number" min="0" data-f="so_phut" value="${t.so_phut ?? ""}" placeholder="${C.coVanBan(t) ? "" : (C.phutTuGio(t) ? "≈" + C.phutTuGio(t) : "")}" title="${C.phutTuGio(t) ? "Ô trống: phần mềm ước tính " + C.phutTuGio(t) + " phút từ giờ bắt đầu – kết thúc" : ""}"></td></tr>`;
    const read = (tr) => {
      const g = (f) => $(`[data-f=${f}]`, tr).value;
      return { ma_cv: g("ma_cv") || null, vai_tro: g("vai_tro"), chu_tri: g("vai_tro") === "Chủ trì", nhom_sp: g("nhom_sp") || null, muc_do: g("muc_do") ? +g("muc_do") : null,
        so_ky_hieu: g("so_ky_hieu").trim() || null, so_phut: g("so_phut") === "" ? null : Math.max(0, Math.round(+g("so_phut") || 0)) };
    };
    const selRows = () => $$("#gBody tr[data-i]").filter((tr) => $(".gChk", tr).checked);
    const updSel = () => { $("#gSel").textContent = `Đã chọn ${selRows().length} dòng`; };
    function refresh() {
      const k = periodGet("gP"), kw = $("#gKw").value.trim().toLowerCase();
      list = tasksOf(k.tu, k.den).filter((t) => (!$("#gOnly").checked || !t.ma_cv) && (!kw || t.title.toLowerCase().includes(kw)));
      $("#gBody").innerHTML = list.length ? list.map(row).join("") : `<tr><td colspan="9" class="empty">Không có công việc phù hợp.</td></tr>`;
      $("#gCnt").textContent = `${list.length} việc`; $("#gAll").checked = false; updSel();
    }
    periodWire("gP", refresh); $("#gOnly").addEventListener("change", refresh); $("#gKw").addEventListener("input", refresh);
    $("#gAll").addEventListener("change", (e) => { $$("#gBody .gChk").forEach((c) => { c.checked = e.target.checked; }); updSel(); });
    $("#gBody").addEventListener("change", (e) => {
      const tr = e.target.closest("tr[data-i]"); if (!tr) return;
      if (e.target.classList.contains("gChk")) return updSel();
      tr.classList.remove("row-bad");
      // chọn nhóm mà chưa có mức → tạm điền mức III (Thông thường), sửa lại nếu cần
      if (e.target.dataset.f === "nhom_sp" && e.target.value && !$("[data-f=muc_do]", tr).value) $("[data-f=muc_do]", tr).value = "3";
      if (e.target.dataset.f === "nhom_sp" && !e.target.value) $("[data-f=muc_do]", tr).value = "";
    });
    const apply = (ma, label) => {
      const rows = selRows(); if (!rows.length) return toast("Tích chọn ít nhất một dòng ở cột đầu tiên.", true);
      rows.forEach((tr) => { $("[data-f=ma_cv]", tr).value = ma; if (ma === "KHAC") { $("[data-f=nhom_sp]", tr).value = ""; $("[data-f=muc_do]", tr).value = ""; } $(".gChk", tr).checked = false; tr.classList.add("row-done"); });
      $("#gAll").checked = false; updSel(); toast(`${label} cho ${rows.length} dòng — bấm Lưu thay đổi để ghi.`);
    };
    $("#gBulkGo").onclick = () => { const v = $("#gBulk").value; if (!v) return toast("Chọn mã công việc ở ô bên cạnh trước.", true); apply(v, "Đã gán mã"); };
    $("#gKhac").onclick = () => { if (!S.dmMap.has("KHAC")) return toast("Danh mục chưa có mã KHAC — chạy lại file SQL nạp danh mục.", true); apply("KHAC", "Đã đánh dấu “Không thuộc VTVL”"); };
    $("#gSuggest").onclick = () => {
      let n = 0;
      $$("#gBody tr[data-i]").forEach((tr) => {
        const t = list[+tr.dataset.i], ma = $("[data-f=ma_cv]", tr).value; if (!laCuaToi(ma)) return;
        const sN = $("[data-f=nhom_sp]", tr), sM = $("[data-f=muc_do]", tr), sK = $("[data-f=so_ky_hieu]", tr);
        const k = C.goiYNhom(t.title), so = C.timSoKyHieu(t.title + " " + (t.ket_qua || "") + " " + (t.ghi_chu || ""));
        if (k && !sN.value) { sN.value = k; if (!sM.value) sM.value = "3"; n++; }
        if (so && !sK.value) { sK.value = so; n++; }
      });
      toast(n ? `Đã gợi ý ${n} ô (mức tạm để III – Thông thường) — kiểm tra lại rồi bấm Lưu.` : "Không có gợi ý mới. Gợi ý chỉ áp dụng cho dòng đã gán mã thuộc VTVL của bạn.");
    };
    $("#gSave").onclick = async () => {
      const ch = []; let bad = 0;
      $$("#gBody tr[data-i]").forEach((tr) => {
        const t = list[+tr.dataset.i], d = read(tr);
        if ((d.nhom_sp && !d.muc_do) || (!d.nhom_sp && d.muc_do)) { tr.classList.add("row-bad"); bad++; return; }
        if (Object.keys(d).some((x) => String(t[x] ?? "") !== String(d[x] ?? ""))) ch.push({ t, d });
      });
      if (bad) { const f = $("#gBody tr.row-bad"); f && f.scrollIntoView({ block: "center" }); return alertDlg(`Có <b>${bad}</b> dòng (tô đỏ) mới chọn Nhóm mà chưa chọn Mức, hoặc ngược lại. Chọn đủ cả hai, hoặc để trống cả hai nếu không phải văn bản.`); }
      if (!ch.length) return toast("Không có thay đổi nào để lưu.");
      const res = await guard(async () => { const out = []; for (let i = 0; i < ch.length; i += 20) out.push(...await Promise.all(ch.slice(i, i + 20).map(({ t, d }) => DB.Tasks.update(t.id, d)))); return out; }, `Đã lưu ${ch.length} công việc.`);
      if (res) { res.forEach((r) => Object.assign(S.tasks.find((x) => x.id === r.id), r)); refresh(); }
    };
    refresh();
  }

  // ── Tab 3: Danh mục công việc ──
  const DM_F = [["ma", "Mã công việc (*)", "CV.NV.BTGTU.VP.25.01"], ["ma_nv", "Mã nhiệm vụ", "NV.BTGTU.VP.25"], ["ma_vtvl", "Mã vị trí việc làm", "TG.T-CM 05.11"], ["thu_tu", "Thứ tự", ""],
    ["ten_nv", "Tên nhiệm vụ (Biểu A1)", ""], ["ten", "Tên công việc (*)", ""], ["san_pham", "Sản phẩm", ""], ["don_vi_tinh", "Đơn vị tính", ""], ["chat_luong", "Yêu cầu chất lượng", ""], ["can_cu", "Căn cứ (nguồn)", ""]];
  function vtDm(root) {
    root.innerHTML = `<div class="filters card flat"><input id="mKw" placeholder="Tìm theo mã, tên công việc…"><label class="f row"><input type="checkbox" id="mMine"> Chỉ VTVL của tôi</label>
      <label class="f row"><input type="checkbox" id="mHid"> Hiện cả mục đang ẩn</label><span class="muted" id="mCnt"></span></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin:10px 0"><button class="btn primary" id="mAdd">${ico("plus")} Thêm công việc vào danh mục</button>
      <button class="btn" id="mImp">${ico("ul")} Nhập từ file Excel Biểu A2/Biểu 02…</button><input type="file" id="mFile" accept=".xlsx" class="hidden"></div>
      <div class="table-wrap"><table class="tbl"><thead><tr><th>Mã công việc</th><th>Mã VTVL</th><th>Tên công việc</th><th class="num">Số việc đã gắn</th><th class="num">Hiện</th><th></th></tr></thead><tbody id="mBody"></tbody></table></div>`;
    const used = {}; S.tasks.forEach((t) => { if (t.ma_cv) used[t.ma_cv] = (used[t.ma_cv] || 0) + 1; });
    function draw() {
      const kw = $("#mKw").value.trim().toLowerCase();
      const rows = S.dm.filter((d) => ($("#mHid").checked || d.hien_thi !== false || (d.ma_vtvl || "").trim() === vtvlMa()) && (!$("#mMine").checked || (d.ma_vtvl || "").trim() === vtvlMa())
        && (!kw || (d.ma + " " + d.ten + " " + (d.ma_vtvl || "")).toLowerCase().includes(kw)));
      $("#mCnt").textContent = `${rows.length}/${S.dm.length} mục`;
      $("#mBody").innerHTML = rows.length ? rows.map((d) => `<tr${(d.ma_vtvl || "").trim() === vtvlMa() ? ' class="mine-row"' : ""}><td class="nowrap"><b>${esc(maNgan(d.ma))}</b></td><td class="nowrap">${esc(d.ma_vtvl || "")}</td>
        <td>${esc(d.ten)}${d.san_pham ? `<br><small class="muted">SP: ${esc(trunc(d.san_pham, 140))}</small>` : ""}</td><td class="num">${used[d.ma] || ""}</td>
        <td class="num"><input type="checkbox" data-a="vis" data-ma="${esc(d.ma)}"${d.hien_thi !== false ? " checked" : ""}></td>
        <td class="act"><div class="tbl-actions"><button class="icon-btn" data-a="edit" data-ma="${esc(d.ma)}" title="Sửa">${ico("edit")}</button><button class="icon-btn red" data-a="del" data-ma="${esc(d.ma)}" title="Xóa">${ico("trash")}</button></div></td></tr>`).join("")
        : `<tr><td colspan="6" class="empty">Danh mục trống. Chạy file SQL nạp danh mục hoặc nhập từ Excel.</td></tr>`;
    }
    ["mKw", "mMine", "mHid"].forEach((id) => $("#" + id).addEventListener(id === "mKw" ? "input" : "change", draw));
    $("#mBody").addEventListener("click", async (e) => {
      const b = e.target.closest("[data-a]"); if (!b) return; const d = S.dmMap.get(b.dataset.ma); if (!d) return;
      if (b.dataset.a === "vis") {
        const r = await guard(() => DB.Dm.upsert({ ...d, hien_thi: b.checked })); if (r) { Object.assign(d, r); resetDmCache(); } else b.checked = !b.checked;
      } else if (b.dataset.a === "edit") dmDialog(d, draw);
      else if (b.dataset.a === "del") {
        if (used[d.ma]) return alertDlg(`Mã <b>${esc(d.ma)}</b> đang được gắn cho ${used[d.ma]} công việc — bỏ gắn trước, hoặc bỏ tích “Hiện” để ẩn khỏi danh sách chọn.`);
        if (await confirmDlg(`Xóa <b>${esc(d.ma)}</b> khỏi danh mục?`)) { if (await guard(async () => { await DB.Dm.remove(d.ma); return true; }, "Đã xóa.")) { setDm(S.dm.filter((x) => x.ma !== d.ma)); resetDmCache(); draw(); } }
      }
    });
    $("#mAdd").onclick = () => dmDialog(null, draw);
    $("#mImp").onclick = () => $("#mFile").click();
    $("#mFile").addEventListener("change", async (e) => {
      const f = e.target.files[0]; e.target.value = ""; if (!f) return;
      const rows = await guard(async () => {
        const wb = new ExcelJS.Workbook(); await wb.xlsx.load(await f.arrayBuffer());
        const MAP = { ma: /^mã công việc/i, ma_nv: /^mã nhiệm vụ/i, ma_vtvl: /^mã vtvl|^mã vị trí/i, ten: /^tên công việc/i, san_pham: /^sản phẩm/i, don_vi_tinh: /^đơn vị tính/i, chat_luong: /^chất lượng|yêu cầu chất lượng/i, can_cu: /^căn cứ/i };
        const out = [];
        wb.eachSheet((ws) => {
          let hdr = null;
          ws.eachRow((r, rn) => {
            const vals = r.values.map((v) => (v && typeof v === "object" ? (v.richText ? v.richText.map((x) => x.text).join("") : v.result ?? v.text ?? "") : v ?? "")).map((v) => String(v).trim());
            if (!hdr) { if (vals.some((v) => MAP.ma.test(v))) { hdr = {}; vals.forEach((v, i) => { for (const [k, re] of Object.entries(MAP)) if (re.test(v) && !(k in hdr)) hdr[k] = i; }); } return; }
            const o = {}; for (const [k, i] of Object.entries(hdr)) o[k] = vals[i] || null;
            if (o.ma && /^CV\./i.test(o.ma) && o.ten) out.push(o);
          });
        });
        return out;
      });
      if (!rows) return;
      if (!rows.length) return alertDlg("Không tìm thấy dòng nào có cột “Mã công việc” bắt đầu bằng CV. trong file.");
      const moi = rows.filter((r) => !S.dmMap.has(r.ma)).length;
      if (!(await confirmDlg(`Tìm thấy <b>${rows.length}</b> công việc (${moi} mã mới, ${rows.length - moi} mã đã có sẽ được cập nhật tên, sản phẩm…). Nhập vào danh mục?`, "Nhập"))) return;
      const max = S.dm.reduce((a, d) => Math.max(a, d.thu_tu || 0), 0);
      const up = rows.map((r, i) => { const old = S.dmMap.get(r.ma); return { ...(old || {}), ...Object.fromEntries(Object.entries(r).filter(([, v]) => v !== null)), thu_tu: old ? old.thu_tu : max + i + 1, hien_thi: old ? old.hien_thi : true }; });
      if (await guard(async () => { for (let i = 0; i < up.length; i += 200) await DB.Dm.upsertMany(up.slice(i, i + 200)); return true; }, `Đã nhập ${up.length} công việc vào danh mục.`)) {
        setDm(await DB.Dm.all()); resetDmCache(); draw();
      }
    });
    draw();
  }
  function dmDialog(d, after) {
    const dlg = $("#taskDlg"), x = d || { ma_vtvl: vtvlMa(), hien_thi: true };
    dlg.innerHTML = `<form class="dlg" id="dmForm" novalidate><h2>${d ? "Sửa công việc trong danh mục" : "Thêm công việc vào danh mục"}</h2><div class="form-grid">
      ${DM_F.map(([k, l, p]) => `<label class="f ${["ten", "ten_nv", "san_pham", "chat_luong", "can_cu"].includes(k) ? "span4" : ""}">${l}${["ten", "chat_luong", "can_cu"].includes(k) ? `<textarea data-k="${k}" rows="2" placeholder="${p}">${esc(x[k] ?? "")}</textarea>` : `<input data-k="${k}" ${k === "thu_tu" ? 'type="number"' : ""} placeholder="${p}" value="${esc(x[k] ?? "")}"${k === "ma" && d ? " readonly" : ""}>`}</label>`).join("")}
      <label class="f row span4"><input type="checkbox" id="dmVis"${x.hien_thi !== false ? " checked" : ""}> Hiện trong danh sách chọn mã</label></div>
      <div class="form-err" id="dmErr"></div><div class="dlg-foot"><button type="button" class="btn" id="dmCancel">Hủy</button><button class="btn primary" type="submit">Lưu</button></div></form>`;
    dlg.showModal(); $("#dmCancel").onclick = () => dlg.close();
    $("#dmForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const o = Object.fromEntries($$("[data-k]", dlg).map((i) => [i.dataset.k, i.value.trim() || null]));
      o.thu_tu = o.thu_tu ? +o.thu_tu : null; o.hien_thi = $("#dmVis").checked;
      if (!o.ma || !o.ten) return ($("#dmErr").textContent = "Cần nhập mã và tên công việc.");
      if (!d && S.dmMap.has(o.ma)) return ($("#dmErr").textContent = "Mã này đã có trong danh mục.");
      const r = await guard(() => DB.Dm.upsert(o), "Đã lưu danh mục.");
      if (!r) return;
      if (d) Object.assign(d, r); else { S.dm.push(r); S.dmMap.set(r.ma, r); }
      resetDmCache(); dlg.close(); after && after();
    });
  }

  // ── Tab 4: Định mức & thiết lập ──
  function vtDmuc(root) {
    const CF = [["vtvl_ma", "Mã vị trí việc làm của tôi", "TG.T-CM 05.11"], ["vtvl_ten", "Tên vị trí việc làm", "Chuyên viên về chuyển đổi số"], ["vtvl_to_chuc", "Tổ chức (cột C Biểu 01)", "Văn phòng Ban"],
      ["vtvl_quy_gio", "Quỹ giờ/người/năm", "1904"], ["vtvl_ty_le_phoi_hop", "Tỷ lệ tính cho vai trò phối hợp (0–1)", "0.3"]];
    root.innerHTML = `<div class="section-label">Thiết lập</div><div class="card"><div class="form-grid">${CF.map(([k, l, p]) => `<label class="f${k === "vtvl_ten" ? " span2" : ""}">${l}<input data-c="${k}" placeholder="${p}" value="${esc(S.cfg[k] ?? "")}"></label>`).join("")}</div></div>
      <div class="section-label">Định mức phút/1 sản phẩm theo nhóm × mức (Biểu 02)</div>
      <p class="hint">Để trống ô nào thì nhóm – mức đó chưa có định mức (văn bản gắn vào sẽ bị cảnh báo). Định mức do người đứng đầu xác định; số mặc định là số đề xuất đã dùng cho kỳ 01/10/2025–30/9/2026.</p>
      <div class="table-wrap"><table class="tbl kpi-table"><thead><tr><th>Nhóm loại văn bản</th>${[1, 2, 3, 4, 5, 6].map((m) => `<th class="num">Mức ${C.MUC_LA_MA[m]}<br><small>${C.MUC_TEN[m]}</small></th>`).join("")}</tr></thead>
      <tbody>${C.NHOM_SP.map((g) => `<tr><td class="t"><b>${g}</b> – ${esc(C.NHOM_SP_TEN[g])}</td>${[0, 1, 2, 3, 4, 5].map((i) => `<td><input class="w-sm" type="number" min="0" data-g="${g}" data-m="${i + 1}" value="${S.dinhMuc[g][i] ?? ""}"></td>`).join("")}</tr>`).join("")}</tbody></table></div>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:12px"><button class="btn" id="dmDef">Điền lại số mặc định</button><button class="btn primary" id="dmSave">Lưu thiết lập và định mức</button></div>`;
    $("#dmDef").onclick = () => { $$("[data-g]", root).forEach((i) => { const v = C.DM_PHUT_MAC_DINH[i.dataset.g][+i.dataset.m - 1]; i.value = v ?? ""; }); toast("Đã điền số mặc định — bấm Lưu để ghi."); };
    $("#dmSave").onclick = async () => {
      const cf = Object.fromEntries($$("[data-c]", root).map((i) => [i.dataset.c, i.value.trim()]));
      const tl = parseFloat(String(cf.vtvl_ty_le_phoi_hop).replace(",", ".")), qg = parseFloat(cf.vtvl_quy_gio);
      if (!cf.vtvl_ma) return toast("Cần nhập mã vị trí việc làm.", true);
      if (!(tl >= 0 && tl <= 1)) return toast("Tỷ lệ phối hợp phải trong khoảng 0–1 (VD 0.3).", true);
      if (!(qg > 0)) return toast("Quỹ giờ phải lớn hơn 0.", true);
      cf.vtvl_ty_le_phoi_hop = String(tl);
      const rows = $$("[data-g]", root).map((i) => ({ nhom: i.dataset.g, muc: +i.dataset.m, phut: i.value === "" ? null : Math.max(0, Math.round(+i.value)) }));
      const ok = await guard(async () => { await DB.Config.setMany(cf); await DB.DinhMuc.saveAll(rows); return true; }, "Đã lưu thiết lập và định mức.");
      if (ok) { Object.assign(S.cfg, cf); setDinhMuc(rows); resetDmCache(); }
    };
  }

  // ── Tab 5: Xuất Biểu 01, 02, B1 ──
  function vtExp(root) {
    root.innerHTML = `<p class="hint">Xuất một file Excel gồm: <b>Biểu 01</b> (mỗi dòng một sản phẩm, chia phần A–D như bản đã nộp), <b>Biểu 02</b> (đếm theo nhóm × mức, phút/SP), <b>B1</b> (khối lượng theo mã công việc, công thức nối với Biểu 01) và sheet đối chiếu. Số liệu là công thức Excel nên sửa trực tiếp trong file vẫn tự tính lại.</p>
      ${vtPeriod("eP")}<div class="grid g4" id="eStats"></div>
      <div class="card" style="margin-top:14px"><label class="f row"><input type="checkbox" id="eMine" checked> Chỉ lấy công việc thuộc VTVL của tôi (${esc(vtvlMa())})</label>
      <label class="f row"><input type="checkbox" id="eChk" checked> Kèm sheet “Đối chiếu” (việc chưa gắn mã, văn bản thiếu định mức)</label>
      <div style="margin-top:12px"><button class="btn primary" id="eGo">${ico("dl")} Xuất Excel Biểu 01, 02, B1</button></div></div>`;
    const pick = () => { const k = periodGet("eP"), all = tasksVtvl(k.tu, k.den); return { k, all, list: all.filter((t) => t.ma_cv && (!$("#eMine").checked || laCuaToi(t.ma_cv))) }; };
    function refresh() {
      const { list, all } = pick(), c = { A: 0, B: 0, C: 0, D: 0 }; list.forEach((t) => { c[C.phanBieu01(t)]++; });
      $("#eStats").innerHTML = stat("A. VĂN BẢN CÓ SỐ", c.A, "#C8102E", "chủ trì") + stat("B. PHỐI HỢP", c.B, "#2A5298") + stat("C. CHƯA CÓ SỐ", c.C, "#E67E22", "văn bản giấy, ký nháy…") + stat("D. SẢN PHẨM KHÁC", c.D, "#7D3C98", `${all.filter((t) => !t.ma_cv).length} việc chưa gắn mã`);
    }
    periodWire("eP", refresh); $("#eMine").addEventListener("change", refresh);
    $("#eGo").onclick = () => {
      const { k, list, all } = pick();
      if (!list.length) return alertDlg("Không có công việc nào đã gắn mã trong kỳ đã chọn.");
      guard(async () => {
        const blob = await Reports.buildVtvl({ ten: S.cfg.ten || "", to_chuc: S.cfg.vtvl_to_chuc || "Văn phòng Ban", vtvl_ma: vtvlMa(), vtvl_ten: S.cfg.vtvl_ten || "", quy_gio: quyGio(), ty_le: tyLePh(),
          ky: k, tasks: list, chuaGan: $("#eChk").checked ? all.filter((t) => !t.ma_cv) : null, dmMap: S.dmMap, dinhMuc: S.dinhMuc, maToi: [...S.dm].filter((d) => (d.ma_vtvl || "").trim() === vtvlMa()).map((d) => d.ma) });
        saveBlob(blob, `Bieu_01_02_B1_${C.iso(k.tu).replace(/-/g, "")}_${C.iso(k.den).replace(/-/g, "")}.xlsx`);
      }, "Đã tạo file Excel — kiểm tra thư mục Tải xuống.");
    };
    refresh();
  }

  // ───────────── CÀI ĐẶT ─────────────
  function pageSettings(root) {
    const F = [["ten", "Họ và tên (*)", "", 1], ["chuc_vu", "Chức vụ (hiển thị ở thanh bên)", "", 1], ["chuc_vu_day_du", "Chức vụ, đơn vị đầy đủ", "VD: Chuyên viên Văn phòng Ban Tuyên giáo Tỉnh ủy ...", 2],
      ["cap_uy", "Cấp ủy / cơ quan chủ quản", "VD: Tỉnh ủy Tuyên Quang", 1], ["ten_don_vi", "Tên đơn vị", "VD: Ban Tuyên giáo", 1], ["dia_danh", "Địa danh (nơi lập)", "VD: Tuyên Quang", 1], ["don_vi_ct", "Đơn vị công tác đầy đủ", "", 1]];
    root.innerHTML = head("Cài đặt", "Thông tin của bạn và thông tin cơ quan hiển thị trên các biểu mẫu Word/Excel.") + `
      <div class="card"><div class="form-grid g2" style="grid-template-columns:1fr 1fr">${F.map(([k, l, p, sp]) => `<label class="f${sp === 2 ? " span2" : ""}" ${sp === 2 ? 'style="grid-column:1/-1"' : ""}>${l}<input data-c="${k}" placeholder="${p}" value="${esc(S.cfg[k] || "")}"></label>`).join("")}</div>
      <div class="dlg-foot" style="position:static"><button class="btn primary" id="sSave">Lưu thay đổi</button></div></div>
      <div class="section-label">Tài khoản</div>
      <div class="card"><div class="form-grid" style="grid-template-columns:1fr 1fr"><label class="f">Mật khẩu mới (tối thiểu 8 ký tự)<input type="password" id="pw1" autocomplete="new-password"></label>
      <label class="f">Nhập lại mật khẩu mới<input type="password" id="pw2" autocomplete="new-password"></label></div>
      <div class="dlg-foot" style="position:static"><button class="btn" id="pwGo">Đổi mật khẩu</button></div></div>
      <div class="section-label">Sao lưu & khôi phục dữ liệu</div>
      <div class="card"><p class="hint">Dữ liệu được lưu trên Supabase. Nên tải một bản sao lưu (.json) về máy định kỳ, phòng khi dự án bị khóa hoặc xóa nhầm.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" id="bkGo">${ico("dl")} Tải bản sao lưu (.json)</button>
      <button class="btn" id="rsGo">${ico("ul")} Khôi phục từ file…</button><input type="file" id="rsFile" accept=".json,application/json" class="hidden"></div></div>`;
    $("#sSave").onclick = async () => {
      const o = Object.fromEntries($$("[data-c]", root).map((i) => [i.dataset.c, i.value.trim()]));
      if (!o.ten) return toast("Họ tên không được để trống.", true);
      if (!o.chuc_vu) o.chuc_vu = "Chuyên viên";
      if (await guard(async () => { await DB.Config.setMany(o); return true; }, "Đã cập nhật thông tin.")) { Object.assign(S.cfg, o); refreshUser(); }
    };
    $("#pwGo").onclick = async () => {
      const a = $("#pw1").value, b = $("#pw2").value;
      if (a.length < 8) return toast("Mật khẩu cần tối thiểu 8 ký tự.", true);
      if (a !== b) return toast("Hai mật khẩu chưa trùng nhau.", true);
      if (await guard(async () => { await DB.Auth.changePassword(a); return true; }, "Đã đổi mật khẩu.")) { $("#pw1").value = $("#pw2").value = ""; }
    };
    $("#bkGo").onclick = () => guard(async () => {
      const j = await DB.Backup.exportAll();
      saveBlob(new Blob([JSON.stringify(j, null, 1)], { type: "application/json" }), `sao_luu_cong_tac_${C.iso(C.today()).replace(/-/g, "")}.json`);
    }, "Đã tạo bản sao lưu — kiểm tra thư mục Tải xuống.");
    $("#rsGo").onclick = () => $("#rsFile").click();
    $("#rsFile").addEventListener("change", async (e) => {
      const f = e.target.files[0]; e.target.value = ""; if (!f) return;
      let obj; try { obj = JSON.parse(await f.text()); } catch (er) { return toast("File không đọc được.", true); }
      if (!(await confirmDlg(`Khôi phục từ <b>${esc(f.name)}</b>?<br><span class="muted">Các công việc trùng mã sẽ bị ghi đè; không xóa dữ liệu hiện có.</span>`, "Khôi phục"))) return;
      const r = await guard(() => DB.Backup.importAll(obj));
      if (r) { S.tasks = await DB.Tasks.all(); S.cfg = await DB.Config.all(); refreshUser(); toast(`Đã khôi phục ${r.tasks} công việc, ${r.nwt} nhiệm vụ tuần tới.`); go("settings"); }
    });
  }

  // ───────────── GIỚI THIỆU ─────────────
  function pageAbout(root) {
    const D = APP.dev;
    root.innerHTML = head("Giới thiệu", "") + `<div class="card"><div class="about"><img src="assets/logo.png" alt="Logo Ban Tuyên giáo">
      <div><h2 style="font-size:22px">Quản lý Công tác Cá nhân</h2><p class="muted" style="margin:4px 0">Phiên bản ${APP.version} · ${APP.year} · Bản web (GitHub Pages + Supabase)</p>
      <p style="margin:8px 0 0">Ghi chép, theo dõi công việc hằng ngày và xuất báo cáo Word/Excel đúng mẫu quy định.</p></div></div></div>
      <div class="section-label">Thông tin người phát triển</div>
      <div class="card">${[["Họ và tên", D.name], ["Chức vụ", D.role], ["Đơn vị", D.org], ["Điện thoại / Zalo", `<a href="tel:${D.phone}">${D.phone}</a>`], ["Email", `<a href="mailto:${D.email}">${D.email}</a>`]]
        .map(([l, v]) => `<div class="dev-row"><span>${l}</span><b>${v}</b></div>`).join("")}</div>
      <div class="note" style="margin-top:14px">Báo cáo được tạo ngay trên trình duyệt của bạn; dữ liệu công việc chỉ đọc được khi đã đăng nhập.</div>`;
  }

  boot();
})();
