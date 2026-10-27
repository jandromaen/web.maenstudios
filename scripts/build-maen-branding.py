"""Genera app/pitch/maen-branding/diapos.ts (presentación de la vertical de
Branding & Packaging de Maen). Lienzo 1920×1080 con las clases de
../maen-plan-100k/plan.css y ./branding.css. Ejecutar desde la raíz:

    python3 scripts/build-maen-branding.py
"""

import json
from pathlib import Path

IMG = "/pitch/maen-branding"
INK = "#151515"
ROSA = "#F9CDCD"


def sec(body, bg=INK, color="#F4F4F4"):
    return f'<section style="background:{bg};color:{color}">{body}</section>'


def foot(n, left=128, width=None, k=False):
    w = f"right:auto;width:{width}px;" if width else ""
    cls = "foot foot-k" if k else "foot"
    return (
        f'<div class="{cls}" style="left:{left}px;{w}">'
        f'<span>Maen Studios · Branding &amp; Packaging</span>'
        f'<span class="n">{n:02d}</span></div>'
    )


def reel(name, left, top, w, h, rot, d):
    return (
        f'<video class="pm-reel f" style="left:{left}px;top:{top}px;width:{w}px;height:{h}px;'
        f'transform:rotate({rot}deg);--d:{d}" src="/clients/{name}/preview.mp4" '
        f'poster="/clients/{name}/poster.jpg" autoplay muted loop playsinline preload="auto"></video>'
    )


def img(src, alt, style, cls="mb-img f", d=0):
    return f'<img class="{cls}" style="{style};--d:{d}" src="{IMG}/{src}.webp" alt="{alt}">'


slides = []

# ── 1. Portada ────────────────────────────────────────────────────────────
cols = [
    ["moet-a", "camaleon-b", "seny-b", "glop-b"],
    ["tous-a", "wink-a", "label-b", "manjares-a"],
    ["benkas-b", "360-a", "moet-b", "camaleon-a"],
]
grid = ""
for ci, col in enumerate(cols):
    imgs = "".join(
        f'<img class="mb-tile" src="{IMG}/{s}.webp" alt="">' for s in col + col[:2]
    )
    grid += (
        f'<div class="mb-col deriva" style="--rot:-8deg;animation-duration:{26 + ci * 6}s;'
        f'animation-delay:-{ci * 7}s">{imgs}</div>'
    )
slides.append({
    "id": "portada",
    "titulo": "Branding & Packaging",
    "html": sec(
        f'<div class="abs deco f" style="left:1010px;top:-320px;display:flex;gap:28px">{grid}</div>'
        '<div class="abs deco" style="left:0;top:0;width:1120px;height:1080px;'
        'background:linear-gradient(90deg,#151515 80%,rgba(21,21,21,0))"></div>'
        '<p class="abs a pm-eyebrow" style="left:128px;top:150px;--d:0">Maen Studios · Nueva vertical</p>'
        '<h1 class="abs a disp" style="left:128px;top:300px;font-size:112px;--d:1">Branding</h1>'
        '<h1 class="abs a disp outline" style="left:128px;top:440px;font-size:72px;--d:2">&amp; Packaging</h1>'
        '<p class="abs a soft" style="left:128px;top:600px;width:760px;font-size:32px;--d:3">'
        'Marcas que funcionan en el lineal y en el feed. Diseñadas, fotografiadas y lanzadas por el mismo equipo.</p>'
        '<p class="abs a muted" style="left:128px;top:960px;font-size:22px;letter-spacing:0.18em;'
        'text-transform:uppercase;--d:4">Barcelona · Madrid · maenstudios.com</p>'
    ),
})

