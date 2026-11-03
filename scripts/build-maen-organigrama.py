"""
Genera app/pitch/maen-organigrama/diapos.ts — organigrama del equipo de Maen.

Si cambia el equipo, se edita EQUIPO / AREAS aquí y se vuelve a ejecutar:
    python3 scripts/build-maen-organigrama.py
"""

import json
from html import escape
from pathlib import Path

INK = "#151515"
PAPER = "#F4F4F4"
ROSA = "#F9CDCD"
MARCA = "Maen Studios · Organigrama"

# ── Equipo ────────────────────────────────────────────────────────────────
DIRECCION = [
    {"nombre": "Jandro", "rol": "Dirección de Cuentas",
     "hace": ["Relación con clientes y negocio", "Captación y propuestas", "Rentabilidad de cada cuenta"]},
    {"nombre": "Richi", "rol": "Dirección Creativa",
     "hace": ["Conceptos y campañas", "Línea visual de todas las marcas", "Supervisión de rodajes y piezas"]},
]

AREAS = [
    {
        "id": "brand",
        "nombre": "Cuentas & Brand", "lineas": ["Cuentas", "& Brand"],
        "lema": "La voz de cada marca dentro del estudio.",
        "gente": [
            {"nombre": "Helen", "rol": "Brand Manager"},
            {"nombre": "Minuca", "rol": "Brand Manager"},
            {"nombre": "Laura", "rol": "Brand Manager", "jr": True, "extra": "+ Community Manager"},
        ],
        "hace": ["Estrategia y briefing de cada marca", "Contacto diario con el cliente",
                 "Calendario de contenidos", "Reporting mensual"],
    },
    {
        "id": "community",
        "nombre": "Community", "lineas": ["Community"],
        "lema": "Las marcas, vivas en redes cada día.",
        "gente": [
            {"nombre": "Blanca", "rol": "Community Manager"},
            {"nombre": "Alexia", "rol": "Community Manager", "jr": True},
        ],
        "hace": ["Publicación y gestión de perfiles", "Conversación con la comunidad",
                 "Tendencias y formatos", "Copys y stories"],
    },
    {
        "id": "audiovisual",
        "nombre": "Producción audiovisual", "lineas": ["Producción", "audiovisual"],
        "lema": "Todo lo que se graba y se monta, en casa.",
        "gente": [
            {"nombre": "Mati", "rol": "Director de Fotografía", "extra": "DoP · Cámara"},
            {"nombre": "Go", "rol": "Editor & Postproducción", "extra": "Montaje · Color"},
        ],
        "hace": ["Rodajes de foto y vídeo", "Dirección de cámara e iluminación",
                 "Montaje, color y sonido", "Versiones por formato y canal"],
    },
]

TOTAL = len(DIRECCION) + sum(len(a["gente"]) for a in AREAS)


# ── Piezas ────────────────────────────────────────────────────────────────
def e(t):
    return escape(t, quote=False)


def foot(n, claro=False):
    k = " foot-k" if claro else ""
    return f'<div class="foot{k}"><span>{e(MARCA)}</span><span class="n">{n:02d}</span></div>'


def jr(p, claro=False):
    if not p.get("jr"):
        return ""
    cls = "og-jr og-jr-k" if claro else "og-jr"
    return f' <span class="{cls}">Jr</span>'


def avatar(nombre, x, y, size, rosa=False, d=0):
    cls = "og-av og-av-r" if rosa else "og-av"
    fs = int(size * 0.42)
    return (f'<div class="abs {cls} pop" style="left:{x}px;top:{y}px;width:{size}px;height:{size}px;'
            f'font-size:{fs}px;--d:{d}">{e(nombre[0])}</div>')


