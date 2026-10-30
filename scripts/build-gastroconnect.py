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
        ("Esencial", "1.000 €", [
            "Podcast: 1 episodio al mes + 8 reels",
            "Guía de los lunes: 1 post semanal por temáticas y festividades",
            "Guía foodie: 1 restaurante al mes con Richi o Jandro, reel + carrusel",
            "Calendario, publicación y community",
        ]),
        ("Completo", "1.250 €", [
            "Todo lo del plan Esencial",
            "Guía foodie: 2 restaurantes al mes",
            "LinkedIn: 1 post semanal",
            "Calendario, publicación y community",
        ]),
        ("360", "1.500 €", [
            "Todo lo del plan Completo",
            "Guía foodie: 3 restaurantes al mes",
            "Calendario, publicación y community",
        ]),
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
    + ('<video class="pm-reel f" style="left:1450px;top:300px;width:340px;height:604px;'
       'transform:rotate(3deg);--d:2" src="/pitch/gastroconnect/portada-reel.mp4" '
       'poster="/pitch/gastroconnect/portada-reel.jpg" autoplay muted loop playsinline preload="auto"></video>')
    + eyebrow("Plan de contenido · 2026–2027", top=150)
    + '<h1 class="abs a disp" style="left:128px;top:300px;font-size:104px;line-height:1;--d:1">Gastro</h1>'
    '<h1 class="abs a disp outline" style="left:128px;top:415px;font-size:104px;line-height:1;--d:2">connect</h1>'
    + p("El programa nº1 de gastronomía de Barcelona.", 128, 590, 820, size=36, d=3, cls="", extra="font-weight:800;")
))

# ── 2. El objetivo ────────────────────────────────────────────────────────
n += 1
add("objetivo", "El objetivo", sec(
    eyebrow("El objetivo", k=True)
    + titulo("El programa nº1<br>de Barcelona", top=260, size=112, extra="color:#151515;")
    + '<h2 class="abs a disp" style="left:128px;top:510px;width:1660px;font-size:112px;line-height:1.05;'
    'color:transparent;-webkit-text-stroke:3px #151515;--d:2">en gastronomía.</h2>'
    + p("Que cuando alguien en Barcelona quiera saber dónde comer o cómo funciona un restaurante, "
        "la respuesta sea Gastroconnect. Para el que come y para el que da de comer.",
        128, 720, 1300, size=30, d=3, cls="", extra="color:#3A2F2F;")
    + foot(n, k=True),
    bg=AMARILLO, color=INK,
))

# ── 3. El plan ────────────────────────────────────────────────────────────
n += 1
movs = [
    ("Autoridad", "Podcast", "Los que mandan en la restauración de Barcelona pasan por el micro. 1 episodio al mes + 8 reels."),
    ("Hábito", "Guía de los lunes", "Una cita fija cada semana: la guía gastronómica de Barcelona por temáticas y fechas (Navidad, San Valentín…)."),
    ("Sector", "LinkedIn", "Referente para el profesional: 1 post semanal con el lado negocio de la restauración."),
    ("Presencia", "Guía foodie", "Comer en los restaurantes que importan de la ciudad con Richi o Jandro. De 1 a 3 visitas al mes según el plan: reel + carrusel de cada una."),
]
mh = ""
for i, (t, linea, s_) in enumerate(movs):
    x = 128 + i * 424
    mh += (
        f'<div class="abs pm-card pop" style="left:{x}px;top:340px;width:396px;height:540px;--d:{i}"></div>'
        f'<p class="abs a disp outline" style="left:{x + 36}px;top:380px;font-size:64px;--d:{i + 1}">{i + 1:02d}</p>'
        f'<p class="abs a" style="left:{x + 36}px;top:490px;width:330px;font-size:38px;font-weight:800;line-height:1.15;--d:{i + 1}">{t}</p>'
        f'<p class="abs a rosa" style="left:{x + 36}px;top:545px;width:330px;font-size:22px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;--d:{i + 1}">{linea}</p>'
        f'<p class="abs a soft" style="left:{x + 36}px;top:600px;width:330px;font-size:25px;line-height:1.4;--d:{i + 2}">{s_}</p>'
    )
