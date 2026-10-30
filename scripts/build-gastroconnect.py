"""Genera app/pitch/gastroconnect/diapos.ts: estrategia de contenido de
noviembre 2026 para Gastroconnect Podcast (host: Quique), con el mismo
visor y estilos que la propuesta de Libertine (../maen-plan-100k/plan.css).

El acento rosa de Maen se cambia por el amarillo de Gastroconnect
redefiniendo --rosa en cada diapositiva. Las cifras del mes viven en CIFRAS.
Se ejecuta desde la raíz del repo:

    python3 scripts/build-gastroconnect.py
"""

import json
from pathlib import Path

INK = "#151515"
AMARILLO = "#F6C01B"
MARCA = "Maen Studios × Gastroconnect"

CIFRAS = {
    "fee_nota": "al mes + IVA",
    "permanencia": "3 meses",
    # (nombre, precio, [lo que incluye]) — cada plan suma al anterior
    "planes": [
        ("Esencial", "1.000 €", ["Podcast: 1 episodio al mes + clips", "Guía foodie: 2 restaurantes al mes", "2 reels + 2 carruseles"]),
        ("Completo", "1.250 €", ["Todo lo del plan Esencial", "Guía de los lunes: 1 post semanal", "Temáticas, calendario y festividades"]),
        ("360", "1.500 €", ["Todo lo del plan Completo", "Gestión de LinkedIn"]),
    ],
}


def sec(body, bg=INK, color="#F4F4F4"):
    return f'<section style="background:{bg};color:{color};--rosa:{AMARILLO}">{body}</section>'


def foot(n, k=False):
    cls = "foot foot-k" if k else "foot"
    return f'<div class="{cls}" style="left:128px;"><span>{MARCA}</span><span class="n">{n:02d}</span></div>'


def reel(name, left, top, w, h, rot, d):
    return (
        f'<video class="pm-reel f" style="left:{left}px;top:{top}px;width:{w}px;height:{h}px;'
        f'transform:rotate({rot}deg);--d:{d}" src="/clients/{name}/preview.mp4" '
        f'poster="/clients/{name}/poster.jpg" autoplay muted loop playsinline preload="auto"></video>'
    )


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


slides = []
n = 0


def add(id_, tit, html):
    slides.append({"id": id_, "titulo": tit, "html": html})


C = CIFRAS

# ── 1. Portada ────────────────────────────────────────────────────────────
n += 1
add("portada", "Gastroconnect × Maen", sec(
    reel("gastroconnect", 1060, 150, 340, 604, -4, 1)
    + reel("mantis", 1450, 300, 340, 604, 3, 2)
    + eyebrow("Estrategia de contenido · Noviembre 2026", top=150)
    + '<h1 class="abs a disp" style="left:128px;top:300px;font-size:104px;line-height:1;--d:1">Gastro</h1>'
    '<h1 class="abs a disp outline" style="left:128px;top:415px;font-size:104px;line-height:1;--d:2">connect</h1>'
    + p("El plato y el negocio.", 128, 590, 800, size=36, d=3, cls="", extra="font-weight:800;")
    + p("Podcast + contenido foodie para que la cuenta crezca más allá del plató.", 128, 660, 820, size=30, d=4)
))

# ── 2. Punto de partida ───────────────────────────────────────────────────
n += 1
add("partida", "Punto de partida", sec(
    eyebrow("Punto de partida", k=True)
    + titulo("Un podcast<br>que funciona.", top=260, size=104, extra="color:#151515;")
    + '<h2 class="abs a disp" style="left:128px;top:500px;width:1660px;font-size:104px;line-height:1.05;'
    'color:transparent;-webkit-text-stroke:3px #151515;--d:2">Un solo motor.</h2>'
    + p("220 publicaciones · 8.300 seguidores · 2 temporadas. Todo sale de un episodio al mes: "
        "noviembre añade una segunda pata que no depende del plató.",
        128, 720, 1300, size=30, d=3, cls="", extra="color:#3A2F2F;")
    + foot(n, k=True),
    bg=AMARILLO, color=INK,
))

