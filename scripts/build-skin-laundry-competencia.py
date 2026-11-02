"""Diapositivas de competencia en Instagram de Skin Laundry Barcelona: las
cuentas de la competencia, las fichas y el mapa con el hueco que nadie ocupa.

No genera una presentación propia: scripts/build-skin-laundry.py importa D y
mete estas diapositivas en la parte 2 de /pitch/skin-laundry. Mismo lienzo e
identidad (espresso, crema y lima; Newsreader Light y Figtree). Las cifras
salen de los perfiles públicos el 2 de noviembre de 2026 (últimos 12 reels de
cada cuenta). Para regenerar, se ejecuta el script principal:

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
SOFT = "#7A5C55"
SOFT_D = "rgba(246,237,228,.72)"
SERIF = "Newsreader, Georgia, serif"
SANS = "Figtree, Arial, sans-serif"
PIE = "All About Management × Skin Laundry · Competencia en Instagram"

# ── Datos (perfiles públicos, 2 de noviembre de 2026) ─────────────────────
# (cuenta, usuario, tipo, seguidores, reels/semana, mediana de visualizaciones,
#  rango de «me gusta» por reel, es_skin_laundry)
IG = [
    ("Skin Laundry", "@skinlaundry_es", "Láser facial", 9540, "1,7", 2400, "7–28", True),
    ("Clínicas Dorsia", "@clinicasdorsia", "Cadena de medicina y cirugía", 295000, "3,5", 55000, "81–270", False),
    ("Hydrafacial España", "@hydrafacial_es", "Marca de tecnología facial", 94000, "2", 7900, "21–107", False),
    ("Clínica Planas", "@clinicaplanas", "Cirugía y medicina premium", 89000, "5–6", 17800, "44–489", False),
    ("Santé Clinics", "@sante.clinics", "Medicina estética y longevidad", 32000, "1", 11800, "52–349", False),
    ("Work Your Face", "@workyourface", "Gimnasio facial", 20000, "1,6", 2000, "14–51", False),
    ("Toral Clinic", "@toralclinic", "Medicina estética · Diagonal 598", 5584, "2", 1400, "18–53", False),
    ("The Light Bar", "@thelightbarsalon", "Facial bar LED · Sarrià", 3295, "Irregular", 1800, "11–56", False),
]
# (cuenta, seguidores, vídeos, visualizaciones recientes, es_skin_laundry)
TT = [
    ("Clínicas Dorsia", 59900, "1.182", "400–2.300", False),
    ("Clínica Planas", 31000, "883", "650–8.000 · fijados hasta 1,2 M", False),
    ("Work Your Face", 660, "179", "400–1.500", False),
    ("Skin Laundry", 187, "246", "300–1.100", True),
    ("Toral Clinic", 162, "123", "—", False),
    ("The Light Bar", 66, "57", "—", False),
]


# ── Piezas (las mismas que el análisis de Skin Laundry) ───────────────────
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
    c = acento or "inherit"
    sub = SOFT_D if dark else SOFT
    return (
        f'<div style="{pos(left, top)}width:{w}px">'
        f'<p style="font-family:{SERIF};font-weight:300;font-size:{size}px;line-height:1;letter-spacing:-3px;color:{c}">{valor}</p>'
        f'<p style="margin-top:18px;font-size:24px;line-height:1.35;color:{sub}">{etiqueta}</p></div>'
    )


def linea(left, top, w, color=INK, alpha=0.18):
    return f'<div style="{pos(left, top)}width:{w}px;height:1px;background:{color};opacity:{alpha}"></div>'


def miles(v):
    return f"{v:,}".replace(",", ".")


def corto(v):
    if v >= 1000:
        k = v / 1000
        s = f"{k:.1f}".rstrip("0").rstrip(".").replace(".", ",")
        return f"{s}K"
    return str(v)


def pastilla(t, left, top, bg=LIME, color=INK, size=22):
    return (
        f'<p style="{pos(left, top)}padding:10px 22px;border-radius:999px;background:{bg};color:{color};'
        f'font-size:{size}px;font-weight:600;letter-spacing:1px;white-space:nowrap">{t}</p>'
    )


def etiqueta(t, left, top, width, color=SOFT, align="left"):
    return texto(t, left, top, width, 18, color, 600,
                 extra=f"letter-spacing:2px;text-transform:uppercase;text-align:{align}")


# ── Diapositivas ──────────────────────────────────────────────────────────
D = []


def add(id_, titulo_, html):
    D.append({"id": id_, "titulo": titulo_, "html": html})


# 01 · Portada
add(
    "portada",
    "Portada",
    sec(
        foto("laser-beige.jpg", "Facial láser de Skin Laundry", 900, 0, 1020, 1080, opos="62% 50%")
        + logo(128, 128, 340)
        + eyebrow("Competencia en Instagram · Noviembre 2026", 128, 330)
        + titulo("Quién más<br>habla de piel<br><i>en Barcelona</i>", 128, 400, 820, 96, tag="h1")
        + texto(
            "Los principales competidores de Skin Laundry en Instagram y el hueco que nadie ocupa.",
            128, 760, 660, 30, SOFT,
        )
        + texto("All About Management × Skin Laundry · Noviembre 2026", 128, 960, 760, 22, SOFT,
                extra="letter-spacing:2px;text-transform:uppercase"),
        bg="#E2D0BE",
    ),
)

# 02 · A quién hemos mirado
circulos = [
    ("Competencia directa", "Medicina estética y láser facial en Barcelona",
     "Toral Clinic · Santé Clinics · Clínica Planas · Clínicas Dorsia",
     "Toral está en Diagonal 598, a cien metros de la clínica. Santé, en Diagonal 384."),
    ("Competencia de concepto", "Facial rápido, por hábito o por suscripción",
     "Work Your Face · The Light Bar",
     "El gimnasio facial nacido en Barcelona y un facial bar de luz LED en Sarrià."),
    ("Marca de categoría", "La idea de «facial express» que ya tiene el cliente",
     "Hydrafacial España",
     "La tecnología más conocida del sector, presente en muchas clínicas de la ciudad."),
]
cg = ""
for i, (t, s, quien, d) in enumerate(circulos):
    x = 128 + i * 568
    bg = INK if i == 0 else SAND
    fg = CREAM if i == 0 else INK
    sub = SOFT_D if i == 0 else SOFT
    cg += (
        f'<div style="{pos(x, 380)}width:536px;height:480px;border-radius:24px;background:{bg}"></div>'
        f'<p style="{pos(x + 40, 420)}font-size:20px;font-weight:600;letter-spacing:2px;color:{LIME if i == 0 else CARAMEL}">0{i + 1}</p>'
        f'<p style="{pos(x + 40, 460)}width:460px;font-family:{SERIF};font-size:48px;font-weight:300;line-height:1.05;color:{fg}">{t}</p>'
        + texto(s, x + 40, 580, 456, 24, sub)
        + texto(f"<b>{quien}</b>", x + 40, 680, 456, 26, fg)
        + texto(d, x + 40, 770, 456, 21, sub)
    )
add(
    "quien",
    "A quién hemos mirado",
    sec(
        eyebrow("A quién hemos mirado", 128, 128)
        + titulo("Siete cuentas, <i>tres círculos</i>.", 128, 200, 1600, 84)
        + cg
        + texto(
            "Perfiles públicos consultados el 2 de noviembre de 2026: seguidores, publicaciones y los últimos 12 reels de cada cuenta. "
            "Como referencia, Skin Laundry global (354.000 seguidores), Glowbar (62.000) y FaceGym (830.000).",
            128, 900, 1660, 20, SOFT,
        )
        + pie(2),
    ),
)

# 03 · En una frase
claves = [
    "Nadie en Barcelona comunica «facial láser en 15 minutos, como hábito». El territorio está libre.",
    "Los grandes compran alcance: decenas de miles de reproducciones y apenas cien o doscientos «me gusta».",
    "La mecánica que más se repite es «Comenta X y te lo enviamos por mensaje». Convierte interacción en reservas.",
    "Las caras médicas funcionan. El reel de Skin Laundry con más «me gusta» es la colaboración con una doctora.",
]
dg = ""
for i, t in enumerate(claves):
    y = 420 + i * 104
    dg += (
        f'<div style="{pos(128, y + 14)}width:14px;height:14px;border-radius:99px;background:{LIME}"></div>'
        + texto(t, 176, y, 920, 28, CREAM)
    )
add(
    "resumen",
    "En una frase",
    sec(
        foto("mujer-perfil.jpg", "Retrato de campaña de Skin Laundry", 1200, 0, 720, 1080, opos="72% 50%")
        + eyebrow("En una frase", 128, 128, color=CREAM)
        + titulo("Hay mucho ruido,<br>pero <i>el hueco está libre</i>.", 128, 200, 1000, 80, color=CREAM)
        + dg
        + pie(3, dark=True, right=780),
        bg=INK,
        color=CREAM,
    ),
)

# 04 · Instagram comparativa
cols = [(128, "Cuenta"), (640, "Seguidores"), (860, "Reels/semana"), (1080, "Reproducciones por reel"), (1560, "«Me gusta» por reel")]
filas = "".join(etiqueta(t, x, 380, 400) for x, t in cols)
filas += linea(128, 420, 1664)
mx = max(r[5] for r in IG)
for i, (c, u, tipo, seg, rs, med, lk, sl) in enumerate(IG):
    y = 440 + i * 64
    if sl:
        filas += f'<div style="{pos(108, y - 4)}width:1704px;height:60px;border-radius:12px;background:{LIME}"></div>'
    filas += (
        texto(f"<b>{c}</b> <span style=\"color:{SOFT};font-size:19px\">{tipo}</span>", 128, y + 6, 520, 24)
        + texto(miles(seg), 640, y + 6, 200, 24, weight=600)
        + texto(rs, 860, y + 6, 200, 24)
    )
    bw = max(8, round(med / mx * 340))
    filas += (
        f'<div style="{pos(1080, y + 16)}width:{bw}px;height:22px;border-radius:6px;background:{INK if sl else CARAMEL}"></div>'
        + texto(corto(med), 1080 + bw + 16, y + 6, 120, 24, weight=600)
        + texto(lk, 1560, y + 6, 220, 24)
    )
add(
    "ig-comparativa",
    "Instagram · Comparativa",
    sec(
        eyebrow("Instagram · Comparativa", 128, 128)
        + titulo("Por tamaño, Skin Laundry juega<br>en la liga de <i>Work Your Face</i>.", 128, 200, 1600, 76)
        + filas
        + texto("Mediana de reproducciones de los últimos 12 reels. Incluye contenido promocionado, que desde fuera no se puede separar.",
                128, 960, 1600, 20, SOFT)
        + pie(4),
    ),
)

# 05 · Alcance comprado
pares = [
    ("Clínicas Dorsia", "55K", "≈150", "reproducciones · «me gusta» por reel"),
    ("Hydrafacial España", "174K", "107", "su reel más visto del trimestre"),
    ("Clínica Planas", "236K", "200", "su reel más visto de octubre"),
]
pg = ""
for i, (c, v, l, nota) in enumerate(pares):
    x = 128 + i * 568
    pg += (
        f'<p style="{pos(x, 470)}font-size:22px;letter-spacing:2px;text-transform:uppercase;font-weight:600;color:{LIME}">{c}</p>'
        f'<p style="{pos(x, 520)}font-family:{SERIF};font-weight:300;font-size:120px;line-height:1;letter-spacing:-3px">{v}</p>'
        f'<p style="{pos(x, 660)}font-family:{SERIF};font-weight:300;font-size:56px;line-height:1;color:{PEACH}">{l} «me gusta»</p>'
        + texto(nota, x, 740, 480, 22, SOFT_D)
    )
add(
    "alcance",
    "Alcance comprado",
    sec(
        eyebrow("Lo que no se ve", 128, 128, color=CREAM)
        + titulo("Las cifras de los grandes<br><i>vienen con pauta</i>.", 128, 200, 1500, 84, color=CREAM)
        + pg
        + linea(128, 840, 1664, CREAM, 0.2)
        + texto(
            "Cuando un reel suma decenas de miles de reproducciones y apenas cien «me gusta», casi seguro es contenido promocionado. "
            "Es un listón que no se alcanza en orgánico: conviene tenerlo claro antes de comparar cifras.",
            128, 870, 1500, 26, SOFT_D,
        )
        + pie(5, dark=True),
        bg=INK,
        color=CREAM,
    ),
)

# 07–10 · Fichas
def ficha(x, y, w, nombre, usuario, seg, hacen, funciona, debil, tomar, dark=False):
    bg = INK if dark else SAND
    fg = CREAM if dark else INK
    sub = SOFT_D if dark else SOFT
    ac = LIME if dark else CARAMEL
    h = 560
    out = (
        f'<div style="{pos(x, y)}width:{w}px;height:{h}px;border-radius:24px;background:{bg}"></div>'
        f'<p style="{pos(x + 44, y + 40)}font-family:{SERIF};font-size:52px;font-weight:300;line-height:1;color:{fg}">{nombre}</p>'
        + texto(f"{usuario} · {seg}", x + 44, y + 108, w - 88, 20, sub, 600, extra="letter-spacing:1px")
    )
    filas = [("Qué hacen", hacen), ("Qué les funciona", funciona), ("Punto débil", debil), ("Qué tomar", tomar)]
    for i, (k, v) in enumerate(filas):
        yy = y + 168 + i * 96
        out += (
            texto(k, x + 44, yy, 220, 17, ac, 600, extra="letter-spacing:2px;text-transform:uppercase")
            + texto(v, x + 260, yy - 4, w - 304, 21, fg)
        )
    return out


def diapo_fichas(n, id_, eyebrow_t, titulo_t, a, b):
    return sec(
        eyebrow(eyebrow_t, 128, 128)
        + titulo(titulo_t, 128, 200, 1600, 76)
        + ficha(128, 380, 816, *a)
        + ficha(976, 380, 816, *b, dark=True)
        + pie(n),
    )


add(
    "grandes",
    "Fichas · Los grandes",
    diapo_fichas(
        7, "grandes", "Competencia directa · Los grandes",
        "Volumen, dinámicas y <i>captación por mensaje</i>.",
        ("Clínicas Dorsia", "@clinicasdorsia", "295.000",
         "3–4 reels a la semana: tratamientos corporales, humor y sorteos.",
         "Las dinámicas disparan comentarios (hasta 781). Ya anuncian Black Friday.",
         "Mucho alcance de pago con poca conexión. Casi nada facial.",
         "Una dinámica de comentario al mes y Black Friday preparado ya."),
        ("Clínica Planas", "@clinicaplanas", "89.000",
         "5–6 reels a la semana con «Comenta MIA y te enviamos la información».",
         "Cada reel capta leads por mensaje.",
         "Foco en cirugía, lejos del cuidado facial diario.",
         "La palabra clave con respuesta automática y el «así lo vivió»."),
    ),
)
add(
    "diagonal",
    "Fichas · Diagonal",
    diapo_fichas(
        8, "diagonal", "Competencia directa · Diagonal",
        "Los vecinos: <i>premium</i> y con bata blanca.",
        ("Santé Clinics", "@sante.clinics · Diagonal 384", "32.000",
         "Un reel a la semana, bilingüe. Posicionamiento de longevidad: «Become superhuman».",
         "Los tours por la clínica, sus reels más vistos (17.700) y con más «me gusta» (349).",
         "Poca frecuencia: un reel a la semana.",
         "Mismo público internacional de Diagonal. El tour y la visita real funcionan."),
        ("Toral Clinic", "@toralclinic · Diagonal 598", "5.584",
         "La marca no publica desde 2023: todo sale con la cuenta de su doctora, dos veces por semana.",
         "La autoridad médica. Un reel sobre neuromoduladores llegó a 35.500.",
         "20–50 «me gusta» por reel y una marca de clínica casi invisible.",
         "Están empujando el otoño (IPL, manchas). Ganarles con un formato más rápido y visual."),
    ),
)
add(
    "concepto",
    "Fichas · Concepto",
    diapo_fichas(
        9, "concepto", "Competencia de concepto",
        "Los que venden <i>hábito y experiencia</i>.",
        ("Work Your Face", "@workyourface", "20.000",
         "El gimnasio facial de Barcelona: packs del mes, add-ons y colaboraciones como Foreo.",
         "El lenguaje de entreno y constancia, muy cerca de la lógica de membresía.",
         "Alcance modesto: unas 2.000 reproducciones por reel.",
         "Los «packs del mes». Están en cifras parecidas: el listón es alcanzable."),
        ("The Light Bar", "@thelightbarsalon · Sarrià", "3.295",
         "Faciales LED a medida, contenido educativo sobre luz y planes especiales.",
         "«Bridal Squad»: el plan entre amigas antes de la boda, su reel más visto (11.800).",
         "Publicación muy irregular: parón de abril a noviembre de 2026.",
         "Los planes en grupo, un ángulo que nadie trabaja de forma constante."),
    ),
)

# 10 · Hydrafacial
add(
    "hydrafacial",
    "Ficha · Hydrafacial",
    sec(
        foto("dos-mujeres.jpg", "Dos clientas sonriendo, imagen de campaña", 1200, 0, 720, 1080, opos="74% 30%")
        + eyebrow("Marca de categoría", 128, 128)
        + titulo("Hydrafacial ya ocupa<br>la idea de <i>facial express</i>.", 128, 200, 1000, 80)
        + cifra("94.000", "seguidores de @hydrafacial_es", 128, 450, 320, size=88)
        + cifra("~2", "reels a la semana", 470, 450, 260, size=88)
        + cifra("0–6", "comentarios por reel", 760, 450, 300, size=88)
        + linea(128, 640, 960)
        + texto("<b>Qué hacen.</b> Marca de tecnología: resultado en una sesión, personalización, otoño y tratamiento capilar.", 128, 670, 960, 24)
        + texto("<b>Punto débil.</b> Mensaje genérico y casi cero conversación: no es un sitio al que ir.", 128, 750, 960, 24)
        + texto("<b>Qué tomar.</b> Explicar en qué se diferencia el láser de 15 minutos de un Hydrafacial. "
                "Esa comparación ya está en la cabeza del público.", 128, 830, 960, 24, CARAMEL, 600)
        + pie(10, right=820),
    ),
)

# 11 · Mapa
X0, Y0, W, H = 760, 330, 1000, 600
mapa = (
    f'<div style="{pos(X0, Y0)}width:{W}px;height:{H}px;border-radius:24px;background:{SAND}"></div>'
    f'<div style="{pos(X0 + W // 2, Y0 + 30)}width:1px;height:{H - 60}px;background:{INK};opacity:.25"></div>'
    f'<div style="{pos(X0 + 30, Y0 + H // 2)}width:{W - 60}px;height:1px;background:{INK};opacity:.25"></div>'
    + etiqueta("Clínica médica", X0 + 30, Y0 + H + 16, 300)
    + etiqueta("Ritual y experiencia", X0 + W - 330, Y0 + H + 16, 300, align="right")
    + etiqueta("↑ Rápido · hábito", X0 + W - 330, Y0 + 24, 300, align="right")
    + etiqueta("↓ Largo · puntual", X0 + W - 330, Y0 + H - 48, 300, align="right")
)
puntos = [
    ("Planas", 0.12, 0.85), ("Dorsia", 0.22, 0.72), ("Santé", 0.30, 0.82), ("Toral", 0.20, 0.60),
    ("Hydrafacial", 0.55, 0.45), ("Work Your Face", 0.78, 0.40), ("The Light Bar", 0.72, 0.70),
]
for n, px, py in puntos:
    x, y = X0 + round(px * W), Y0 + round(py * H)
    mapa += (
        f'<div style="{pos(x - 10, y - 10)}width:20px;height:20px;border-radius:99px;background:{CARAMEL}"></div>'
        + texto(n, x + 18, y - 18, 220, 22, INK, 600)
    )
sx, sy = X0 + round(0.22 * W), Y0 + round(0.16 * H)
mapa += (
    f'<div style="{pos(sx - 70, sy - 70)}width:140px;height:140px;border-radius:99px;border:3px dashed {INK};opacity:.5"></div>'
    f'<div style="{pos(sx - 14, sy - 14)}width:28px;height:28px;border-radius:99px;background:{LIME};box-shadow:0 0 0 4px {INK}"></div>'
    + texto("<b>Skin Laundry</b>", sx + 84, sy - 20, 260, 26)
)
add(
    "mapa",
    "Dónde está Skin Laundry",
    sec(
        eyebrow("Dónde está Skin Laundry", 128, 128)
        + titulo("El cuadrante<br>que <i>nadie ocupa</i>.", 128, 200, 600, 84)
        + texto(
            "Médico y rápido a la vez: rigor de clínica con la lógica de un hábito mensual. "
            "Las clínicas venden tratamientos largos y puntuales; los conceptos de experiencia, ritual sin bata.",
            128, 470, 560, 26, SOFT,
        )
        + texto(
            "Hoy, en redes, Skin Laundry se parece demasiado a las clínicas: ácido hialurónico y neuromoduladores, "
            "terreno donde Santé, Toral o Dorsia hablan igual o más fuerte.",
            128, 720, 560, 22, INK, 600,
        )
        + mapa
        + pie(11),
    ),
)

# 12 · Oportunidades
ops = [
    ("Adueñarse de los 15 minutos", "Cronómetro en pantalla, antes y después sin filtro, el «facial de la hora de comer» en Diagonal."),
    ("Una cara médica propia", "La doctora del centro como voz recurrente, con dudas y mitos. Es lo que mejor ha funcionado."),
    ("Comenta y te escribimos", "«Comenta GLOW y te enviamos tu primer láser por 75 €», con respuesta automática por mensaje."),
    ("Diferenciarse", "Láser de 15 minutos frente a Hydrafacial y frente a la clínica clásica: ocupar una búsqueda que ya existe."),
    ("Planes en grupo", "Amigas, novias, after-work en Diagonal. Nadie lo trabaja de forma constante."),
    ("TikTok nativo", "Menos volumen y formato propio de TikTok. Y la campaña de Black Friday, lista ya: Dorsia la anuncia desde el 30 de octubre."),
]
og = ""
for i, (t, d) in enumerate(ops):
    col, row = i % 3, i // 3
    x, y = 128 + col * 568, 400 + row * 280
    og += (
        f'<p style="{pos(x, y)}font-size:20px;font-weight:600;letter-spacing:2px;color:{CARAMEL}">0{i + 1}</p>'
        f'<p style="{pos(x, y + 40)}width:520px;font-family:{SERIF};font-size:44px;font-weight:300;line-height:1.05">{t}</p>'
        + texto(d, x, y + 108, 500, 22, SOFT)
    )
add(
    "oportunidades",
    "Oportunidades",
    sec(
        eyebrow("Qué hacemos con esto", 128, 128)
        + titulo("Seis movimientos para <i>ganar el hueco</i>.", 128, 200, 1600, 80)
        + og
        + pie(12),
    ),
)

# 13 · Cierre
add(
    "cierre",
    "Cierre",
    sec(
        foto("inyeccion.jpg", "Tratamiento de medicina estética en Skin Laundry", 1105, 0, 815, 1080, opos="100% 40%")
        + logo(128, 128, 340)
        + titulo("Fifteen minutes.<br><i>Nobody else.</i>", 128, 380, 900, 120, tag="h2")
        + texto("El hueco está libre. Ahora toca ocuparlo.", 128, 680, 640, 34, SOFT)
        + texto("All About Management × Skin Laundry · Barcelona, noviembre de 2026", 128, 960, 940, 22, SOFT,
                extra="letter-spacing:2px;text-transform:uppercase"),
        bg="#E3D1BC",
    ),
)
