"""Genera app/pitch/skin-laundry-visual/diapos.ts: brief visual de Instagram para
Skin Laundry. La identidad que ya tiene la marca (espresso, crema y lima; serif
fina; logotipo centrado; antes y después sobre crema), afinada en un solo
sistema de plantillas, con mockups de cada pilar, el feed, los destacados en
formato catálogo y el storyboard de un reel.

Las plantillas se dibujan a tamaño de Instagram (1080 px de ancho) y se
escalan dentro de la diapositiva. Desde la raíz del repo:

    python3 scripts/build-skin-laundry-visual.py
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
PIE = "All About Management × Skin Laundry · Brief visual"

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


# ── Plantillas de publicación (lienzo de Instagram a 1080 px de ancho) ────
# Cada pieza se dibuja a tamaño real (1080 × alto) y se escala dentro de la
# diapositiva. Así las plantillas mantienen las proporciones reales.
M = 88  # margen interior de las publicaciones


def pieza(x, y, w, h_real, inner, radius=18, sombra=True, borde=None):
    s = w / 1080
    h = round(h_real * s)
    sh = "box-shadow:0 22px 50px rgba(60,32,29,.20);" if sombra else ""
    bd = f"outline:2px solid {borde};outline-offset:6px;" if borde else ""
    return (
        f'<div style="{pos(x, y)}width:{w}px;height:{h}px;overflow:hidden;border-radius:{radius}px;{sh}{bd}">'
        f'<div style="position:absolute;left:0;top:0;width:1080px;height:{h_real}px;transform:scale({s:.5f});transform-origin:0 0">'
        f"{inner}</div></div>"
    )


def _logo(dark_bg, top=70):
    f = "logo-crema.png" if dark_bg else "logo-negro.png"
    return f'<img src="{A}/{f}" alt="Skin Laundry" style="position:absolute;left:{(1080 - 250) // 2}px;top:{top}px;width:250px;height:auto">'


def _eyebrow(t, top, color):
    return (f'<p style="position:absolute;left:{M}px;top:{top}px;font-family:{SANS};font-size:26px;font-weight:600;'
            f'letter-spacing:5px;text-transform:uppercase;color:{color}">{t}</p>')


def _head(t, top, color, size=96, width=1080 - 2 * M):
    return (f'<p style="position:absolute;left:{M}px;top:{top}px;width:{width}px;font-family:{SERIF};font-weight:300;'
            f'font-size:{size}px;line-height:1.02;letter-spacing:-2px;color:{color}">{t}</p>')


def _cta(t, top, bg, color, left=M):
    return (f'<p style="position:absolute;left:{left}px;top:{top}px;padding:16px 30px;border-radius:999px;background:{bg};'
            f'font-family:{SANS};font-size:28px;font-weight:600;color:{color};white-space:nowrap">{t}</p>')


def _img(src, l, t, w, h, opos="50% 50%", radius=0):
    return (f'<img src="{A}/{src}" alt="" style="position:absolute;left:{l}px;top:{t}px;width:{w}px;height:{h}px;'
            f'object-fit:cover;object-position:{opos};border-radius:{radius}px">')


def t_foto(H, img, opos, eyebrow, head, cta=None, size=96):
    """Foto a sangre con degradado espresso abajo: reels y portadas de experiencia."""
    return (
        f'<div style="position:absolute;inset:0;background:{INK}"></div>'
        + _img(img, 0, 0, 1080, H, opos)
        + f'<div style="position:absolute;left:0;right:0;bottom:0;height:{int(H * .55)}px;background:linear-gradient(180deg,rgba(60,32,29,0),rgba(60,32,29,.88))"></div>'
        + _logo(True)
        + _eyebrow(eyebrow, H - 400 if not cta else H - 470, LIME)
        + _head(head, H - 350 if not cta else H - 420, CREAM, size)
        + (_cta(cta, H - 150, CREAM, INK) if cta else "")
    )


def t_retrato(H, eyebrow, head, firma, size=88):
    """Retrato de la doctora: hueco reservado para el rodaje en clínica."""
    return (
        f'<div style="position:absolute;inset:0;background:linear-gradient(160deg,#D9C4AF,#B99A80)"></div>'
        + f'<div style="position:absolute;left:{M}px;right:{M}px;top:200px;height:{int(H * .42)}px;border:3px dashed rgba(60,32,29,.45);border-radius:24px"></div>'
        + f'<p style="position:absolute;left:{M}px;right:{M}px;top:{200 + int(H * .21) - 30}px;text-align:center;font-family:{SANS};font-size:30px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:rgba(60,32,29,.6)">Retrato de la doctora<br>rodaje en clínica</p>'
        + f'<div style="position:absolute;left:0;right:0;bottom:0;height:{int(H * .5)}px;background:linear-gradient(180deg,rgba(60,32,29,0),rgba(60,32,29,.92))"></div>'
        + _logo(False)
        + _eyebrow(eyebrow, H - 470, LIME)
        + _head(head, H - 420, CREAM, size)
        + f'<p style="position:absolute;left:{M}px;top:{H - 150}px;font-family:{SANS};font-size:30px;font-weight:600;color:{CREAM}">{firma}</p>'
    )


def t_ba(H, par, eyebrow, head, cta=None, size=76):
    """Antes y después sobre crema: la seña de identidad de Skin Laundry, afinada."""
    iw = (1080 - 2 * M - 16) // 2
    ih = int(H * .44)
    top = 180
    return (
        f'<div style="position:absolute;inset:0;background:{CREAM}"></div>'
        + _logo(False)
        + _img(f"ba-{par}-antes.jpg", M, top, iw, ih, "50% 40%", 10)
        + _img(f"ba-{par}-despues.jpg", M + iw + 16, top, iw, ih, "50% 40%", 10)
        + f'<p style="position:absolute;left:{M}px;top:{top + ih + 18}px;font-family:{SANS};font-size:22px;letter-spacing:4px;text-transform:uppercase;color:{SOFT}">Antes</p>'
        + f'<p style="position:absolute;right:{M}px;top:{top + ih + 18}px;font-family:{SANS};font-size:22px;letter-spacing:4px;text-transform:uppercase;color:{SOFT}">Después</p>'
        + _eyebrow(eyebrow, top + ih + 110, CARAMEL)
        + _head(head, top + ih + 160, INK, size)
        + (_cta(cta, H - 150, INK, CREAM) if cta else "")
    )


def t_tipo(H, dark, eyebrow, head, sub=None, cta=None, size=120, foto=None, precio=None):
    """Tipográfica: dudas, ofertas y membresía. Fondo liso, nada más."""
    bg, fg, ey, sb = (INK, CREAM, LIME, "rgba(246,237,228,.75)") if dark else (CREAM, INK, CARAMEL, SOFT)
    out = f'<div style="position:absolute;inset:0;background:{bg}"></div>' + _logo(dark)
    y = 300
    if foto:
        out += _img(foto[0], M, 190, 1080 - 2 * M, int(H * .34), foto[1], 14)
        y = 190 + int(H * .34) + 90
    out += _eyebrow(eyebrow, y, ey) + _head(head, y + 56, fg, size)
    if precio:
        out += (f'<p style="position:absolute;left:{M}px;top:{H - 420}px;font-family:{SERIF};font-weight:300;font-size:150px;line-height:1;color:{fg}">{precio[0]}'
                f'<span style="font-size:56px;color:{sb};text-decoration:line-through;margin-left:28px">{precio[1]}</span></p>')
    if sub:
        out += f'<p style="position:absolute;left:{M}px;top:{H - 280}px;width:{1080 - 2 * M}px;font-family:{SANS};font-size:32px;line-height:1.35;color:{sb}">{sub}</p>'
    if cta:
        out += _cta(cta, H - 150, LIME if dark else INK, INK if dark else CREAM)
    return out


def t_lista(H, numero, titulo_t, texto_t, total):
    """Interior de carrusel: un punto por imagen, numerado."""
    return (
        f'<div style="position:absolute;inset:0;background:{CREAM}"></div>'
        + _logo(False)
        + f'<p style="position:absolute;left:{M}px;top:300px;font-family:{SERIF};font-weight:300;font-size:200px;line-height:1;color:{CARAMEL}">{numero}</p>'
        + _head(titulo_t, 560, INK, 84)
        + f'<p style="position:absolute;left:{M}px;top:{H - 470}px;width:{1080 - 2 * M}px;font-family:{SANS};font-size:34px;line-height:1.4;color:{SOFT}">{texto_t}</p>'
        + f'<p style="position:absolute;right:{M}px;top:{H - 120}px;font-family:{SANS};font-size:24px;letter-spacing:4px;color:{SOFT}">{numero} / {total}</p>'
    )


def etiqueta_pieza(t, x, y, w):
    return texto(t, x, y, w, 17, SOFT, 600, extra="letter-spacing:2px;text-transform:uppercase;text-align:center")


# ── Diapositivas ──────────────────────────────────────────────────────────
D = []


def add(id_, titulo_, html):
    D.append({"id": id_, "titulo": titulo_, "html": html.replace("§N§", f"{len(D) + 1:02d}")})


POST = 1350   # 4:5
REEL = 1920   # 9:16
GRID = 1440   # 3:4, como se ve en el perfil

# 01 · Portada
add(
    "portada",
    "Portada",
    sec(
        foto("laser-vertical.jpg", "Facial láser de Skin Laundry", 900, 0, 1020, 1080, opos="60% 40%")
        + logo(128, 128, 340)
        + eyebrow("Brief visual · Instagram", 128, 330)
        + titulo("La misma<br>Skin Laundry,<br><i>más afinada</i>", 128, 400, 760, 104, tag="h1")
        + texto("Cómo se verá la cuenta: la identidad que ya tiene la marca, con la coherencia de un solo sistema visual.",
                128, 760, 640, 28, SOFT)
        + texto("All About Management × Skin Laundry · Versión 1", 128, 960, 760, 22, SOFT,
                extra="letter-spacing:2px;text-transform:uppercase"),
        bg="#E2D0BE",
    ),
)

# 02 · Qué mantenemos y qué afinamos
mantener = [
    "Espresso, crema y lima: la paleta de la marca.",
    "Serif fina para titulares y sans para texto.",
    "El logotipo arriba y centrado en cada pieza.",
    "Piel real, luz cálida y fondos neutros.",
    "El antes y después sobre crema.",
]
afinar = [
    "Una plantilla por formato, siempre igual.",
    "La lima solo como acento, nunca de fondo.",
    "Márgenes y posiciones fijas en todas las piezas.",
    "Foto a sangre o fondo liso: nada de collages.",
    "Las ofertas con la misma línea que el resto.",
]


def col_lista(items, x, dark):
    fg = CREAM if dark else INK
    return "".join(
        texto(f'<span style="color:{LIME if dark else CARAMEL};margin-right:14px">—</span>{t}', x, 520 + i * 74, 760, 26, fg)
        for i, t in enumerate(items)
    )


add(
    "mantener-afinar",
    "Qué mantenemos y qué afinamos",
    sec(
        eyebrow("El punto de partida", 128, 128)
        + titulo("Mantener la identidad,<br><i>afinar el sistema</i>.", 128, 200, 1600, 80)
        + f'<div style="{pos(128, 400)}width:816px;height:540px;border-radius:24px;background:{SAND}"></div>'
        + f'<div style="{pos(976, 400)}width:816px;height:540px;border-radius:24px;background:{INK}"></div>'
        + texto("Lo que mantenemos", 176, 440, 700, 20, CARAMEL, 600, extra="letter-spacing:2px;text-transform:uppercase")
        + texto("Lo que afinamos", 1024, 440, 700, 20, LIME, 600, extra="letter-spacing:2px;text-transform:uppercase")
        + col_lista(mantener, 176, False)
        + col_lista(afinar, 1024, True)
        + pie(0),
    ),
)

# 03 · Paleta
paleta = [
    ("Crema", CREAM, "#F6EDE4", 55, "Fondo principal: aire y calma."),
    ("Espresso", INK, "#3C201D", 30, "Texto, fondos de contraste y ofertas."),
    ("Arena", SAND, "#EADFD3", 10, "Tarjetas y apoyos."),
    ("Lima", LIME, "#CDF765", 5, "Solo para señalar: una palabra, un CTA."),
]
bx = 128
barra = ""
for n, c, hx, pct, uso in paleta:
    w = round(1664 * pct / 100)
    fg = CREAM if c == INK else INK
    barra += f'<div style="{pos(bx, 380)}width:{w}px;height:300px;background:{c};{"box-shadow:inset 0 0 0 1px rgba(60,32,29,.15);" if c in (CREAM, SAND) else ""}"></div>'
    if w > 150:
        barra += texto(f"{pct} %", bx + 28, 610, 200, 30, fg, 600)
    bx += w
cards = ""
for i, (n, c, hx, pct, uso) in enumerate(paleta):
    x = 128 + i * 422
    cards += (
        f'<div style="{pos(x, 730)}width:36px;height:36px;border-radius:99px;background:{c};box-shadow:0 0 0 1px rgba(60,32,29,.2)"></div>'
        + f'<p style="{pos(x + 56, 726)}font-family:{SERIF};font-size:40px;font-weight:300;line-height:1">{n}</p>'
        + texto(f"{hx} · {pct} %", x, 790, 380, 18, SOFT, 600, extra="letter-spacing:2px")
        + texto(uso, x, 826, 380, 22, INK)
    )
add(
    "paleta",
    "Paleta",
    sec(
        eyebrow("Color", 128, 128)
        + titulo("La paleta de siempre, <i>con proporciones</i>.", 128, 200, 1600, 76)
        + barra
        + cards
        + pie(0),
    ),
)

# 04 · Tipografía
add(
    "tipografia",
    "Tipografía",
    sec(
        eyebrow("Tipografía", 128, 128)
        + titulo("Dos letras, <i>tres niveles</i>.", 128, 200, 1600, 76)
        + f'<div style="{pos(128, 360)}width:1100px;height:600px;border-radius:24px;background:{SAND}"></div>'
        + texto("Etiqueta · sans en mayúsculas", 176, 400, 900, 18, CARAMEL, 600, extra="letter-spacing:2px;text-transform:uppercase")
        + f'<p style="{pos(176, 440)}font-family:{SANS};font-size:28px;font-weight:600;letter-spacing:6px;text-transform:uppercase">Antes y después · Melasma</p>'
        + texto("Titular · serif fina, con cursiva en la palabra clave", 176, 530, 900, 18, CARAMEL, 600, extra="letter-spacing:2px;text-transform:uppercase")
        + f'<p style="{pos(176, 570)}width:1000px;font-family:{SERIF};font-size:100px;font-weight:300;line-height:1;letter-spacing:-2px">Your skin.<br><i>Our expertise.</i></p>'
        + texto("Texto · sans regular", 176, 800, 900, 18, CARAMEL, 600, extra="letter-spacing:2px;text-transform:uppercase")
        + texto("Frases cortas, tono cercano y médico a la vez. Nunca más de dos líneas de titular por pieza.", 176, 840, 980, 28, INK)
        + texto("Las de la marca", 1300, 380, 480, 18, SOFT, 600, extra="letter-spacing:2px;text-transform:uppercase")
        + f'<p style="{pos(1300, 420)}width:480px;font-family:{SERIF};font-size:54px;font-weight:300;line-height:1.05">Apris</p>'
        + texto("Titulares", 1300, 486, 480, 22, SOFT)
        + f'<p style="{pos(1300, 560)}width:480px;font-family:{SANS};font-size:46px;font-weight:500;line-height:1.05">Articulat</p>'
        + texto("Etiquetas y textos", 1300, 620, 480, 22, SOFT)
        + texto("Sin tipografías de campaña: Halloween o Black Friday se cuentan con la misma letra.", 1300, 720, 480, 22, INK, 600)
        + pie(0),
    ),
)

# 05 · Fotografía
fotos_si = [
    ("laser-vertical.jpg", "60% 40%", "La tecnología, de cerca"),
    ("mujer-perfil.jpg", "75% 40%", "Piel real, sin filtros"),
    ("inyeccion.jpg", "85% 40%", "Gesto médico, manos y detalle"),
    ("dos-mujeres.jpg", "74% 30%", "Caras del público objetivo"),
]
fs = ""
for i, (src, op, t) in enumerate(fotos_si):
    x = 128 + i * 340
    fs += foto(src, t, x, 360, 316, 420, opos=op, radius=16) + texto(t, x, 800, 316, 20, INK, 600)
no = ["Filtros y piel retocada", "Fondos de color o degradados", "Collages y rótulos sobre la cara", "Fotos de banco genéricas"]
ns = "".join(texto(f'<span style="color:{LIME};margin-right:12px">×</span>{t}', 1526, 424 + i * 96, 236, 22, CREAM) for i, t in enumerate(no))
add(
    "fotografia",
    "Fotografía",
    sec(
        eyebrow("Fotografía", 128, 128)
        + titulo("Luz cálida, <i>piel de verdad</i>.", 128, 200, 1600, 76)
        + fs
        + f'<div style="{pos(1490, 360)}width:302px;height:470px;border-radius:16px;background:{INK}"></div>'
        + texto("Lo que no", 1530, 380, 260, 18, LIME, 600, extra="letter-spacing:2px;text-transform:uppercase")
        + ns
        + texto("Las imágenes son de la campaña de Skin Laundry. A partir del primer rodaje, el feed se nutre de material propio de la clínica de Diagonal.",
                128, 900, 1600, 21, SOFT)
        + pie(0),
    ),
)

# 06 · Anatomía de una pieza
ejemplo = t_foto(POST, "laser-vertical.jpg", "60% 40%", "Tratamientos en vivo", "15 minutos,<br><i>de principio a fin</i>", cta="Reserva desde la bio")
notas = [
    (338, "Logotipo", "Arriba y centrado, siempre en el mismo sitio."),
    (470, "Imagen", "A sangre o fondo liso. Una sola imagen por pieza."),
    (640, "Etiqueta del pilar", "En lima sobre oscuro, en caramelo sobre crema."),
    (750, "Titular", "Serif fina, dos líneas como máximo, con una palabra en cursiva."),
    (860, "Llamada a la acción", "Abajo a la izquierda, en una pastilla."),
]
an = pieza(128, 330, 480, POST, ejemplo)
for yy, t, d in notas:
    an += (
        f'<div style="{pos(640, yy + 14)}width:300px;height:1px;background:{INK};opacity:.35"></div>'
        + f'<div style="{pos(632, yy + 8)}width:14px;height:14px;border-radius:99px;background:{LIME};box-shadow:0 0 0 2px {INK}"></div>'
        + texto(t, 980, yy, 400, 26, INK, 600)
        + texto(d, 980, yy + 38, 800, 22, SOFT)
    )
add(
    "anatomia",
    "La plantilla",
    sec(
        eyebrow("El sistema", 128, 128)
        + titulo("Una pieza, <i>cinco reglas</i>.", 128, 200, 1600, 76)
        + an
        + pie(0),
    ),
)

# 07–11 · Un pilar por diapositiva, con sus piezas
pilares = [
    ("antes-despues", "Antes y después", "El resultado, en crema y con el caso contado.",
     [("Portada de carrusel", POST, t_ba(POST, "melasma", "Antes y después · Melasma", "Tres sesiones,<br><i>una piel más uniforme</i>", cta="Comenta INFO")),
      ("Interior: el caso", POST, t_tipo(POST, True, "El caso", "«Quería recuperar<br>un tono <i>uniforme</i>»", sub="3 sesiones · 8 semanas · sin tiempo de recuperación", size=92)),
      ("Reel: la doctora lo explica", REEL, t_retrato(REEL, "Antes y después", "Así tratamos<br><i>las manchas</i>", "Dra. Nombre Apellido"))]),
    ("informativo", "Informativo", "Una duda por pieza, tipográfica y fácil de guardar.",
     [("Portada de carrusel", POST, t_tipo(POST, False, "Dudas de piel", "¿Piel seca<br>o <i>deshidratada</i>?", sub="Desliza para saber cuál es la tuya →", size=124)),
      ("Interior", POST, t_lista(POST, "01", "La piel seca<br><i>es un tipo</i>", "Produce menos grasa de forma natural. Se nota tirante y áspera, y necesita nutrición.", "05")),
      ("Reel: preguntas y respuestas", REEL, t_foto(REEL, "mujer-perfil.jpg", "75% 40%", "Nos habéis preguntado", "¿Cada cuánto<br><i>repetir el tratamiento</i>?"))]),
    ("equipo-medico", "Equipo médico", "La doctora como cara de la cuenta, siempre con su nombre.",
     [("Reel: la doctora responde", REEL, t_retrato(REEL, "La doctora responde", "«Lo que más<br>me piden <i>en otoño</i>»", "Dra. Nombre Apellido")),
      ("Portada de carrusel", POST, t_tipo(POST, False, "Consejo de la doctora", "Tres claves<br>para <i>esta temporada</i>", foto=("inyeccion.jpg", "85% 40%"), size=84)),
      ("Interior", POST, t_lista(POST, "02", "Protege antes<br><i>de tratar</i>", "Cada tratamiento empieza con una valoración. Así sabemos qué necesita tu piel y qué no.", "03"))]),
    ("tratamientos", "Tratamientos en vivo", "La experiencia desde dentro: foto a sangre y texto mínimo.",
     [("Reel: la sesión completa", REEL, t_foto(REEL, "laser-vertical.jpg", "60% 40%", "En vivo", "15 minutos,<br><i>de principio a fin</i>")),
      ("Portada de carrusel", POST, t_foto(POST, "laser-beige.jpg", "70% 40%", "Paso a paso", "Qué pasa<br><i>en tu sesión</i>")),
      ("Interior", POST, t_lista(POST, "01", "Valoración<br><i>de tu piel</i>", "Antes de empezar, revisamos tu piel y te explicamos qué vamos a hacer y qué vas a notar.", "04"))]),
    ("ofertas", "Ofertas y membresía", "Las campañas con la misma línea: espresso, serif y un solo acento.",
     [("Campaña", POST, t_tipo(POST, True, "Black Friday", "Tu primer láser,<br><i>solo esta semana</i>", precio=("75 €", "250 €"), cta="Reserva desde la bio", size=96)),
      ("Membresía", POST, t_tipo(POST, False, "Membresía", "Tu piel,<br><i>cada mes</i>", foto=("dos-mujeres.jpg", "74% 30%"), cta="Descubre qué incluye", size=96)),
      ("Reel: la primera visita", REEL, t_foto(REEL, "inyeccion.jpg", "85% 40%", "Primera visita", "Así es<br><i>tu primera vez</i>", cta="Escríbenos por WhatsApp"))]),
]
for i, (pid, n, desc, piezas) in enumerate(pilares):
    body = ""
    AH = 570  # alto disponible para las piezas
    ws = [round(AH * 1080 / H) for _, H, _ in piezas]
    gap = 90
    x = 128 + (1664 - sum(ws) - gap * (len(ws) - 1)) // 2
    for (etq, H, inner), w in zip(piezas, ws):
        body += pieza(x, 320, w, H, inner) + etiqueta_pieza(etq, x - 20, 915, w + 40)
        x += w + gap
    add(
        f"pilar-{pid}",
        n,
        sec(
            eyebrow(f"Pilar {i + 1} de 5", 128, 128)
            + titulo(n, 128, 190, 1600, 80)
            + texto(desc, 1340, 220, 450, 24, SOFT)
            + body
            + pie(0),
        ),
    )

# 12 · El feed
tiles = [
    t_ba(GRID, "melasma", "Antes y después", "Tres sesiones,<br><i>un tono uniforme</i>", size=80),
    t_foto(GRID, "laser-vertical.jpg", "60% 40%", "En vivo", "15 minutos,<br><i>de principio a fin</i>", size=92),
    t_tipo(GRID, False, "Dudas de piel", "¿Seca o<br><i>deshidratada</i>?", size=120),
    t_retrato(GRID, "La doctora responde", "«Lo que más<br>me piden»", "Dra. Nombre Apellido", size=84),
    t_tipo(GRID, True, "Black Friday", "Tu primer láser,<br><i>esta semana</i>", precio=("75 €", "250 €"), size=88),
    t_foto(GRID, "mujer-perfil.jpg", "75% 40%", "Nos habéis preguntado", "¿Cada cuánto<br><i>repetir</i>?", size=92),
    t_tipo(GRID, False, "Membresía", "Tu piel,<br><i>cada mes</i>", foto=("dos-mujeres.jpg", "74% 30%"), size=92),
    t_ba(GRID, "manchas", "Antes y después", "Manchas<br><i>tras el verano</i>", size=80),
    t_foto(GRID, "inyeccion.jpg", "85% 40%", "Primera visita", "Así es<br><i>tu primera vez</i>", size=92),
    t_tipo(GRID, True, "Consejo de la doctora", "Protege<br><i>antes de tratar</i>", size=110),
    t_foto(GRID, "laser-beige.jpg", "70% 40%", "Paso a paso", "Qué pasa<br><i>en tu sesión</i>", size=92),
    t_ba(GRID, "acne", "Antes y después", "Marcas de acné,<br><i>cinco sesiones</i>", size=80),
]
tw = 124
th = round(GRID * tw / 1080)
grid = ""
gx, gy = 1380, 330
for i, inner in enumerate(tiles):
    c, r = i % 3, i // 3
    grid += pieza(gx + c * (tw + 4), gy + r * (th + 4), tw, GRID, inner, radius=0, sombra=False)
hoy = ["ig-vogue.jpg", "ig-promo-75.jpg", "ig-ba-cara.jpg", "ig-ba-labios.jpg", "ig-resenas.jpg", "ig-ba-melasma.jpg",
       "ig-halloween.jpg", "ig-que-laser.jpg", "ig-glowtox.jpg", "ig-sudoracion.jpg", "ig-bronceado.jpg", "ig-membresias.jpg"]
hx = 840
grid_hoy = "".join(foto(src, "Publicación actual de Skin Laundry", hx + (i % 3) * (tw + 4), gy + (i // 3) * (th + 4), tw, th)
                   for i, src in enumerate(hoy))
add(
    "feed",
    "El feed",
    sec(
        eyebrow("El feed", 128, 128)
        + titulo("Un mes,<br><i>un solo sistema</i>.", 128, 200, 700, 80)
        + texto("Los cinco pilares mezclados y una misma línea: crema, espresso y foto a sangre se alternan para dar ritmo sin perder coherencia.",
                128, 420, 600, 26, SOFT)
        + texto("Propuesta con imágenes de campaña y antes y después de la web de Skin Laundry. Textos de ejemplo.",
                128, 880, 600, 20, SOFT)
        + texto("Hoy", hx, 290, 380, 18, SOFT, 600, extra="letter-spacing:2px;text-transform:uppercase")
        + texto("Propuesta", gx, 290, 380, 18, CARAMEL, 600, extra="letter-spacing:2px;text-transform:uppercase")
        + grid_hoy
        + f'<p style="{pos(1252, 560)}font-family:{SERIF};font-size:64px;font-weight:300;color:{CARAMEL}">→</p>'
        + grid
        + pie(0),
    ),
)

# 13 · Destacados y bio
destacados = ["Reservar", "Láser", "Inyectables", "Faciales", "Corporal", "Resultados", "Membresía", "Precios"]
dg = ""
for i, n in enumerate(destacados):
    x = 128 + i * 208
    dark = n == "Reservar"
    bg, fg = (INK, LIME) if dark else (CREAM, INK)
    dg += (
        f'<div style="{pos(x, 640)}width:160px;height:160px;border-radius:999px;background:{bg};box-shadow:0 0 0 3px {CREAM},0 0 0 5px rgba(60,32,29,.35)"></div>'
        + f'<p style="{pos(x, 700)}width:160px;text-align:center;font-family:{SERIF};font-style:italic;font-size:30px;font-weight:300;color:{fg}">{n}</p>'
        + texto(n, x - 20, 822, 200, 20, INK, 600, extra="text-align:center")
    )
bio = (
    f'<div style="{pos(128, 330)}width:1664px;height:250px;border-radius:24px;background:#FFFFFF;box-shadow:0 18px 40px rgba(60,32,29,.10)"></div>'
    + f'<img src="{A}/logo-skinlaundry.png" alt="Skin Laundry" style="{pos(170, 370)}width:150px;height:150px;border-radius:999px">'
    + texto("<b>skinlaundry_es</b>", 360, 372, 600, 28, INK)
    + texto("Láser facial y medicina estética · Barcelona<br>Primera valoración en clínica · Lun–Sáb<br>Diagonal 610", 360, 420, 760, 23, INK)
    + f'<p style="{pos(1180, 380)}padding:14px 30px;border-radius:999px;background:{INK};color:{CREAM};font-size:22px;font-weight:600">Reservar cita</p>'
    + f'<p style="{pos(1440, 380)}padding:14px 30px;border-radius:999px;background:{LIME};color:{INK};font-size:22px;font-weight:600">WhatsApp</p>'
    + texto("Reserva y WhatsApp a un toque desde la bio.", 1180, 460, 560, 20, SOFT)
)
add(
    "destacados",
    "Destacados y bio",
    sec(
        eyebrow("El perfil", 128, 128)
        + titulo("Destacados <i>en formato catálogo</i>.", 128, 200, 1600, 76)
        + bio
        + dg
        + texto("Una portada por categoría, con la misma tipografía. Dentro de cada una: qué es, para quién, precio y cómo reservar. "
                "Las categorías definitivas las cerramos con la clínica.", 128, 900, 1660, 21, SOFT)
        + pie(0),
    ),
)

# 14 · Storyboard de un reel
frames = [
    ("0–2 s", "El gancho", t_ba(REEL, "manchas", "Antes y después", "Tres sesiones.<br><i>Mira la diferencia.</i>", size=84)),
    ("2–8 s", "La doctora", t_retrato(REEL, "El caso", "«Venía por<br>las manchas<br><i>del verano</i>»", "Dra. Nombre Apellido", size=80)),
    ("8–15 s", "El tratamiento", t_foto(REEL, "laser-vertical.jpg", "60% 40%", "En la sesión", "15 minutos,<br><i>sin parar tu día</i>", size=86)),
    ("15–20 s", "El resultado", t_foto(REEL, "mujer-perfil.jpg", "75% 40%", "El resultado", "Una piel<br><i>más uniforme</i>", size=86)),
    ("20–23 s", "La acción", t_tipo(REEL, True, "¿Es para ti?", "Comenta<br><i>INFO</i>", sub="Y te escribimos con todos los detalles.", cta="Comenta INFO", size=140)),
]
sb = ""
for i, (t, n, inner) in enumerate(frames):
    x = 128 + i * 336
    sb += (
        pieza(x, 330, 300, REEL, inner)
        + texto(t, x, 880, 300, 18, CARAMEL, 600, extra="letter-spacing:2px;text-transform:uppercase")
        + texto(n, x, 910, 300, 24, INK, 600)
    )
add(
    "storyboard",
    "Storyboard de un reel",
    sec(
        eyebrow("Un reel, plano a plano", 128, 128)
        + titulo("Antes y después <i>con la doctora</i>.", 128, 200, 1600, 76)
        + sb
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
        + texto("All About Management × Skin Laundry · Barcelona", 128, 960, 940, 22, SOFT,
                extra="letter-spacing:2px;text-transform:uppercase"),
        bg="#E3D1BC",
    ),
)

out = Path(__file__).resolve().parent.parent / "app/pitch/skin-laundry-visual/diapos.ts"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(
    "/**\n * Brief visual de Instagram para Skin Laundry: identidad afinada, plantillas por\n"
    " * pilar, feed, destacados y storyboard. Generado con scripts/build-skin-laundry-visual.py:\n"
    " * si cambia el contenido, se edita el script y se vuelve a ejecutar.\n */\n\n"
    'import type { DiapoHtml } from "../skin-laundry/diapos";\n\n'
    f"export const DIAPOS: DiapoHtml[] = {json.dumps(D, ensure_ascii=False, indent=2)};\n"
)
print(f"{len(D)} diapositivas → {out}")