# ── 2. Manifiesto ─────────────────────────────────────────────────────────
slides.append({
    "id": "manifiesto",
    "titulo": "Manifiesto",
    "html": sec(
        '<p class="abs a pm-eyebrow" style="left:128px;top:128px;color:#151515;--d:0">Por qué abrimos esta vertical</p>'
        '<h2 class="abs a disp" style="left:128px;top:260px;width:1660px;font-size:104px;line-height:1.02;--d:1">'
        'Una marca no termina en el logo.</h2>'
        '<h2 class="abs a disp" style="left:128px;top:520px;width:1660px;font-size:104px;line-height:1.02;'
        'color:transparent;-webkit-text-stroke:3px #151515;--d:2">Empieza ahí.</h2>'
        '<p class="abs a" style="left:128px;top:760px;width:1100px;font-size:34px;line-height:1.4;color:#3A2F2F;--d:3">'
        'Llevamos años contando marcas en redes. Ahora también las creamos: identidad, envase e imagen de producto, '
        'pensados desde el primer día para vivir en contenido.</p>'
        + foot(2, k=True),
        bg=ROSA, color=INK,
    ),
})

# ── 3. Quiénes somos ──────────────────────────────────────────────────────
rows = [
    ("Estrategia de redes", "Calendario, tono y formatos por canal", False),
    ("Producción audiovisual", "Rodaje, foto y posproducción en casa", False),
    ("Marketing digital", "Publicación, paid media y reporting", False),
    ("Branding &amp; Packaging", "Nuevo · La marca, antes del contenido", True),
]
rh = ""
for i, (t, s, new) in enumerate(rows):
    top = 470 + i * 116
    col = "rosa" if new else ""
    rh += (
        f'<div class="abs line-h gx" style="left:128px;top:{top}px;width:860px;--d:{i}"></div>'
        f'<p class="abs a {col}" style="left:128px;top:{top + 24}px;font-size:36px;font-weight:800;--d:{i + 2}">{t}</p>'
        f'<p class="abs a muted" style="left:128px;top:{top + 72}px;font-size:24px;--d:{i + 2}">{s}</p>'
    )
slides.append({
    "id": "estudio",
    "titulo": "Quiénes somos",
    "html": sec(
        reel("gota", 1110, 120, 300, 534, -4, 1)
        + reel("mimosas", 1450, 330, 300, 534, 5, 2)
        + reel("tram-tram", 1200, 700, 260, 462, 3, 3)
        + '<p class="abs a pm-eyebrow" style="left:128px;top:128px;--d:0">El estudio</p>'
        '<h2 class="abs a disp" style="left:128px;top:190px;width:900px;font-size:72px;line-height:1.05;--d:1">'
        'Somos<br>Maen Studios</h2>'
        '<p class="abs a soft" style="left:128px;top:380px;width:860px;font-size:28px;--d:2">'
        'Estudio creativo de Barcelona y Madrid para hostelería, moda y deporte.</p>'
        + rh + foot(3, width=860),
    ),
})

