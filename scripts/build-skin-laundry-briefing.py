"""Genera app/pitch/skin-laundry-briefing/diapos.ts: briefing de contenido de
Instagram para Skin Laundry a partir del análisis de /pitch/skin-laundry. Cinco
pilares, formatos (2 reels + 2 carruseles o posts a la semana), reparto
flexible por mes y calendario por temporadas.

Mismo lienzo, identidad, fotos y tipografías que /pitch/skin-laundry. Desde la
raíz del repo:

    python3 scripts/build-skin-laundry-briefing.py
"""

import json
from pathlib import Path

A = "/pitch/skin-laundry"
INK = "#3C201D"
CREAM = "#F6EDE4"
LIME = "#CDF765"
CARAMEL = "#88583A"
PEACH = "#E7B48F"
SAND = "#EADFD3"
SOFT = "#7A5C55"  # texto secundario sobre crema
SOFT_D = "rgba(246,237,228,.72)"  # texto secundario sobre espresso
SERIF = "Newsreader, Georgia, serif"
SANS = "Figtree, Arial, sans-serif"
PIE = "All About Management × Skin Laundry · Briefing de contenido"

# ── Piezas ────────────────────────────────────────────────────────────────
def sec(body, bg=CREAM, color=INK):
    return (
        f'<section style="background:{bg};color:{color};font-family:{SANS}">'
        f"{body}</section>"
    )


def pos(left, top, extra=""):
    return f"position:absolute;left:{left}px;top:{top}px;{extra}"


def logo(left=128, top=112, w=300, dark=True):
    f = "logo-negro.png" if dark else "logo-crema.png"
    return (
        f'<img src="{A}/{f}" alt="Skin Laundry" '
        f'style="{pos(left, top, f"width:{w}px;height:auto")}">'
    )


def eyebrow(t, left=128, top=128, color=None, dot=LIME):
    c = color or "inherit"
    return (
        f'<p style="{pos(left, top)}display:flex;align-items:center;gap:16px;'
        f"font-family:{SANS};font-weight:600;font-size:22px;letter-spacing:3px;"
        f'text-transform:uppercase;white-space:nowrap;color:{c}">'
        f'<span style="width:14px;height:14px;border-radius:99px;background:{dot};display:inline-block"></span>{t}</p>'
    )


def titulo(t, left=128, top=200, width=1500, size=88, color="inherit", tag="h2"):
    return (
        f'<{tag} style="{pos(left, top)}width:{width}px;font-family:{SERIF};font-weight:300;'
        f'font-size:{size}px;line-height:1.06;letter-spacing:-1.5px;color:{color}">{t}</{tag}>'
    )


def texto(t, left, top, width, size=28, color="inherit", weight=400, extra=""):
    return (
        f'<p style="{pos(left, top)}width:{width}px;font-size:{size}px;line-height:1.4;'
        f'font-weight:{weight};color:{color};{extra}">{t}</p>'
    )


def foto(src, alt, left, top, w, h, opos="50% 50%", radius=0, extra=""):
    return (
        f'<img src="{A}/{src}" alt="{alt}" style="{pos(left, top)}width:{w}px;height:{h}px;'
        f'object-fit:cover;object-position:{opos};border-radius:{radius}px;{extra}">'
    )


def pie(n, dark=False, left=128, right=128):
    c = SOFT_D if dark else SOFT
    return (
        f'<p style="position:absolute;left:{left}px;right:{right}px;bottom:56px;display:flex;'
        f"justify-content:space-between;font-size:18px;letter-spacing:2px;text-transform:uppercase;"
        f'color:{c}"><span>{PIE}</span><span>§N§</span></p>'
    )


def cifra(valor, etiqueta, left, top, w=360, dark=False, size=120, acento=None):
    c = acento or ("inherit")
    sub = SOFT_D if dark else SOFT
    return (
        f'<div style="{pos(left, top)}width:{w}px">'
        f'<p style="font-family:{SERIF};font-weight:300;font-size:{size}px;line-height:1;letter-spacing:-3px;color:{c}">{valor}</p>'
        f'<p style="margin-top:18px;font-size:24px;line-height:1.35;color:{sub}">{etiqueta}</p></div>'
    )


def linea(left, top, w, color=INK, alpha=0.18):
    return f'<div style="{pos(left, top)}width:{w}px;height:1px;background:{color};opacity:{alpha}"></div>'