# ── 3. Estrategia ─────────────────────────────────────────────────────────
n += 1
capas = [
    ("El plato", "Para el foodie: dónde comer, qué pedir y por qué merece la pena."),
    ("El negocio", "Para el hostelero: cómo funciona ese restaurante por dentro, con datos reales."),
]
ch = ""
for i, (t, s_) in enumerate(capas):
    x = 128 + i * 560
    ch += (
        f'<div class="abs pm-card pop" style="left:{x}px;top:550px;width:520px;height:340px;--d:{i}"></div>'
        f'<p class="abs a disp outline" style="left:{x + 44}px;top:585px;font-size:64px;--d:{i + 1}">{i + 1:02d}</p>'
        f'<p class="abs a" style="left:{x + 44}px;top:690px;width:430px;font-size:38px;font-weight:800;--d:{i + 1}">{t}</p>'
        f'<p class="abs a soft" style="left:{x + 44}px;top:752px;width:430px;font-size:26px;line-height:1.4;--d:{i + 2}">{s_}</p>'
    )
add("estrategia", "Estrategia", sec(
    eyebrow("Estrategia general")
    + titulo("De podcast<br>a medio gastronómico", size=72)
    + p("Gastroconnect deja de depender solo del plató: el podcast sigue siendo el ancla y el contenido de calle "
        "abre la cuenta al público foodie, que es el que la hace crecer. Cada pieza habla a las dos audiencias.",
        128, 370, 1100, size=28, d=2)
    + ch
    + reel("gastroconnect", 1400, 200, 400, 711, 2, 2)
    + foot(n),
))

# ── 4. Líneas de contenido ────────────────────────────────────────────────
n += 1
lineas = [
    ("Podcast", "Un episodio al mes en YouTube y sus mejores momentos en clips. La autoridad de la cuenta."),
    ("Guía foodie", "Quique visita 2 restaurantes al mes: un reel y un carrusel de cada uno."),
    ("Guía de los lunes", "Un post cada lunes: guía gastronómica por temáticas y fechas del calendario (Navidad, San Valentín…)."),
    ("LinkedIn", "Gastroconnect como referente del sector: el lado negocio de cada episodio y cada visita."),
]
lh = ""
for i, (t, s_) in enumerate(lineas):
    x = 128 + i * 424
    lh += (
        f'<div class="abs pm-card pop" style="left:{x}px;top:340px;width:396px;height:520px;--d:{i}"></div>'
        f'<p class="abs a disp outline" style="left:{x + 36}px;top:380px;font-size:64px;--d:{i + 1}">{i + 1:02d}</p>'
        f'<p class="abs a" style="left:{x + 36}px;top:490px;width:330px;font-size:34px;font-weight:800;line-height:1.15;--d:{i + 1}">{t}</p>'
        f'<p class="abs a soft" style="left:{x + 36}px;top:560px;width:330px;font-size:25px;line-height:1.4;--d:{i + 2}">{s_}</p>'
    )
add("lineas", "Líneas de contenido", sec(
    eyebrow("Líneas de contenido")
    + titulo("Cuatro líneas", size=72)
    + lh + foot(n),
))

# ── 5. Qué incluye ────────────────────────────────────────────────────────
n += 1
bloques = [
    ("Estrategia y dirección creativa", "Líneas, ideas y restaurantes de cada mes."),
    ("Producción y edición", "Rodaje del podcast y de las visitas, edición de todas las piezas."),
    ("Calendario y publicación", "Planificación mensual, copies y publicación."),
    ("Informe mensual", "Qué ha funcionado y qué ajustamos el mes siguiente."),
]
bh = ""
for i, (t, s_) in enumerate(bloques):
    y = 340 + i * 130
    bh += (
        f'<p class="abs a disp outline" style="left:128px;top:{y - 8}px;font-size:56px;line-height:1;--d:{i + 2}">{i + 1:02d}</p>'
        f'<p class="abs a" style="left:260px;top:{y}px;width:720px;font-size:32px;font-weight:800;--d:{i + 2}">{t}</p>'
        f'<p class="abs a soft" style="left:1000px;top:{y + 4}px;width:790px;font-size:26px;line-height:1.4;--d:{i + 3}">{s_}</p>'
    )
