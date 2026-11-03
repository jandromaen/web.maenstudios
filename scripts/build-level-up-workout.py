"""Genera app/pitch/level-up-workout/diapos.ts: auditoría de Instagram, web y
ventas de Level Up Workout (Lucía, @lucia_entrenadorapersonal) para la
primera reunión de asesoría estratégica (noviembre 2026).

Mismo visor y estilos que el Business Plan (../maen-plan-100k/plan.css). El
acento rosa de Maen se cambia por el melocotón de Level Up redefiniendo
--rosa en cada diapositiva.

Fuentes de las cifras (enviadas por Lucía el 2 nov 2026):
  - Instagram_Mayo-Octubre_2026_Analisis_detallado_por_publicacion.xls
  - Level_Up_Workout_WooCommerce_Pedidos_Jul-Oct_2026.xlsx
más el perfil de Instagram y las dos webs revisados el 3 nov 2026.

Se ejecuta desde la raíz del repo:

    python3 scripts/build-level-up-workout.py
"""

import json
from pathlib import Path

INK = "#151515"
PAPER = "#F4F4F4"
ACENTO = "#FFC48F"  # melocotón de la marca Level Up
NAVY = "#1C2238"  # azul marino de la marca Level Up
G1 = "#2A2D2C"
SOFT = "#C9C7C3"
MUTED = "#9A9894"
MARCA = "Maen Studios × Level Up Workout"


def fmt(n):
    """1234567 -> 1.234.567"""
    return f"{n:,}".replace(",", ".")


# ── Datos ────────────────────────────────────────────────────────────────
MESES = [  # mes, posts, visualizaciones, seguidoras, guardados, pruebas reales en web
    ("May", 6, 117455, 652, 241, None),
    ("Jun", 4, 29944, 16, 118, None),
    ("Jul", 2, 15628, 131, 301, 1),
    ("Ago", 5, 125847, 682, 1940, 2),
    ("Sep", 4, 78119, 139, 200, 2),
    ("Oct", 6, 10037, 17, 35, 0),
]

PILARES = [  # nombre, posts, visualizaciones, guardados, compartidos, comentarios, seguidoras
    ("Entreno práctico", 13, 150300, 2365, 467, 67, 816),
    ("Humor y vida personal", 4, 138386, 255, 1167, 373, 265),
    ("Kitesurf", 6, 61976, 165, 126, 143, 359),
    ("Producto Level Up", 4, 26368, 50, 3, 18, 197),
]
TOT = dict(posts=27, views=377030, alcance=308994, likes=6305, coment=601,
           compart=1763, guard=2835, seg=1637, inter=11504)


def sec(body, bg=INK, color=PAPER):
    return f'<section style="background:{bg};color:{color};--rosa:{ACENTO}">{body}</section>'


def foot(n, k=False):
    cls = "foot foot-k" if k else "foot"
    return f'<div class="{cls}" style="left:128px;"><span>{MARCA}</span><span class="n">{n:02d}</span></div>'


def eyebrow(t, top=128, left=128, k=False, d=0):
    c = "color:#151515;" if k else ""
    return f'<p class="abs a pm-eyebrow" style="left:{left}px;top:{top}px;{c}--d:{d}">{t}</p>'


def titulo(t, top=176, left=128, width=1664, size=64, d=1, extra=""):
    return (
        f'<h2 class="abs a disp" style="left:{left}px;top:{top}px;width:{width}px;'
        f'font-size:{size}px;line-height:1.05;{extra}--d:{d}">{t}</h2>'
    )


def p(t, left, top, width, size=26, d=2, cls="soft", extra=""):
    return (
        f'<p class="abs a {cls}" style="left:{left}px;top:{top}px;width:{width}px;'
        f'font-size:{size}px;line-height:1.4;{extra}--d:{d}">{t}</p>'
    )


def kpi(x, y, w, valor, etiqueta, d, size=72, color=None, sub_color=SOFT):
    c = f"color:{color};" if color else ""
    return (
        f'<div class="abs a" style="left:{x}px;top:{y}px;width:{w}px;border-top:2px solid #3A3D3C;padding-top:24px;--d:{d}">'
        f'<p class="disp" style="font-size:{size}px;{c}">{valor}</p>'
        f'<p style="margin-top:14px;font-size:22px;line-height:1.35;color:{sub_color}">{etiqueta}</p></div>'
    )


def card(x, y, w, h, d=0, cls="pm-card", extra=""):
    return f'<div class="abs {cls} pop" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;{extra}--d:{d}"></div>'


def lista(items, x, y, w, size=25, d=2, color=None, gap=16, marca="—", mcolor="var(--rosa)"):
    c = f"color:{color};" if color else ""
    lis = "".join(
        f'<p style="margin:0 0 {gap}px;padding-left:38px;text-indent:-38px">'
        f'<span style="font-weight:800;display:inline-block;width:38px;text-indent:0;color:{mcolor}">{marca}</span>{it}</p>'
        for it in items
    )
    return f'<div class="abs a" style="left:{x}px;top:{y}px;width:{w}px;font-size:{size}px;line-height:1.35;{c}--d:{d}">{lis}</div>'


slides = []
n = 0


def add(id_, tit, html):
    slides.append({"id": id_, "titulo": tit, "html": html})


# ── 1. Portada ───────────────────────────────────────────────────────────
n += 1
add("portada", "Auditoría Level Up Workout", sec(
    '<div class="abs deco f" style="left:1180px;top:-120px;width:900px;height:1320px;'
    f'background:{ACENTO};transform:rotate(14deg);border-radius:60px;--d:0"></div>'
    f'<p class="abs a disp" style="left:1290px;top:300px;font-size:220px;line-height:.9;color:{NAVY};--d:2">LV<br>UP</p>'
    + eyebrow("Auditoría · Noviembre 2026", top=150)
    + '<h1 class="abs a disp" style="left:128px;top:290px;font-size:112px;line-height:1;--d:1">Level Up</h1>'
    '<h1 class="abs a disp outline" style="left:128px;top:410px;font-size:112px;line-height:1;--d:2">Workout</h1>'
    + p("Qué está pasando en tu Instagram, en tu web y en tus ventas, y por dónde empezar.",
        128, 590, 900, size=36, d=3, cls="", extra="font-weight:800;")
    + p("Preparado por Maen Studios para Lucía · @lucia_entrenadorapersonal", 128, 790, 900, size=24, d=4)
    + foot(n),
))