def barras_v(datos, left, top, w, h, color=INK, acento=None, idx_acento=None, fmt=str, label_color=SOFT):
    """Columnas verticales con su valor encima y la etiqueta debajo."""
    mx = max(v for _, v in datos)
    n = len(datos)
    gap = 28
    bw = (w - gap * (n - 1)) / n
    h_out = ""
    for i, (k, v) in enumerate(datos):
        bh = max(6, round(v / mx * h))
        x = left + i * (bw + gap)
        c = acento if (idx_acento is not None and i == idx_acento) else color
        h_out += (
            f'<div style="{pos(round(x), top + h - bh)}width:{round(bw)}px;height:{bh}px;'
            f'background:{c};border-radius:10px 10px 2px 2px"></div>'
            f'<p style="{pos(round(x), top + h - bh - 50)}width:{round(bw)}px;text-align:center;'
            f'font-size:28px;font-weight:600">{fmt(v)}</p>'
            f'<p style="{pos(round(x), top + h + 18)}width:{round(bw)}px;text-align:center;'
            f'font-size:22px;letter-spacing:2px;text-transform:uppercase;color:{label_color}">{k}</p>'
        )
    return h_out


def miles(v):
    return f"{v:,}".replace(",", ".")


def post(src, alt, left, top, w=300, rot=0, ring=None):
    h = round(w * 4 / 3)
    r = f"box-shadow:0 0 0 6px {ring};" if ring else "box-shadow:0 18px 40px rgba(60,32,29,.18);"
    return foto(src, alt, left, top, w, h, radius=14, extra=f"transform:rotate({rot}deg);{r}")


def etiqueta_t(t, left, top):
    return (
        f'<p style="{pos(left, top)}font-size:18px;font-weight:600;letter-spacing:2px;'
        f'text-transform:uppercase;color:{SOFT}">{t}</p>'
    )


def pastilla(t, left, top, bg=LIME, color=INK, size=22):
    return (
        f'<p style="{pos(left, top)}padding:10px 22px;border-radius:999px;background:{bg};color:{color};'
        f'font-size:{size}px;font-weight:600;letter-spacing:1px;white-space:nowrap">{t}</p>'
    )


# ── Diapositivas ──────────────────────────────────────────────────────────
D = []


def add(id_, titulo_, html):
    # El número del pie sale del orden real, así quitar o mover una diapositiva no descuadra nada
    D.append({"id": id_, "titulo": titulo_, "html": html.replace("§N§", f"{len(D) + 1:02d}")})


