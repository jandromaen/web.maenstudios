"""Genera app/pitch/gastroconnect-calendario/diciembre/diapos.ts: el planning
de diciembre 2026 de Gastroconnect, con el visor y los estilos de la propuesta
(../../maen-plan-100k/plan.css) y el amarillo de Gastroconnect.

Contenidos fijados al mes (acuerdo con Quique, nov 2026): 1 episodio en
YouTube y Spotify, 6 reels del episodio, 2 reels de la app de reservas, la
guía foodie (reel + reel de receta), la guía de los lunes (LinkedIn fuera del
acuerdo final). Todo el mes se define en PUBLICACIONES; se ejecuta desde la raíz:

    python3 scripts/build-gastroconnect-diciembre.py
"""

import json
from pathlib import Path

INK = "#151515"
AMARILLO = "#F6C01B"
MARCA = "Gastroconnect · Planning de diciembre"

# Línea de contenido → (nombre, color)
LINEAS = {
    "podcast": ("Podcast", AMARILLO),
    "foodie": ("Guía foodie", "#F08A5D"),
    "lunes": ("Guía de los lunes", "#C8BCE9"),
}

# (día, línea, pieza, detalle)
PUBLICACIONES = [
    (0, "lunes", "Carrusel", "Restaurantes para la cena de empresa"),
    (1, "podcast", "YouTube y Spotify", "Episodio completo con Papalote"),
    (1, "podcast", "Reel 1", "Tráiler del episodio"),
    (3, "podcast", "Reel 2", "Clip del episodio"),
    (5, "podcast", "Reel 3", "Clip del episodio"),
    (7, "lunes", "Carrusel", "Planes gastronómicos para el puente"),
    (7, "podcast", "Reel 4", "Clip del episodio"),
    (9, "podcast", "Reel 5", "Clip del episodio"),
    (11, "podcast", "Reel 6", "Clip del episodio"),
    (13, "podcast", "Reel 7", "Clip del episodio"),
    (14, "lunes", "Carrusel", "Dónde encargar la comida de Navidad"),
    (15, "podcast", "Reel 8", "Clip del episodio"),
    (17, "podcast", "Reel 9", "Clip del episodio"),
    (19, "podcast", "Reel 10", "Clip del episodio (si da el montaje)"),
    (21, "lunes", "Carrusel", "Restaurantes abiertos el 24, el 25 y Sant Esteve"),
    (28, "lunes", "Carrusel", "Nochevieja y el primer brunch del año"),
    (29, "foodie", "Reel", "Guía foodie en Papalote"),
    (30, "foodie", "Reel receta", "Receta de Papalote"),
]

FESTIVOS = {
    8: "Inmaculada",
    24: "Nochebuena",
    25: "Navidad",
    26: "Sant Esteve",
    31: "Nochevieja",
}

DIAS_SEM = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
PRIMER_DIA = 1  # el 1 de diciembre de 2026 es martes (0 = lunes)


def dia_sem(d):
    return DIAS_SEM[(PRIMER_DIA + d - 1) % 7]


def fecha(d):
    """Día del mes; el 0 es el lunes 30 de noviembre."""
    return "30 nov" if d == 0 else str(d)


def sec(body, bg=INK, color="#F4F4F4"):
    return f'<section style="background:{bg};color:{color};--rosa:{AMARILLO}">{body}</section>'


def foot(n, k=False):
    cls = "foot foot-k" if k else "foot"
    return f'<div class="{cls}" style="left:128px;"><span>{MARCA}</span><span class="n">{n:02d}</span></div>'


def eyebrow(t, top=128, left=128, k=False, d=0):
    c = "color:#151515;" if k else ""
    return f'<p class="abs a pm-eyebrow" style="left:{left}px;top:{top}px;{c}--d:{d}">{t}</p>'


def titulo(t, top=190, left=128, width=1660, size=72, d=1, extra=""):
    return (
        f'<h2 class="abs a disp" style="left:{left}px;top:{top}px;width:{width}px;'
        f'font-size:{size}px;line-height:1.05;{extra}--d:{d}">{t}</h2>'
    )


def p(t, left, top, width, size=26, d=2, cls="soft", extra=""):
    return (
        f'<p class="abs a {cls}" style="left:{left}px;top:{top}px;width:{width}px;'
        f'font-size:{size}px;line-height:1.4;{extra}--d:{d}">{t}</p>'
    )


def punto(color, size=14):
    return (f'<span style="display:inline-block;width:{size}px;height:{size}px;border-radius:50%;'
            f'background:{color};margin-right:10px;vertical-align:middle"></span>')


slides = []
n = 0


def add(id_, tit, html):
    slides.append({"id": id_, "titulo": tit, "html": html})