# ── 2. Lo que nos pediste ────────────────────────────────────────────────
n += 1
add("encargo", "Lo que nos pediste", sec(
    eyebrow("Punto de partida")
    + titulo("Lo que nos pediste")
    + card(128, 330, 800, 560)
    + p("Tu objetivo", 176, 374, 700, size=22, d=1, cls="rosa", extra="font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
    + p("Más visitas a la web y más suscripciones a Level Up Workout.", 176, 420, 700, size=40, d=2, cls="", extra="font-weight:800;line-height:1.2;")
    + lista([
        "Público: mujeres de 35 a 55 años.",
        "Tú grabas y editas; nosotros ponemos la estrategia.",
        "Saber qué funciona, qué se pierde y cómo usar la audiencia que ya tienes.",
    ], 176, 620, 700, size=25, d=3)
    + card(992, 330, 800, 560, d=1, cls="pm-card-r")
    + p("La duda", 1040, 374, 700, size=22, d=2, cls="", extra=f"color:{NAVY};font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
    + p("«El kitesurf es lo que mejor funciona, pero ese público no es el que necesito llevar a la web.»",
        1040, 420, 700, size=36, d=3, cls="", extra=f"color:{INK};font-weight:800;line-height:1.25;")
    + p("¿Cómo combino los dos mundos y aprovecho mi marca personal para impulsar el proyecto?",
        1040, 700, 700, size=26, d=4, cls="", extra="color:#3A2F2F;")
    + foot(n),
))

# ── 3. Qué hemos analizado ───────────────────────────────────────────────
n += 1
fuentes = [
    ("27", "publicaciones de Instagram", "1 de mayo – 31 de octubre de 2026, una a una: formato, tema, copy y métricas."),
    ("38", "pedidos de WooCommerce", "1 de julio – 1 de noviembre de 2026: importe, cupón, canal y tipo de cliente."),
    ("26,4K", "seguidoras en el perfil", "Bio, enlaces, destacados, fijados y portadas, revisados el 3 de noviembre."),
    ("2", "webs", "La landing de Level Up y la web de entrenamiento personal a domicilio."),
]
fh = ""
for i, (num, tit, desc) in enumerate(fuentes):
    x = 128 + i * 424
    fh += (
        card(x, 340, 396, 470, d=i)
        + f'<p class="abs a disp rosa" style="left:{x + 36}px;top:384px;font-size:72px;--d:{i + 1}">{num}</p>'
        + p(tit, x + 36, 490, 330, size=30, d=i + 1, cls="", extra="font-weight:800;line-height:1.2;")
        + p(desc, x + 36, 600, 330, size=23, d=i + 2)
    )
add("fuentes", "Qué hemos analizado", sec(
    eyebrow("Metodología")
    + titulo("Qué hemos analizado")
    + fh
    + p("Siguiendo tu indicación, las altas directas y las de 0,99 € (cupón testing99) se tratan como conocidas y no cuentan como clientas reales.",
        128, 860, 1664, size=23, d=6, cls="muted")
    + foot(n),
))

# ── 4. Resumen ───────────────────────────────────────────────────────────
n += 1
conclus = [
    ("Tienes alcance de sobra.", "377.030 visualizaciones y 1.637 seguidoras nuevas en seis meses. El problema no es que no te vean."),
    ("Pero no llega a la web.", "Solo 5 pruebas gratis reales en cuatro meses. El vídeo con más éxito del año (105.000 visualizaciones) no trajo ninguna."),
    ("Y cuando llega, convierte.", "3 de esas 5 pruebas pasaron a pago. El producto y el precio funcionan: falta el puente entre Instagram y la web."),
]
ch = ""
for i, (t, s_) in enumerate(conclus):
    y = 360 + i * 190
    ch += (
        f'<p class="abs a disp outline" style="left:128px;top:{y - 6}px;font-size:64px;line-height:1;--d:{i + 2}">{i + 1:02d}</p>'
        + p(t, 300, y, 640, size=40, d=i + 2, cls="", extra="font-weight:800;line-height:1.15;")
        + p(s_, 1000, y + 2, 790, size=27, d=i + 3)
    )
add("resumen", "Resumen", sec(
    eyebrow("En una frase")
    + titulo("El problema no es el contenido.<br>Es el camino a la web.", size=60)
    + ch + foot(n),
))

# ── 5. La cuenta en cifras ───────────────────────────────────────────────
n += 1
k1 = [
    (fmt(TOT["views"]), "visualizaciones"),
    (fmt(TOT["alcance"]), "alcance acumulado (no son personas únicas)"),
    (fmt(TOT["seg"]), "seguidoras nuevas atribuidas"),
    ("3,7 %", "interacciones sobre alcance"),
]
k2 = [
    (fmt(TOT["likes"]), "me gusta"),
    (fmt(TOT["coment"]), "comentarios"),
    (fmt(TOT["compart"]), "compartidos"),
    (fmt(TOT["guard"]), "guardados"),
]
kh = ""
for i, (v, e) in enumerate(k1):
    kh += kpi(128 + i * 424, 340, 380, v, e, i + 2, size=64, color=ACENTO)
for i, (v, e) in enumerate(k2):
    kh += kpi(128 + i * 424, 600, 380, v, e, i + 4, size=56)
add("cifras", "La cuenta en cifras", sec(
    eyebrow("Instagram · mayo – octubre 2026")
    + titulo("27 publicaciones en seis meses")
    + kh
    + p("Una media de 4,5 publicaciones al mes: 25 reels, una foto y un carrusel.",
        128, 860, 1664, size=24, d=8, cls="muted")
    + foot(n),
))

# ── 6. Evolución mensual ─────────────────────────────────────────────────
n += 1
maxv = max(m[2] for m in MESES)
bh = ""
base_y, alto = 820, 400
for i, (mes, posts, v, seg, guard, pruebas) in enumerate(MESES):
    x = 160 + i * 270
    h = max(6, round(v / maxv * alto))
    color = ACENTO if mes != "Oct" else "#E86A5C"
    bh += (
        f'<div class="abs gy" style="left:{x}px;top:{base_y - h}px;width:150px;height:{h}px;background:{color};border-radius:12px 12px 0 0;--d:{i}"></div>'
        f'<p class="abs a" style="left:{x - 30}px;top:{base_y - h - 52}px;width:210px;text-align:center;font-size:26px;font-weight:800;--d:{i + 2}">{fmt(v)}</p>'
        f'<p class="abs a disp" style="left:{x}px;top:{base_y + 18}px;width:150px;text-align:center;font-size:26px;--d:{i}">{mes}</p>'
        f'<p class="abs a muted" style="left:{x - 30}px;top:{base_y + 62}px;width:210px;text-align:center;font-size:20px;line-height:1.3;--d:{i}">{posts} posts · {fmt(seg)} seg.</p>'
    )
bh += f'<div class="abs line-h" style="left:128px;top:{base_y}px;width:1620px"></div>'
add("evolucion", "Evolución mensual", sec(
    eyebrow("Evolución mensual · visualizaciones")
    + titulo("Picos y caídas sin un ritmo fijo", size=56)
    + bh
    + p("<b style='color:#F4F4F4'>Octubre:</b> 6 posts y 10.037 visualizaciones, un 92 % menos que agosto con más publicaciones. Ninguna publicación de octubre pasó de 4.200.",
        128, 286, 1100, size=24, d=3)
    + foot(n),
))

# ── 7. Los cuatro pilares ────────────────────────────────────────────────
n += 1
cols = ["Posts", "Visualiz.", "Guardados", "Compartidos", "Comentarios", "Seguidoras"]
xs = [700, 860, 1080, 1270, 1470, 1660]
th = f'<div class="abs line-h" style="left:128px;top:400px;width:1664px"></div>'
for c, x in zip(cols, xs):
    th += f'<p class="abs a muted" style="left:{x}px;top:350px;width:150px;text-align:right;font-size:20px;letter-spacing:.06em;text-transform:uppercase;--d:1">{c}</p>'
tot_cols = [TOT["posts"], TOT["views"], TOT["guard"], TOT["compart"], TOT["coment"], TOT["seg"]]
mejores = [None, 0, 0, 1, 1, 0]  # índice del pilar que gana cada columna
for r, (nom, *vals) in enumerate(PILARES):
    y = 430 + r * 110
    th += f'<p class="abs a" style="left:128px;top:{y}px;width:540px;font-size:30px;font-weight:800;--d:{r + 2}">{nom}</p>'
    for j, (v, x) in enumerate(zip(vals, xs)):
        pct = "" if j == 0 else f'<span style="display:block;font-size:19px;font-weight:500;color:{MUTED}">{round(v / tot_cols[j] * 100)} %</span>'
        col = f"color:{ACENTO};" if mejores[j] == r else ""
        th += f'<p class="abs a" style="left:{x}px;top:{y}px;width:150px;text-align:right;font-size:30px;font-weight:800;line-height:1.1;{col}--d:{r + 2}">{fmt(v)}{pct}</p>'
    th += f'<div class="abs line-h" style="left:128px;top:{y + 90}px;width:1664px;background:#2E3130"></div>'
add("pilares", "Los cuatro pilares", sec(
    eyebrow("Qué publicas")
    + titulo("Tus cuatro tipos de contenido")
    + p("Hemos clasificado las 27 publicaciones por tema. En melocotón, el pilar que gana cada métrica.", 128, 264, 1400, size=25, d=2)
    + th
    + p("El entreno práctico es el 48 % de lo que publicas y se lleva el 83 % de los guardados y la mitad de las seguidoras nuevas.",
        128, 900, 1664, size=25, d=7, cls="", extra="font-weight:700;")
    + foot(n),
))

# ── 8. Mito y dato: el kite ──────────────────────────────────────────────
n += 1
add("kite", "El kite, con datos", sec(
    eyebrow("Mito y dato", k=True)
    + titulo("El kite no es lo que<br>mejor te funciona", size=72, extra="color:#151515;")
    + p("Funciona un vídeo de kite. El resto, mucho menos.", 128, 380, 900, size=34, d=2, cls="", extra="font-weight:800;color:#151515;")
    + lista([
        "De las 359 seguidoras que trajo el kite, <b>331 llegaron con un solo reel</b>: el de iniciación del 27 de mayo con «comenta KITE».",
        "Los otros 5 posts de kite sumaron <b>28 seguidoras</b> entre todos. Los tres de octubre (Dakhla y la foto con Sergi): 13.",
        "El entreno práctico trajo <b>816 seguidoras</b> y <b>2.365 guardados</b>, frente a 165 del kite.",
        "Lo que sí tiene el kite es un suelo estable: su mediana es de 5.053 visualizaciones, frente a 2.631 del entreno. Engancha, pero no capta.",
    ], 128, 470, 1000, size=26, d=3, color="#151515", gap=22, mcolor="#151515")
    + card(1220, 300, 572, 600, d=1, extra=f"background:{INK};border:none;")
    + p("Seguidoras por pilar", 1270, 344, 480, size=20, d=2, cls="", extra=f"color:{ACENTO};font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
    + "".join(
        f'<p class="abs a" style="left:1270px;top:{410 + i * 118}px;width:480px;font-size:22px;color:{SOFT};--d:{i + 2}">{nom}</p>'
        f'<div class="abs gx" style="left:1270px;top:{448 + i * 118}px;width:{round(seg / 816 * 380)}px;height:34px;border-radius:8px;background:{ACENTO if i == 0 else "#5A5D5C"};--d:{i}"></div>'
        f'<p class="abs a" style="left:{1270 + round(seg / 816 * 380) + 16}px;top:{446 + i * 118}px;font-size:26px;font-weight:800;color:{PAPER};--d:{i + 3}">{fmt(seg)}</p>'
        for i, (nom, _, _, _, _, _, seg) in enumerate(PILARES)
    )
    + foot(n, k=True),
    bg=ACENTO, color=INK,
))

# ── 9. Cada pilar hace un trabajo ────────────────────────────────────────
n += 1
trab = [
    ("Entreno práctico", "Guardados", "83 %", "de todos los guardados", "Es lo que tu público quiere tener a mano. Es el contenido que demuestra que sabes y el que mejor se convierte en seguidoras."),
    ("Humor y vida personal", "Compartidos", "66 %", "de todos los compartidos", "Te da viralidad y cercanía: 1.167 compartidos y 373 comentarios con solo 4 posts. Pero pocas seguidoras por visualización (1,9 por cada mil)."),
    ("Kitesurf", "Personalidad", "16 %", "de las visualizaciones", "Te diferencia de cualquier otra entrenadora. Pero su público es otro: deportistas de agua, no mujeres que quieren empezar desde cero."),
    ("Producto Level Up", "Seguidoras por vista", "7,5", "seguidoras por cada mil visualizaciones", "El ratio más alto de todos, pero el menor alcance: se ve poco porque es lo que más suena a anuncio."),
]
tw = ""
for i, (nom, metr, num, sub, txt) in enumerate(trab):
    x = 128 + i * 424
    tw += (
        card(x, 300, 396, 620, d=i)
        + p(nom, x + 36, 340, 330, size=28, d=i + 1, cls="", extra="font-weight:800;line-height:1.2;")
        + p(metr, x + 36, 430, 330, size=20, d=i + 1, cls="rosa", extra="font-weight:700;letter-spacing:.12em;text-transform:uppercase;")
        + f'<p class="abs a disp" style="left:{x + 36}px;top:480px;font-size:64px;--d:{i + 2}">{num}</p>'
        + p(sub, x + 36, 565, 330, size=20, d=i + 2, cls="muted")
        + p(txt, x + 36, 650, 330, size=22, d=i + 3)
    )
add("trabajos", "Cada pilar hace un trabajo", sec(
    eyebrow("La clave")
    + titulo("Cada pilar hace un trabajo", size=56)
    + tw + foot(n),
))

# ── 10. Top 5 ────────────────────────────────────────────────────────────
n += 1
top = [
    ("8 ago", "Rutina de piernas y glúteos en la piscina", "104.923", "511", "1.690 guardados y 402 compartidos. Útil, con un escenario que llama la atención y formato de serie. Termina con «Link en BIO»."),
    ("27 may", "Kitesurf: qué es y cómo empezar, «comenta KITE»", "41.156", "331", "La palabra clave en comentarios disparó la conversación (86 comentarios) y el algoritmo. Es la mecánica que hay que copiar para Level Up."),
    ("1 may", "Salir a correr aunque no te guste", "47.432", "216", "303 comentarios: una pregunta abierta y una confesión con la que tu público se identifica."),
    ("14 ago", "Rutina de brazos, espalda y pecho en la piscina", "11.611", "136", "La continuación de la serie mantuvo un ratio excelente: 11,7 seguidoras por cada mil visualizaciones."),
    ("29 jul", "Movilidad lumbar en cuatro minutos", "9.674", "117", "El mejor ratio del periodo: 12,1 seguidoras y 29 guardados por cada mil visualizaciones. Resuelve un dolor concreto."),
]
tp = ""
tp += (f'<p class="abs a muted" style="left:1360px;top:300px;width:170px;text-align:right;font-size:19px;letter-spacing:.08em;text-transform:uppercase;--d:1">Visualiz.</p>'
       f'<p class="abs a muted" style="left:1600px;top:300px;width:190px;text-align:right;font-size:19px;letter-spacing:.08em;text-transform:uppercase;--d:1">Seguidoras</p>')
for i, (f, t, v, s_, why) in enumerate(top):
    y = 350 + i * 128
    tp += (
        f'<p class="abs a disp outline" style="left:128px;top:{y}px;font-size:44px;line-height:1;--d:{i + 1}">{i + 1}</p>'
        + p(f, 210, y, 140, size=22, d=i + 1, cls="rosa", extra="font-weight:700;")
        + p(t, 360, y - 4, 960, size=27, d=i + 1, cls="", extra="font-weight:800;line-height:1.2;")
        + p(why, 360, y + 38, 960, size=20, d=i + 2, cls="muted", extra="line-height:1.35;")
        + f'<p class="abs a" style="left:1360px;top:{y}px;width:170px;text-align:right;font-size:30px;font-weight:800;--d:{i + 2}">{v}</p>'
        + f'<p class="abs a rosa" style="left:1600px;top:{y}px;width:190px;text-align:right;font-size:30px;font-weight:800;--d:{i + 2}">{s_}</p>'
    )
add("top", "Lo que mejor funcionó", sec(
    eyebrow("Lo que mejor funcionó")
    + titulo("Top 5 por seguidoras nuevas", size=56)
    + tp + foot(n),
))

# ── 11. Lo que no funcionó ───────────────────────────────────────────────
n += 1
lecc = [
    ("El gancho lo cambia todo", "Respiración, mismo tema dos veces: el del 23 sep («Aprovecho mientras salgo de un entreno…») tuvo <b>148</b> visualizaciones. El del 24 sep, que abre con «¿Te quedas sin aire cuando entrenas?», <b>1.563</b>. Diez veces más."),
    ("Repetir no es reciclar", "La movilidad lumbar resubida el 11 ago tuvo <b>548</b> visualizaciones, frente a las 9.674 del original. Se puede reutilizar una idea, pero con otro gancho, otro formato u otro escenario."),
    ("Las «continuaciones» no se entienden solas", "«…y que los entrenos son para mujeres que no han entrenado antes» (6 oct) arranca a mitad de frase: <b>113</b> visualizaciones, la peor del periodo. Cada pieza tiene que funcionar sola."),
    ("Los temas fuera de la promesa no crecen", "Los dos reels de posparto de octubre sumaron <b>1.983</b> visualizaciones y 4 seguidoras. Es un tema valioso, pero no es la promesa de Level Up (empezar desde cero)."),
]
lh = ""
for i, (t, s_) in enumerate(lecc):
    col, fila = i % 2, i // 2
    x = 128 + col * 852
    y = 300 + fila * 320
    lh += (
        card(x, y, 812, 290, d=i)
        + p(t, x + 40, y + 36, 730, size=30, d=i + 1, cls="", extra="font-weight:800;line-height:1.2;")
        + p(s_, x + 40, y + 96, 730, size=22, d=i + 2)
    )
add("aprendizajes", "Lo que no funcionó", sec(
    eyebrow("Lo que no funcionó")
    + titulo("Cuatro aprendizajes", size=56)
    + lh + foot(n),
))

# ── 12. Copies y llamadas a la acción ────────────────────────────────────
n += 1
add("cta", "Copies y llamadas a la acción", sec(
    eyebrow("Copies y llamadas a la acción")
    + titulo("Casi nunca pides el siguiente paso", size=56)
    + kpi(128, 330, 380, "7 / 27", "publicaciones mencionan la bio o la web", 2, size=72, color=ACENTO)
    + kpi(552, 330, 380, "1 / 27", "nombra la prueba de 5 días gratis (27 sep)", 3, size=72, color=ACENTO)
    + kpi(976, 330, 380, "0", "usan una palabra clave en comentarios para Level Up", 4, size=72, color=ACENTO)
    + kpi(1400, 330, 380, "86", "comentarios logró «comenta KITE»: la única vez que se usó", 5, size=72)
    + p("Lo que vemos en los copies", 128, 640, 700, size=22, d=6, cls="rosa", extra="font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
    + lista([
        "«Link en BIO» al final de un texto largo, sin decir qué hay en la bio ni por qué ir.",
        "Los mejores vídeos de entreno (piscina, silla, movilidad) no conectan con el método: «si te gusta esto, en Level Up tienes 28 semanas así».",
        "Hashtags de entrenadora en Barcelona (#entrenadorabarcelona) en un producto online: atraen a quien busca entreno presencial.",
    ], 128, 690, 1664, size=24, d=7, gap=14)
    + foot(n),
))

# ── 13. El perfil ────────────────────────────────────────────────────────
n += 1
bien = [
    "Cuenta verificada, 26,4K seguidoras y 515 publicaciones: autoridad de sobra.",
    "La bio dice lo esencial: graduada en Ciencias del Deporte, especializada en mujeres y «PRUEBA LEVEL UP WORKOUT 🎁».",
    "Portadas con titular grande y legible («3 ejercicios en postparto», «Entrenar conmigo…»). Muy buena práctica.",
    "Tu último reel, «No hay viento… pero hay que practicar», ya mezcla kite y entreno en casa. Ese es el camino.",
]
mejorar = [
    "La bio no dice para quién es Level Up (mujeres que empiezan desde cero) ni qué consiguen.",
    "Tres enlaces («y 2 más»): reparten los clics. Para vender, mejor uno solo y directo a la prueba gratis.",
    "14 destacados, con «Entrena online!» en cuarto lugar, detrás de Lifestyle y Kitesurf, y varios de 2021–2025.",
    "En el nombre visible pone «Entrenadora Personal», sin «online» ni «mujeres», que es lo que se busca en Instagram.",
]
add("perfil", "El perfil", sec(
    eyebrow("El perfil · @lucia_entrenadorapersonal")
    + titulo("Tu escaparate", size=56)
    + p("Funciona", 128, 300, 780, size=22, d=1, cls="rosa", extra="font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
    + lista(bien, 128, 360, 780, size=28, d=2, gap=30, marca="+")
    + p("A mejorar", 1012, 300, 780, size=22, d=2, cls="", extra="color:#E86A5C;font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
    + lista(mejorar, 1012, 360, 780, size=28, d=3, gap=30, marca="−")
    + '<div class="abs line-v" style="left:960px;top:300px;height:600px"></div>'
    + foot(n),
))

# ── 14. La web ───────────────────────────────────────────────────────────
n += 1
add("web", "La web", sec(
    eyebrow("La web")
    + titulo("Donde se decide la venta", size=56)
    + card(128, 290, 812, 620)
    + p("levelup.luciaentrenadorapersonal.com", 168, 326, 740, size=22, d=1, cls="rosa", extra="font-weight:700;")
    + lista([
        "Un titular claro: «¿No sabes por dónde empezar? Yo te enseño».",
        "La prueba de 5 días gratis está arriba, a la vista.",
        "El precio destacado (14,99 €/mes) es el del plan anual. La cuota mensual real, 17,99 €, no aparece en portada.",
        "<b>Ningún testimonio</b>, ni vídeo tuyo explicando el método.",
        "No se nombra a la mujer de 35 a 55 años ni su momento vital: se habla de «mujeres», en general.",
    ], 168, 384, 740, size=23, d=2, gap=14)
    + card(980, 290, 812, 620, d=1)
    + p("luciaentrenadorapersonal.com", 1020, 326, 740, size=22, d=2, cls="rosa", extra="font-weight:700;")
    + lista([
        "<b>10 testimonios</b> reales de alumnas («hay un antes y un después», «por fin tengo una rutina constante»…).",
        "Años de experiencia, posparto, espalda, embarazo: justo los problemas de tu público objetivo.",
        "<b>No enlaza a Level Up en ningún sitio.</b> Quien llega por Google buscando entrenadora en Barcelona no descubre la versión online.",
        "Google ya trajo 2 de las 5 pruebas reales, sin hacer nada. Hay una puerta abierta.",
    ], 1020, 384, 740, size=23, d=3, gap=14)
    + foot(n),
))

# ── 15. Ventas: los 38 pedidos ───────────────────────────────────────────
n += 1
seg = [
    ("A 0,99 € (16 con cupón testing99)", 18, "#5A5D5C", "Conocidas o pruebas internas"),
    ("A 0 €", 7, "#8A8C8B", "Altas de prueba gratis (incluye 1 anual directa y 1 con testing99)"),
    ("A 17,99 €", 13, ACENTO, "Cobros reales de suscripción"),
]
sh = '<div class="abs" style="left:128px;top:330px;width:1664px;height:90px;display:flex;border-radius:16px;overflow:hidden">'
for i, (_, v, c, _) in enumerate(seg):
    sh += f'<div class="gx" style="width:{v / 38 * 100}%;background:{c};display:flex;align-items:center;padding-left:28px;font-size:32px;font-weight:800;color:{INK};--d:{i}">{v}</div>'
sh += "</div>"
for i, (t, v, c, s_) in enumerate(seg):
    x = 128 + i * 560
    sh += (
        f'<div class="abs a" style="left:{x}px;top:460px;width:28px;height:28px;border-radius:6px;background:{c};--d:{i + 2}"></div>'
        + p(t, x + 44, 454, 480, size=24, d=i + 2, cls="", extra="font-weight:800;")
        + p(s_, x + 44, 492, 480, size=21, d=i + 2, cls="muted")
    )
canales = [("Instagram", 11, "118,96 €"), ("Google orgánico", 7, "45,43 €"), ("Directo", 20, "43,68 €")]
for i, (c, v, e) in enumerate(canales):
    x = 128 + i * 560
    sh += kpi(x, 640, 500, f"{v} pedidos", f"{c} · {e} netos", i + 4, size=48, color=ACENTO if i == 0 else None)
add("pedidos", "Los 38 pedidos", sec(
    eyebrow("Ventas · julio – octubre 2026")
    + titulo("38 pedidos, 208 € netos", size=56)
    + p("WooCommerce marca 31 como «recurrentes» y 7 como «nuevos». Separados por importe:", 128, 262, 1400, size=25, d=2)
    + sh
    + p("Instagram trae el 57 % de las ventas netas y 8 de los 13 cobros a 17,99 €. De los 20 pedidos «directos», 17 son de 0,99 €.",
        128, 870, 1664, size=23, d=8, cls="muted")
    + foot(n),
))

# ── 16. Las suscriptoras reales ──────────────────────────────────────────
n += 1
meses_x = {"Jul": 640, "Ago": 860, "Sep": 1080, "Oct": 1300}
filas = [  # etiqueta, canal, eventos [(mes, tipo)], estado
    ("Clienta 1", "Instagram", [("Jul", "pago"), ("Ago", "pago"), ("Sep", "pago"), ("Oct", "pago")], "Activa · paga desde antes de julio"),
    ("Clienta 2", "Instagram", [("Jul", "prueba"), ("Jul", "pago"), ("Ago", "pago"), ("Sep", "pago"), ("Oct", "pago")], "Activa · prueba 7 jul, paga desde 12 jul"),
    ("Prueba", "Instagram", [("Ago", "prueba")], "No continúa · prueba 1 ago"),
    ("Prueba", "Instagram", [("Ago", "prueba")], "No continúa · prueba 7 ago*"),
    ("Clienta 3", "Google", [("Sep", "prueba"), ("Sep", "pago"), ("Oct", "pago")], "Activa · prueba 14 sep, paga desde 19 sep"),
    ("Clienta 4", "Google", [("Sep", "prueba"), ("Oct", "pago")], "Activa · prueba 30 sep, paga desde 5 oct"),
]
fh = ""
for mes, x in meses_x.items():
    fh += f'<p class="abs a disp" style="left:{x - 60}px;top:300px;width:120px;text-align:center;font-size:24px;--d:1">{mes}</p>'
for r, (et, can, evs, est) in enumerate(filas):
    y = 370 + r * 76
    activa = est.startswith("Activa")
    fh += (
        f'<div class="abs line-h" style="left:128px;top:{y + 62}px;width:1664px;background:#2E3130"></div>'
        + p(et, 128, y, 220, size=26, d=r + 2, cls="", extra="font-weight:800;" + ("" if activa else f"color:{MUTED};"))
        + p(can, 340, y + 2, 220, size=22, d=r + 2, cls="muted")
    )
    vistos = {}
    for mes, tipo in evs:
        k = vistos.get(mes, 0)
        vistos[mes] = k + 1
        x = meses_x[mes] - 18 + (k * 44 if len([e for e in evs if e[0] == mes]) > 1 else 0) - (22 if len([e for e in evs if e[0] == mes]) > 1 else 0)
        if tipo == "pago":
            fh += f'<div class="abs pop" style="left:{x}px;top:{y + 4}px;width:36px;height:36px;border-radius:50%;background:{ACENTO};--d:{r}"></div>'
        else:
            fh += f'<div class="abs pop" style="left:{x}px;top:{y + 4}px;width:36px;height:36px;border-radius:50%;border:3px solid {SOFT};--d:{r}"></div>'
    fh += p(est, 1440, y + 2, 352, size=20, d=r + 3, cls="" if activa else "muted", extra="line-height:1.25;" + (f"color:{ACENTO};" if activa else ""))
add("suscriptoras", "Las suscriptoras reales", sec(
    eyebrow("Ventas · clientas reales")
    + titulo("4 suscriptoras de pago activas", size=56)
    + f'<div class="abs a" style="left:1440px;top:304px;width:28px;height:28px;border-radius:50%;border:3px solid {SOFT};--d:2"></div>'
    + p("Prueba gratis", 1480, 300, 220, size=21, d=2, cls="muted")
    + f'<div class="abs a" style="left:1440px;top:250px;width:28px;height:28px;border-radius:50%;background:{ACENTO};--d:2"></div>'
    + p("Cobro de 17,99 €", 1480, 246, 260, size=21, d=2, cls="muted")
    + fh
    + p("≈ 72 €/mes con IVA (59 € netos) de clientas reales. Conversión de prueba a pago: 3 de 5 (60 %). Desde el 30 de septiembre no ha entrado ninguna prueba real (la del 4 oct lleva el cupón testing99).",
        128, 840, 1664, size=23, d=9, cls="", extra="font-weight:700;")
    + p("Reconstruido por fechas: prueba de 0 € y primer cobro 5 días después. *Del 7 ago solo hay un cobro el día 12, que puede ser la renovación de la clienta 2 o esta alta; en ambos casos solo una sigue pagando. Hay que confirmarlo con la exportación de Suscripciones.",
        128, 920, 1664, size=17, d=10, cls="muted", extra="line-height:1.3;")
    + foot(n),
))

# ── 17. Viral ≠ ventas ───────────────────────────────────────────────────
n += 1
add("viral", "Viral no es vender", sec(
    eyebrow("Instagram × ventas", k=True)
    + titulo("Viral no es lo mismo<br>que vender", size=72, extra="color:#151515;")
    + kpi(128, 470, 500, "104.923", "visualizaciones del reel de la piscina (8 ago), el mejor del año", 2, size=72, sub_color="#3A2F2F")
    + kpi(700, 470, 500, "511", "seguidoras nuevas con ese mismo reel", 3, size=72, sub_color="#3A2F2F")
    + kpi(1272, 470, 520, "0", "pruebas gratis en las tres semanas siguientes. Las dos de agosto llegaron antes (1 y 7 ago)", 4, size=72, sub_color="#3A2F2F")
    + p("Lo mismo con el reel del diferencial de Level Up (27 sep): 96 seguidoras y ninguna prueba desde Instagram después. "
        "La gente te sigue, pero nadie le explica el siguiente paso: no hay oferta en el vídeo, ni palabra clave, ni historias que lleven a la web, ni un destacado de «empieza aquí».",
        128, 790, 1664, size=27, d=6, cls="", extra="color:#151515;font-weight:600;")
    + foot(n, k=True),
    bg=ACENTO, color=INK,
))

# ── 18. El embudo ────────────────────────────────────────────────────────
n += 1
emb = [
    ("377.030", "visualizaciones", "may–oct", 1664),
    ("1.637", "seguidoras nuevas", "may–oct", 1240),
    ("?", "visitas al perfil y clics en el enlace", "sin datos todavía", 860),
    ("5", "pruebas gratis reales", "jul–oct · 3 IG + 2 Google", 520),
    ("4", "suscriptoras activas", "≈ 72 €/mes", 300),
]
eh = ""
for i, (v, t, s_, w) in enumerate(emb):
    y = 290 + i * 128
    w = round(w * 0.76)
    x = 128 + (1270 - w) // 2
    roto = v == "?"
    estilo = (f"border:3px dashed {ACENTO};background:transparent;" if roto else f"background:{ACENTO if i < 2 else '#E9B07E' if i == 3 else '#D49A69'};")
    eh += (
        f'<div class="abs gx" style="left:{x}px;top:{y}px;width:{w}px;height:108px;border-radius:16px;{estilo}--d:{i}"></div>'
        f'<p class="abs a disp" style="left:{x}px;top:{y + 26}px;width:{w}px;text-align:center;font-size:48px;color:{ACENTO if roto else INK};--d:{i + 1}">{v}</p>'
    )
    eh += p(f"<b style='color:#F4F4F4'>{t}</b><br>{s_}", 1460, y + 22, 332, size=22, d=i + 2, cls="muted", extra="line-height:1.3;")
add("embudo", "El embudo", sec(
    eyebrow("El embudo")
    + titulo("Dónde se pierde la gente", size=56)
    + eh
    + p("El escalón que falta medir es justo el que más falla: de seguidora a visita a la web.", 128, 930, 1300, size=22, d=7, cls="muted")
    + foot(n),
))

# ── 19. Diagnóstico ──────────────────────────────────────────────────────
n += 1
diag = [
    ("Sin puente", "El contenido que atrae no lleva a Level Up, y el que habla de Level Up casi no se ve."),
    ("Sin ritmo", "De 2 a 6 publicaciones al mes, con huecos de hasta 3 semanas y sin una línea fija. Octubre, el peor mes."),
    ("Sin oferta visible", "La prueba gratis solo aparece en 1 de 27 copies. No hay palabra clave, ni historias, ni destacado de venta."),
    ("Sin prueba social", "Tienes 10 testimonios en tu otra web y ninguno en Level Up ni en el perfil."),
    ("Sin medición", "Faltan visitas al perfil, clics en el enlace y datos de la web para saber qué contenido vende."),
]
dh = ""
for i, (t, s_) in enumerate(diag):
    y = 300 + i * 124
    dh += (
        f'<p class="abs a disp outline" style="left:128px;top:{y}px;font-size:52px;line-height:1;--d:{i + 1}">{i + 1:02d}</p>'
        + p(t, 280, y + 4, 520, size=34, d=i + 1, cls="", extra="font-weight:800;")
        + p(s_, 820, y + 6, 970, size=25, d=i + 2)
        + f'<div class="abs line-h" style="left:128px;top:{y + 96}px;width:1664px;background:#2E3130"></div>'
    )
add("diagnostico", "Diagnóstico", sec(
    eyebrow("Diagnóstico")
    + titulo("Cinco cosas que frenan las altas", size=56)
    + dh + foot(n),
))

# ── 20. Qué proponemos: el mix ───────────────────────────────────────────
n += 1
mix = [
    ("40 %", "Entreno que empieza desde cero", "Rutinas cortas en casa, con silla o sin material, para quien no ha entrenado nunca. La serie de la piscina, adaptada a cada temporada. Motor de guardados y seguidoras."),
    ("20 %", "Salud de la mujer de 35 a 55", "Fuerza para los huesos, espalda, suelo pélvico, cambios hormonales. Tu formación como argumento. Atrae al público exacto de Level Up."),
    ("20 %", "Método y alumnas", "Qué hay en cada nivel, una semana dentro de Level Up, testimonios, preguntas frecuentes. El contenido que convierte, con oferta y palabra clave."),
    ("20 %", "Lucía de verdad", "Kite, maternidad, humor. Siempre con un puente: «entreno fuerza para seguir haciendo kite», «no hay viento, pero hay que practicar»."),
]
mh = ""
for i, (pct, t, s_) in enumerate(mix):
    x = 128 + i * 424
    mh += (
        card(x, 300, 396, 620, d=i, cls="pm-card-r" if i == 2 else "pm-card")
        + f'<p class="abs a disp" style="left:{x + 36}px;top:340px;font-size:72px;{"color:" + INK + ";" if i == 2 else "color:" + ACENTO + ";"}--d:{i + 1}">{pct}</p>'
        + p(t, x + 36, 450, 330, size=29, d=i + 1, cls="", extra="font-weight:800;line-height:1.2;" + (f"color:{INK};" if i == 2 else ""))
        + p(s_, x + 36, 580, 330, size=22, d=i + 2, cls="" if i == 2 else "soft", extra=f"color:#3A2F2F;" if i == 2 else "")
    )
add("mix", "El nuevo mix", sec(
    eyebrow("Primeras líneas de la estrategia")
    + titulo("El nuevo mix de contenido", size=56)
    + mh + foot(n),
))

# ── 21. El puente con el kite ────────────────────────────────────────────
n += 1
ideas = [
    ("«Lo que entreno para aguantar una sesión de kite a los 40»", "Fuerza de core, agarre y piernas, con ejercicios que están en Level Up."),
    ("«No hay viento… pero hay que practicar»", "Tu último reel. Convertirlo en serie fija: cada día sin viento, un entreno en casa."),
    ("«Nunca es tarde para empezar algo»", "Tu historia con el kite como ejemplo de lo que vende Level Up: empezar desde cero, a cualquier edad."),
    ("Movilidad después del agua", "El reel de movilidad lumbar ya mencionaba el kite y fue el de mejor ratio. Formato a repetir."),
]
ih = ""
for i, (t, s_) in enumerate(ideas):
    y = 330 + i * 140
    ih += (
        f'<div class="abs a" style="left:128px;top:{y + 8}px;width:16px;height:16px;border-radius:50%;background:{ACENTO};--d:{i + 2}"></div>'
        + p(t, 176, y - 6, 1050, size=31, d=i + 2, cls="", extra="font-weight:800;line-height:1.2;")
        + p(s_, 176, y + 46, 1050, size=23, d=i + 3)
    )
add("puente", "El kite como puente", sec(
    eyebrow("Tu duda, resuelta")
    + titulo("El kite no se quita: se usa de puente", size=56)
    + ih
    + card(1330, 330, 462, 540, d=2, cls="pm-card-r")
    + p("La regla", 1370, 370, 390, size=20, d=3, cls="", extra=f"color:{NAVY};font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
    + p("Cada vídeo de kite o de vida personal tiene que dejar a la mujer de 45 años pensando «yo también puedo empezar».",
        1370, 420, 390, size=30, d=4, cls="", extra=f"color:{INK};font-weight:800;line-height:1.25;")
    + p("Si solo dice «qué bien se lo pasa Lucía», es entretenimiento, no captación.", 1370, 700, 390, size=22, d=5, cls="", extra="color:#3A2F2F;")
    + foot(n),
))

# ── 22. Acciones rápidas ─────────────────────────────────────────────────
n += 1
acc = [
    ("Bio", [
        "Nombre: «Lucía | Entreno online para mujeres».",
        "Primera línea con la promesa: empezar desde cero, en casa, 15–30 min.",
        "Un solo enlace, directo a la prueba gratis y con seguimiento por campaña.",
    ]),
    ("Destacados y fijados", [
        "De 14 a 5 destacados: Empieza aquí, Opiniones, Entrenos, Sobre mí, Kite.",
        "Fijados: el método, un testimonio y «sobre mí».",
    ]),
    ("Captación", [
        "Palabra clave en comentarios (p. ej. «NIVEL 0») con mensaje automático y enlace a la prueba.",
        "Historias con enlace a la web 2–3 veces por semana.",
        "Cerrar cada reel de entreno con el puente a Level Up.",
    ]),
    ("Web", [
        "Testimonios y un vídeo tuyo en la landing de Level Up.",
        "Banner de Level Up en luciaentrenadorapersonal.com.",
        "Mostrar los 17,99 €/mes y «cancela cuando quieras».",
    ]),
]
ah = ""
for i, (t, items) in enumerate(acc):
    col, fila = i % 2, i // 2
    x = 128 + col * 852
    y = 290 + fila * 330
    ah += (
        card(x, y, 812, 300, d=i)
        + p(t, x + 40, y + 32, 730, size=22, d=i + 1, cls="rosa", extra="font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
        + lista(items, x + 40, y + 84, 730, size=24, d=i + 2, gap=12)
    )
add("acciones", "Acciones rápidas", sec(
    eyebrow("Primeros 15 días")
    + titulo("Arreglos rápidos, sin grabar nada", size=56)
    + ah + foot(n),
))

# ── 23. Objetivos ────────────────────────────────────────────────────────
n += 1
obj = [
    ("Publicaciones al mes", "4,5", "12", "3 reels por semana + historias a diario"),
    ("Pruebas gratis reales al mes", "1,25", "10", "en enero de 2027"),
    ("Conversión de prueba a pago", "60 %", "≥ 50 %", "mantenerla con más volumen"),
    ("Suscriptoras activas", "4", "20", "a 31 de enero de 2027"),
    ("Clics en el enlace de la bio", "—", "medir", "línea base en noviembre"),
]
oh = (f'<p class="abs a muted" style="left:900px;top:300px;width:220px;text-align:right;font-size:20px;letter-spacing:.08em;text-transform:uppercase;--d:1">Hoy</p>'
      f'<p class="abs a rosa" style="left:1160px;top:300px;width:220px;text-align:right;font-size:20px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;--d:1">Objetivo</p>')
for i, (t, hoy, meta, nota) in enumerate(obj):
    y = 360 + i * 108
    oh += (
        p(t, 128, y, 760, size=30, d=i + 2, cls="", extra="font-weight:800;")
        + f'<p class="abs a" style="left:900px;top:{y - 4}px;width:220px;text-align:right;font-size:38px;font-weight:800;color:{MUTED};--d:{i + 2}">{hoy}</p>'
        + f'<p class="abs a disp rosa" style="left:1160px;top:{y - 2}px;width:220px;text-align:right;font-size:38px;--d:{i + 3}">{meta}</p>'
        + p(nota, 1440, y + 4, 352, size=21, d=i + 3, cls="muted", extra="line-height:1.3;")
        + f'<div class="abs line-h" style="left:128px;top:{y + 78}px;width:1664px;background:#2E3130"></div>'
    )
add("objetivos", "Objetivos", sec(
    eyebrow("Propuesta para validar juntos")
    + titulo("Qué vamos a medir", size=56)
    + oh
    + p("Con 20 suscriptoras al mes, Level Up ingresaría unos 360 € al mes con IVA, cinco veces lo de hoy.",
        128, 920, 1664, size=23, d=8, cls="", extra="font-weight:700;")
    + foot(n),
))

# ── 24. Datos que necesitamos ────────────────────────────────────────────
n += 1
datos = [
    ("WooCommerce › Suscripciones", "Activas, bajas, cancelaciones y fechas de cada una. Para confirmar las 4 activas y el 60 % de conversión."),
    ("Instagram › Estadísticas de la cuenta", "Visitas al perfil, clics en el enlace, edad y sexo de la audiencia y ciudades. ¿De verdad hablas con mujeres de 35 a 55?"),
    ("Historias", "Alcance y toques en enlace de los últimos 30 días."),
    ("Analítica de la web", "Visitas a Level Up por origen y cuántas acaban en prueba (Google Analytics o el panel de WordPress)."),
    ("Dos publicaciones a revisar", "El lanzamiento (11 may) y el circuito con silla (29 ago) tienen más alcance que visualizaciones (33.102 frente a 6.662 y 18.026 frente a 7.350). ¿Se promocionaron?"),
]
dth = ""
for i, (t, s_) in enumerate(datos):
    y = 300 + i * 120
    dth += (
        p(t, 128, y, 640, size=28, d=i + 2, cls="", extra="font-weight:800;line-height:1.2;")
        + p(s_, 800, y + 2, 990, size=23, d=i + 3)
        + f'<div class="abs line-h" style="left:128px;top:{y + 96}px;width:1664px;background:#2E3130"></div>'
    )
add("datos", "Datos que necesitamos", sec(
    eyebrow("Para afinar")
    + titulo("Lo que nos falta", size=56)
    + dth + foot(n),
))

# ── 25. Próximos pasos ───────────────────────────────────────────────────
n += 1
pasos = [
    ("Viernes 6 nov", "Reunión de arranque", "Repasamos esta auditoría y cerramos objetivos."),
    ("Semana 1", "Escaparate", "Bio, enlace, destacados, fijados y textos de la landing."),
    ("Semana 2", "Estrategia y calendario", "Pilares, formatos, tono, frecuencia y el calendario de noviembre con ideas concretas para grabar."),
    ("Fin de mes", "Revisión", "Qué ha funcionado, pruebas y altas del mes, y ajustes para diciembre."),
]
ph = f'<div class="abs line-h gx" style="left:128px;top:540px;width:1664px;background:{ACENTO};--d:0"></div>'
for i, (cuando, t, s_) in enumerate(pasos):
    x = 128 + i * 424
    ph += (
        f'<div class="abs pop" style="left:{x}px;top:524px;width:34px;height:34px;border-radius:50%;background:{ACENTO};--d:{i}"></div>'
        + p(cuando, x, 460, 380, size=24, d=i + 1, cls="rosa", extra="font-weight:700;letter-spacing:.1em;text-transform:uppercase;")
        + p(t, x, 610, 380, size=38, d=i + 2, cls="", extra="font-weight:800;line-height:1.15;")
        + p(s_, x, 720, 380, size=26, d=i + 3)
    )
add("pasos", "Próximos pasos", sec(
    eyebrow("Próximos pasos")
    + titulo("Noviembre, paso a paso", size=56)
    + ph + foot(n),
))

# ── 26. Cierre ───────────────────────────────────────────────────────────
n += 1
add("cierre", "Gracias", sec(
    '<div class="abs deco f" style="left:1260px;top:-160px;width:900px;height:1400px;'
    f'background:{ACENTO};transform:rotate(14deg);border-radius:60px;--d:0"></div>'
    + eyebrow("Contacto")
    + titulo("Vamos a<br>subir de nivel", top=290, size=104, width=1200)
    + '<div class="abs a" style="left:128px;top:720px;font-size:28px;line-height:1.5;--d:3">'
    '<p style="font-weight:800">Jandro Martín · Maen Studios</p>'
    '<p><a href="mailto:jandro@maenstudios.com" style="color:inherit">jandro@maenstudios.com</a> · +34 688 629 688</p>'
    "</div>"
    + foot(n),
))

out = Path("app/pitch/level-up-workout/diapos.ts")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(
    "/**\n * Auditoría de Instagram, web y ventas de Level Up Workout (nov 2026).\n"
    " * Generado con scripts/build-level-up-workout.py: si cambia el contenido\n"
    " * o las cifras, se edita el script y se vuelve a ejecutar.\n */\n\n"
    'import type { DiapoHtml } from "../maen-plan-100k/diapos";\n\n'
    "export const DIAPOS: DiapoHtml[] = "
    + json.dumps(slides, ensure_ascii=False, indent=2)
    + ";\n",
    encoding="utf-8",
)
print(len(slides), "diapositivas")