PILARES = [
    # (id, nombre, objetivo, en reel, en carrusel o post, CTA, foto, encuadre)
    ("antes-despues", "Antes y después",
     "Demostrar que funciona. Es el pilar fijo: la prueba que decide una reserva.",
     ["La doctora explica el caso mientras se ve el resultado: qué preocupaba, qué se hizo y por qué.",
      "La evolución sesión a sesión: primera, tercera y quinta sesión de láser.",
      "El caso con nombre propio, con consentimiento: «Laura, 42 años, manchas tras el verano»."],
     ["La comparativa con el caso contado en la primera imagen.",
      "Antes y después por problema: manchas, textura, poros, labios.",
      "El mismo tratamiento en distintos tipos de piel."],
     "«Comenta INFO y te contamos si es para ti».",
     "mujer-perfil.jpg", "72% 50%"),
    ("informativo", "Informativo",
     "Resolver dudas reales. Es el contenido que más se guarda y el que trae a quien todavía no conoce la clínica.",
     ["Preguntas y respuestas rápidas sacadas de comentarios y mensajes: «nos habéis preguntado…».",
      "«Tres mitos del láser en 30 segundos».",
      "Una duda, una respuesta, con la clínica de fondo."],
     ["Guía por problema: «¿Qué tratamiento necesita mi piel?».",
      "Piel seca o deshidratada, ¿mañana o noche?, cada cuánto repetir.",
      "Comparativas: láser frente a Hydrafacial, neuromoduladores frente a GlowTox."],
     "«Guárdalo para tu próxima valoración».",
     "laser-beige.jpg", "60% 40%"),
    ("equipo-medico", "Equipo médico",
     "Dar una voz propia a la cuenta. En medicina estética se confía en personas: las doctoras como caras recurrentes.",
     ["«La doctora responde»: una duda en 30 segundos, a cámara.",
      "Su opinión sobre tendencias: «¿Funciona el Korean glass skin?».",
      "«Lo que más me piden en otoño» o «lo que yo nunca haría»."],
     ["La doctora presenta su protocolo, con su foto y su firma.",
      "Cómo es una primera valoración, paso a paso.",
      "Sus tres consejos de la temporada."],
     "«¿Qué le preguntarías a la doctora? Te leemos en comentarios».",
     "inyeccion.jpg", "92% 30%"),
    ("tratamientos", "Tratamientos en vivo",
     "Quitar el miedo a la primera vez y enseñar la tecnología. Es la experiencia Skin Laundry contada desde dentro.",
     ["Una sesión de principio a fin: el láser facial en 15 minutos, en tiempo real.",
      "El detalle de la tecnología: el láser, la mascarilla de carbón, Exion.",
      "«Ven conmigo a Skin Laundry» con alguien del público objetivo."],
     ["La sesión paso a paso en fotos.",
      "La tecnología explicada: qué hace y qué notarás.",
      "Qué esperar antes, durante y después."],
     "«Reserva tu primera sesión desde el enlace de la bio».",
     "laser-beige.jpg", "85% 35%"),
    ("ofertas", "Ofertas y membresía",
     "Convertir. Es el pilar que lleva directamente a la reserva, con la estética de la marca y no con plantillas sueltas.",
     ["La primera visita con la oferta al final.",
      "La membresía contada por una clienta: qué incluye y por qué la usa.",
      "La cuenta atrás de una campaña: Black Friday, Navidad."],
     ["La promoción del mes con la línea visual de Skin Laundry.",
      "La membresía explicada: qué incluye y para quién tiene sentido.",
      "Tarjetas regalo en fechas clave."],
     "«Escríbenos por WhatsApp» o «reserva desde la bio».",
     "dos-mujeres.jpg", "74% 30%"),
]

# 01 · Portada
add(
    "portada",
    "Portada",
    sec(
        foto("laser-beige.jpg", "Facial láser de Skin Laundry", 900, 0, 1020, 1080, opos="62% 50%")
        + logo(128, 128, 340)
        + eyebrow("Briefing de contenido · Instagram", 128, 330)
        + titulo("Cinco pilares<br><i>para ordenar<br>el contenido</i>", 128, 400, 820, 104, tag="h1")
        + texto("Qué contamos, cómo lo contamos y cómo decidimos cada mes, a partir del análisis de Instagram y la competencia.",
                128, 760, 640, 28, SOFT)
        + texto("All About Management × Skin Laundry · Versión 1", 128, 960, 760, 22, SOFT,
                extra="letter-spacing:2px;text-transform:uppercase"),
        bg="#E2D0BE",
    ),
)

# 02 · De dónde partimos
partida = [
    ("Se publica mucho, se conecta poco",
     "3–4 publicaciones a la semana, pero el 59 % sin un solo comentario."),
    ("Lo que conecta tiene cara",
     "Casos reales, doctoras y creadoras: es lo que más conversa, aquí y en la competencia."),
    ("Cada pieza necesita un porqué",
     "Un CTA claro convierte la interacción en consultas: «Comenta INFO» llevó a InOut a 307 comentarios."),
    ("El territorio tiene que entenderse al entrar",
     "Una sola línea visual y un perfil que explique qué hay y cómo reservar."),
]
pg = ""
for i, (t, d) in enumerate(partida):
    y = 440 + i * 136
    pg += (
        f'<p style="{pos(128, y)}font-size:20px;font-weight:600;letter-spacing:2px;color:{LIME}">0{i + 1}</p>'
        + f'<p style="{pos(200, y - 10)}width:860px;font-family:{SERIF};font-size:40px;font-weight:300;line-height:1.1;color:{CREAM}">{t}</p>'
        + texto(d, 200, y + 46, 860, 23, SOFT_D)
    )
add(
    "partida",
    "De dónde partimos",
    sec(
        foto("mujer-perfil.jpg", "Retrato de campaña de Skin Laundry", 1200, 0, 720, 1080, opos="72% 50%")
        + eyebrow("De dónde partimos", 128, 128, color=CREAM)
        + titulo("Lo que nos dice<br><i>el análisis</i>.", 128, 200, 1000, 80, color=CREAM)
        + pg
        + pie(0, dark=True, right=780),
        bg=INK,
        color=CREAM,
    ),
)

