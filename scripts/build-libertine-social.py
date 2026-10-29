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
    "preaviso": "2 meses",
    "hora_extra": "100 €/h + IVA",
    "rodajes": 1,
    "salidas": 4,
    "ig_mes": 12,
    "tt_mes": 16,
    "gifting": 8,
    "colabs": 2,
    "ads": 8,
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
    "Vuestro equipo social y creativo: el que piensa Libertine con vosotros y lleva las ideas hasta el final.</p>"
    '<p class="abs a muted" style="left:128px;top:960px;font-size:22px;letter-spacing:0.18em;'
    'text-transform:uppercase;--d:4">Para Sofía · Libertine Blends</p>'
))

# ── 2. Lo que nos pides ───────────────────────────────────────────────────
n += 1
pide = [
    ("Ideas que vengan de nuestro lado", "Sin que tengáis que hacer el brief, buscar referencias ni coordinar la ejecución."),
    ("Un lenguaje propio en TikTok", "No una copia de Instagram."),
    ("Formatos que sean de Libertine", "Empezando por repensar Can to Table."),
    ("Una red de gente interesante", "En food, música, diseño, moda, hospitality y cultura."),
]
ph = ""
for i, (t, s) in enumerate(pide):
    y = 430 + i * 118
    ph += (
        f'<div class="abs line-h gx" style="left:128px;top:{y}px;width:1100px;background:#3A2F2F;--d:{i}"></div>'
        f'<p class="abs a" style="left:128px;top:{y + 22}px;font-size:34px;font-weight:800;--d:{i + 2}">{t}</p>'
        f'<p class="abs a" style="left:128px;top:{y + 70}px;width:1100px;font-size:24px;color:#3A2F2F;--d:{i + 2}">{s}</p>'
    )
add("encargo", "Lo que nos pides", sec(
    eyebrow("Lo que nos pides", k=True)
    + titulo("Más ideas,<br>no más posts", size=88, extra="color:#151515;")
    + ph
    + '<p class="abs a" style="left:1340px;top:430px;width:452px;font-size:30px;line-height:1.4;'
    'font-weight:700;--d:6">«No busco maximizar el número de posts. Busco que Libertine tenga más ideas, '
    "más personalidad y más cosas interesantes pasando alrededor de la marca.»</p>"
    + '<p class="abs a" style="left:1340px;top:780px;font-size:22px;letter-spacing:0.14em;'
    'text-transform:uppercase;color:#3A2F2F;--d:7">— Sofía, Libertine Blends</p>'
    + foot(n, k=True),
    bg=ROSA, color=INK,
))

# ── 3. El reparto ─────────────────────────────────────────────────────────
n += 1
lado = [
    ("Libertine", "pone el contexto", [
        "Prioridades del trimestre",
        "Lanzamientos, retailers y eventos",
        "Lo que no se puede tocar de la marca",
        "Aprobación de ideas, no de piezas sueltas",
    ], False),
    ("Maen", "trae las ideas y las hace realidad", [
        "Ideas, conceptos y formatos",
        "Brief, referencias y producción",
        "Copy, edición, publicación y comunidad",
        "Creators, proveedores y No Idea",
    ], True),
]
lh = ""
for i, (quien, verbo, items, r) in enumerate(lado):
    x = 128 + i * 848
    lh += (
        f'<div class="abs {"pm-card-r" if r else "pm-card"} pop" style="left:{x}px;top:390px;width:816px;height:530px;--d:{i * 2}"></div>'
        f'<p class="abs a disp" style="left:{x + 56}px;top:430px;font-size:56px;{"color:#151515;" if r else ""}--d:{i + 1}">{quien}</p>'
        f'<p class="abs a" style="left:{x + 56}px;top:505px;font-size:30px;font-weight:700;{"color:#151515;" if r else "color:#F9CDCD;"}--d:{i + 1}">{verbo}</p>'
    )
    for j, t in enumerate(items):
        lh += (
            f'<p class="abs a" style="left:{x + 56}px;top:{590 + j * 70}px;width:700px;font-size:28px;'
            f'{"color:#151515;" if r else "color:#C9C9C9;"}--d:{i + j + 2}">— {t}</p>'
        )
add("reparto", "Cómo lo vemos", sec(
    eyebrow("Cómo lo vemos")
    + titulo("Vosotros el contexto,<br>nosotros el resto", size=64)
    + lh + foot(n),
))