add("plan", "El plan", sec(
    eyebrow("El plan")
    + titulo("Cuatro movimientos para ser el nº1", size=64)
    + mh + foot(n),
))

# ── 4. Qué incluye ────────────────────────────────────────────────────────
n += 1
bloques = [
    ("Estrategia y dirección creativa", "Líneas, ideas y restaurantes de cada mes."),
    ("Producción y edición", "Rodaje del podcast y de las visitas, edición de todas las piezas."),
    ("Calendario, publicación y community", "Planificación mensual, copies, publicación y gestión de la comunidad."),
]
bh = ""
for i, (t, s_) in enumerate(bloques):
    y = 380 + i * 150
    bh += (
        f'<p class="abs a disp outline" style="left:128px;top:{y - 8}px;font-size:56px;line-height:1;--d:{i + 2}">{i + 1:02d}</p>'
        f'<p class="abs a" style="left:260px;top:{y}px;width:720px;font-size:32px;font-weight:800;--d:{i + 2}">{t}</p>'
        f'<p class="abs a soft" style="left:1080px;top:{y + 4}px;width:710px;font-size:26px;line-height:1.4;--d:{i + 3}">{s_}</p>'
    )
add("incluye", "Qué incluye", sec(
    eyebrow("En todos los planes")
    + titulo("Qué incluye", size=72)
    + bh + foot(n),
))

# ── 5. Planes ─────────────────────────────────────────────────────────────
n += 1
C = CIFRAS
ph = ""
for i, (nombre, precio, items) in enumerate(C["planes"]):
    x = 128 + i * 568
    destacado = i == 1
    borde = "background:#151515;color:#F4F4F4;" if destacado else "border:3px solid #151515;"
    col = "#C9C7C3" if destacado else "#3A2F2F"
    ph += f'<div class="abs pop" style="left:{x}px;top:300px;width:528px;height:560px;border-radius:22px;{borde}--d:{i}"></div>'
    tc = "color:#F4F4F4;" if destacado else ""
    ph += f'<p class="abs a pm-eyebrow" style="left:{x + 44}px;top:344px;{"color:" + AMARILLO + ";" if destacado else "color:#151515;"}--d:{i + 1}">Plan {nombre}</p>'
    ph += f'<p class="abs a disp" style="left:{x + 40}px;top:400px;font-size:96px;line-height:1;{tc}--d:{i + 1}">{precio}</p>'
    ph += f'<p class="abs a" style="left:{x + 44}px;top:512px;font-size:24px;font-weight:700;color:{col};--d:{i + 1}">{C["fee_nota"]}</p>'
    lis = "".join(
        f'<p style="margin:0 0 18px;padding-left:36px;text-indent:-36px">'
        f'<span style="font-weight:800;display:inline-block;width:36px;text-indent:0">—</span>{it}</p>'
        for it in items
    )
    ph += (f'<div class="abs a" style="left:{x + 44}px;top:570px;width:450px;font-size:24px;'
           f'line-height:1.3;{tc}--d:{i + 2}">{lis}</div>')
add("planes", "Inversión", sec(
    eyebrow("Inversión", k=True)
    + titulo("Tres planes", top=170, size=72, extra="color:#151515;")
    + ph
    + p("<b style=\"color:#151515\">Reels extra:</b> 30 € + IVA por reel grabado in situ · "
        "50 € + IVA por reel si requiere desplazamiento exclusivo (zona Barcelona).",
        128, 888, 1660, size=24, d=6, cls="", extra="color:#3A2F2F;")
    + p(f"Compromiso de {C['permanencia']} para medir resultados. No incluye paid media, invitados ni consumiciones en los restaurantes.",
        128, 932, 1660, size=22, d=7, cls="", extra="color:#3A2F2F;")
    + foot(n, k=True),
    bg=AMARILLO, color=INK,
))

# ── 6. Cierre ────────────────────────────────────────────────────────────
n += 1
add("cierre", "Gracias", sec(
    eyebrow("Contacto")
    + titulo("Gracias", top=300, size=140)
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