reels_podcast = sum(1 for _, l, pz, _ in PUBLICACIONES if l == "podcast" and pz.startswith("Reel"))
carruseles = sum(1 for _, l, _, _ in PUBLICACIONES if l == "lunes")

# ── 1. Portada ────────────────────────────────────────────────────────────
n += 1
add("portada", "Planning de diciembre", sec(
    eyebrow("Gastroconnect · @gastroconnect_", top=150)
    + '<h1 class="abs a disp" style="left:128px;top:300px;font-size:120px;line-height:1;--d:1">Planning</h1>'
    '<h1 class="abs a disp outline" style="left:128px;top:430px;font-size:120px;line-height:1;--d:2">diciembre</h1>'
    + p(f"Papalote: episodio, {reels_podcast} reels del podcast, guía foodie y receta · {carruseles} guías de los lunes",
        128, 620, 1300, size=32, d=3, cls="", extra="font-weight:700;")
    + p("Los reels del podcast, en las tres primeras semanas. La guía foodie y la receta, en la última.",
        128, 730, 1300, size=28, d=4)
    + '<video class="pm-reel f" style="left:1460px;top:200px;width:340px;height:604px;transform:rotate(3deg);--d:2" '
    'src="/clients/gastroconnect/preview.mp4" poster="/clients/gastroconnect/poster.jpg" autoplay muted loop playsinline preload="auto"></video>'
))

# ── 2. Calendario ─────────────────────────────────────────────────────────
n += 1
por_dia = {}
for d, l, pz, det in PUBLICACIONES:
    por_dia.setdefault(d, []).append((l, pz))
cw, ch, x0, y0, gap = 232, 116, 128, 320, 6
cal = ""
for j, nombre in enumerate(["L", "M", "X", "J", "V", "S", "D"]):
    cal += (f'<p class="abs a muted" style="left:{x0 + j * (cw + gap)}px;top:{y0 - 44}px;width:{cw}px;'
            f'font-size:20px;letter-spacing:.1em;text-align:center;--d:1">{nombre}</p>')
for d in range(0, 32):
    idx = PRIMER_DIA + d - 1
    col, fila = idx % 7, idx // 7
    x, y = x0 + col * (cw + gap), y0 + fila * (ch + gap)
    fest = FESTIVOS.get(d) or ("noviembre" if d == 0 else None)
    borde = "1px solid #3A3A3A"
    cal += f'<div class="abs a" style="left:{x}px;top:{y}px;width:{cw}px;height:{ch}px;border:{borde};border-radius:12px;--d:2"></div>'
    cal += (f'<p class="abs a disp" style="left:{x + 14}px;top:{y + 10}px;font-size:26px;line-height:1;'
            f'{"color:#6B6B6B;" if not por_dia.get(d) else ""}--d:2">{30 if d == 0 else d}</p>')
    if fest:
        cal += (f'<p class="abs a rosa" style="left:{x + 56}px;top:{y + 14}px;width:{cw - 66}px;font-size:16px;'
                f'font-weight:700;text-align:right;--d:2">{fest}</p>')
    yy = y + 48
    for l, pz in por_dia.get(d, []):
        nombre, color = LINEAS[l]
        if l == "podcast":
            etiqueta = "Podcast en YouTube y Spotify" if pz == "YouTube y Spotify" else "Reel podcast"
        elif l == "foodie" and pz == "Reel receta":
            etiqueta = "Receta foodie"
        else:
            etiqueta = nombre
        lineas = 2 if len(etiqueta) > 20 else 1
        cal += (f'<p class="abs a" style="left:{x + 14}px;top:{yy}px;width:{cw - 24}px;font-size:16px;'
                f'line-height:1.15;padding-left:21px;text-indent:-21px;--d:3">{punto(color, 11)}{etiqueta}</p>')
        yy += 19 * lineas + 8
ley = ('<div class="abs a" style="left:560px;top:212px;width:1232px;display:flex;justify-content:flex-end;'
       'gap:34px;font-size:21px;--d:1">'
       + "".join(f'<span>{punto(color, 13)}{nombre}</span>' for nombre, color in LINEAS.values())
       + '</div>')
add("calendario", "Calendario", sec(
    eyebrow("Diciembre 2026")
    + titulo("El mes", size=72)
    + ley + cal + foot(n),
))