# ── 4. Instagram y TikTok ────────────────────────────────────────────────
n += 1
canal = [
    ("Instagram", "El escaparate de la marca", [
        "Cuidado, producido y reconocible de un vistazo",
        "Producto, Barcelona y la gente de Libertine",
        "Formatos propios en serie, no piezas sueltas",
        "Stories para el día a día y los momentos de marca",
    ]),
    ("TikTok", "Un lenguaje propio", [
        "Nativo: se graba para TikTok, no se recorta de Instagram",
        "Humor seco: serious cocktails for unserious moments",
        "Series y personajes que vuelven cada semana",
        "Rápido de producir para poder seguir lo que pasa",
    ]),
]
ch = ""
for i, (t, s, items) in enumerate(canal):
    x = 128 + i * 848
    ch += (
        f'<p class="abs a disp" style="left:{x}px;top:380px;font-size:56px;--d:{i + 1}">{t}</p>'
        f'<p class="abs a rosa" style="left:{x}px;top:456px;font-size:30px;font-weight:700;--d:{i + 1}">{s}</p>'
        f'<div class="abs line-h gx" style="left:{x}px;top:520px;width:780px;--d:{i}"></div>'
        + lista(items, x, 556, 780, size=26, gap=70, d=2 + i)
    )
add("canales", "Creative + social", sec(
    eyebrow("01 · Creative + social")
    + titulo("Dos canales,<br>dos lenguajes", size=64)
    + ch + foot(n),
))

# ── 5. Can to Table ──────────────────────────────────────────────────────
n += 1
add("can-to-table", "Can to Table", sec(
    foto("bar-libertine-ambiente.jpg", "Gente en el bar Libertine de Casa Bonay", 1040, 120, 752, 470, rot=2, d=1)
    + foto("bar-libertine-barra.jpg", "Bartender sirviendo cócteles en la barra", 1100, 560, 520, 330, rot=-3, d=3)
    + eyebrow("02 · Formatos propios")
    + '<p class="abs a" style="left:128px;top:186px;--d:1"><span class="pill pill-o">Repensado</span></p>'
    + titulo("Can to<br>Table", top=270, width=860, size=96, d=1)
    + '<p class="abs a soft" style="left:128px;top:500px;width:820px;font-size:30px;line-height:1.4;--d:2">'
    "Barcelona contada por la gente que la hace: restauradores, chefs, DJs, artistas y diseñadores. "
    "La comida y la bebida son el hilo; la persona, la historia.</p>"
    + lista([
        "Un episodio al mes, rodado en la producción mensual",
        "Pieza larga para Instagram y cortes para TikTok",
        "Cada invitado entra en la red de Libertine",
    ], 128, 720, 860, size=26, gap=58, d=4)
    + foot(n, width=860),
))

# ── 6. Más formatos ──────────────────────────────────────────────────────
n += 1
fmts = [
    ("La nevera de…", "Qué tiene en la nevera alguien interesante de Barcelona. Una Libertine siempre está.", "gota"),
    ("Easy peasy", "El cóctel imposible frente a abrir la lata. Serie de humor nativa de TikTok.", "focacha"),
    ("Antes de salir", "El momento previo: la cena, el bolo, la inauguración. Libertine como ritual del pre.", "mimosas"),
]
fh = ""
for i, (t, s, r) in enumerate(fmts):
    x = 128 + i * 568
    fh += (
        f'<div class="abs pm-card pop" style="left:{x}px;top:380px;width:528px;height:420px;--d:{i}"></div>'
        f'<p class="abs a disp outline" style="left:{x + 40}px;top:416px;font-size:72px;--d:{i + 1}">{i + 1:02d}</p>'
        f'<p class="abs a disp" style="left:{x + 40}px;top:530px;width:450px;font-size:38px;line-height:1.1;--d:{i + 2}">{t}</p>'
        f'<p class="abs a soft" style="left:{x + 40}px;top:600px;width:450px;font-size:25px;line-height:1.4;--d:{i + 3}">{s}</p>'
    )
add("formatos", "Formatos propios", sec(
    eyebrow("02 · Formatos propios")
    + titulo("Y a partir de ahí,<br>más formatos nuestros", size=64)
    + fh
    + '<p class="abs a muted" style="left:128px;top:870px;width:1660px;font-size:24px;--d:6">'
    "Primeras ideas para abrir conversación. En el arranque elegimos con vosotros cuáles se quedan.</p>"
    + foot(n),
))