# 03 · Por qué cinco pilares
razones = [
    ("Diversificar", "Cinco maneras de hablar de la piel para no repetir siempre la misma pieza y llegar a más gente."),
    ("Si uno falla, el resto sostiene", "Ningún pilar carga con todo: si uno no funciona, la cuenta no se cae."),
    ("Potenciar lo que funciona", "Medimos cada pilar por separado y movemos el peso hacia el que mejor responde."),
]
rz = ""
for i, (t, d) in enumerate(razones):
    x = 128 + i * 568
    rz += (
        f'<div style="{pos(x, 420)}width:536px;height:420px;border-radius:24px;background:{SAND}"></div>'
        + f'<p style="{pos(x + 44, 470)}font-family:{SERIF};font-size:120px;font-weight:300;line-height:1;color:{CARAMEL}">{i + 1}</p>'
        + f'<p style="{pos(x + 44, 620)}width:448px;font-family:{SERIF};font-size:42px;font-weight:300;line-height:1.08">{t}</p>'
        + texto(d, x + 44, 740, 448, 22, SOFT)
    )
add(
    "por-que",
    "Por qué cinco pilares",
    sec(
        eyebrow("Por qué cinco pilares", 128, 128)
        + titulo("Una cuenta que <i>no depende</i><br>de una sola idea.", 128, 200, 1600, 80)
        + rz
        + pie(0),
    ),
)

# 04 · Los cinco pilares
cards = ""
cw, gap = 312, 26
for i, (pid, n, obj, *_rest) in enumerate(PILARES):
    x = 128 + i * (cw + gap)
    dark = i == 0
    bg, fg, sub = (INK, CREAM, SOFT_D) if dark else (SAND, INK, SOFT)
    cards += (
        f'<div style="{pos(x, 360)}width:{cw}px;height:560px;border-radius:22px;background:{bg}"></div>'
        + f'<p style="{pos(x + 32, 396)}font-family:{SERIF};font-size:96px;font-weight:300;line-height:1;color:{LIME if dark else CARAMEL}">{i + 1}</p>'
        + f'<p style="{pos(x + 32, 530)}width:{cw - 64}px;font-family:{SERIF};font-size:38px;font-weight:300;line-height:1.05;color:{fg}">{n}</p>'
        + texto(obj, x + 32, 650, cw - 60, 19, sub)
    )
add(
    "pilares",
    "Los cinco pilares",
    sec(
        eyebrow("Los cinco pilares", 128, 128)
        + titulo("Qué contamos.", 128, 200, 1600, 80)
        + cards
        + pie(0),
    ),
)

# 05–09 · Un pilar por diapositiva
for i, (pid, n, obj, reel, carr, cta, img, opos) in enumerate(PILARES):
    extra = ""
    if pid == "antes-despues":
        extra = texto("<b>No siempre fotos.</b> El antes y después también puede ser la doctora contando el caso, "
                      "como hace InOut: el resultado con una voz detrás.", 128, 900, 860, 20, CARAMEL, 600)
    col = lambda titulo_c, items, x: (
        texto(titulo_c, x, 470, 400, 18, SOFT, 600, extra="letter-spacing:2px;text-transform:uppercase")
        + "".join(texto(f'<span style="color:{CARAMEL};font-weight:700;margin-right:10px">—</span>{t}', x, 512 + j * 104, 410, 21, INK)
                  for j, t in enumerate(items))
    )
    add(
        pid,
        n,
        sec(
            foto(img, "Imagen de campaña de Skin Laundry", 1100, 0, 820, 1080, opos=opos)
            + eyebrow(f"Pilar {i + 1} de 5", 128, 128)
            + titulo(n, 128, 190, 940, 88)
            + texto(obj, 128, 312, 900, 26, SOFT)
            + col("En reel", reel, 128)
            + col("En carrusel o post", carr, 578)
            + f'<p style="{pos(128, 840)}padding:10px 22px;border-radius:999px;background:{LIME};font-size:20px;font-weight:600;white-space:nowrap">CTA · {cta}</p>'
            + extra
            + pie(0, right=860),
        ),
    )