def ficha(p, x, y, w, h, d, rosa=False):
    """Tarjeta de persona para el organigrama general."""
    card = "pm-card-r" if rosa else "pm-card"
    sub_color = "#3A2F2F" if rosa else "var(--muted)"
    name_color = "#151515" if rosa else "#F4F4F4"
    av = 56
    extra = f' · {e(p["extra"])}' if p.get("extra") else ""
    return (
        f'<div class="abs {card} pop" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:20px;--d:{d}"></div>'
        + avatar(p["nombre"], x + 18, y + (h - av) // 2, av, rosa=not rosa, d=d)
        + f'<p class="abs a" style="left:{x + 94}px;top:{y + h // 2 - 34}px;font-size:30px;font-weight:800;line-height:1.1;color:{name_color};--d:{d}">{e(p["nombre"])}{jr(p, rosa)}</p>'
        + f'<p class="abs a" style="left:{x + 94}px;top:{y + h // 2 + 4}px;width:{w - 110}px;font-size:19px;line-height:1.25;color:{sub_color};--d:{d}">{e(p["rol"])}{extra}</p>'
    )


# ── Diapositivas ──────────────────────────────────────────────────────────
def arbol(x0, y0, d0=0, r=46):
    """Mini organigrama de iniciales: dirección arriba, áreas debajo."""
    h = []
    sep = 136
    top = [p["nombre"] for p in DIRECCION]
    tx = [x0 + 1.5 * sep - sep / 2 + i * sep for i in range(len(top))]
    cx = [x0 + i * 1.5 * sep for i in range(len(AREAS))]
    yb = y0 + 2 * r + 50
    h.append(f'<div class="abs line-v gy" style="left:{int(x0 + 1.5 * sep) + r - 1}px;top:{y0 + 2 * r}px;height:{yb - y0 - 2 * r}px;background:{ROSA};--d:{d0}"></div>')
    h.append(f'<div class="abs line-h gx" style="left:{int(cx[0]) + r}px;top:{yb}px;width:{int(cx[-1] - cx[0]) + 2}px;background:{ROSA};--d:{d0 + 1}"></div>')
    for i, n in enumerate(top):
        h.append(avatar(n, int(tx[i]), y0, 2 * r, rosa=False, d=d0 + i).replace('og-av ', 'og-av og-av-o '))
    for k, a in enumerate(AREAS):
        h.append(f'<div class="abs line-v gy" style="left:{int(cx[k]) + r - 1}px;top:{yb}px;height:{(len(a["gente"]) - 1) * (2 * r + 24) + 30 + r}px;background:#3A3D3C;--d:{d0 + 2}"></div>')
        for j, p in enumerate(a["gente"]):
            h.append(avatar(p["nombre"], int(cx[k]), yb + 30 + j * (2 * r + 24), 2 * r, rosa=True, d=d0 + 3 + k + j))
    return "".join(h)


def portada():
    nombres = " · ".join([p["nombre"] for p in DIRECCION] + [p["nombre"] for a in AREAS for p in a["gente"]])
    cinta = (nombres + " · ") * 2
    return {
        "id": "portada",
        "titulo": "Organigrama",
        "html": (
            f'<section style="background:{INK};color:{PAPER}">'
            f'<p class="abs a pm-eyebrow" style="left:128px;top:150px;--d:0">Maen Studios · Equipo</p>'
            f'<h1 class="abs a disp" style="left:128px;top:300px;font-size:150px;--d:1">Organi</h1>'
            f'<h1 class="abs a disp outline" style="left:128px;top:460px;font-size:150px;--d:2">grama</h1>'
            f'<p class="abs a soft" style="left:128px;top:680px;width:900px;font-size:32px;--d:3">'
            f'Quién hace qué en Maen. {TOTAL} personas, un mismo ciclo: de la idea a la publicación.</p>'
            + arbol(1160, 150, 3) +
            f'<div class="abs og-marquee" style="left:0;top:850px;width:1920px;--d:4">'
            f'<div class="og-marquee-in disp outline">{e(cinta)}</div></div>'
            f'<p class="abs a muted" style="left:128px;top:980px;font-size:22px;letter-spacing:0.18em;text-transform:uppercase;--d:5">'
            f'Barcelona · Madrid · Noviembre 2026</p>'
            f'</section>'
        ),
    }


def organigrama(n):
    h = []
    h.append(f'<section style="background:{INK};color:{PAPER}">')
    h.append('<p class="abs a pm-eyebrow" style="left:120px;top:96px;--d:0">El equipo</p>')
    h.append('<h2 class="abs a disp" style="left:120px;top:146px;font-size:64px;--d:1">Organigrama</h2>')
    h.append(f'<p class="abs a muted" style="left:1400px;top:160px;width:400px;text-align:right;font-size:22px;letter-spacing:0.12em;text-transform:uppercase;--d:1">{TOTAL} personas · 4 áreas</p>')

    # Dirección
    w, hh, gap = 400, 120, 40
    x0 = (1920 - (2 * w + gap)) // 2
    y_dir = 272
    h.append('<p class="abs a muted" style="left:120px;top:318px;font-size:20px;letter-spacing:0.18em;text-transform:uppercase;--d:1">Dirección</p>')
    for i, p in enumerate(DIRECCION):
        h.append(ficha(p, x0 + i * (w + gap), y_dir, w, hh, i + 1, rosa=True))

    # Conectores
    cols = [(120, 520), (700, 520), (1280, 520)]
    centros = [x + cw // 2 for x, cw in cols]
    y_bus = 450
    h.append(f'<div class="abs line-v gy" style="left:959px;top:{y_dir + hh}px;height:{y_bus - y_dir - hh}px;background:{ROSA};--d:2"></div>')
    h.append(f'<div class="abs line-h gx" style="left:{centros[0]}px;top:{y_bus}px;width:{centros[-1] - centros[0] + 2}px;background:{ROSA};--d:3"></div>')
    for c in centros:
        h.append(f'<div class="abs line-v gy" style="left:{c}px;top:{y_bus}px;height:40px;background:{ROSA};--d:4"></div>')

    # Áreas
    y_area = 490
    for k, ((x, cw), area) in enumerate(zip(cols, AREAS)):
        h.append(f'<div class="abs pop" style="left:{x}px;top:{y_area}px;width:{cw}px;height:64px;border:2px solid {ROSA};border-radius:999px;--d:{4 + k}"></div>')
        h.append(f'<p class="abs a disp-r" style="left:{x}px;top:{y_area + 19}px;width:{cw}px;text-align:center;font-size:24px;color:{ROSA};--d:{4 + k}">{e(area["nombre"])}</p>')
        for j, p in enumerate(area["gente"]):
            h.append(ficha(p, x, y_area + 92 + j * 106, cw, 92, 6 + k + j))
    h.append(foot(n))
    h.append('</section>')
    return {"id": "organigrama", "titulo": "Organigrama", "html": "".join(h)}


def direccion(n):
    h = [f'<section style="background:{ROSA};color:{INK}">']
    h.append(f'<p class="abs a pm-eyebrow" style="left:128px;top:128px;color:{INK};--d:0">01 · Dirección</p>')
    h.append('<h2 class="abs a disp" style="left:128px;top:190px;width:1660px;font-size:88px;--d:1">Negocio y creatividad,</h2>')
    h.append(f'<h2 class="abs a disp" style="left:128px;top:290px;width:1660px;font-size:88px;color:transparent;-webkit-text-stroke:3px {INK};--d:2">a la misma altura.</h2>')
    for i, p in enumerate(DIRECCION):
        x = 128 + i * 852
        y = 480
        h.append(f'<div class="abs pop" style="left:{x}px;top:{y}px;width:812px;height:440px;background:{INK};border-radius:28px;--d:{3 + i}"></div>')
        h.append(avatar(p["nombre"], x + 56, y + 56, 120, rosa=True, d=3 + i))
        h.append(f'<p class="abs a disp" style="left:{x + 210}px;top:{y + 70}px;font-size:56px;color:{PAPER};--d:{3 + i}">{e(p["nombre"])}</p>')
        h.append(f'<p class="abs a" style="left:{x + 210}px;top:{y + 140}px;font-size:26px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:{ROSA};--d:{3 + i}">{e(p["rol"])}</p>')
        for j, t in enumerate(p["hace"]):
            yy = y + 230 + j * 62
            h.append(f'<div class="abs line-h gx" style="left:{x + 56}px;top:{yy}px;width:700px;background:#3A3D3C;--d:{4 + j}"></div>')
            h.append(f'<p class="abs a" style="left:{x + 56}px;top:{yy + 14}px;font-size:28px;color:{PAPER};--d:{4 + j}">{e(t)}</p>')
    h.append(foot(n, claro=True))
    h.append('</section>')
    return {"id": "direccion", "titulo": "Dirección", "html": "".join(h)}


def area(a, num, n):
    h = [f'<section style="background:{INK};color:{PAPER}">']
    h.append(f'<p class="abs a disp outline" style="left:128px;top:110px;font-size:200px;--d:0">{num:02d}</p>')
    h.append(f'<p class="abs a pm-eyebrow" style="left:128px;top:380px;--d:1">Área</p>')
    titulo = "<br>".join(e(l) for l in a["lineas"])
    h.append(f'<h2 class="abs a disp" style="left:128px;top:430px;width:820px;font-size:68px;line-height:1.05;--d:2">{titulo}</h2>')
    h.append(f'<p class="abs a soft" style="left:128px;top:{430 + len(a["lineas"]) * 72 + 24}px;width:680px;font-size:30px;--d:3">{e(a["lema"])}</p>')
    # Qué hace el área
    y0 = 720
    for j, t in enumerate(a["hace"]):
        yy = y0 + j * 58
        h.append(f'<div class="abs line-h gx" style="left:128px;top:{yy}px;width:680px;--d:{3 + j}"></div>')
        h.append(f'<p class="abs a" style="left:128px;top:{yy + 12}px;font-size:24px;--d:{3 + j}"><span class="rosa">→</span>&nbsp; {e(t)}</p>')
    # Personas
    gente = a["gente"]
    ch, gap = 200, 32
    alto = len(gente) * ch + (len(gente) - 1) * gap
    y = (1080 - alto) // 2 - 10
    for i, p in enumerate(gente):
        yy = y + i * (ch + gap)
        h.append(f'<div class="abs pm-card pop" style="left:1000px;top:{yy}px;width:792px;height:{ch}px;--d:{2 + i}"></div>')
        h.append(avatar(p["nombre"], 1044, yy + 44, 112, rosa=True, d=2 + i))
        h.append(f'<p class="abs a disp" style="left:1196px;top:{yy + 46}px;font-size:48px;--d:{2 + i}">{e(p["nombre"])}{jr(p)}</p>')
        h.append(f'<p class="abs a" style="left:1196px;top:{yy + 108}px;font-size:24px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:{ROSA};--d:{2 + i}">{e(p["rol"])}</p>')
        if p.get("extra"):
            h.append(f'<p class="abs a muted" style="left:1196px;top:{yy + 144}px;font-size:22px;--d:{2 + i}">{e(p["extra"])}</p>')
    h.append(foot(n))
    h.append('</section>')
    return {"id": a["id"], "titulo": a["nombre"], "html": "".join(h)}


def ciclo(n):
    pasos = [
        ("Briefing", "Cuentas & Brand"),
        ("Concepto", "Dirección Creativa"),
        ("Rodaje", "Audiovisual"),
        ("Montaje", "Audiovisual"),
        ("Calendario", "Brand · Community"),
        ("Publicación", "Community"),
        ("Reporting", "Cuentas & Brand"),
    ]
    h = [f'<section style="background:{INK};color:{PAPER}">']
    h.append('<p class="abs a pm-eyebrow" style="left:128px;top:128px;--d:0">Cómo encaja</p>')
    h.append('<h2 class="abs a disp" style="left:128px;top:190px;width:1660px;font-size:72px;--d:1">Un ciclo, todo en casa</h2>')
    h.append('<p class="abs a soft" style="left:128px;top:300px;width:1100px;font-size:28px;--d:2">Cada pieza pasa por todas las áreas del estudio, sin salir de Maen.</p>')
    w, gap = 214, 18
    x0 = (1920 - (len(pasos) * w + (len(pasos) - 1) * gap)) // 2
    y = 500
    h.append(f'<div class="abs line-h gx" style="left:{x0}px;top:{y + 90}px;width:{len(pasos) * w + (len(pasos) - 1) * gap}px;background:{ROSA};--d:2"></div>')
    for i, (paso, quien) in enumerate(pasos):
        x = x0 + i * (w + gap)
        h.append(f'<div class="abs pop" style="left:{x + w // 2 - 18}px;top:{y + 72}px;width:38px;height:38px;border-radius:999px;background:{ROSA};--d:{3 + i}"></div>')
        h.append(f'<p class="abs a disp outline" style="left:{x}px;top:{y - 30}px;width:{w}px;text-align:center;font-size:64px;--d:{3 + i}">{i + 1:02d}</p>')
        h.append(f'<p class="abs a" style="left:{x}px;top:{y + 150}px;width:{w}px;text-align:center;font-size:28px;font-weight:800;--d:{3 + i}">{e(paso)}</p>')
        h.append(f'<p class="abs a muted" style="left:{x}px;top:{y + 196}px;width:{w}px;text-align:center;font-size:20px;--d:{3 + i}">{e(quien)}</p>')
    h.append(foot(n))
    h.append('</section>')
    return {"id": "ciclo", "titulo": "Cómo encaja", "html": "".join(h)}


def cierre(n):
    h = [f'<section style="background:{ROSA};color:{INK}">']
    h.append(f'<p class="abs a disp" style="left:128px;top:220px;font-size:340px;line-height:1;--d:0">{TOTAL}</p>')
    h.append(f'<h2 class="abs a disp" style="left:128px;top:600px;width:1660px;font-size:80px;--d:1">personas.</h2>')
    h.append(f'<h2 class="abs a disp" style="left:128px;top:700px;width:1660px;font-size:80px;color:transparent;-webkit-text-stroke:3px {INK};--d:2">Un solo estudio.</h2>')
    h.append(f'<p class="abs a" style="left:128px;top:880px;font-size:24px;letter-spacing:0.18em;text-transform:uppercase;color:#3A2F2F;--d:3">Barcelona · Madrid · maenstudios.com</p>')
    h.append(arbol(1180, 180, 2).replace("background:#3A3D3C", "background:#151515").replace("og-av og-av-r", "og-av").replace(f"background:{ROSA}", "background:#151515").replace("og-av og-av-o", "og-av og-av-o og-av-ok"))
    h.append(foot(n, claro=True))
    h.append('</section>')
    return {"id": "cierre", "titulo": "Cierre", "html": "".join(h)}


def main():
    diapos = [portada(), organigrama(2), direccion(3)]
    for i, a in enumerate(AREAS):
        diapos.append(area(a, i + 2, 4 + i))
    diapos.append(ciclo(4 + len(AREAS)))
    diapos.append(cierre(5 + len(AREAS)))

    out = Path(__file__).resolve().parent.parent / "app/pitch/maen-organigrama/diapos.ts"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        "/**\n * Organigrama del equipo de Maen.\n"
        " * Generado con scripts/build-maen-organigrama.py: si cambia el equipo,\n"
        " * se edita el script y se vuelve a ejecutar.\n */\n\n"
        'import type { DiapoHtml } from "../maen-plan-100k/diapos";\n\n'
        f"export const DIAPOS: DiapoHtml[] = {json.dumps(diapos, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )
    print(f"{len(diapos)} diapositivas → {out}")


if __name__ == "__main__":
    main()