# ── 7. Cadencia ──────────────────────────────────────────────────────────
n += 1
C = CIFRAS
nums = [
    (str(C["rodajes"]), "producción al mes", "Media jornada: Can to Table, producto y piezas cuidadas"),
    (str(C["salidas"]), "salidas social-first", "Una por semana, ligeras, para lo rápido y espontáneo"),
    (str(C["ig_mes"]), "piezas en Instagram", "Reels y carruseles al mes, más stories"),
    (str(C["tt_mes"]), "vídeos en TikTok", "Al mes, nativos del canal"),
]
nh = ""
for i, (num, t, s) in enumerate(nums):
    x = 128 + i * 424
    nh += (
        f'<p class="abs pop disp outline" style="left:{x - 6}px;top:380px;font-size:180px;line-height:1;--d:{i}">{num}</p>'
        f'<p class="abs a" style="left:{x}px;top:600px;width:380px;font-size:30px;font-weight:800;--d:{i + 2}">{t}</p>'
        f'<p class="abs a muted" style="left:{x}px;top:650px;width:370px;font-size:24px;line-height:1.4;--d:{i + 2}">{s}</p>'
    )
add("cadencia", "Cadencia", sec(
    eyebrow("Cadencia mensual")
    + titulo("Producido y espontáneo,<br>cada mes", size=64)
    + nh
    + '<p class="abs a soft" style="left:128px;top:820px;width:1660px;font-size:26px;line-height:1.4;--d:7">'
    "Los números son un punto de partida, no el objetivo: si un mes pide menos piezas y una idea más grande, se cambia.</p>"
    + foot(n),
))