# 12 · Temporadas (sin tratamientos: los define Skin Laundry)
temporadas = [
    ("Otoño", "Sep – Nov", "Vuelta a la rutina",
     ["Vuelta de vacaciones", "Halloween", "Black Friday"]),
    ("Invierno", "Dic – Feb", "Fiestas y propósitos",
     ["Navidad y tarjetas regalo", "Año nuevo, nuevos hábitos", "San Valentín"]),
    ("Primavera", "Mar – May", "Preparar la piel",
     ["Sant Jordi", "Bodas y celebraciones", "Día de la Madre"]),
    ("Verano", "Jun – Ago", "Cuidarse con el sol",
     ["Antes de las vacaciones", "Sant Joan", "Cuidado y mantenimiento"]),
]
tg = ""
for i, (t, m, foco, items) in enumerate(temporadas):
    x = 128 + i * 422
    dark = i == 0
    bg, fg, sub = (INK, CREAM, SOFT_D) if dark else (SAND, INK, SOFT)
    tg += (
        f'<div style="{pos(x, 400)}width:398px;height:470px;border-radius:22px;background:{bg}"></div>'
        + texto(m, x + 36, 434, 330, 18, LIME if dark else CARAMEL, 600, extra="letter-spacing:2px;text-transform:uppercase")
        + f'<p style="{pos(x + 36, 470)}font-family:{SERIF};font-size:56px;font-weight:300;line-height:1;color:{fg}">{t}</p>'
        + texto(foco, x + 36, 550, 330, 24, fg, 600)
        + texto("Campañas y momentos", x + 36, 620, 330, 16, sub, 600, extra="letter-spacing:2px;text-transform:uppercase")
        + "".join(texto(f'<span style="color:{LIME if dark else CARAMEL};margin-right:10px">—</span>{it}', x + 36, 656 + j * 56, 330, 22, fg)
                  for j, it in enumerate(items))
    )
add(
    "temporadas",
    "Temporadas",
    sec(
        eyebrow("Por temporadas", 128, 128)
        + titulo("El contenido, <i>por estaciones</i>.", 128, 200, 1600, 76)
        + texto("Cada época cambia lo que la gente busca y lo que la clínica ofrece, y trae sus propias campañas. "
                "Organizar el año por estaciones nos permite preparar con antelación tanto los tratamientos como las ofertas.",
                128, 300, 1560, 24, SOFT)
        + tg
        + texto("Los tratamientos protagonistas de cada temporada los definimos junto al equipo de Skin Laundry.",
                128, 900, 1600, 22, CARAMEL, 600)
        + pie(0),
    ),
)

# 13 · Semana tipo
semana = [
    ("Reel", "Antes y después", "La doctora explica un caso de manchas tras el verano en tres sesiones de láser.", "«Comenta INFO»"),
    ("Carrusel", "Informativo", "«¿Por qué el otoño es la época del láser?»", "«Guárdalo»"),
    ("Reel", "Tratamientos en vivo", "Una sesión de láser facial de principio a fin, en 15 minutos.", "«Reserva desde la bio»"),
    ("Carrusel", "Ofertas", "Black Friday con la línea visual de Skin Laundry.", "«Escríbenos por WhatsApp»"),
]
sg = ""
for i, (f, p, d, c) in enumerate(semana):
    x = 128 + i * 422
    sg += (
        f'<div style="{pos(x, 340)}width:398px;height:540px;border-radius:22px;background:{SAND}"></div>'
        + f'<p style="{pos(x + 32, 372)}padding:8px 18px;border-radius:999px;background:{INK if f == "Reel" else LIME};'
          f'color:{CREAM if f == "Reel" else INK};font-size:18px;font-weight:600;letter-spacing:2px;text-transform:uppercase">{f}</p>'
        + texto(f"Pieza {i + 1}", x + 32, 452, 330, 18, SOFT, 600, extra="letter-spacing:2px;text-transform:uppercase")
        + f'<p style="{pos(x + 32, 486)}width:334px;font-family:{SERIF};font-size:40px;font-weight:300;line-height:1.05">{p}</p>'
        + texto(d, x + 32, 600, 334, 22, INK)
        + texto(f"CTA · {c}", x + 32, 800, 334, 19, CARAMEL, 600)
    )
add(
    "semana",
    "Semana tipo",
    sec(
        eyebrow("Una semana de noviembre", 128, 128)
        + titulo("Así se ve <i>en el calendario</i>.", 128, 200, 1600, 76)
        + sg
        + texto("La semana siguiente rota: el equipo médico entra en reel y el antes y después pasa a carrusel.",
                128, 912, 1600, 21, SOFT)
        + pie(0),
    ),
)

