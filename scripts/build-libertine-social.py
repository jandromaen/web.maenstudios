"""Genera app/pitch/libertine-social/diapos.ts: propuesta de Maen como equipo
social y creativo recurrente de Libertine Blends (respuesta al scope que
mandó Sofía, CEO de Libertine, el 29 de octubre de 2026).

Lienzo 1920×1080 con las clases de ../maen-plan-100k/plan.css. Las cifras
negociables viven arriba, en CIFRAS: si cambia el fee o la cadencia, se toca
ahí y se vuelve a ejecutar desde la raíz del repo:

    python3 scripts/build-libertine-social.py
"""

import json
from pathlib import Path

LB = "/pitch/libertine-blends"
INK = "#151515"
ROSA = "#F9CDCD"
MARCA = "Maen Studios × Libertine Blends"

# ── Lo negociable ─────────────────────────────────────────────────────────
CIFRAS = {
    "fee": "4.000 €",
    "fee_nota": "al mes + IVA",
    "permanencia": "6 meses",
    "rodajes": 1,
    "salidas": 4,
    "ig_mes": 12,
    "tt_mes": 16,
}


def sec(body, bg=INK, color="#F4F4F4"):
    return f'<section style="background:{bg};color:{color}">{body}</section>'


def foot(n, left=128, width=None, k=False):
    w = f"right:auto;width:{width}px;" if width else ""
    cls = "foot foot-k" if k else "foot"
    return (
        f'<div class="{cls}" style="left:{left}px;{w}">'
        f"<span>{MARCA}</span>"
        f'<span class="n">{n:02d}</span></div>'
    )


def reel(name, left, top, w, h, rot, d):
    return (
        f'<video class="pm-reel f" style="left:{left}px;top:{top}px;width:{w}px;height:{h}px;'
        f'transform:rotate({rot}deg);--d:{d}" src="/clients/{name}/preview.mp4" '
        f'poster="/clients/{name}/poster.jpg" autoplay muted loop playsinline preload="auto"></video>'
    )


def foto(src, alt, left, top, w, h, rot=0, d=0, radius=22, pos="50% 50%"):
    return (
        f'<img class="abs f" style="left:{left}px;top:{top}px;width:{w}px;height:{h}px;'
        f"object-fit:cover;object-position:{pos};border-radius:{radius}px;"
        f'transform:rotate({rot}deg);--d:{d}" src="{LB}/{src}" alt="{alt}">'
    )


def eyebrow(t, top=128, left=128, k=False, d=0):
    c = "color:#151515;" if k else ""
    return f'<p class="abs a pm-eyebrow" style="left:{left}px;top:{top}px;{c}--d:{d}">{t}</p>'


def titulo(t, top=190, left=128, width=1660, size=72, d=1, extra=""):
    return (
        f'<h2 class="abs a disp" style="left:{left}px;top:{top}px;width:{width}px;'
        f'font-size:{size}px;line-height:1.05;{extra}--d:{d}">{t}</h2>'
    )


def lista(items, left, top, width, size=26, gap=58, d=2, color="soft", bullet="—"):
    h = ""
    for i, t in enumerate(items):
        h += (
            f'<p class="abs a {color}" style="left:{left}px;top:{top + i * gap}px;width:{width}px;'
            f'font-size:{size}px;line-height:1.35;--d:{d + i}">'
            f'<span class="rosa" style="font-weight:800;margin-right:14px">{bullet}</span>{t}</p>'
        )
    return h


slides = []
n = 0


def add(id_, tit, html):
    slides.append({"id": id_, "titulo": tit, "html": html})


C = CIFRAS

# ── 1. Portada ────────────────────────────────────────────────────────────
n += 1
add("portada", "Libertine × Maen", sec(
    foto("portada-latas.jpg", "Latas de Libertine Blends con cócteles servidos",
         860, 0, 1060, 1080, radius=0, pos="62% 50%")
    + '<div class="abs deco" style="left:820px;top:0;width:260px;height:1080px;'
    'background:linear-gradient(90deg,#151515,rgba(21,21,21,0))"></div>'
    + eyebrow("Propuesta · Octubre 2026", top=150)
    + '<h1 class="abs a disp" style="left:128px;top:300px;font-size:96px;line-height:1;--d:1">Libertine</h1>'
    '<h1 class="abs a disp outline" style="left:128px;top:410px;font-size:96px;line-height:1;--d:2">× Maen</h1>'
    '<p class="abs a soft" style="left:128px;top:580px;width:700px;font-size:32px;line-height:1.35;--d:3">'
    "Vuestro equipo social y creativo.</p>"
))