# ── 4. Servicios ──────────────────────────────────────────────────────────
serv = [
    ("Identidad", "Naming, logotipo, sistema visual y tono de marca."),
    ("Packaging", "Estructura, gráfica y materiales del envase."),
    ("Rebranding", "Actualizar marcas con historia sin perderla."),
    ("Etiquetado", "Vino, bebidas y producto gourmet."),
    ("Promocional", "Ediciones especiales, regalo y punto de venta."),
    ("Imagen de producto", "Fotografía y render 3D listos para lanzar."),
]
cards = ""
for i, (t, s) in enumerate(serv):
    x = 128 + (i % 3) * 568
    y = 360 + (i // 3) * 300
    cards += (
        f'<div class="abs pm-card pop" style="left:{x}px;top:{y}px;width:528px;height:268px;--d:{i * 2}"></div>'
        f'<p class="abs a disp outline" style="left:{x + 40}px;top:{y + 32}px;font-size:56px;--d:{i}">{i + 1:02d}</p>'
        f'<p class="abs a" style="left:{x + 40}px;top:{y + 120}px;font-size:34px;font-weight:800;--d:{i}">{t}</p>'
        f'<p class="abs a muted" style="left:{x + 40}px;top:{y + 172}px;width:450px;font-size:24px;--d:{i}">{s}</p>'
    )
slides.append({
    "id": "servicios",
    "titulo": "Qué hacemos",
    "html": sec(
        '<p class="abs a pm-eyebrow" style="left:128px;top:128px;--d:0">Qué hacemos</p>'
        '<h2 class="abs a disp" style="left:128px;top:190px;width:1660px;font-size:72px;--d:1">Seis servicios, una marca</h2>'
        + cards + foot(4),
    ),
})

# ── 5. Del lineal al feed ────────────────────────────────────────────────
nodes = ["Marca", "Envase", "Foto y vídeo", "Redes"]
nh = '<div class="abs line-h gx" style="left:260px;top:520px;width:1400px;height:3px;background:#F9CDCD;--d:1"></div>'
for i, t in enumerate(nodes):
    cx = 260 + i * 466
    nh += (
        f'<div class="abs pop" style="left:{cx - 36}px;top:484px;width:72px;height:72px;border-radius:50%;'
        f'background:#F9CDCD;--d:{4 + i * 3}"></div>'
        f'<p class="abs a disp-r" style="left:{cx - 200}px;top:590px;width:400px;text-align:center;font-size:30px;--d:{3 + i}">{t}</p>'
    )
benef = [
    ("Diseñada para redes", "La identidad se piensa sabiendo cómo se verá en el feed, en stories y en vídeo."),
    ("Producción en casa", "El mismo equipo que diseña el envase lo fotografía y lo graba."),
    ("Lanzamiento incluido", "Calendario, publicación y reporting: la marca no se queda en un PDF."),
]
for i, (t, s) in enumerate(benef):
    x = 128 + i * 568
    nh += (
        f'<p class="abs a rosa" style="left:{x}px;top:730px;font-size:30px;font-weight:800;--d:{6 + i}">{t}</p>'
        f'<p class="abs a soft" style="left:{x}px;top:780px;width:500px;font-size:24px;--d:{6 + i}">{s}</p>'
    )
slides.append({
    "id": "lineal-feed",
    "titulo": "Por qué con Maen",
    "html": sec(
        '<p class="abs a pm-eyebrow" style="left:128px;top:128px;--d:0">Por qué con Maen</p>'
        '<h2 class="abs a disp" style="left:128px;top:190px;width:1660px;font-size:72px;line-height:1.05;--d:1">'
        'Del lineal al feed,<br><span class="rosa">sin cambiar de equipo</span></h2>'
        + nh + foot(5),
    ),
})

# ── 6. Proceso ───────────────────────────────────────────────────────────
steps = [
    ("Briefing", "Negocio, público, canal de venta y competencia."),
    ("Concepto", "Idea de marca, territorio visual y tono."),
    ("Diseño", "Identidad, estructura del envase y gráfica."),
    ("Arte final", "Prototipo, materiales y archivos de imprenta."),
    ("Lanzamiento", "Foto, vídeo y campaña en redes."),
]
ph = ""
for i, (t, s) in enumerate(steps):
    x = 128 + i * 340
    h = 180 + i * 90
    ph += (
        f'<div class="abs gy" style="left:{x}px;top:{900 - h}px;width:300px;height:{h}px;'
        f'background:{"#F9CDCD" if i == 4 else "#2A2D2C"};border-radius:24px 24px 0 0;--d:{i}"></div>'
        f'<p class="abs a disp" style="left:{x + 28}px;top:{900 - h + 28}px;font-size:44px;'
        f'color:{"#151515" if i == 4 else "#F9CDCD"};--d:{i + 2}">{i + 1:02d}</p>'
        f'<p class="abs a" style="left:{x}px;top:{900 - h - 160}px;font-size:30px;font-weight:800;--d:{i + 2}">{t}</p>'
        f'<p class="abs a muted" style="left:{x}px;top:{900 - h - 112}px;width:300px;font-size:22px;--d:{i + 2}">{s}</p>'
    )
slides.append({
    "id": "proceso",
    "titulo": "Cómo trabajamos",
    "html": sec(
        '<p class="abs a pm-eyebrow" style="left:128px;top:128px;--d:0">Cómo trabajamos</p>'
        '<h2 class="abs a disp" style="left:128px;top:190px;width:900px;font-size:72px;line-height:1.05;--d:1">'
        'Del briefing<br>al lanzamiento</h2>'
        + ph + foot(6),
    ),
})

# ── 7. Selección (intro) ─────────────────────────────────────────────────
awards = [
    ("Pentawards", "Bronze 2020", "Millésime"),
    ("Elisava Awards", "Nominación 2020", "Camaleon"),
    ("100×100 TOUS", "Pieza seleccionada", "Centenario TOUS"),
]
ah = ""
for i, (a, b, c) in enumerate(awards):
    y = 300 + i * 190
    ah += (
        f'<div class="abs line-h gx" style="left:1060px;top:{y}px;width:732px;--d:{i}"></div>'
        f'<p class="abs a disp-r" style="left:1060px;top:{y + 30}px;font-size:34px;--d:{i + 2}">{a}</p>'
        f'<p class="abs a rosa" style="left:1060px;top:{y + 86}px;font-size:28px;font-weight:700;--d:{i + 2}">{b} · <span class="soft" style="font-weight:400">{c}</span></p>'
    )
slides.append({
    "id": "seleccion",
    "titulo": "Selección de trabajos",
    "html": sec(
        '<p class="abs a pm-eyebrow" style="left:128px;top:128px;--d:0">Selección de trabajos</p>'
        '<p class="abs pop disp outline" style="left:100px;top:180px;font-size:520px;line-height:1;--d:1">10</p>'
        '<p class="abs a" style="left:128px;top:740px;width:820px;font-size:38px;font-weight:800;line-height:1.25;--d:3">'
        'proyectos de identidad y packaging, del gran consumo al lujo.</p>'
        '<p class="abs a muted" style="left:128px;top:870px;width:820px;font-size:24px;--d:4">'
        'Proyectos conceptuales y de concurso de nuestro equipo de branding.</p>'
        + ah + foot(7),
    ),
})

# ── 8-17. Proyectos ──────────────────────────────────────────────────────
P = [
    dict(id="millesime", n=1, cat="Packaging de lujo", name="Millésime", big="moet-a", small="moet-b",
         obj="Estuche premium para bombones inspirado en Moët: textura, oro y un ritual de apertura.",
         tag="Pentawards Bronze 2020", lay="A",
         alt=("Estuche negro abierto con bombones", "Estuche blanco visto desde arriba")),
    dict(id="camaleon", n=2, cat="Perfumería", name="Camaleon", big="camaleon-b", small="camaleon-a",
         obj="Frasco, identidad y concepto de un perfume que cambia de color, para un público femenino joven.",
         tag="Nominado Elisava Awards 2020", lay="B",
         alt=("Tres frascos de colores sobre peanas de madera", "Frasco y peana vistos desde arriba")),
    dict(id="tous", n=3, cat="Pieza artística", name="100×100<br>TOUS", big="tous-a", small="tous-b",
         obj="Oso TOUS en papel troquelado por capas para celebrar el centenario de la marca.",
         tag="Seleccionado 100×100 TOUS", lay="A",
         alt=("Oso de papel por capas de colores", "Detalle de las capas de papel")),
    dict(id="manjares", n=4, cat="Gourmet", name="Manjares", big="manjares-a", small="manjares-b",
         obj="Marca e identidad para una línea gourmet, desplegada en cinco formatos de envase.",
         tag="Identidad + packaging", lay="C", pos="50% 70%",
         alt=("Gama Manjares en cinco formatos", "Caja de crema de gambas desplegada")),
    dict(id="seny", n=5, cat="Vino", name="El Seny<br>y La Rauxa", big="seny-b", small="seny-a",
         obj="Identidad para dos vinos del Empordà inspirados en Anna Espelt: la calma y el impulso.",
         tag="Etiquetado de vino", lay="B",
         alt=("Botellas de blanco y tinto con etiquetas de rayas", "Dos botellas, una tumbada")),
    dict(id="glop", n=6, cat="Bebidas", name="GLOP", big="glop-b", small="glop-a",
         obj="Identidad, forma de envase y concepto para una gama de zumos naturales con ilustración propia.",
         tag="Identidad + ilustración", lay="A",
         alt=("Botellas GLOP con personajes ilustrados", "Tres zumos GLOP de frente")),
    dict(id="wink", n=7, cat="Rebranding", name="Wink", big="wink-a", small="wink-b",
         obj="Nueva identidad y estructura de botella para una bebida clásica, con un tono más descarado.",
         tag="Rebranding", lay="B",
         alt=("Tres botellas blancas Wink", "Dos botellas Wink, una tumbada")),
    dict(id="benkas", n=8, cat="Producto de origen", name="Benkas", big="benkas-a", small="benkas-b",
         obj="Packaging para cocadas palenqueras: kraft, acuarela y la historia de quienes las elaboran.",
         tag="Packaging", lay="C", pos="50% 62%",
         alt=("Caja kraft Benkas con faja de acuarela", "Cajas Benkas abiertas con cocadas")),
    dict(id="label", n=9, cat="Hostelería", name="Label", big="label-b", small="label-a",
         obj="Familia de envases en varios tamaños para los amenities de hotel: gel, champú e hidratante.",
         tag="Diseño de envase", lay="A",
         alt=("Envases Label de gel en tres tamaños", "Envases Label en gris, arena y verde")),
    dict(id="eyewear", n=10, cat="E-commerce", name="360<br>Eyewear", big="360-a", small="360-b",
         obj="Funda-packaging para gafas de venta online, pensada para el envío y para el unboxing.",
         tag="Packaging e-commerce", lay="B",
         alt=("Fundas blancas con estampados de colores", "Funda abierta con unas gafas de sol")),
]

for p in P:
    lines = p["name"].count("<br>") + 1
    num = f'{p["n"]:02d}'
    pill = (f'<p class="abs a" style="left:{{x}}px;top:{{y}}px;--d:5"><span class="pill pill-r">{p["tag"]}</span>'
            f' <span class="pill pill-o" style="margin-left:12px">Concepto</span></p>')
    slide_n = 7 + p["n"]
    if p["lay"] in ("A", "B"):
        right = p["lay"] == "A"
        ix = 860 if right else 0
        tx = 128 if right else 1152
        cardx = 900 if right else 520
        rot = -4 if right else 4
        name_top = 420
        obj_top = name_top + lines * 80 + 36
        pill_top = obj_top + 170
        body = (
            f'<div class="abs" style="left:{ix}px;top:0;width:1060px;height:1080px;overflow:hidden">'
            f'{img(p["big"], p["alt"][0], "position:absolute;left:0;top:0;width:1060px;height:1080px", cls="mb-img mb-zoom")}</div>'
            + img(p["small"], p["alt"][1],
                  f"position:absolute;left:{cardx}px;top:640px;width:500px;height:340px;transform:rotate({rot}deg)",
                  cls="mb-img mb-card f", d=6)
            + f'<p class="abs pop disp outline" style="left:{tx - 8}px;top:110px;font-size:220px;line-height:1;--d:0">{num}</p>'
            f'<p class="abs a pm-eyebrow" style="left:{tx}px;top:368px;--d:1">{p["cat"]}</p>'
            f'<h2 class="abs a disp" style="left:{tx}px;top:{name_top}px;width:660px;font-size:72px;line-height:1.05;--d:2">{p["name"]}</h2>'
            f'<p class="abs a soft" style="left:{tx}px;top:{obj_top}px;width:640px;font-size:30px;line-height:1.4;--d:3">{p["obj"]}</p>'
            + pill.format(x=tx, y=pill_top)
            + foot(slide_n, left=tx, width=640)
        )
    else:
        body = (
            f'<div class="abs" style="left:0;top:0;width:1920px;height:600px;overflow:hidden">'
            f'{img(p["big"], p["alt"][0], "position:absolute;left:0;top:0;width:1920px;height:600px;object-position:" + p["pos"], cls="mb-img mb-zoom")}</div>'
            + img(p["small"], p["alt"][1],
                  "position:absolute;left:1360px;top:520px;width:432px;height:300px;transform:rotate(3deg)",
                  cls="mb-img mb-card f", d=6)
            + f'<p class="abs pop disp" style="left:128px;top:440px;font-size:160px;line-height:1;color:#F9CDCD;'
            f'text-shadow:0 8px 40px rgba(0,0,0,0.4);--d:0">{num}</p>'
            f'<p class="abs a pm-eyebrow" style="left:128px;top:660px;--d:1">{p["cat"]}</p>'
            f'<h2 class="abs a disp" style="left:128px;top:712px;width:620px;font-size:72px;line-height:1.05;--d:2">{p["name"]}</h2>'
            f'<p class="abs a soft" style="left:780px;top:668px;width:520px;font-size:30px;line-height:1.4;--d:3">{p["obj"]}</p>'
            + pill.format(x=128, y=830)
            + foot(slide_n)
        )
    slides.append({"id": p["id"], "titulo": p["name"].replace("<br>", " "), "html": sec(body)})

# ── 18. Cierre ───────────────────────────────────────────────────────────
names = " · ".join(x["name"].replace("<br>", " ") for x in P)
slides.append({
    "id": "contacto",
    "titulo": "Hablemos",
    "html": sec(
        '<p class="abs a pm-eyebrow" style="left:128px;top:128px;color:#151515;--d:0">Hablemos</p>'
        '<h2 class="abs a disp" style="left:128px;top:200px;width:1660px;font-size:132px;line-height:1.0;--d:1">'
        '¿Construimos<br>tu marca?</h2>'
        '<div class="abs a" style="left:128px;top:560px;display:flex;gap:96px;font-size:30px;line-height:1.5;--d:3">'
        '<div><p style="font-weight:800">Jandro Martín</p><p>CEO y fundador</p>'
        '<p><a href="mailto:jandro@maenstudios.com" style="color:inherit">jandro@maenstudios.com</a></p><p>+34 688 629 688</p></div>'
        '<div><p style="font-weight:800">Estudios</p><p>Carrer del Bruc 61, Barcelona</p><p>Calle de Génova 3, Madrid</p></div>'
        '<div><p style="font-weight:800">Online</p>'
        '<p><a href="https://www.maenstudios.com" style="color:inherit">maenstudios.com</a></p><p>@maen.studios</p></div>'
        '</div>'
        '<div class="abs deco mb-marquee" style="left:0;top:860px;width:1920px;height:120px;overflow:hidden">'
        f'<div class="mb-marquee-in disp outline-k">{names} · {names} · </div></div>',
        bg=ROSA, color=INK,
    ),
})

out = Path("app/pitch/maen-branding/diapos.ts")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(
    "/**\n * Diapositivas de la vertical de Branding & Packaging de Maen.\n"
    " * Generado con scripts/build-maen-branding.py: si cambia el contenido,\n"
    " * se edita el script y se vuelve a ejecutar.\n */\n\n"
    'import type { DiapoHtml } from "../maen-plan-100k/diapos";\n\n'
    "export const DIAPOS: DiapoHtml[] = "
    + json.dumps(slides, ensure_ascii=False, indent=2)
    + ";\n",
    encoding="utf-8",
)
print(len(slides), "diapositivas")