# ── 3. Producción ─────────────────────────────────────────────────────────
n += 1
rodajes = [
    ("Grabado", "Podcast con Papalote", "Episodio de diciembre y sus 9–10 reels."),
    ("Antes del 22", "Guía foodie en Papalote", "Visita con Richi o Jandro: reel + reel de receta."),
    ("14–18 dic", "Podcast de enero", "Episodio y reels del mes, antes de las fiestas."),
]
rh = ""
for i, (cuando, t, s_) in enumerate(rodajes):
    y = 380 + i * 150
    rh += (
        f'<p class="abs a disp" style="left:128px;top:{y - 6}px;width:330px;font-size:42px;--d:{i + 2}">{cuando}</p>'
        f'<p class="abs a" style="left:500px;top:{y}px;width:520px;font-size:34px;font-weight:800;--d:{i + 2}">{t}</p>'
        f'<p class="abs a" style="left:1040px;top:{y + 4}px;width:750px;font-size:27px;line-height:1.4;color:#3A2F2F;--d:{i + 3}">{s_}</p>'
    )
add("produccion", "Producción", sec(
    eyebrow("Producción", k=True)
    + titulo("Rodajes", top=190, size=72, extra="color:#151515;")
    + rh
    + p("Grabar el episodio de enero antes del 18 deja la primera semana de enero cubierta sin depender de las fiestas.",
        128, 860, 1500, size=24, d=6, cls="", extra="color:#3A2F2F;")
    + foot(n, k=True),
    bg=AMARILLO, color=INK,
))

# ── 4–7. Semanas ──────────────────────────────────────────────────────────
semanas = [
    ("Semana 1", "30 nov–6 dic", "Arranca la guía de los lunes y se estrena Papalote", 0, 6),
    ("Semana 2", "7–13 dic", "Reels del podcast", 7, 13),
    ("Semana 3", "14–20 dic", "Últimos reels del podcast", 14, 20),
    ("Semanas 4 y 5", "21–31 dic", "Guía foodie y receta con Papalote", 21, 31),
]
for k, (nom, rango, lema, a, b) in enumerate(semanas):
    n += 1
    filas = [x for x in PUBLICACIONES if a <= x[0] <= b]
    fh = ""
    alto = 86 if len(filas) <= 6 else 76
    for i, (d, l, pz, det) in enumerate(filas):
        y = 380 + i * alto
        nombre, color = LINEAS[l]
        fh += (
            f'<div class="abs a deco" style="left:128px;top:{y - 22}px;width:1664px;height:1px;background:#3A3A3A;--d:{i + 1}"></div>'
            f'<p class="abs a" style="left:128px;top:{y}px;width:300px;font-size:26px;font-weight:800;--d:{i + 2}">{dia_sem(d)} {fecha(d)}</p>'
            f'<p class="abs a" style="left:460px;top:{y}px;width:420px;font-size:24px;--d:{i + 2}">{punto(color)}{nombre} · {pz}</p>'
            f'<p class="abs a soft" style="left:920px;top:{y}px;width:870px;font-size:26px;line-height:1.3;--d:{i + 2}">{det}</p>'
        )
    fest = [f"{dia_sem(d).lower()} {d}: {f}" for d, f in FESTIVOS.items() if a <= d <= b]
    nota = ("Festivos: " + " · ".join(fest) + ". Sin publicaciones esos días.") if fest else ""
    add(f"semana-{k + 1}", nom, sec(
        eyebrow(f"{nom} · {rango}")
        + titulo(lema, size=56, width=1660)
        + fh
        + (p(nota, 128, 940, 1660, size=22, d=8, cls="muted") if nota else "")
        + foot(n),
    ))

# ── 8. Pendiente ──────────────────────────────────────────────────────────
n += 1
pend = [
    "Día para grabar la guía foodie y la receta en Papalote (antes del 22).",
    "Fecha exacta del rodaje del podcast de enero (semana del 14).",
    "Restaurantes de cada guía de los lunes.",
]
ph = "".join(
    f'<p class="abs a" style="left:128px;top:{380 + i * 90}px;width:1500px;font-size:32px;--d:{i + 2}">'
    f'<span class="rosa" style="font-weight:800;margin-right:18px">—</span>{t}</p>'
    for i, t in enumerate(pend)
)
add("pendiente", "Pendiente de cerrar", sec(
    eyebrow("Para cerrar con Quique")
    + titulo("Pendiente", size=72)
    + ph + foot(n),
))

out = Path("app/pitch/gastroconnect-calendario/diciembre/diapos.ts")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(
    "/**\n * Planning de diciembre 2026 de Gastroconnect.\n"
    " * Generado con scripts/build-gastroconnect-diciembre.py: se edita el\n"
    " * script y se vuelve a ejecutar.\n */\n\n"
    'import type { DiapoHtml } from "../../maen-plan-100k/diapos";\n\n'
    "export const DIAPOS: DiapoHtml[] = "
    + json.dumps(slides, ensure_ascii=False, indent=2)
    + ";\n",
    encoding="utf-8",
)
print(len(slides), "diapositivas")