# ── 2. Cómo lo vemos ──────────────────────────────────────────────────────
n += 1
add("idea", "Cómo lo vemos", sec(
    eyebrow("Cómo lo vemos", k=True)
    + titulo("Libertine pone<br>el contexto.", top=300, size=96, extra="color:#151515;")
    + '<h2 class="abs a disp" style="left:128px;top:540px;width:1660px;font-size:96px;line-height:1.05;'
    'color:transparent;-webkit-text-stroke:3px #151515;--d:2">Maen trae las ideas<br>y las hace realidad.</h2>'
    + foot(n, k=True),
    bg=ROSA, color=INK,
))

# ── 3. El servicio ───────────────────────────────────────────────────────
n += 1
bloques = [
    ("Dirección estratégica y creativa", [
        "Estrategia por canal",
        "Ideas y formatos propios",
        "Briefing mensual",
    ]),
    ("Producción y edición", [
        f"{C['rodajes']} rodaje al mes",
        f"{C['salidas']} grabaciones rápidas",
        "Edición para cada canal",
    ]),
    ("Calendario", [
        f"{C['ig_mes']} piezas en Instagram",
        f"{C['tt_mes']} vídeos en TikTok",
        "Copy y publicación",
    ]),
    ("Community management", [
        "Comentarios y mensajes",
        "Stories del día a día",
        "Reporte mensual",
    ]),
]
bh = ""
for i, (t, items) in enumerate(bloques):
    x = 128 + i * 424
    bh += (
        f'<div class="abs pm-card pop" style="left:{x}px;top:340px;width:392px;height:540px;--d:{i}"></div>'
        f'<p class="abs a disp outline" style="left:{x + 36}px;top:376px;font-size:64px;--d:{i + 1}">{i + 1:02d}</p>'
        f'<p class="abs a" style="left:{x + 36}px;top:480px;width:330px;font-size:32px;font-weight:800;line-height:1.15;--d:{i + 1}">{t}</p>'
    )
    for j, it in enumerate(items):
        bh += (
            f'<p class="abs a soft" style="left:{x + 36}px;top:{640 + j * 66}px;width:330px;font-size:24px;'
            f'line-height:1.3;--d:{i + j + 2}"><span class="rosa" style="margin-right:10px">—</span>{it}</p>'
        )
add("servicio", "El servicio", sec(
    eyebrow("El servicio")
    + titulo("Qué incluye", size=72)
    + bh + foot(n),
))

# ── 5. Inversión ─────────────────────────────────────────────────────────
n += 1
add("inversion", "Inversión", sec(
    eyebrow("Inversión", k=True)
    + f'<p class="abs pop disp" style="left:120px;top:300px;font-size:200px;line-height:1;--d:1">{C["fee"]}</p>'
    + f'<p class="abs a" style="left:128px;top:540px;font-size:40px;font-weight:700;--d:2">{C["fee_nota"]}</p>'
    + '<p class="abs a" style="left:128px;top:680px;width:1300px;font-size:28px;line-height:1.5;color:#3A2F2F;--d:3">'
    f"{C['permanencia']} con prórroga automática.<br>"
    "No incluye creators, colaboraciones ni eventos. El paid lo sigue llevando No Idea.</p>"
    + foot(n, k=True),
    bg=ROSA, color=INK,
))

# ── 6. Cierre ────────────────────────────────────────────────────────────
n += 1
add("cierre", "Lo cerramos", sec(
    eyebrow("Siguiente paso")
    + titulo("¿Lo<br>cerramos?", top=260, width=1660, size=140)
    + '<div class="abs a" style="left:128px;top:720px;font-size:28px;line-height:1.5;--d:3">'
    '<p style="font-weight:800">Jandro Martín</p>'
    '<p><a href="mailto:jandro@maenstudios.com" style="color:inherit">jandro@maenstudios.com</a> · +34 688 629 688</p>'
    "</div>"
    + foot(n),
))

out = Path("app/pitch/libertine-social/diapos.ts")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(
    "/**\n * Propuesta de Maen como equipo social y creativo de Libertine Blends.\n"
    " * Generado con scripts/build-libertine-social.py: si cambia el contenido\n"
    " * o las cifras, se edita el script y se vuelve a ejecutar.\n */\n\n"
    'import type { DiapoHtml } from "../maen-plan-100k/diapos";\n\n'
    "export const DIAPOS: DiapoHtml[] = "
    + json.dumps(slides, ensure_ascii=False, indent=2)
    + ";\n",
    encoding="utf-8",
)
print(len(slides), "diapositivas")