# 14 · Qué medimos
medidas = [
    ("Comentarios", "La conversación que buscamos."),
    ("Guardados y compartidos", "Lo que la gente quiere volver a ver."),
    ("Mensajes y «Comenta INFO»", "Las consultas que genera cada pieza."),
    ("Reservas desde Instagram", "El objetivo final, junto con la clínica."),
]
mg = ""
for i, (t, d) in enumerate(medidas):
    x = 128 + i * 422
    mg += (
        f'<p style="{pos(x, 470)}font-family:{SERIF};font-size:96px;font-weight:300;line-height:1;color:{LIME}">0{i + 1}</p>'
        + f'<p style="{pos(x, 600)}width:380px;font-family:{SERIF};font-size:38px;font-weight:300;line-height:1.08;color:{CREAM}">{t}</p>'
        + texto(d, x, 710, 360, 22, SOFT_D)
    )
add(
    "medir",
    "Qué medimos",
    sec(
        eyebrow("Qué medimos", 128, 128, color=CREAM)
        + titulo("Cada mes, <i>análisis y report</i>.", 128, 200, 1600, 80, color=CREAM)
        + texto("Al cierre de cada mes analizamos los resultados y compartimos un report con lo que ha funcionado y lo que ajustamos para el siguiente.",
                128, 340, 1500, 26, SOFT_D)
        + mg
        + pie(0, dark=True),
        bg=INK,
        color=CREAM,
    ),
)

# 15 · Lo que necesitamos
necesidades = [
    ("Prioridades del negocio", "Qué tratamientos y servicios queremos empujar en los próximos meses."),
    ("Validación del equipo médico", "Qué tratamientos encajan en cada temporada y cómo se comunican."),
    ("Agenda de grabación", "Una mañana al mes con las doctoras y la clínica en funcionamiento."),
    ("Consentimiento de pacientes", "Para los antes y después y los casos con nombre propio."),
    ("Acceso a estadísticas", "Instagram y reservas, para medir desde el primer mes."),
]
ng = ""
for i, (t, d) in enumerate(necesidades):
    y = 352 + i * 112
    ng += (
        linea(128, y, 1664)
        + f'<p style="{pos(128, y + 30)}font-size:20px;font-weight:600;letter-spacing:2px;color:{CARAMEL}">0{i + 1}</p>'
        + f'<p style="{pos(228, y + 24)}width:620px;font-family:{SERIF};font-size:38px;font-weight:300;line-height:1.1">{t}</p>'
        + texto(d, 900, y + 30, 890, 23, SOFT)
    )
ng += linea(128, 352 + 5 * 112, 1664)
add(
    "necesitamos",
    "Lo que necesitamos",
    sec(
        eyebrow("Para arrancar", 128, 128)
        + titulo("Lo que necesitamos <i>de Skin Laundry</i>.", 128, 200, 1600, 80)
        + ng
        + pie(0),
    ),
)

# 16 · Cierre
add(
    "cierre",
    "Cierre",
    sec(
        foto("inyeccion.jpg", "Tratamiento de medicina estética en Skin Laundry", 1105, 0, 815, 1080, opos="100% 40%")
        + logo(128, 128, 340)
        + titulo("Your skin.<br><i>Our expertise.</i>", 128, 380, 900, 120, tag="h2")
        + texto("All About Management × Skin Laundry · Barcelona", 128, 960, 940, 22, SOFT,
                extra="letter-spacing:2px;text-transform:uppercase"),
        bg="#E3D1BC",
    ),
)

out = Path(__file__).resolve().parent.parent / "app/pitch/skin-laundry-briefing/diapos.ts"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(
    "/**\n * Briefing de contenido de Instagram para Skin Laundry: cinco pilares, formatos,\n"
    " * reparto flexible y temporadas. Generado con scripts/build-skin-laundry-briefing.py:\n"
    " * si cambia el contenido, se edita el script y se vuelve a ejecutar.\n */\n\n"
    'import type { DiapoHtml } from "../skin-laundry/diapos";\n\n'
    f"export const DIAPOS: DiapoHtml[] = {json.dumps(D, ensure_ascii=False, indent=2)};\n"
)
print(f"{len(D)} diapositivas → {out}")
