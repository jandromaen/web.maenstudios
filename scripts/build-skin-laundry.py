"""Genera app/pitch/skin-laundry/diapos.ts: análisis de Instagram de
Skin Laundry Barcelona (1 de mayo – 1 de noviembre de 2026), primer entregable
de Maen en el servicio de social media que lleva con All About Management.

Lienzo de 1920×1080 con la identidad de Skin Laundry (espresso, crema y lima;
Newsreader Light en lugar de Apris y Figtree en lugar de Articulat). Todas las
cifras viven arriba, en IG: salen de los perfiles públicos el 2 de
noviembre de 2026. Si cambian, se tocan ahí y se vuelve a ejecutar desde la
raíz del repo:

    python3 scripts/build-skin-laundry.py
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
PIE = "All About Management × Skin Laundry · Análisis de Instagram"

# ── Datos (perfiles públicos, 2 de noviembre de 2026) ─────────────────────
IG = {
    "seguidores": "9.540",
    "posts": 87,
    "semana": "3,4",
    "mix": [("Carruseles", 42), ("Reels", 35), ("Fotos", 10)],
    "meses": [("May", 13), ("Jun", 19), ("Jul", 15), ("Ago", 15), ("Sep", 15), ("Oct", 9)],
    "comentarios": 179,
    "sin_comentarios": 51,
    "likes_ocultos": 83,
    "com_reel": "3,9",
    "com_carrusel": "0,9",
    "com_foto": "0,3",
}


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


def divisor(id_, num, titulo_t, sub):
    add(
        id_,
        titulo_t.replace("<i>", "").replace("</i>", "").replace("<br>", " "),
        sec(
            f'<p style="{pos(128, 300)}font-family:{SERIF};font-weight:300;font-size:200px;line-height:1;color:{LIME}">{num}</p>'
            + titulo(titulo_t, 128, 540, 1400, 112, color=CREAM)
            + texto(sub, 128, 820, 1000, 30, SOFT_D)
            + pie(0, dark=True),
            bg=INK,
            color=CREAM,
        ),
    )


# 01 · Portada
add(
    "portada",
    "Portada",
    sec(
        foto("laser-beige.jpg", "Facial láser de Skin Laundry", 900, 0, 1020, 1080, opos="62% 50%")
        + logo(128, 128, 340)
        + eyebrow("Análisis · Noviembre 2026", 128, 330)
        + titulo("Instagram<br><i>y competencia</i>", 128, 400, 820, 112, tag="h1")
        + texto(
            "Cómo está hoy Skin Laundry Barcelona en Instagram y con quién compite.",
            128, 680, 640, 30, SOFT,
        )
        + texto("All About Management × Skin Laundry", 128, 960, 760, 22, SOFT,
                extra="letter-spacing:2px;text-transform:uppercase"),
        bg="#E2D0BE",
    ),
)

divisor("parte-1", "01", "Skin Laundry,<br><i>seis meses después</i>",
        "Las 87 publicaciones de Instagram entre mayo y octubre de 2026.")

# 02 · Punto de partida
add(
    "partida",
    "Punto de partida",
    sec(
        foto("mujer-perfil.jpg", "Retrato de campaña de Skin Laundry", 0, 0, 760, 1080, opos="72% 50%")
        + eyebrow("Punto de partida", 880, 128)
        + titulo("Born in California.<br><i>Now in Barcelona.</i>", 880, 200, 920, 92)
        + texto(
            "Una marca global de láser facial y medicina estética con una sola clínica en España, en Diagonal 610, "
            "que en septiembre cumplió su primer año. El respaldo de marca es enorme; la comunidad local, "
            "todavía pequeña: 9.540 seguidores en Instagram.",
            880, 440, 900, 30, SOFT,
        )
        + linea(880, 690, 900)
        + cifra("+60", "clínicas en el mundo", 880, 730, 280, size=96)
        + cifra("+3M", "láseres faciales realizados", 1190, 730, 300, size=96)
        + cifra("1", "clínica en España: Barcelona", 1520, 730, 280, size=96)
        + pie(2, left=880),
    ),
)

# 03 · Qué hemos analizado
add(
    "metodo",
    "Qué hemos analizado",
    sec(
        eyebrow("Qué hemos analizado", 128, 128)
        + titulo("Todo lo publicado entre el 1 de mayo<br>y el 1 de noviembre de 2026.", 128, 200, 1600, 80)
        + foto("ig-perfil.jpg", "Perfil de Instagram de Skin Laundry Spain", 128, 500, 600, 450, radius=18,
               extra="box-shadow:0 18px 40px rgba(60,32,29,.14)")
        + post("ig-promo-75.jpg", "Promoción del primer láser facial por 75 €", 800, 520, 225)
        + post("ig-bronceado.jpg", "Carrusel «El bronceado se va»", 1045, 520, 225)
        + post("ig-halloween.jpg", "Reel «Halloween Week»", 1290, 520, 225)
        + post("ig-que-laser.jpg", "Reel «¿Qué láser necesita tu piel este otoño?»", 1535, 520, 225)
        + texto(
            "Perfil público <b>@skinlaundry_es</b>, consultado el 2 de noviembre. Las 87 publicaciones, una a una: "
            "formato, fecha, comentarios, reproducciones y estilo.",
            128, 400, 1500, 26, SOFT,
        )
        + pie(3),
    ),
)

# 04 · En cifras
add(
    "cifras",
    "Seis meses en cifras",
    sec(
        eyebrow("Seis meses en cifras", 128, 128, color=CREAM)
        + titulo("Mucha constancia,<br>poca <i>conversación</i>.", 128, 200, 1400, 96, color=CREAM)
        + cifra(IG["seguidores"], "seguidores en Instagram", 128, 560, 380, dark=True, size=120)
        + cifra(str(IG["posts"]), "publicaciones en seis meses", 548, 560, 380, dark=True, size=120)
        + cifra(IG["semana"], "publicaciones por semana", 968, 560, 380, dark=True, size=120)
        + cifra(str(IG["comentarios"]), "comentarios en total: 2 por publicación", 1388, 560, 400, dark=True, size=120, acento=LIME)
        + pie(4, dark=True),
        bg=INK,
        color=CREAM,
    ),
)

# 05 · Instagram: qué se publica
mix_total = sum(v for _, v in IG["mix"])
mix_html = ""
x = 128
colores = [INK, CARAMEL, PEACH]
for (k, v), c in zip(IG["mix"], colores):
    w = round(v / mix_total * 760)
    mix_html += f'<div style="{pos(x, 560)}width:{w - 6}px;height:64px;background:{c};border-radius:8px"></div>'
    mix_html += texto(f"<b>{round(v / mix_total * 100)} %</b> {k.lower()} · {v}", x, 644, w + 80, 22, SOFT)
    x += w
add(
    "ig-formatos",
    "Instagram · Qué se publica",
    sec(
        eyebrow("Instagram · Qué se publica", 128, 128)
        + titulo("Un ritmo sólido que se cae en octubre.", 128, 200, 1600, 80)
        + texto(
            "Casi una publicación cada dos días, con más carruseles que reels. "
            "Del 3 al 22 de octubre la cuenta estuvo 19 días sin publicar, el mayor hueco del semestre.",
            128, 330, 760, 28, SOFT,
        )
        + f'<p style="{pos(128, 500)}font-size:22px;letter-spacing:3px;text-transform:uppercase;font-weight:600">Formatos</p>'
        + mix_html
        + texto(
            "Martes y domingo concentran casi la mitad de las publicaciones; lunes y sábado apenas se usan.",
            128, 760, 760, 24, SOFT,
        )
        + barras_v(IG["meses"], 1000, 420, 800, 400, color=SAND, acento=CARAMEL, idx_acento=5)
        + texto("Publicaciones al mes", 1000, 900, 800, 22, SOFT, extra="text-align:center;letter-spacing:2px;text-transform:uppercase")
        + pie(5),
    ),
)

# 06 · Instagram: conversación
add(
    "ig-conversacion",
    "Instagram · Conversación",
    sec(
        eyebrow("Instagram · Conversación", 128, 128)
        + titulo("Seis de cada diez publicaciones<br>no reciben <i>ni un comentario</i>.", 128, 200, 1600, 84)
        + cifra(f'{round(IG["sin_comentarios"] / IG["posts"] * 100)} %', f'de las publicaciones, sin comentarios ({IG["sin_comentarios"]} de {IG["posts"]})', 128, 470, 480)
        + cifra(f'{IG["likes_ocultos"]}/{IG["posts"]}', "publicaciones con los «me gusta» ocultos", 680, 470, 480)
        + cifra("×4", "comentarios en un reel frente a un carrusel", 1232, 470, 560, acento=CARAMEL)
        + linea(128, 760, 1664)
        + texto(
            "<b>Los «me gusta» ocultos quitan prueba social.</b> Quien llega al perfil por primera vez no ve que otras "
            "personas confían en la clínica, y desde fuera no se puede medir qué funciona.",
            128, 800, 780, 26, SOFT,
        )
        + texto(
            f'<b>El reel conversa más.</b> {IG["com_reel"]} comentarios de media por reel, {IG["com_carrusel"]} por carrusel y '
            f'{IG["com_foto"]} por foto. Aun así, el carrusel sigue siendo el formato principal.',
            1012, 800, 780, 26, SOFT,
        )
        + pie(6),
    ),
)

# 07 · Instagram: lo que funciona
top = [
    ("23", "Colaboración «Sabbatical»", "Creadora con estilo de vida propio. 140 «me gusta», los únicos visibles con cifra alta."),
    ("23", "Reel «¿El secreto de Victoria Beckham?»", "Gancho con una cara conocida para presentar Exion."),
    ("18", "Reel «Korean Skin»", "Curiosidad por un resultado concreto que la gente ya busca."),
    ("10", "Reel de neuromoduladores", "Una duda real, explicada por el equipo médico."),
    ("9", "«¡Cumplimos 1 año!»", "La clínica y su gente, sin promoción de por medio."),
]
filas = ""
for i, (n, t, d) in enumerate(top):
    y = 456 + i * 104
    filas += (
        f'<p style="{pos(128, y)}width:120px;font-family:{SERIF};font-weight:300;font-size:72px;line-height:1;color:{CARAMEL}">{n}</p>'
        + texto(f"<b>{t}</b>", 270, y + 2, 560, 28)
        + texto(d, 270, y + 44, 640, 22, SOFT)
    )
add(
    "ig-funciona",
    "Instagram · Lo que funciona",
    sec(
        eyebrow("Instagram · Lo que funciona", 128, 128)
        + titulo("Lo que más conversa tiene <i>cara</i>,<br>no plantilla.", 128, 200, 1500, 84)
        + texto("Comentarios", 128, 410, 300, 20, SOFT, extra="letter-spacing:2px;text-transform:uppercase")
        + filas
        + f'<div style="{pos(1000, 410)}width:792px;height:530px;background:{INK};border-radius:24px"></div>'
        + texto("Reproducciones de reels visibles", 1060, 456, 680, 20, SOFT_D, extra="letter-spacing:2px;text-transform:uppercase")
        + cifra("3.897", "«The Artist», en colaboración con otra cuenta", 1060, 510, 680, dark=True, size=96, acento=LIME)
        + cifra("594–672", "reels propios de finales de octubre: el equivalente al 6–7 % de los seguidores", 1060, 710, 680, dark=True, size=96, acento=CREAM)
        + pie(7),
    ),
)

# 08 · Instagram: identidad visual
on = [("ig-vogue.jpg", "Publicación con mención de Vogue"), ("ig-bronceado.jpg", "Carrusel «El bronceado se va»"),
      ("ig-promo-75.jpg", "Promoción del primer láser facial por 75 €"), ("ig-ba-labios.jpg", "Antes y después de labios")]
off = [("ig-halloween.jpg", "Reel «Halloween Week»"), ("ig-membresias.jpg", "Carrusel «Nuestras membresías»"),
       ("ig-sudoracion.jpg", "Promoción de sudoración excesiva"), ("ig-regeneye.jpg", "Reel «Regeneye»")]
g = ""
for i, (s, a) in enumerate(on):
    g += post(s, a, 128 + i * 200, 470, 184)
for i, (s, a) in enumerate(off):
    g += post(s, a, 1000 + i * 200, 470, 184)
add(
    "ig-identidad",
    "Instagram · Identidad visual",
    sec(
        eyebrow("Instagram · Identidad visual", 128, 128)
        + titulo("Dos marcas conviviendo en el mismo feed.", 128, 200, 1600, 80)
        + texto(
            "La identidad global de Skin Laundry convive con plantillas de promoción hechas para cada ocasión: "
            "tipografías de Halloween, fondos azules, rótulos en negrita. El feed pierde el aire premium que sí tiene la web.",
            128, 310, 1500, 26, SOFT,
        )
        + g
        + pastilla("Suena a Skin Laundry", 128, 830, LIME)
        + pastilla("No suena a Skin Laundry", 1000, 830, INK, CREAM)
        + texto("Crema, espresso, lima. Serif fina. Piel real, luz natural.", 128, 900, 780, 24, SOFT)
        + texto("Cada promoción con su estilo. Mensajes de oferta antes que de marca.", 1000, 900, 780, 24, SOFT)
        + pie(8),
    ),
)

# 09 · Pilares
pilares = [
    ("Antes y después", "De lo más presente. Funciona como prueba, pero repetido en la misma plantilla crema acaba pasando desapercibido."),
    ("Promociones", "Primer láser por 75 €, Summer Glow, Halloween… Cada campaña con estética propia."),
    ("Educación", "Mitos del láser, piel seca o deshidratada, manchas tras el verano. Buen fondo, casi siempre en carrusel."),
    ("Equipo médico", "La Dra. Nataly Revelo y la Dra. Farah Anani aparecen de vez en cuando. Son la mejor credencial de la clínica."),
    ("Tratamientos", "Exion, GlowTox, exosomas, Regeneye: novedades presentadas como ficha de producto."),
    ("Comunidad", "Reseñas, «Skin Laundry Friends», el aniversario. Lo más humano, lo menos frecuente."),
]
pg = ""
for i, (t, d) in enumerate(pilares):
    col, row = i % 3, i // 3
    x, y = 128 + col * 568, 400 + row * 270
    pg += (
        f'<div style="{pos(x, y)}width:536px;height:240px;border-radius:20px;background:{SAND}"></div>'
        f'<p style="{pos(x + 36, y + 32)}font-family:{SERIF};font-size:44px;font-weight:300;line-height:1">{t}</p>'
        + texto(d, x + 36, y + 100, 464, 22, SOFT)
    )
add(
    "pilares",
    "Pilares de contenido",
    sec(
        eyebrow("Pilares de contenido", 128, 128)
        + titulo("Los temas están. Falta <i>un hilo</i> que los una.", 128, 200, 1600, 80)
        + pg
        + pie(9),
    ),
)

# 13 · Diagnóstico
diag = [
    "Hay constancia: 3–4 publicaciones a la semana en Instagram durante casi todo el semestre.",
    "No hay conversación: el 59 % de las publicaciones no recibe comentarios y los «me gusta» están ocultos.",
    "Lo que funciona tiene cara: colaboraciones, equipo médico y ganchos con curiosidad.",
    "La identidad se diluye: cada promoción trae su propia estética y el feed deja de parecer premium.",
    "Octubre se cae: 9 publicaciones y 19 días seguidos sin publicar.",
]
dg = ""
for i, t in enumerate(diag):
    y = 400 + i * 108
    dg += (
        f'<div style="{pos(128, y + 14)}width:14px;height:14px;border-radius:99px;background:{LIME}"></div>'
        + texto(t, 176, y, 880, 30, CREAM)
    )
add(
    "diagnostico",
    "Diagnóstico",
    sec(
        foto("dos-mujeres.jpg", "Dos clientas sonriendo, imagen de campaña", 1160, 0, 760, 1080, opos="74% 30%")
        + eyebrow("Diagnóstico", 128, 128, color=CREAM)
        + titulo("En una frase: <i>se publica mucho,<br>se conecta poco.</i>", 128, 200, 1000, 72, color=CREAM)
        + dg
        + pie(13, dark=True, right=820),
        bg=INK,
        color=CREAM,
    ),
)

# Parte 2 · Competencia (diapositivas de scripts/build-skin-laundry-competencia.py)
divisor("parte-2", "02", "Quién más habla<br>de piel <i>en Barcelona</i>",
        "Siete cuentas de la competencia y dónde se sitúa cada una.")

import importlib.util  # noqa: E402

_spec = importlib.util.spec_from_file_location(
    "competencia", Path(__file__).resolve().parent / "build-skin-laundry-competencia.py")
_comp = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_comp)
_por_id = {d["id"]: d for d in _comp.D}
for _id in ["quien", "resumen", "ig-comparativa", "alcance", "grandes", "diagonal", "concepto", "hydrafacial", "mapa"]:
    _d = _por_id[_id]
    add(f"comp-{_id}", _d["titulo"], _d["html"])

# 14 · Oportunidades
ops = [
    ("Definir el foco", "Entender qué tratamientos, servicios y objetivos queremos priorizar en la comunicación."),
    ("Una sola identidad", "Unificar la estética de las publicaciones para reforzar el universo premium de Skin Laundry."),
    ("Dar voz al equipo médico", "Potenciar la presencia de las doctoras para transmitir confianza y conocimiento, y dar una voz propia a la cuenta."),
    ("Más conversación", "Explorar contenidos y llamadas a la acción que inviten a participar y faciliten el contacto."),
    ("Reforzar la diferenciación", "Comunicar mejor qué hace único a Skin Laundry frente a otras clínicas y tratamientos."),
    ("Conectar con Barcelona", "Explorar colaboraciones con creadoras y perfiles locales afines a la marca."),
    ("Medir para evolucionar", "Identificar qué contenidos generan interés, interacción, consultas y reservas."),
]
Y0, RH = 372, 84
og = (
    texto("Oportunidad", 228, 330, 500, 18, SOFT, 600, extra="letter-spacing:2px;text-transform:uppercase")
    + texto("Enfoque", 820, 330, 500, 18, SOFT, 600, extra="letter-spacing:2px;text-transform:uppercase")
)
for i, (t, d) in enumerate(ops):
    y = Y0 + i * RH
    og += (
        linea(128, y, 1664)
        + f'<p style="{pos(128, y + 24)}font-size:20px;font-weight:600;letter-spacing:2px;color:{CARAMEL}">0{i + 1}</p>'
        + f'<p style="{pos(228, y + 18)}width:560px;font-family:{SERIF};font-size:38px;font-weight:300;line-height:1.1">{t}</p>'
        # Una línea centrada en la fila; si pasa de una línea, sube para caber entera
        + texto(d, 820, y + (22 if len(d) < 95 else 9), 972, 23, SOFT)
    )
og += linea(128, Y0 + len(ops) * RH, 1664)
add(
    "oportunidades",
    "Por dónde podemos empezar",
    sec(
        eyebrow("Por dónde podemos empezar", 128, 128)
        + titulo("Siete oportunidades para <i>explorar juntos</i>.", 128, 200, 1600, 80)
        + og
        + pie(0),
    ),
)

# 15 · Cierre
add(
    "cierre",
    "Cierre",
    sec(
        foto("inyeccion.jpg", "Tratamiento de medicina estética en Skin Laundry", 1105, 0, 815, 1080, opos="100% 40%")
        + logo(128, 128, 340)
        + titulo("Your skin.<br><i>Our expertise.</i>", 128, 380, 900, 120, tag="h2")
        + texto("Siguiente paso: definir juntos el foco.", 128, 680, 680, 34, SOFT)
        + texto("All About Management × Skin Laundry · Barcelona", 128, 960, 940, 22, SOFT,
                extra="letter-spacing:2px;text-transform:uppercase"),
        bg="#E3D1BC",
    ),
)

out = Path(__file__).resolve().parent.parent / "app/pitch/skin-laundry/diapos.ts"
out.write_text(
    "/**\n * Análisis de Instagram y competencia de Skin Laundry (noviembre 2026).\n"
    " * Generado con scripts/build-skin-laundry.py: si cambia el contenido o las\n"
    " * cifras, se edita el script y se vuelve a ejecutar.\n */\n\n"
    "export type DiapoHtml = { id: string; titulo: string; html: string };\n\n"
    f"export const DIAPOS: DiapoHtml[] = {json.dumps(D, ensure_ascii=False, indent=2)};\n"
)
print(f"{len(D)} diapositivas → {out}")
