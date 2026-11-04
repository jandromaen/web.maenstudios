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
     "Demostrar que funciona: la prueba que decide una reserva.",
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
        + texto("Qué contamos en Instagram, a partir del análisis de la cuenta y de la competencia.",
                128, 760, 640, 28, SOFT)
        + texto("All About Management × Skin Laundry · Versión 1", 128, 960, 760, 22, SOFT,
                extra="letter-spacing:2px;text-transform:uppercase"),
        bg="#E2D0BE",
    ),
)

# 02 · Los cinco pilares, sin numerar ni jerarquizar
ORDEN = ["equipo-medico", "antes-despues", "informativo", "tratamientos", "ofertas"]
por_id = {p[0]: p for p in PILARES}
cards = ""
cw, gap = 312, 26
for i, pid in enumerate(ORDEN):
    _, n, obj, *_rest = por_id[pid]
    x = 128 + i * (cw + gap)
    cards += (
        f'<div style="{pos(x, 380)}width:{cw}px;height:480px;border-radius:22px;background:{SAND}"></div>'
        + f'<div style="{pos(x + 32, 420)}width:40px;height:4px;border-radius:2px;background:{CARAMEL}"></div>'
        + f'<p style="{pos(x + 32, 452)}width:{cw - 64}px;font-family:{SERIF};font-size:42px;font-weight:300;line-height:1.05;color:{INK}">{n}</p>'
        + texto(obj, x + 32, 600, cw - 60, 20, SOFT)
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

# 03 · Qué vamos a mejorar
mejoras = [
    ("Planos más simétricos", "Encuadres limpios y centrados, con la persona o el tratamiento como protagonista y aire alrededor."),
    ("La misma luz, más cálida", "Siempre la misma iluminación, en tonos cálidos, para que todo el feed se vea como una sola sesión."),
    ("Más unidad cromática", "Espresso, crema y lima como paleta común en fondos, textos y detalles."),
    ("Una sola tipografía", "La misma letra en reels y en posts: serif fina para titulares y sans para textos."),
    ("Reel y post, coherentes", "Los dos formatos siguen el mismo sistema y el mismo ritmo, para que la cuenta se lea como un todo."),
    ("Una edición más creativa", "Transiciones, ritmo y detalles de montaje que hagan el contenido más atractivo sin perder la línea premium."),
]
mg = ""
for i, (t, d) in enumerate(mejoras):
    col, row = i % 3, i // 3
    x, y = 128 + col * 568, 360 + row * 300
    dark = i == 5
    bg, fg, sub, ac = (INK, CREAM, SOFT_D, LIME) if dark else (SAND, INK, SOFT, CARAMEL)
    mg += (
        f'<div style="{pos(x, y)}width:536px;height:270px;border-radius:22px;background:{bg}"></div>'
        + f'<p style="{pos(x + 40, y + 34)}font-size:20px;font-weight:600;letter-spacing:2px;color:{ac}">0{i + 1}</p>'
        + f'<p style="{pos(x + 40, y + 72)}width:456px;font-family:{SERIF};font-size:42px;font-weight:300;line-height:1.05;color:{fg}">{t}</p>'
        + texto(d, x + 40, y + 140, 456, 21, sub)
    )
add(
    "mejoras",
    "Qué vamos a mejorar",
    sec(
        eyebrow("Qué vamos a mejorar", 128, 128)
        + titulo("Más coherencia, <i>plano a plano</i>.", 128, 200, 1600, 80)
        + mg
        + pie(0),
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
