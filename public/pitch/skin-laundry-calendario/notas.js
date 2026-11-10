/* Notas del cliente en el calendario de contenido.
   Botón «Notas» en la barra inferior: abre un panel donde dejar comentarios sobre la
   diapositiva que se está viendo (y, en los carruseles, sobre una imagen concreta).
   Las notas se guardan en /api/calendario-notas y las ve cualquiera que abra el enlace.
   Uso: <script src="/pitch/skin-laundry-calendario/notas.js" data-mes="noviembre" defer></script> */
(function () {
  const me = document.currentScript;
  const MES = (me && me.dataset.mes) || (location.pathname.match(/skin-laundry-calendario\/([a-z0-9-]+)/) || [])[1] || "noviembre";
  const API = "/api/calendario-notas";
  let notas = [], vista = "esta", cargando = false, error = "";

  const css = `
#nt-btn{position:relative;width:auto!important;padding:0 14px 0 12px;border-radius:18px!important;gap:7px;display:flex!important;align-items:center;font-size:12px!important;letter-spacing:.04em}
#nt-btn svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
#nt-btn b{min-width:17px;height:17px;padding:0 5px;border-radius:9px;background:#CDF765;color:#1A1312;font-size:10px;font-weight:700;display:none;place-items:center;line-height:17px}
#nt-btn b.on{display:inline-grid}
#nt-panel{position:fixed;top:0;right:0;bottom:56px;width:min(390px,100vw);background:#F6EDE4;color:#1A1312;z-index:50;box-shadow:-18px 0 40px rgba(0,0,0,.35);display:flex;flex-direction:column;transform:translateX(105%);transition:transform .28s cubic-bezier(.25,.8,.25,1);font-size:13px;line-height:1.45}
#nt-panel.open{transform:none}
#nt-panel *{box-sizing:border-box}
#nt-panel .h{padding:18px 18px 12px;border-bottom:1px solid rgba(26,19,18,.12)}
#nt-panel .t{display:flex;align-items:center;justify-content:space-between}
#nt-panel .t strong{font-size:17px;font-weight:600}
#nt-panel .x{width:30px;height:30px;border-radius:50%;border:1px solid rgba(26,19,18,.2);background:none;cursor:pointer;font-size:16px;color:#1A1312}
#nt-panel .tabs{display:flex;gap:6px;margin-top:12px}
#nt-panel .tabs button{flex:1;padding:7px 0;border-radius:16px;border:1px solid rgba(26,19,18,.2);background:none;cursor:pointer;font-size:12px;color:#1A1312}
#nt-panel .tabs button.on{background:#1A1312;color:#F6EDE4;border-color:#1A1312}
#nt-panel .lbl{margin-top:12px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#7a6a60}
#nt-panel .lbl b{display:block;margin-top:2px;font-size:14px;letter-spacing:0;text-transform:none;color:#1A1312;font-weight:600}
#nt-panel .list{flex:1;overflow:auto;padding:12px 18px;display:flex;flex-direction:column;gap:10px}
#nt-panel .empty{color:#7a6a60;padding:18px 0;text-align:center}
#nt-panel .n{background:#fff;border-radius:12px;padding:11px 13px;box-shadow:0 1px 3px rgba(26,19,18,.08)}
#nt-panel .n.res{opacity:.5}
#nt-panel .n .m{display:flex;justify-content:space-between;gap:8px;font-size:11px;color:#7a6a60;margin-bottom:5px}
#nt-panel .n .m b{color:#1A1312;font-weight:600}
#nt-panel .n .tx{white-space:pre-wrap;word-wrap:break-word}
#nt-panel .n .ft{display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap}
#nt-panel .chip{font-size:10.5px;padding:2px 8px;border-radius:10px;background:#efe3d6}
#nt-panel .chip.go{cursor:pointer;background:#CDF765}
#nt-panel .lnk{margin-left:auto;border:0;background:none;color:#3C201D;text-decoration:underline;cursor:pointer;font-size:11.5px;padding:0}
#nt-panel form{padding:12px 18px 16px;border-top:1px solid rgba(26,19,18,.12);display:flex;flex-direction:column;gap:8px;background:#F3EADF}
#nt-panel input,#nt-panel textarea,#nt-panel select{width:100%;border:1px solid rgba(26,19,18,.2);border-radius:10px;padding:9px 11px;font:inherit;color:#1A1312;background:#fff}
#nt-panel textarea{min-height:74px;resize:vertical}
#nt-panel .row{display:flex;gap:8px}
#nt-panel .row>*{flex:1}
#nt-panel .send{border:0;border-radius:22px;padding:11px;background:#1A1312;color:#F6EDE4;font:inherit;font-weight:600;cursor:pointer}
#nt-panel .send:disabled{opacity:.5;cursor:default}
#nt-panel .err{color:#a23a2a;font-size:12px}
`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slides = () => [...document.querySelectorAll("#stage .slide")];
  const actual = () => { const s = slides(); const i = s.findIndex(x => x.classList.contains("active")); return { el: s[i], i: Math.max(0, i) }; };
  function info(el, i) {
    if (!el) return { clave: `#${i + 1}`, etiqueta: `Diapositiva ${i + 1}` };
    const t = x => (x ? x.textContent.replace(/\s+/g, " ").trim() : "");
    const h = t(el.querySelector("h2")) || t(el.querySelector("h1")) || t(el.querySelector(".cap"));
    const p = t(el.querySelector(".pieza"));
    const fmt = t(el.querySelector(".tag.fmt"));
    const etiqueta = [h, p].filter(Boolean).join(" · ") || `Diapositiva ${i + 1}`;
    return { clave: [h, p, fmt].filter(Boolean).join(" | ") || `#${i + 1}`, etiqueta };
  }
  function imagenes(el) {
    const car = el && el.querySelector(".car-ig");
    if (!car) return null;
    const n = car.querySelectorAll(".trk img").length;
    const c = (car.querySelector(".cnt") || {}).textContent || "1/" + n;
    return { n, cur: parseInt(c) || 1 };
  }
  const fecha = iso => { try { return new Date(iso).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } };
  const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k) || ""; localStorage.setItem(k, v); } catch (e) { return ""; } };

  // ---------- UI ----------
  const ctrls = document.querySelector("#bar .ctrls");
  if (!ctrls) return;
  const btn = document.createElement("button");
  btn.id = "nt-btn"; btn.type = "button"; btn.setAttribute("aria-label", "Notas");
  btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></svg>Notas<b></b>`;
  ctrls.insertBefore(btn, ctrls.firstChild);

  const pn = document.createElement("aside");
  pn.id = "nt-panel"; pn.setAttribute("aria-label", "Notas del calendario");
  document.body.appendChild(pn);
  // que escribir o deslizar dentro del panel no pase de diapositiva
  ["keydown", "touchstart", "touchend", "click"].forEach(t => pn.addEventListener(t, e => e.stopPropagation()));

  function render() {
    const { el, i } = actual(); const inf = info(el, i); const im = imagenes(el);
    const abiertas = notas.filter(n => !n.resuelta);
    const deAqui = notas.filter(n => n.clave === inf.clave);
    const lista = vista === "esta" ? deAqui : notas;
    const b = btn.querySelector("b"); const k = deAqui.filter(n => !n.resuelta).length;
    b.textContent = k; b.classList.toggle("on", k > 0);
    btn.title = `${abiertas.length} notas abiertas en todo el calendario`;
    if (!pn.classList.contains("open")) return;
    const draft = pn.querySelector("textarea") ? pn.querySelector("textarea").value : "";
    pn.innerHTML = `
      <div class="h">
        <div class="t"><strong>Notas</strong><button class="x" type="button" aria-label="Cerrar">×</button></div>
        <div class="tabs"><button type="button" data-v="esta" class="${vista === "esta" ? "on" : ""}">Esta diapositiva (${deAqui.length})</button><button type="button" data-v="todas" class="${vista === "todas" ? "on" : ""}">Todas (${abiertas.length} abiertas)</button></div>
        <div class="lbl">Diapositiva ${i + 1}<b>${esc(inf.etiqueta)}</b></div>
      </div>
      <div class="list">${cargando && !notas.length ? `<div class="empty">Cargando…</div>` : lista.length ? lista.slice().reverse().map(n => `
        <div class="n ${n.resuelta ? "res" : ""}">
          <div class="m"><span><b>${esc(n.autor)}</b> · ${esc(fecha(n.fecha))}</span>${n.resuelta ? "<span>Resuelta</span>" : ""}</div>
          <div class="tx">${esc(n.texto)}</div>
          <div class="ft">${vista === "todas" ? `<span class="chip go" data-ir="${esc(n.clave)}" data-d="${n.diapositiva}">${esc(n.etiqueta || "Diapositiva " + n.diapositiva)}</span>` : ""}${n.imagen ? `<span class="chip">${esc(n.imagen)}</span>` : ""}
            <button class="lnk" type="button" data-res="${esc(n.id)}" data-v="${n.resuelta ? 0 : 1}">${n.resuelta ? "Reabrir" : "Marcar como resuelta"}</button></div>
        </div>`).join("") : `<div class="empty">${vista === "esta" ? "Todavía no hay notas en esta diapositiva." : "Todavía no hay notas."}</div>`}</div>
      <form>
        ${im ? `<select name="img"><option value="">Toda la pieza</option>${Array.from({ length: im.n }, (_, j) => `<option ${j + 1 === im.cur ? "selected" : ""}>Imagen ${j + 1}</option>`).join("")}</select>` : ""}
        <textarea name="tx" placeholder="Escribe tu nota sobre esta diapositiva…" maxlength="2000" required>${esc(draft)}</textarea>
        <div class="row"><input name="au" placeholder="Tu nombre" maxlength="60" value="${esc(ls("nt-autor"))}"><button class="send" type="submit">Añadir nota</button></div>
        ${error ? `<div class="err">${esc(error)}</div>` : ""}
      </form>`;
  }

  async function cargar() {
    cargando = true;
    try {
      const r = await fetch(`${API}?mes=${MES}`, { cache: "no-store" });
      const j = await r.json(); if (!r.ok) throw new Error(j.error || "Error");
      notas = j.notas || []; error = "";
    } catch (e) { error = "No se han podido cargar las notas. Vuelve a intentarlo en un momento."; }
    cargando = false; render();
  }

  pn.addEventListener("click", async e => {
    const t = e.target;
    if (t.closest(".x")) { pn.classList.remove("open"); return; }
    const tab = t.closest("[data-v]:not([data-res])");
    if (tab && tab.parentElement.classList.contains("tabs")) { vista = tab.dataset.v; render(); return; }
    const ir = t.closest("[data-ir]");
    if (ir) {
      const s = slides(); let k = s.findIndex((el, i) => info(el, i).clave === ir.dataset.ir);
      if (k < 0) k = (+ir.dataset.d || 1) - 1;
      if (typeof go === "function") go(k); else location.hash = "#" + (k + 1);
      vista = "esta"; render(); return;
    }
    const rs = t.closest("[data-res]");
    if (rs) {
      rs.disabled = true;
      try {
        const r = await fetch(API, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mes: MES, id: rs.dataset.res, resuelta: rs.dataset.v === "1" }) });
        const j = await r.json(); if (!r.ok) throw 0;
        notas = notas.map(n => n.id === j.nota.id ? j.nota : n); error = "";
      } catch (e2) { error = "No se ha podido actualizar la nota."; }
      render();
    }
  });
  pn.addEventListener("submit", async e => {
    e.preventDefault();
    const f = e.target; const tx = f.tx.value.trim(); if (!tx) return;
    const au = f.au.value.trim(); ls("nt-autor", au);
    const { el, i } = actual(); const inf = info(el, i);
    const sb = f.querySelector(".send"); sb.disabled = true; sb.textContent = "Guardando…";
    try {
      const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mes: MES, ...inf, diapositiva: i + 1, imagen: f.img ? f.img.value : "", texto: tx, autor: au }) });
      const j = await r.json(); if (!r.ok) throw 0;
      notas.push(j.nota); error = ""; f.tx.value = ""; const ta = pn.querySelector("textarea"); if (ta) ta.value = "";
    } catch (e2) { error = "No se ha podido guardar la nota. Vuelve a intentarlo."; }
    render();
  });

  btn.addEventListener("click", e => { e.stopPropagation(); pn.classList.toggle("open"); if (pn.classList.contains("open")) { render(); cargar(); } });
  // al cambiar de diapositiva o de imagen del carrusel, el panel se actualiza
  const stage = document.getElementById("stage");
  let tmr; const pronto = () => { clearTimeout(tmr); tmr = setTimeout(() => { const a = document.activeElement; if (!(a && pn.contains(a))) render(); else render2(); }, 60); };
  // si se está escribiendo no se repinta el formulario: solo la cabecera y la lista
  function render2() { const { el, i } = actual(); const lbl = pn.querySelector(".lbl"); if (lbl) lbl.innerHTML = `Diapositiva ${i + 1}<b>${esc(info(el, i).etiqueta)}</b>`; }
  if (stage) new MutationObserver(muts => { if (muts.some(m => m.attributeName === "class" && m.target.classList && m.target.classList.contains("slide"))) pronto(); }).observe(stage, { attributes: true, subtree: true, attributeFilter: ["class"] });
  cargar();
  setInterval(() => { if (pn.classList.contains("open") && !(document.activeElement && pn.contains(document.activeElement))) cargar(); }, 30000);
})();