add("incluye", "Qué incluye", sec(
    eyebrow("En todos los planes")
    + titulo("Qué incluye", size=72)
    + bh + foot(n),
))

# ── 6. Planes ─────────────────────────────────────────────────────────────
n += 1
C = CIFRAS
ph = ""
for i, (nombre, precio, items) in enumerate(C["planes"]):
    x = 128 + i * 568
    destacado = i == 1
    borde = "background:#151515;color:#F4F4F4;" if destacado else "border:3px solid #151515;"
    col = "#C9C7C3" if destacado else "#3A2F2F"
    ph += f'<div class="abs pop" style="left:{x}px;top:300px;width:528px;height:600px;border-radius:22px;{borde}--d:{i}"></div>'
    tc = "color:#F4F4F4;" if destacado else ""
    ph += f'<p class="abs a pm-eyebrow" style="left:{x + 44}px;top:344px;{"color:" + AMARILLO + ";" if destacado else "color:#151515;"}--d:{i + 1}">Plan {nombre}</p>'
    ph += f'<p class="abs a disp" style="left:{x + 40}px;top:400px;font-size:96px;line-height:1;{tc}--d:{i + 1}">{precio}</p>'
    ph += f'<p class="abs a" style="left:{x + 44}px;top:512px;font-size:24px;font-weight:700;color:{col};--d:{i + 1}">{C["fee_nota"]}</p>'
    for j, it in enumerate(items):
        ph += (
            f'<p class="abs a" style="left:{x + 44}px;top:{590 + j * 70}px;width:440px;font-size:26px;line-height:1.3;{tc}--d:{i + 2}">'
            f'<span style="font-weight:800;margin-right:12px">—</span>{it}</p>'
        )
add("planes", "Inversión", sec(
    eyebrow("Inversión", k=True)
    + titulo("Tres planes", top=170, size=72, extra="color:#151515;")
    + ph
    + p(f"Compromiso de {C['permanencia']} para medir resultados. No incluye paid media, invitados ni consumiciones en los restaurantes.",
        128, 940, 1660, size=24, d=6, cls="", extra="color:#3A2F2F;")
    + foot(n, k=True),
    bg=AMARILLO, color=INK,
))

# ── 7. Cierre ────────────────────────────────────────────────────────────
n += 1
add("cierre", "Arrancamos", sec(
    eyebrow("Siguiente paso")
    + titulo("¿Arrancamos<br>noviembre?", top=260, size=116)
    + '<div class="abs a" style="left:128px;top:720px;font-size:28px;line-height:1.5;--d:3">'
    '<p style="font-weight:800">Jandro Martín</p>'
    '<p><a href="mailto:jandro@maenstudios.com" style="color:inherit">jandro@maenstudios.com</a> · +34 688 629 688</p>'
    "</div>"
    + reel("gastroconnect", 1500, 220, 300, 534, 3, 2)
    + foot(n),
))

out = Path("app/pitch/gastroconnect/diapos.ts")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(
    "/**\n * Estrategia de contenido de noviembre 2026 para Gastroconnect.\n"
    " * Generado con scripts/build-gastroconnect.py: si cambia el contenido\n"
    " * o las cifras, se edita el script y se vuelve a ejecutar.\n */\n\n"
    'import type { DiapoHtml } from "../maen-plan-100k/diapos";\n\n'
    "export const DIAPOS: DiapoHtml[] = "
    + json.dumps(slides, ensure_ascii=False, indent=2)
    + ";\n",
    encoding="utf-8",
)
print(len(slides), "diapositivas")
