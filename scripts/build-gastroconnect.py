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
    "episodios": 1,
    "jornadas": 3,
    "reels": 14,
    "restaurantes": 4,
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

# ── 3. La idea ────────────────────────────────────────────────────────────
n += 1
capas = [
    ("El plato", "Lo que ve el foodie: qué pedir, cómo se hace, cuánto cuesta."),
    ("El negocio", "Lo que quiere el hostelero: ticket medio, cubiertos al día, coste del plato, cómo se montó."),
]
ch = ""
for i, (t, s_) in enumerate(capas):
    x = 128 + i * 560
    ch += (
        f'<div class="abs pm-card pop" style="left:{x}px;top:420px;width:520px;height:440px;--d:{i}"></div>'
        f'<p class="abs a disp outline" style="left:{x + 44}px;top:464px;font-size:72px;--d:{i + 1}">{i + 1:02d}</p>'
        f'<p class="abs a" style="left:{x + 44}px;top:580px;width:430px;font-size:40px;font-weight:800;--d:{i + 1}">{t}</p>'
        f'<p class="abs a soft" style="left:{x + 44}px;top:650px;width:430px;font-size:26px;line-height:1.4;--d:{i + 2}">{s_}</p>'
    )
add("idea", "La idea", sec(
    eyebrow("La idea")
    + titulo("Cada pieza,<br>dos capas", size=80)
    + ch
    + reel("gastroconnect", 1380, 150, 420, 746, 2, 2)
    + foot(n),
))

# ── 4. Pilares ────────────────────────────────────────────────────────────
n += 1
pilares = [
    ("5", "Podcast", "El episodio del mes recortado en clips con gancho de dato."),
    ("4", "Por qué funciona", "Quique visita un restaurante, prueba el plato estrella y saca un dato al dueño."),
    ("3", "Así se hace", "Un plato icónico cocinado por partes, en la cocina del restaurante."),
    ("2", "Guías rápidas", "Rankings y recomendaciones cortas, hechas para guardar."),
]
ph = ""
for i, (num, t, s_) in enumerate(pilares):
    x = 128 + i * 424
    ph += (
        f'<div class="abs pm-card pop" style="left:{x}px;top:340px;width:396px;height:560px;--d:{i}"></div>'
        f'<p class="abs a disp outline" style="left:{x + 36}px;top:370px;font-size:140px;line-height:1;--d:{i + 1}">{num}</p>'
        f'<p class="abs a muted" style="left:{x + 36}px;top:530px;font-size:20px;letter-spacing:.08em;text-transform:uppercase;--d:{i + 1}">reels</p>'
        f'<p class="abs a" style="left:{x + 36}px;top:600px;width:330px;font-size:34px;font-weight:800;line-height:1.15;--d:{i + 1}">{t}</p>'
        f'<p class="abs a soft" style="left:{x + 36}px;top:690px;width:330px;font-size:24px;line-height:1.4;--d:{i + 2}">{s_}</p>'
    )
add("pilares", "Cuatro pilares", sec(
    eyebrow("Pilares de contenido")
    + titulo(f"{C['reels']} reels, cuatro pilares", size=72)
    + ph + foot(n),
))

# ── 5. Por qué funciona ───────────────────────────────────────────────────
n += 1
pasos = [
    "Entrada al local y plato estrella en mesa: 3 segundos de gancho.",
    "Quique lo prueba y dice qué pedir.",
    "Pregunta de negocio al dueño: «¿cuántos vendes al día?», «¿cuánto te cuesta?».",
    "Cierre con el dato en pantalla.",
]
sh = ""
for i, t in enumerate(pasos):
    y = 420 + i * 110
    sh += (
        f'<p class="abs a disp outline" style="left:128px;top:{y - 10}px;font-size:56px;line-height:1;--d:{i + 2}">{i + 1:02d}</p>'
        f'<p class="abs a" style="left:260px;top:{y}px;width:780px;font-size:30px;line-height:1.35;--d:{i + 2}">{t}</p>'
    )
add("formato", "Por qué funciona", sec(
    eyebrow("Formato estrella")
    + titulo("«Por qué<br>funciona»", size=72)
    + sh
    + p("Variante: <b style=\"color:#F4F4F4\">¿Cuánto cuesta este plato?</b> Escandallo del plato estrella frente a su precio de carta.",
        128, 880, 960, size=26, d=7)
    + reel("burmet", 1150, 170, 330, 586, -3, 2)
    + reel("tram-tram", 1500, 290, 330, 586, 3, 3)
    + foot(n),
))

# ── 6. Más formatos ───────────────────────────────────────────────────────
n += 1
otros = [
    ("Así se hace", "Plato de otoño en 3 partes (guiso, setas o callos). Cada parte acaba en suspense, como las tortillas de Mantequerías Pirenaicas."),
    ("Guías rápidas", "«3 sitios para comer bien por menos de 25 €», «Dónde comen los cocineros en su día libre», «Lo mejor del mes»."),
    ("Clips del podcast", "Lo que ya funciona: titular con número o nombre potente. 5 clips por episodio y el mejor, fijado."),
]
oh = ""
for i, (t, s_) in enumerate(otros):
    x = 128 + i * 568
    oh += (
        f'<div class="abs pm-card pop" style="left:{x}px;top:340px;width:528px;height:520px;--d:{i}"></div>'
        f'<p class="abs a disp outline" style="left:{x + 44}px;top:384px;font-size:72px;--d:{i + 1}">{i + 1:02d}</p>'
        f'<p class="abs a" style="left:{x + 44}px;top:500px;width:440px;font-size:36px;font-weight:800;line-height:1.15;--d:{i + 1}">{t}</p>'
        f'<p class="abs a soft" style="left:{x + 44}px;top:580px;width:440px;font-size:26px;line-height:1.4;--d:{i + 2}">{s_}</p>'
    )