# ── 8. Creators ──────────────────────────────────────────────────────────
n += 1
circ = ["Food", "Música", "Diseño", "Moda", "Hospitality", "Cultura"]
cc = ""
for i, t in enumerate(circ):
    x = 1080 + (i % 2) * 360
    y = 330 + (i // 2) * 170
    cc += (
        f'<div class="abs pm-card pop" style="left:{x}px;top:{y}px;width:330px;height:140px;--d:{i}"></div>'
        f'<p class="abs a disp-r" style="left:{x + 32}px;top:{y + 52}px;font-size:26px;--d:{i + 1}">{t}</p>'
    )
add("creators", "Creators + comunidad", sec(
    eyebrow("03 · Creators + comunidad")
    + titulo("Una red alrededor<br>de Libertine", width=900, size=64)
    + '<p class="abs a soft" style="left:128px;top:360px;width:840px;font-size:28px;line-height:1.4;--d:2">'
    "No campañas sueltas con influencers: gente interesante que vuelve a aparecer porque le gusta la marca.</p>"
    + lista([
        "Mapa de creators y perfiles por territorio",
        "Outreach y gifting: hasta " + str(C["gifting"]) + " envíos al mes",
        "Hasta " + str(C["colabs"]) + " colaboraciones activas al mes",
        "Seguimiento, permisos de uso y reporte",
    ], 128, 520, 840, size=27, gap=66, d=3)
    + cc + foot(n),
))

# ── 9. Brand moments + paid ──────────────────────────────────────────────
n += 1
add("momentos", "Brand moments + paid", sec(
    eyebrow("04 · Brand moments + paid")
    + '<div class="abs pm-card pop" style="left:128px;top:380px;width:816px;height:520px;--d:0"></div>'
    '<div class="abs pm-card pop" style="left:976px;top:380px;width:816px;height:520px;--d:2"></div>'
    + titulo("Que pase algo,<br>no solo un post", size=64)
    + '<p class="abs a disp-r rosa" style="left:184px;top:430px;font-size:34px;--d:2">Brand moments</p>'
    '<p class="abs a soft" style="left:184px;top:490px;width:700px;font-size:26px;line-height:1.4;--d:3">'
    "Lanzamiento, nuevo retailer, colaboración o evento: lo convertimos en algo que merezca la pena contar.</p>"
    + lista([
        "Concepto y plan de comunicación, incluidos",
        "Producción y activación, presupuesto aparte",
    ], 184, 680, 720, size=25, gap=62, d=4)
    + '<p class="abs a disp-r rosa" style="left:1032px;top:430px;font-size:34px;--d:3">Paid con No Idea</p>'
    '<p class="abs a soft" style="left:1032px;top:490px;width:700px;font-size:26px;line-height:1.4;--d:4">'
    "No Idea sigue llevando paid y growth en UK. Nosotros les damos la creatividad.</p>"
    + lista([
        "Nuevos conceptos y hooks cada mes",
        f"Hasta {C['ads']} variaciones de ads y UGC al mes",
        "Iteración con sus datos de rendimiento",
    ], 1032, 640, 720, size=25, gap=62, d=5)
    + foot(n),
))

# ── 10. Forma de trabajar ────────────────────────────────────────────────
n += 1
ritmo = [
    ("Cada trimestre", "Sesión de ideas: prioridades vuestras, propuestas nuestras."),
    ("Cada mes", "Una reunión de una hora y el calendario entero para aprobar de una vez."),
    ("Cada semana", "Un canal directo para lo que pasa y lo urgente."),
]
rh = ""
for i, (t, s) in enumerate(ritmo):
    y = 360 + i * 150
    rh += (
        f'<div class="abs line-h gx" style="left:128px;top:{y}px;width:860px;--d:{i}"></div>'
        f'<p class="abs a rosa" style="left:128px;top:{y + 26}px;font-size:30px;font-weight:800;--d:{i + 2}">{t}</p>'
        f'<p class="abs a soft" style="left:128px;top:{y + 74}px;width:860px;font-size:25px;--d:{i + 2}">{s}</p>'
    )
add("forma", "Forma de trabajar", sec(
    eyebrow("Forma de trabajar")
    + titulo("Menos gestión<br>para vosotros", size=64)
    + rh
    + '<p class="abs a pm-eyebrow" style="left:1080px;top:360px;--d:3">Lo que dejáis de hacer</p>'
    + lista([
        "Briefs pieza a pieza",
        "Buscar referencias",
        "Corregir copy",
        "Perseguir a creators",
        "Coordinar proveedores",
    ], 1080, 420, 712, size=30, gap=78, d=4, color="", bullet="✕")
    + foot(n),
))

# ── 11. Equipo ───────────────────────────────────────────────────────────
n += 1
eq = [
    ("Dirección creativa", "Ideas, conceptos y formatos. La que piensa Libertine con vosotros."),
    ("Brand manager", "Vuestro punto de contacto. Calendario, copy y coordinación con No Idea."),
    ("Filmmakers y editores", "Producción mensual, salidas social-first y edición para cada canal."),
    ("Community manager", "Publicación, comunidad y seguimiento del día a día."),
    ("Creators & partnerships", "Scouting, outreach, gifting y colaboraciones."),
]
eh = ""
for i, (t, s) in enumerate(eq):
    x = 128 + (i % 3) * 568
    y = 360 + (i // 3) * 270
    eh += (
        f'<div class="abs pm-card pop" style="left:{x}px;top:{y}px;width:528px;height:240px;--d:{i}"></div>'
        f'<p class="abs a" style="left:{x + 40}px;top:{y + 36}px;font-size:30px;font-weight:800;--d:{i + 1}">{t}</p>'
        f'<p class="abs a muted" style="left:{x + 40}px;top:{y + 92}px;width:450px;font-size:23px;line-height:1.4;--d:{i + 1}">{s}</p>'
    )
add("equipo", "Equipo", sec(
    eyebrow("Equipo")
    + titulo("Quién lleva Libertine", size=64)
    + eh
    + '<p class="abs a soft" style="left:1264px;top:670px;width:528px;font-size:24px;line-height:1.4;--d:6">'
    "Equipo propio en Barcelona, sin intermediarios: quien propone la idea es quien la rueda.</p>"
    + foot(n),
))

# ── 12. 90 días ──────────────────────────────────────────────────────────
n += 1
fases = [
    ("Mes 1", "Inmersión", ["Marca, producto y lo que ya funciona", "Territorio y tono de TikTok", "Piloto de Can to Table", "Primer mapa de creators"]),
    ("Mes 2", "Lanzamiento", ["Formatos propios en marcha", "Primeros envíos y colaboraciones", "Primera tanda de creatividad para No Idea"]),
    ("Mes 3", "Ajuste", ["Revisión de lo que funciona", "Se queda lo que funciona y se cambia el resto", "Plan del siguiente trimestre"]),
]
fh = ""
for i, (m, t, items) in enumerate(fases):
    x = 128 + i * 568
    fh += (
        f'<div class="abs {"pm-card-r" if i == 0 else "pm-card"} pop" style="left:{x}px;top:340px;width:528px;height:560px;--d:{i}"></div>'
        f'<p class="abs a" style="left:{x + 40}px;top:380px;font-size:22px;font-weight:700;letter-spacing:0.2em;'
        f'text-transform:uppercase;{"color:#151515;" if i == 0 else "color:#F9CDCD;"}--d:{i + 1}">{m}</p>'
        f'<p class="abs a disp" style="left:{x + 40}px;top:430px;font-size:46px;{"color:#151515;" if i == 0 else ""}--d:{i + 1}">{t}</p>'
    )
    for j, it in enumerate(items):
        fh += (
            f'<p class="abs a" style="left:{x + 40}px;top:{530 + j * 80}px;width:450px;font-size:25px;line-height:1.35;'
            f'{"color:#151515;" if i == 0 else "color:#C9C9C9;"}--d:{i + j + 2}">— {it}</p>'
        )
add("arranque", "Primeros 90 días", sec(
    eyebrow("Arranque")
    + titulo("Los primeros 90 días", size=64)
    + fh + foot(n),
))

# ── 13. Qué entra ────────────────────────────────────────────────────────
n += 1
add("alcance", "Qué entra y qué no", sec(
    eyebrow("Alcance")
    + titulo("Qué entra en el retainer", size=64)
    + '<p class="abs a pm-eyebrow" style="left:128px;top:330px;--d:2">Incluido</p>'
    + lista([
        "Estrategia, ideas y formatos propios",
        "Calendario, copy y diseño de Instagram y TikTok",
        "Producción mensual y salidas social-first",
        "Edición, publicación y community management",
        "Creators: scouting, outreach, gifting y seguimiento",
        "Creatividad para paid con No Idea",
        "Concepto de los brand moments",
        "Reporte mensual con aprendizajes",
    ], 128, 390, 920, size=26, gap=58, d=3)
    + '<p class="abs a pm-eyebrow" style="left:1160px;top:330px;--d:3">Fuera, se presupuesta aparte</p>'
    + lista([
        "Gestión y presupuesto de paid (No Idea)",
        "Producto y envíos de gifting",
        "Fees de creators y talento",
        "Producciones y activaciones fuera del día a día",
        "Localizaciones, atrezo o licencias con coste",
    ], 1160, 390, 640, size=26, gap=58, d=4, color="muted", bullet="·")
    + foot(n),
))

# ── 14. Inversión ────────────────────────────────────────────────────────
n += 1
cond = [
    ("Permanencia", f"{C['permanencia']}, con prórroga automática"),
    ("Preaviso", C["preaviso"]),
    ("Producción extra", C["hora_extra"]),
    ("Facturación", "El día 1 de cada mes"),
]
kh = ""
for i, (t, s) in enumerate(cond):
    y = 400 + i * 116
    kh += (
        f'<div class="abs line-h" style="left:1080px;top:{y}px;width:712px;background:#3A2F2F"></div>'
        f'<p class="abs a" style="left:1080px;top:{y + 26}px;font-size:22px;letter-spacing:0.14em;'
        f'text-transform:uppercase;color:#3A2F2F;--d:{i + 2}">{t}</p>'
        f'<p class="abs a" style="left:1080px;top:{y + 62}px;font-size:30px;font-weight:800;--d:{i + 2}">{s}</p>'
    )
add("inversion", "Inversión", sec(
    eyebrow("Inversión", k=True)
    + titulo("Un fee mensual,<br>todo dentro", size=64, extra="color:#151515;")
    + f'<p class="abs pop disp" style="left:120px;top:430px;font-size:150px;line-height:1;--d:1">{C["fee"]}</p>'
    + f'<p class="abs a" style="left:128px;top:650px;font-size:34px;font-weight:700;--d:2">{C["fee_nota"]}</p>'
    + '<p class="abs a" style="left:128px;top:740px;width:820px;font-size:26px;line-height:1.4;color:#3A2F2F;--d:3">'
    "Creative, social, contenido, creators y creatividad para paid. Lo que se salga del día a día se presupuesta "
    "antes de hacerlo, nunca después.</p>"
    + kh + foot(n, k=True),
    bg=ROSA, color=INK,
))

# ── 15. Cierre ───────────────────────────────────────────────────────────
n += 1
add("cierre", "Lo cerramos", sec(
    reel("gota", 1180, 140, 300, 534, -4, 1)
    + reel("mimosas", 1500, 360, 300, 534, 5, 2)
    + eyebrow("Siguiente paso")
    + titulo("¿Lo<br>cerramos?", top=210, width=960, size=120)
    + '<p class="abs a soft" style="left:128px;top:500px;width:900px;font-size:30px;line-height:1.4;--d:2">'
    "Si os encaja, empezamos con la sesión de inmersión y en el primer mes ya tenéis el piloto de Can to Table.</p>"
    + '<div class="abs a" style="left:128px;top:700px;display:flex;gap:96px;font-size:26px;line-height:1.5;--d:3">'
    '<div><p style="font-weight:800">Jandro Martín</p><p class="muted">CEO y fundador</p>'
    '<p><a href="mailto:jandro@maenstudios.com" style="color:inherit">jandro@maenstudios.com</a></p>'
    "<p>+34 688 629 688</p></div>"
    '<div><p style="font-weight:800">Maen Studios</p><p class="muted">Carrer del Bruc 61, Barcelona</p>'
    '<p><a href="https://www.maenstudios.com" style="color:inherit">maenstudios.com</a></p></div>'
    "</div>"
    + foot(n, width=960),
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