add("formatos", "Más formatos", sec(
    eyebrow("El resto del mes")
    + titulo("Tres formatos más", size=72)
    + oh + foot(n),
))

# ── 7. Noviembre en números ───────────────────────────────────────────────
n += 1
nums = [
    (str(C["episodios"]), "episodio de podcast"),
    (str(C["restaurantes"]), "restaurantes visitados"),
    (str(C["jornadas"]), "jornadas de rodaje"),
    (str(C["reels"]), "reels publicados"),
]
nh = ""
for i, (num, t) in enumerate(nums):
    x = 128 + i * 424
    nh += (
        f'<p class="abs pop disp outline" style="left:{x - 6}px;top:410px;font-size:180px;line-height:1;--d:{i}">{num}</p>'
        f'<p class="abs a" style="left:{x}px;top:640px;width:380px;font-size:32px;font-weight:800;--d:{i + 2}">{t}</p>'
    )
add("numeros", "Noviembre en números", sec(
    eyebrow("Noviembre")
    + titulo("El mes,<br>en cuatro cifras", size=72)
    + nh
    + p("3–4 reels por semana. Las stories acompañan cada rodaje y empujan el episodio en YouTube.",
        128, 800, 1660, size=28, d=7)
    + foot(n),
))

# ── 8. Calendario ─────────────────────────────────────────────────────────
n += 1
cols = ["Semana", "Lunes", "Martes", "Jueves", "Sábado"]
filas = [
    ["2–8 nov", "Grabación del episodio", "Por qué funciona #1", "Guía: menos de 25 €", "¿Cuánto cuesta? #2"],
    ["9–15 nov", "Clip podcast #1", "Así se hace · 1", "Clip podcast #2", "Así se hace · 2"],
    ["16–22 nov", "Así se hace · 3", "Clip podcast #3", "Por qué funciona #3", "Clip podcast #4"],
    ["23–29 nov", "—", "Por qué funciona #4", "Clip podcast #5", "Guía: lo mejor del mes"],
]
xs = [128, 420, 790, 1160, 1530]
w = [270, 350, 350, 350, 300]
th = ""
for j, c in enumerate(cols):
    th += (f'<p class="abs a muted" style="left:{xs[j]}px;top:330px;width:{w[j]}px;font-size:20px;'
           f'letter-spacing:.08em;text-transform:uppercase;--d:1">{c}</p>')
for i, fila in enumerate(filas):
    y = 400 + i * 130
    th += f'<div class="abs a deco" style="left:128px;top:{y - 24}px;width:1664px;height:1px;background:#3A3A3A;--d:{i + 1}"></div>'
    for j, c in enumerate(fila):
        estilo = "font-weight:800;" if j == 0 else ""
        clase = "rosa" if ("Por qué" in c or "Cuánto" in c) else ""
        th += (f'<p class="abs a {clase}" style="left:{xs[j]}px;top:{y}px;width:{w[j]}px;font-size:27px;'
               f'line-height:1.3;{estilo}--d:{i + 2}">{c}</p>')
add("calendario", "Calendario", sec(
    eyebrow("Calendario")
    + titulo("Noviembre, semana a semana", size=64)
    + th
    + p("El episodio completo sale en YouTube la semana del 9, junto al primer clip.", 128, 920, 1660, size=24, d=7)
    + foot(n),
))

# ── 9. Producción ─────────────────────────────────────────────────────────
n += 1
jornadas = [
    ("Podcast", "Episodio completo + intros y cierres para los clips", "3 h"),
    ("Foodie A", "Visitas #1 y #2 + la serie «Así se hace» completa", "5 h"),
    ("Foodie B", "Visitas #3 y #4 + recursos para las guías", "4 h"),
]
jh = ""
for i, (t, s_, h) in enumerate(jornadas):
    y = 440 + i * 120
    jh += (
        f'<p class="abs a" style="left:128px;top:{y}px;font-size:34px;font-weight:800;--d:{i + 2}">{t}</p>'
        f'<p class="abs a" style="left:420px;top:{y + 4}px;width:640px;font-size:28px;line-height:1.35;color:#3A2F2F;--d:{i + 2}">{s_}</p>'
        f'<p class="abs a disp" style="left:1080px;top:{y - 6}px;font-size:44px;--d:{i + 2}">{h}</p>'
    )
add("produccion", "Producción", sec(
    eyebrow("Producción", k=True)
    + titulo("Tres jornadas,<br>todo el mes", top=190, size=72, extra="color:#151515;")
    + jh
    + '<div class="abs a deco" style="left:1300px;top:400px;width:492px;height:440px;border:3px solid #151515;border-radius:22px;--d:3"></div>'
    + '<p class="abs a" style="left:1344px;top:440px;width:410px;font-size:30px;font-weight:800;--d:4">Lo que necesitamos de Quique</p>'
    + p("— Los 4 restaurantes, con acceso cerrado<br>— Qué datos de negocio cuenta cada dueño<br>— Invitado y fecha del episodio",
        1344, 530, 410, size=26, d=5, cls="", extra="line-height:1.6;color:#3A2F2F;")
    + foot(n, k=True),
    bg=AMARILLO, color=INK,
))

# ── 10. Cierre ────────────────────────────────────────────────────────────
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
