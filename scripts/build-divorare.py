"""Genera app/pitch/divorare/diapos.ts: propuesta de Maen Studios para el
concurso de agencias de Divorare (Italian Street Food), en respuesta a su
«Creative Brief · Social Media 2026» (recibido el 3 de noviembre de 2026).

Sigue el orden de los diez bloques que pide el brief (Brand Understanding →
Christmas Creative Challenge). Lienzo de 1920×1080 con la identidad de
Divorare: hormigón, papel con garabatos, rojo #D80036, lima #D4FB04, brocha
(Permanent Marker), palo seco condensado (Anton) y Raleway para el texto.
Las fotos salen del propio brief.

Todo lo que es dato o precio vive arriba, en constantes. Si cambia algo, se
toca aquí y se vuelve a ejecutar desde la raíz del repo:

    python3 scripts/build-divorare.py
"""

import json
from pathlib import Path

A = "/pitch/divorare"
ROJO = "#D80036"
LIMA = "#D4FB04"
TINTA = "#111111"
GRIS = "#5A5A5A"
CREMA = "#FBFAF7"
ANTON = "Anton, Impact, sans-serif"
MARKER = "'Permanent Marker', cursive"
PIE = "Maen Studios × Divorare"

# ── Precios (propuesta de Maen, + IVA) ────────────────────────────────────
PLANES = [
    {
        "nombre": "Antojo",
        "precio": "3.400",
        "rodajes": "2 rodajes al mes",
        "items": [
            "Estrategia, dirección creativa y calendario mensual",
            "10 vídeos verticales (Reels + TikTok)",
            "4 carruseles o posts de foto",
            "Sesión de foto de producto: 20 fotos editadas",
            "Publicación en Instagram y TikTok + stories 3 días/semana",
            "Reporting mensual",
        ],
        "reco": False,
    },
    {
        "nombre": "Devorador",
        "precio": "4.900",
        "rodajes": "4 rodajes al mes · uno por semana",
        "items": [
            "Todo lo del plan Antojo, más:",
            "18 vídeos verticales (Reels + TikTok), con series propias",
            "8 carruseles o posts de foto",
            "Sesión de foto de producto: 40 fotos editadas",
            "Stories todos los días laborables",
            "Revisión trimestral de estrategia y Social Brand Book",
        ],
        "reco": True,
    },
]
EXTRAS = [
    ("Rodaje fuera de Madrid y Barcelona", "550 € / jornada + desplazamiento"),
    ("Community activo: respuestas, DMs y escucha diaria", "900 € / mes"),
    ("Creadores UGC de Maen Talents", "desde 180 € / pieza"),
    ("Gestión de colaboraciones con influencers", "750 € / mes (sin fees de creador)"),
    ("Paid media en Meta y TikTok", "15 % de la inversión · mín. 400 € / mes"),
    ("Producción de la campaña de Navidad", "2.200 € (cerrado)"),
]

# ── Casos de Maen (seguidores actuales de cada cuenta, de app/clients.ts) ──
CASOS = [
    ("ultramarinos-marin", "Ultramarinos", "Bar-asador · Barcelona", "55,3k"),
    ("burmet", "Burmet", "Hamburguesas · Madrid", "34,9k"),
    ("macchina", "Macchina", "Pasta bar · Barcelona", "32k"),
    ("mimosas", "Mimosas", "Tapas y cócteles · Madrid", "29k"),
    ("b-de-bocata", "B de Bocata", "Bocatería · Barcelona", "12k"),
    ("ultrapaninos-marin", "Ultrapaninos", "Bocadillos · Barcelona", "7k"),
]


# ── Piezas ────────────────────────────────────────────────────────────────
_uid = [0]


def uid():
    _uid[0] += 1
    return f"dv{_uid[0]}"


def pos(left, top, extra=""):
    return f"position:absolute;left:{left}px;top:{top}px;{extra}"


def sec(body, cls="papel", extra=""):
    return f'<section class="{cls}" style="{extra}">{body}</section>'


def brocha(left, top, w, h, color=LIMA, rot=-2, seed=3, op=1):
    """Trazo de brocha con el canto roto (turbulencia + desplazamiento)."""
    i = uid()
    return (
        f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" '
        f'style="{pos(left, top, f"transform:rotate({rot}deg);opacity:{op};overflow:visible")}">'
        f'<defs><filter id="{i}" x="-5%" y="-40%" width="110%" height="180%">'
        f'<feTurbulence type="fractalNoise" baseFrequency="0.035 0.55" numOctaves="3" seed="{seed}"/>'
        f'<feDisplacementMap in="SourceGraphic" scale="{max(14, h * 0.45):.0f}"/></filter></defs>'
        f'<path d="M{h*0.3:.0f} {h*0.32:.0f} Q{w*0.5:.0f} {h*0.12:.0f} {w-h*0.2:.0f} {h*0.3:.0f} '
        f'L{w-h*0.35:.0f} {h*0.78:.0f} Q{w*0.45:.0f} {h*0.9:.0f} {h*0.15:.0f} {h*0.72:.0f} Z" '
        f'fill="{color}" filter="url(#{i})"/></svg>'
    )


def subrayado(left, top, w, color=ROJO, rot=-1.5, grosor=10):
    return brocha(left, top, w, grosor * 2, color, rot, seed=11)


def corona(left, top, w=120, color=LIMA, rot=-8):
    h = w * 0.72
    return (
        f'<svg width="{w}" height="{h:.0f}" viewBox="0 0 120 86" style="{pos(left, top, f"transform:rotate({rot}deg)")}">'
        f'<path d="M12 78 L8 26 L36 52 L58 12 L80 50 L110 22 L104 78 Z" fill="none" stroke="{color}" '
        f'stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>'
        f'<circle cx="8" cy="20" r="6" fill="{color}"/><circle cx="58" cy="6" r="6" fill="{color}"/>'
        f'<circle cx="111" cy="16" r="6" fill="{color}"/></svg>'
    )


def flecha(left, top, w=220, color=LIMA, rot=0, grosor=7):
    return (
        f'<svg width="{w}" height="80" viewBox="0 0 220 80" style="{pos(left, top, f"transform:rotate({rot}deg);overflow:visible")}">'
        f'<path d="M6 58 C60 30 120 18 196 34" fill="none" stroke="{color}" stroke-width="{grosor}" stroke-linecap="round"/>'
        f'<path d="M168 12 L200 34 L166 54" fill="none" stroke="{color}" stroke-width="{grosor}" '
        f'stroke-linecap="round" stroke-linejoin="round"/></svg>'
    )


def garabato(left, top, w=160, color=ROJO, rot=0):
    """Zigzag rojo de spray, como los de las fotos del brief."""
    return (
        f'<svg width="{w}" height="{w*0.6:.0f}" viewBox="0 0 160 96" style="{pos(left, top, f"transform:rotate({rot}deg)")}">'
        f'<path d="M8 80 L40 12 L52 78 L86 14 L96 80 L130 16 L140 70" fill="none" stroke="{color}" '
        f'stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    )


def estrella(left, top, w=90, color=TINTA, rot=0):
    return (
        f'<svg width="{w}" height="{w}" viewBox="0 0 100 100" style="{pos(left, top, f"transform:rotate({rot}deg)")}">'
        f'<path d="M50 6 L62 40 L96 40 L68 60 L80 94 L50 72 L20 94 L32 60 L4 40 L38 40 Z" fill="none" '
        f'stroke="{color}" stroke-width="6" stroke-linejoin="round"/></svg>'
    )


def logo(left, top, w=260, rot=0):
    return f'<img src="{A}/logo-llama.webp" alt="Divorare" style="{pos(left, top, f"width:{w}px;height:auto;transform:rotate({rot}deg)")}">'


def maen(left, top, w=300, claro=False):
    f = "" if claro else "filter:invert(1);"
    return f'<img src="/maen-logo.png" alt="Maen Studios" style="{pos(left, top, f"width:{w}px;height:auto;{f}")}">'


def marker(t, left, top, size=72, color=TINTA, rot=-2, width=None, extra=""):
    wd = f"width:{width}px;" if width else "white-space:nowrap;"
    return (
        f'<h2 class="marker" style="{pos(left, top)}{wd}font-size:{size}px;color:{color};'
        f'transform:rotate({rot}deg);transform-origin:left center;{extra}">{t}</h2>'
    )


def anton(t, left, top, size=120, color=TINTA, width=None, extra=""):
    wd = f"width:{width}px;" if width else "white-space:nowrap;"
    return f'<h1 class="anton" style="{pos(left, top)}{wd}font-size:{size}px;color:{color};{extra}">{t}</h1>'


def texto(t, left, top, width, size=27, color=TINTA, weight=500, extra=""):
    return (
        f'<p style="{pos(left, top)}width:{width}px;font-size:{size}px;line-height:1.42;'
        f'font-weight:{weight};color:{color};{extra}">{t}</p>'
    )


def etiqueta(t, left, top, rot=-2, bg=ROJO, color="#fff", size=20):
    return (
        f'<span class="etiqueta" style="{pos(left, top)}transform:rotate({rot}deg);background:{bg};'
        f'color:{color};font-size:{size}px">{t}</span>'
    )


def carta(left, top, w, h, contenido="", rot=0, pad=36, bg=CREMA):
    return (
        f'<div style="{pos(left, top, f"width:{w}px;height:{h}px;transform:rotate({rot}deg);filter:drop-shadow(0 14px 22px rgba(0,0,0,.18))")}">'
        f'<div class="carta" style="width:100%;height:100%;padding:{pad}px;background:{bg}">{contenido}</div></div>'
    )


def cinta(left, top, rot=-8, w=150):
    return f'<span class="cinta" style="{pos(left, top, f"width:{w}px;transform:rotate({rot}deg)")}"></span>'


def foto(src, left, top, w, h, rot=0, extra=""):
    return (
        f'<img class="foto" src="{A}/{src}" alt="" style="{pos(left, top, f"width:{w}px;height:{h}px;transform:rotate({rot}deg);{extra}")}">'
    )


def recorte(src, left, top, w, rot=0, extra=""):
    return (
        f'<img class="recorte" src="{A}/{src}" alt="" style="{pos(left, top, f"width:{w}px;height:auto;transform:rotate({rot}deg);{extra}")}">'
    )


def num(n, left, top, size=64, color=ROJO, rot=-4):
    return marker(f"{n:02d}.", left, top, size, color, rot)


def lista(items, left, top, width, size=25, gap=14, color=TINTA, bullet=ROJO, weight=500):
    lis = "".join(
        f'<p style="margin:0 0 {gap}px;padding-left:34px;position:relative">'
        f'<span style="position:absolute;left:0;top:0;color:{bullet};font-family:{MARKER}">✕</span>{it}</p>'
        for it in items
    )
    return (
        f'<div style="{pos(left, top)}width:{width}px;font-size:{size}px;line-height:1.38;'
        f'font-weight:{weight};color:{color}">{lis}</div>'
    )


def pie(n, oscuro=False):
    c = "rgba(244,244,244,.6)" if oscuro else "rgba(17,17,17,.55)"
    return (
        f'<div style="{pos(96, 1018)}width:1728px;display:flex;justify-content:space-between;'
        f'font-size:17px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:{c}">'
        f"<span>{PIE}</span><span>{n:02d}</span></div>"
    )


def logo_esquina():
    return logo(1738, 40, 92, rot=6)


slides = []


def add(id_, tit, html):
    slides.append({"id": id_, "titulo": tit, "html": html})


def n():
    return len(slides) + 1


def divisoria(id_, parte, l1, l2, sub, foto_rec=None):
    """Portada de bloque, como las «PART 0X» del brief."""
    b = (
        f'<svg width="330" height="110" viewBox="0 0 330 110" style="{pos(110, 110, "transform:rotate(-6deg)")}">'
        f'<ellipse cx="165" cy="55" rx="150" ry="40" fill="none" stroke="{LIMA}" stroke-width="7"/></svg>'
        + marker(f"PART {parte:02d}", 168, 138, 50, TINTA, -6)
        + anton(l1, 130, 250, min(250, int(1330 / (0.5 * len(l1)))), "#fff", extra="text-shadow:0 4px 0 rgba(0,0,0,.08)")
        + brocha(110, 640, 1180, 120, LIMA, -2, seed=parte + 4)
        + marker(l2, 150, 520, min(170, int(1300 / (0.66 * len(l2)))), TINTA, -3)
        + texto(sub, 150, 800, 1100, 40, TINTA, 800, "text-transform:uppercase;font-family:Anton,Impact,sans-serif;letter-spacing:1px;font-weight:400")
        + subrayado(140, 870, 620, ROJO)
        + flecha(1250, 560, 300, LIMA, -14)
        + corona(1560, 150, 170)
        + logo(1500, 280, 330, rot=4)
        + pie(n())
    )
    if foto_rec:
        b += foto_rec
    add(id_, f"{l1} {l2}".title(), sec(b, "hormigon"))


# ════════════════════════════════════════════════════════════════════════
# 01 · PORTADA
# ════════════════════════════════════════════════════════════════════════
add("portada", "Portada", sec(
    corona(96, 70, 150, ROJO, -10)
    + anton("THE AGENCY", 120, 170, 260, "#fff")
    + brocha(90, 600, 1240, 150, LIMA, -2, seed=2)
    + marker("Proposal", 150, 420, 250, TINTA, -4)
    + anton("Maen Studios × Divorare · Social Media 2026", 140, 800, 46, TINTA)
    + subrayado(130, 870, 900, ROJO)
    + texto("Concurso de agencias · Noviembre 2026", 140, 920, 900, 26, TINTA, 700)
    + flecha(1240, 480, 300, LIMA, -18)
    + logo(1450, 230, 400, rot=6)
    + marker("©", 1820, 190, 70, LIMA, 0)
    + estrella(1700, 760, 110, TINTA, 12),
    "hormigon",
))

# 02 · CARTA
add("carta", "Antes de empezar", sec(
    marker("Antes de empezar", 120, 100, 70, ROJO, -3)
    + subrayado(110, 190, 560, LIMA, -2, 14)
    + anton("Aquí no venimos a morder.", 120, 250, 92, TINTA)
    + anton("Venimos a devorar.", 120, 350, 92, ROJO)
    + texto(
        "Divorare ya tiene lo que casi ninguna marca consigue: un producto que se reconoce de un vistazo, "
        "una comunidad que hace cola y una identidad con carácter. Lo que pedís ahora es más difícil: "
        "que todo eso deje de depender de un vídeo viral y se convierta en un universo propio.",
        120, 520, 1000, 30, TINTA, 500)
    + texto(
        "En Maen Studios hacemos exactamente eso para marcas de restauración, de principio a fin y con "
        "equipo propio: estrategia, dirección creativa, rodaje, edición y publicación. Tenemos estudio en "
        "Madrid y en Barcelona, y nos sentamos en vuestras mesas como clientes antes que como agencia.",
        120, 740, 1000, 30, TINTA, 500)
    + recorte("hand-sign.webp", 1290, 80, 560, 3)
    + carta(1250, 760, 520, 190,
            f'<p style="font-family:{MARKER};font-size:34px;line-height:1.15">Jandro Martín</p>'
            f'<p style="font-size:21px;font-weight:600;margin-top:10px;color:{GRIS}">CEO, founder y director de cuentas · Maen Studios</p>',
            -3)
    + cinta(1440, 740, -6)
    + pie(n()),
))

# 03 · ÍNDICE
bloques = [
    ("Brand understanding", "Nuestra lectura de Divorare"),
    ("Creative vision", "El concepto para los próximos 12 meses"),
    ("Brand territories", "Cinco territorios, siete series propias"),
    ("Content strategy", "Pilares, formatos y frecuencia"),
    ("Community & influence", "Comunidad más allá del seguidor"),
    ("Production & execution", "Cómo rodamos y trabajos reales"),
    ("Team & ways of working", "Equipo, interlocutores y ciclo mensual"),
    ("Measurement & KPIs", "Qué medimos y cómo mejoramos"),
    ("Financial proposal", "Planes, extras y condiciones"),
    ("Christmas challenge", "El Gordo se devora"),
]
idx = ""
for i, (b, s) in enumerate(bloques):
    col, fila = divmod(i, 5)
    x = 120 + col * 860
    y = 290 + fila * 138
    idx += (
        marker(f"{i+1:02d}.", x, y, 54, ROJO, -4)
        + anton(b, x + 120, y + 4, 50, TINTA)
        + texto(s, x + 122, y + 66, 640, 23, GRIS, 600)
    )
add("indice", "Índice", sec(
    marker("Lo que os traemos", 120, 100, 80, TINTA, -3)
    + brocha(100, 200, 700, 34, LIMA, -2, seed=5)
    + idx
    + corona(1700, 70, 120, ROJO, 10)
    + pie(n()),
))

# ════════════════════════════════════════════════════════════════════════
# 01 · BRAND UNDERSTANDING
# ════════════════════════════════════════════════════════════════════════
divisoria("p1", 1, "BRAND", "Understanding", "Nuestra lectura de Divorare")

# Fortalezas
fz = [
    ("17", "locales en 3 años", "De 0 a 17 en siete ciudades, con modelo de franquicia desde abril de 2026."),
    ("147K", "seguidores en Instagram", "Una comunidad real que ya habla de vosotros sin que se lo pidáis."),
    ("1", "vídeo que lo cambió todo", "El de Jack Dining Room demostró que la focaccia es un formato hecho para la pantalla."),
    ("48H", "de fermentación", "Una verdad de producto que pocas marcas de street food pueden contar."),
]
c = ""
for i, (big, lab, desc) in enumerate(fz):
    x = 120 + i * 420
    c += carta(x, 400, 380, 380,
               f'<p style="font-family:{ANTON};font-size:110px;line-height:1;color:{ROJO}">{big}</p>'
               f'<p style="font-family:{MARKER};font-size:30px;line-height:1.1;margin-top:10px">{lab}</p>'
               f'<p style="font-size:22px;line-height:1.4;font-weight:500;margin-top:18px;color:#333">{desc}</p>',
               [-2, 1.5, -1, 2][i], 34)
add("fortalezas", "Lo que ya tenéis", sec(
    marker("Lo que ya tenéis", 120, 110, 84, TINTA, -3)
    + brocha(100, 214, 640, 36, LIMA, -2, seed=6)
    + texto("Empezamos por lo que funciona, porque lo que viene después tiene que construirse encima, no al lado.", 120, 270, 1300, 30, "#333", 600)
    + c
    + texto("Y una identidad muy clara: <b>auténtica, irreverente, cercana y urbana</b>. El fuego, la corona, la brocha y el spray ya son vuestros.", 120, 880, 1500, 28, TINTA, 500)
    + logo_esquina() + pie(n()),
))

# Retos
retos = [
    ("De viral a universo",
     "El primer gran empujón vino de fuera, de un creador. El siguiente tiene que venir de dentro: formatos y narrativas que solo pueda firmar Divorare."),
    ("17 locales, una sola voz",
     "Con la expansión y las franquicias, el riesgo es que cada ciudad cuente una marca distinta. La consistencia visual se convierte en un activo de negocio."),
    ("Del producto a la cultura",
     "La focaccia es el anzuelo perfecto, pero si solo enseñamos focaccias competimos con cualquier bocatería de moda. La cultura que la rodea no se puede copiar."),
]
c = ""
for i, (t, d) in enumerate(retos):
    y = 330 + i * 210
    c += (
        num(i + 1, 120, y, 72)
        + anton(t, 260, y + 6, 60, TINTA)
        + texto(d, 262, y + 82, 1000, 25, "#333", 500)
    )
add("retos", "Los retos", sec(
    marker("Los tres retos que vemos", 120, 110, 84, TINTA, -3)
    + brocha(100, 214, 900, 36, LIMA, -2, seed=7)
    + c
    + recorte("cola.webp", 1350, 300, 470, 4)
    + carta(1390, 690, 400, 170,
            f'<p style="font-family:{MARKER};font-size:30px;line-height:1.15">Del vídeo a la fila…</p>'
            f'<p style="font-family:{MARKER};font-size:30px;line-height:1.15;color:{ROJO}">…y de la fila al club.</p>', -4)
    + logo_esquina() + pie(n()),
))

# Insight
add("insight", "El insight", sec(
    texto("EL INSIGHT", 120, 140, 600, 26, LIMA, 800, "letter-spacing:6px")
    + anton("Nadie hace cola", 120, 220, 170, "#fff")
    + anton("por una focaccia.", 120, 390, 170, "#fff")
    + brocha(100, 625, 1340, 130, ROJO, -2, seed=9)
    + marker("Hace cola para formar parte de algo.", 150, 648, 64, "#fff", -2)
    + texto("Las colas de Divorare no son de hambre, son de pertenencia: gente joven que quiere estar donde pasa algo y contarlo. "
            "Nuestro trabajo es darle a esa gente algo que contar cada semana.",
            120, 820, 1150, 30, "#e8e8e8", 500)
    + recorte("mujer.webp", 1500, 110, 360, 5)
    + garabato(1350, 820, 170, LIMA, -10)
    + pie(n(), True),
    "asfalto",
))

# ════════════════════════════════════════════════════════════════════════
# 02 · CREATIVE VISION
# ════════════════════════════════════════════════════════════════════════
divisoria("p2", 2, "CREATIVE", "Vision", "El concepto para los próximos 12 meses")

add("concepto", "Fame di Strada", sec(
    texto("EL CONCEPTO · 2026–2027", 120, 110, 900, 26, ROJO, 800, "letter-spacing:6px")
    + anton("FAME DI", 110, 170, 300, TINTA)
    + anton("STRADA", 110, 440, 300, ROJO)
    + brocha(100, 760, 980, 70, LIMA, -2, seed=12)
    + marker("Hambre de calle.", 130, 762, 66, TINTA, -2)
    + texto("En italiano, <i>fame</i> es hambre. Y <i>strada</i>, la calle. Es lo que es Divorare: el hambre de verdad de la tradición italiana "
            "y el hambre de la calle por vivir cosas que merezcan la pena. No hablamos de una focaccia: hablamos de la gente que la devora.",
            120, 860, 1080, 26, "#222", 500)
    + recorte("focaccia-flame.webp", 1180, 150, 700, 0)
    + pie(n()),
))

add("manifiesto", "Manifiesto", sec(
    marker("El manifiesto", 120, 100, 70, LIMA, -3)
    + texto(
        "Tenemos hambre.<br>De pan que ha esperado 48 horas.<br>De mortadela que viene de donde tiene que venir.<br>"
        "De calles con murales, de colas que se convierten en planes,<br>de amigos que se pelean por el último trozo.<br>"
        "No mordemos con educación. Devoramos con ganas.<br>Porque la vida, como la focaccia, se come con las manos.",
        120, 230, 1150, 40, "#fff", 600, "line-height:1.5")
    + anton("Fame di strada.", 120, 820, 110, LIMA)
    + recorte("jack2.webp", 1380, 150, 440, 4)
    + pie(n(), True),
    "asfalto",
))

temporadas = [
    ("T1", "ENE–MAR", "Hecho a mano", "Origen, masa, 48 horas, proveedores italianos. Volvemos a la raíz para que nadie confunda Divorare con una moda."),
    ("T2", "ABR–JUN", "La calle es nuestra", "Arte urbano, murales y colaboraciones con artistas de cada ciudad. Divorare como parte de la escena creativa."),
    ("T3", "JUL–SEP", "Dolce vita devora", "Verano, terrazas, turistas y festivales. La italianidad contemporánea, sin postales ni tópicos."),
    ("T4", "OCT–DIC", "Club Devorador", "Comunidad, fidelización y la gran cita del año: la Navidad. El cierre de temporada lo protagoniza la gente."),
]
c = ""
for i, (t, m, nom, d) in enumerate(temporadas):
    x = 120 + i * 430
    c += carta(x, 360, 400, 470,
               f'<p style="font-family:{ANTON};font-size:90px;color:{ROJO};line-height:1">{t}</p>'
               f'<p style="font-size:22px;font-weight:800;letter-spacing:3px;margin-top:6px">{m}</p>'
               f'<p style="font-family:{MARKER};font-size:38px;line-height:1.05;margin-top:24px">{nom}</p>'
               f'<p style="font-size:22px;line-height:1.42;font-weight:500;margin-top:20px;color:#333">{d}</p>',
               [-1.5, 1, -1, 1.5][i], 36)
add("temporadas", "12 meses en 4 temporadas", sec(
    marker("12 meses, 4 temporadas", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 900, 36, LIMA, -2, seed=13)
    + texto("Como un drop de streetwear: cada temporada tiene su propia narrativa, estética y lanzamientos, y todas cuelgan del mismo concepto.", 120, 260, 1500, 28, "#333", 600)
    + c
    + texto("Las aperturas, los productos nuevos y la carta de temporada se enganchan a la narrativa de cada trimestre, en lugar de ir sueltos.", 120, 920, 1500, 25, GRIS, 600)
    + logo_esquina() + pie(n()),
))

estilo = [
    ("Encuadre", "El corte de la focaccia siempre a la altura de los ojos, con las manos tatuadas, el papel y el ruido de la calle."),
    ("Luz", "Natural y dura de día; neón, flash y tungsteno de noche. Nada de bodegón de estudio."),
    ("Ritmo", "Cortes secos, sonido real del crujido y del cuchillo, y texto en pantalla con la brocha de la marca."),
    ("Personas", "El equipo y los clientes por delante de cualquier actor. Caras reales, sin filtros."),
]
c = ""
for i, (t, d) in enumerate(estilo):
    y = 330 + i * 150
    c += etiqueta(t, 120, y, -2) + texto(d, 120, y + 50, 880, 25, "#222", 500)
add("estilo", "Estilo de contenido", sec(
    marker("Cómo se va a ver", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 700, 36, LIMA, -2, seed=14)
    + c
    + foto("foto-salamanca-1.jpg", 1080, 140, 360, 460, -3)
    + foto("foto-salamanca-2.jpg", 1460, 190, 360, 440, 3)
    + recorte("eco-cultura.webp", 1110, 640, 460, -2)
    + recorte("eco-movil.webp", 1470, 680, 360, 4)
    + pie(n()),
))

# ════════════════════════════════════════════════════════════════════════
# 03 · BRAND TERRITORIES
# ════════════════════════════════════════════════════════════════════════
divisoria("p3", 3, "BRAND", "Territories", "Cinco territorios, siete series propias")

series = [
    ("El Corte", "Ritual devorador", "trio.webp",
     "Cada semana, una focaccia abierta a cámara lenta con el sonido del crujido. Siempre el mismo plano: se convierte en firma de marca."),
    ("48 Horas", "Artesanía real", "eco-artesania.webp",
     "Del saco de harina al primer mordisco en 48 horas contadas en un minuto. Proceso, horno y manos del obrador."),
    ("¿Qué devoras?", "Comunidad devoradora", "eco-tienda.webp",
     "Entrevistas rápidas en la cola: qué pides, con quién vienes, qué harías por la última focaccia. Formato nativo de TikTok."),
    ("Paredes", "Arte urbano", "mural.webp",
     "Un artista por temporada interviene un local, el papel o una edición limitada. Mini documental de 60 segundos."),
    ("Parla come mangi", "Italianidad instintiva", "italia.webp",
     "El equipo italiano traduce Italia sin tópicos: expresiones, gestos, comida de verdad y la dolce vita de calle."),
    ("Detrás de la barra", "Artesanía + comunidad", "equipo.webp",
     "El día a día del equipo: turnos, prisas, bromas y la gente que hace posible cada focaccia."),
    ("Devorador del mes", "Comunidad devoradora", "eco-lifestyle.webp",
     "El cliente más fiel de cada ciudad, convertido en protagonista. Alimenta el Club Devorador y el contenido UGC."),
]


def serie_cards(items, start):
    out = ""
    for i, (nom, terr, img, d) in enumerate(items):
        x = 120 + i * 430
        out += (
            carta(x, 300, 400, 640,
                  f'<img src="{A}/{img}" alt="" style="width:328px;height:220px;object-fit:cover;display:block">'
                  f'<p style="font-family:{MARKER};font-size:40px;line-height:1.05;margin-top:26px">{nom}</p>'
                  f'<p style="font-size:18px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:{ROJO};margin-top:12px">{terr}</p>'
                  f'<p style="font-size:21px;line-height:1.42;font-weight:500;margin-top:14px;color:#333">{d}</p>',
                  [-1.5, 1, -1, 1.5][i % 4], 36)
            + cinta(x + 130, 284, [-6, 5, -4, 7][i % 4])
            + num(start + i, x - 6, 250, 50, ROJO, -6)
        )
    return out


add("territorios", "De territorio a serie", sec(
    marker("De territorio a serie", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 860, 36, LIMA, -2, seed=15)
    + texto("Los territorios no se activan con posts sueltos sino con <b>formatos recurrentes</b> que la gente reconoce y espera. Cada territorio tiene al menos una serie propia.", 120, 262, 1600, 27, "#333", 600)
    + "".join(
        carta(120 + i * 340, 380, 310, 430,
              f'<p style="font-family:{ANTON};font-size:66px;color:{ROJO};line-height:1">{i+1:02d}</p>'
              f'<p style="font-family:{MARKER};font-size:33px;line-height:1.05;margin-top:12px">{t}</p>'
              f'<p style="font-size:19px;font-weight:800;letter-spacing:2px;text-transform:uppercase;margin-top:22px;color:{GRIS}">Series</p>'
              f'<p style="font-size:24px;font-weight:700;line-height:1.35;margin-top:6px">{s}</p>'
              f'<p style="font-size:19px;font-weight:800;letter-spacing:2px;text-transform:uppercase;margin-top:20px;color:{GRIS}">Se ve en</p>'
              f'<p style="font-size:21px;font-weight:500;line-height:1.4;margin-top:6px;color:#333">{v}</p>',
              [-1.5, 1, -1, 1.5, -1][i], 30)
        for i, (t, s, v) in enumerate([
            ("El ritual devorador", "El Corte", "Momentos de antojo, frases que dan hambre, el lifestyle urbano."),
            ("Artesanía real", "48 Horas · Detrás de la barra", "Masa, horno, ingredientes y el equipo que lo hace."),
            ("Comunidad devoradora", "¿Qué devoras? · Devorador del mes", "Clientes reales, UGC y el Club Devorador."),
            ("Arte urbano", "Paredes", "Murales, artistas, ediciones limitadas del packaging."),
            ("Italianidad instintiva", "Parla come mangi", "Italia de verdad, contada con humor y sin postal."),
        ])
    )
    + logo_esquina() + pie(n()),
))

add("series-1", "Series propias I", sec(
    marker("Siete series propias", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 820, 36, LIMA, -2, seed=16)
    + serie_cards(series[:4], 1)
    + logo_esquina() + pie(n()),
))
add("series-2", "Series propias II", sec(
    marker("Siete series propias", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 820, 36, LIMA, -2, seed=17)
    + serie_cards(series[4:], 5)
    + carta(1430, 360, 380, 400,
            f'<p style="font-family:{MARKER};font-size:36px;line-height:1.1;color:{ROJO}">Y fuera de serie…</p>'
            f'<p style="font-size:22px;line-height:1.45;font-weight:500;margin-top:18px">Lanzamientos, aperturas, productos de temporada, '
            f'tendencias y momentos culturales. Las series dan constancia; las piezas sueltas, actualidad.</p>', 2, 34)
    + estrella(1700, 800, 100, TINTA, 10)
    + logo_esquina() + pie(n()),
))

# ════════════════════════════════════════════════════════════════════════
# 04 · CONTENT STRATEGY
# ════════════════════════════════════════════════════════════════════════
divisoria("p4", 4, "CONTENT", "Strategy", "Pilares, formatos y frecuencia")

pilares = [
    ("Producto & food desire", 30, "El Corte, lanzamientos, texturas"),
    ("Artesanía & behind the scenes", 20, "48 Horas, Detrás de la barra"),
    ("Lifestyle & comunidad", 20, "¿Qué devoras?, Devorador del mes, UGC"),
    ("Cultura & entretenimiento", 15, "Paredes, Parla come mangi, tendencias"),
    ("Brand news & activaciones", 10, "Aperturas, carta, eventos, campañas"),
    ("Engagement & conversación", 5, "Retos, encuestas, dinámicas"),
]
c = ""
for i, (p_, pct, ej) in enumerate(pilares):
    y = 320 + i * 102
    c += (
        anton(p_, 120, y, 40, TINTA)
        + texto(ej, 120, y + 50, 760, 21, GRIS, 600)
        + f'<div style="{pos(880, y + 10, f"width:{pct * 15}px;height:44px;background:{ROJO if i == 0 else TINTA};transform:skewX(-8deg)")}"></div>'
        + marker(f"{pct}%", 905 + pct * 15, y + 6, 40, ROJO if i == 0 else TINTA, -2)
    )
add("pilares", "Pilares editoriales", sec(
    marker("Pilares editoriales", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 800, 36, LIMA, -2, seed=18)
    + texto("Los seis bloques del ecosistema que nos pedís, con su peso en el calendario.", 120, 256, 1300, 27, "#333", 600)
    + c
    + carta(1500, 330, 330, 520,
            f'<p style="font-family:{MARKER};font-size:34px;line-height:1.1">La regla</p>'
            f'<p style="font-size:23px;line-height:1.45;font-weight:600;margin-top:18px">El producto sigue siendo el protagonista absoluto, '
            f'pero <span style="color:{ROJO}">la mitad del calendario habla de personas, procesos y cultura</span>. '
            f'Así dejamos de competir solo por la foto más apetecible.</p>', 2, 34)
    + logo_esquina() + pie(n()),
))

plataformas = [
    ("Instagram", "El universo de marca",
     ["Estética cuidada y consistente: es vuestro escaparate y vuestra carta de presentación para franquiciados.",
      "Reels de series, carruseles de producto y de cultura, fotos de alto nivel.",
      "Stories diarias: locales, novedades, encuestas y el día a día."],
     "4–5 publicaciones / semana + stories diarias"),
    ("TikTok", "La personalidad de la marca",
     ["Más crudo, más rápido y con caras: el equipo y los clientes hablan a cámara.",
      "¿Qué devoras?, Detrás de la barra, Parla come mangi y tendencias del momento.",
      "Piezas nativas grabadas en vertical, no reels reciclados."],
     "4 vídeos / semana"),
]
c = ""
for i, (pl, rol, its, fr) in enumerate(plataformas):
    x = 120 + i * 840
    c += carta(x, 300, 780, 600,
               f'<p style="font-family:{ANTON};font-size:84px;line-height:1;text-transform:uppercase">{pl}</p>'
               f'<p style="font-family:{MARKER};font-size:38px;color:{ROJO};margin-top:10px">{rol}</p>'
               + "".join(f'<p style="font-size:24px;line-height:1.42;font-weight:500;margin-top:20px;padding-left:34px;position:relative">'
                         f'<span style="position:absolute;left:0;color:{ROJO};font-family:{MARKER}">✕</span>{t}</p>' for t in its)
               + f'<p style="margin-top:34px;display:inline-block;background:{LIMA};padding:10px 18px;font-size:24px;font-weight:800">{fr}</p>',
               [-1, 1][i], 44)
add("plataformas", "Instagram y TikTok", sec(
    marker("Cada red, su papel", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 760, 36, LIMA, -2, seed=19)
    + c
    + logo_esquina() + pie(n()),
))

add("ciudades", "Una marca, 17 locales", sec(
    marker("Una marca, 17 locales", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 860, 36, LIMA, -2, seed=20)
    + texto("Con siete ciudades y un modelo de franquicia en marcha, la cuenta central tiene que hablar en nombre de todos sin perder lo local.", 120, 262, 1500, 27, "#333", 600)
    + "".join(
        carta(120 + i * 560, 340, 520, 340,
              f'<p style="font-family:{ANTON};font-size:60px;line-height:1;text-transform:uppercase">{t}</p>'
              f'<p style="font-size:23px;line-height:1.45;font-weight:500;margin-top:22px;color:#222">{d}</p>',
              [-1.5, 1, -1][i], 40)
        for i, (t, d) in enumerate([
            ("Hub central", "Una sola cuenta con una sola voz y una dirección visual común. Madrid, con 10 locales, es la base de producción semanal."),
            ("Rutas por ciudad", "Cada trimestre, un rodaje en Valencia, Sevilla, Zaragoza, Salamanca, Granada y Alcalá. Cada ciudad tiene su momento en el calendario."),
            ("Kit de apertura", "Plantilla de contenido para cada nueva apertura o franquicia: cuenta atrás, montaje, primer día y la primera cola."),
        ])
    )
    + etiqueta("Madrid 10 · Valencia 3 · Zaragoza · Alcalá · Salamanca · Sevilla · Granada", 120, 760, -1, TINTA, "#fff", 22)
    + recorte("tienda-noche.webp", 1210, 730, 300, -3)
    + recorte("cola.webp", 1540, 720, 300, 3)
    + logo_esquina() + pie(n()),
))

# ════════════════════════════════════════════════════════════════════════
# 05 · COMMUNITY & INFLUENCE
# ════════════════════════════════════════════════════════════════════════
divisoria("p5", 5, "COMMUNITY", "& Influence", "Comunidad más allá del seguidor")

comunidad = [
    ("Club Devorador", "Le damos contenido propio: acceso antes que nadie a lanzamientos, dinámicas exclusivas y el Devorador del mes. El club se ve en redes y por eso apetece entrar."),
    ("UGC con criterio", "Seleccionamos y republicamos lo mejor de lo que publica vuestra gente, con un hashtag y un formato de reposteo propios. El cliente se convierte en altavoz."),
    ("Creadores de verdad", "Todo empezó con Jack Dining Room. Proponemos creadores gastronómicos y urbanos afines a cada temporada, y piezas UGC con perfiles de Maen Talents."),
    ("Conversación", "Encuestas, retos y debates que piden respuesta: «¿mortadela o porchetta?». Escucha social para detectar qué se dice de Divorare y convertirlo en contenido."),
]
c = ""
for i, (t, d) in enumerate(comunidad):
    col, fila = divmod(i, 2)
    x = 120 + col * 640
    y = 300 + fila * 330
    c += carta(x, y, 600, 300,
               f'<p style="font-family:{MARKER};font-size:40px;line-height:1.05">{t}</p>'
               f'<p style="font-size:22px;line-height:1.45;font-weight:500;margin-top:16px;color:#222">{d}</p>',
               [-1, 1, 1, -1][i], 36)
add("comunidad", "Community & influence", sec(
    marker("Comunidad, no audiencia", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 940, 36, LIMA, -2, seed=21)
    + c
    + recorte("jack-video.webp", 1440, 260, 380, 4)
    + logo_esquina() + pie(n()),
))

# ════════════════════════════════════════════════════════════════════════
# 06 · PRODUCTION & EXECUTION
# ════════════════════════════════════════════════════════════════════════
divisoria("p6", 6, "PRODUCTION", "& Execution", "Cómo rodamos y trabajos reales")

ciclo = [
    ("Semana 1", "Planificación", "Calendario del mes siguiente, guiones y briefing de rodaje. Lo aprobáis vosotros."),
    ("Semana 2", "Rodajes", "Sesiones de unas 4 horas en local, con cámara de cine, móvil para TikTok y set de foto de producto."),
    ("Semana 3", "Edición", "Montaje, color, sonido y textos. Dos rondas de cambios incluidas."),
    ("Semana 4", "Publicación", "Calendario cerrado y programado. Trabajamos siempre con un mes de margen."),
]
c = ""
for i, (s, t, d) in enumerate(ciclo):
    x = 120 + i * 430
    c += (
        carta(x, 330, 400, 420,
              f'<p style="font-size:20px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:{ROJO}">{s}</p>'
              f'<p style="font-family:{ANTON};font-size:62px;line-height:1;margin-top:10px;text-transform:uppercase">{t}</p>'
              f'<p style="font-size:23px;line-height:1.45;font-weight:500;margin-top:20px;color:#222">{d}</p>',
              [-1.5, 1, -1, 1.5][i], 36)
        + (flecha(x + 350, 520, 110, ROJO, 0, 6) if i < 3 else "")
    )
add("produccion", "Metodología", sec(
    marker("Un ciclo mensual, sin sorpresas", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 1100, 36, LIMA, -2, seed=22)
    + texto("Producción 100 % propia: no subcontratamos ni la cámara ni la edición.", 120, 260, 1300, 27, "#333", 600)
    + c
    + lista([
        "Madrid: rodaje semanal con nuestro equipo de cámara de Madrid, a pocos minutos de vuestros locales.",
        "Resto de ciudades: rutas trimestrales de rodaje, coordinadas con los encargados de cada local.",
        "Todo el material en bruto y editado os queda en Drive, ordenado por mes y por local.",
    ], 120, 800, 1600, 24, 10)
    + logo_esquina() + pie(n()),
))

c = ""
for i, (slug, nom, tag, seg) in enumerate(CASOS):
    x = 120 + i * 285
    c += (
        f'<div style="{pos(x, 290, f"width:255px;height:453px;transform:rotate({[-2, 1.5, -1, 2, -1.5, 1][i]}deg);box-shadow:0 16px 34px rgba(0,0,0,.3);background:#000;border:6px solid #fff")}">'
        f'<video src="/clients/{slug}/preview.mp4" poster="/clients/{slug}/poster.jpg" muted loop autoplay playsinline '
        f'style="width:100%;height:100%;object-fit:cover"></video></div>'
        + f'<p style="{pos(x, 770)}width:260px;white-space:nowrap;font-family:{MARKER};font-size:28px;line-height:1.05">{nom}</p>'
        + f'<p style="{pos(x, 812)}width:260px;font-size:18px;font-weight:700;color:{GRIS}">{tag}</p>'
        + f'<p style="{pos(x, 846)}width:260px;font-family:{ANTON};font-size:44px;color:{ROJO}">{seg}</p>'
        + f'<p style="{pos(x, 900)}width:260px;font-size:16px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:{GRIS}">seguidores</p>'
    )
add("trabajos", "Trabajos reales", sec(
    marker("Trabajo real, en restauración", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 1100, 36, LIMA, -2, seed=23)
    + c
    + texto("Una selección de las más de veinte marcas que llevamos. Dirección creativa, rodaje, edición y publicación hechos en casa.", 1060, 940, 760, 20, GRIS, 600, "text-align:right")
    + logo_esquina() + pie(n()),
))

# ════════════════════════════════════════════════════════════════════════
# 07 · TEAM & WAYS OF WORKING
# ════════════════════════════════════════════════════════════════════════
divisoria("p7", 7, "TEAM", "& Ways of Working", "Equipo, interlocutores y ciclo mensual")

equipo = [
    ("Jandro", "Dirección de cuentas", "Interlocutor principal con Divorare. Estrategia, negocio y prioridades."),
    ("Richi", "Dirección creativa", "Concepto, temporadas, series y supervisión de cada pieza."),
    ("Helen", "Brand manager", "Lleva el día a día de la cuenta: calendario, briefings y aprobaciones."),
    ("Laura", "Community manager · Madrid", "Publicación, stories y coordinación con los locales de Madrid."),
    ("Mati y Víctor", "Dirección de fotografía", "Rodajes en Madrid y rutas por ciudades."),
    ("Go", "Edición de vídeo", "Montaje, color y sonido de todas las piezas."),
]
c = ""
for i, (nom, rol, d) in enumerate(equipo):
    col, fila = divmod(i, 3)
    x = 120 + col * 560
    y = 300 + fila * 210
    c += (
        marker(nom, x, y, 46, TINTA, -2)
        + texto(rol.upper(), x, y + 60, 520, 19, ROJO, 800, "letter-spacing:2px")
        + texto(d, x, y + 92, 500, 21, "#333", 500)
    )
add("equipo", "Equipo", sec(
    marker("Quién va a estar", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 700, 36, LIMA, -2, seed=24)
    + c
    + carta(1260, 280, 560, 560,
            f'<p style="font-family:{ANTON};font-size:52px;line-height:1;text-transform:uppercase">Así trabajamos</p>'
            + "".join(f'<p style="font-size:22px;line-height:1.42;font-weight:500;margin-top:18px;padding-left:34px;position:relative">'
                      f'<span style="position:absolute;left:0;color:{ROJO};font-family:{MARKER}">✕</span>{t}</p>' for t in [
                          "Un único interlocutor por cada lado: Jandro en Maen y vuestra brand manager en Divorare.",
                          "Llamada de seguimiento de 30 minutos cada semana.",
                          "Calendario mensual compartido, con cada pieza enlazada en Drive.",
                          "Grupo directo para urgencias y aprobaciones rápidas.",
                          "Reunión de resultados al cierre de cada mes.",
                      ]),
            2, 40)
    + pie(n()),
))

# ════════════════════════════════════════════════════════════════════════
# 08 · MEASUREMENT & KPIs
# ════════════════════════════════════════════════════════════════════════
divisoria("p8", 8, "MEASUREMENT", "& KPIs", "Qué medimos y cómo mejoramos")

kpis = [
    ("Deseo", "Guardados y compartidos por pieza", "Si una focaccia da hambre, se guarda y se manda a un amigo. Es el KPI que más nos importa."),
    ("Alcance", "Alcance y visualizaciones por formato", "Para saber qué series atraen a gente nueva y cuáles fidelizan."),
    ("Comunidad", "Crecimiento neto en Instagram y TikTok", "Seguidores ganados por mes y por pieza, no solo el total."),
    ("Conversación", "Comentarios, menciones y UGC", "Cuántas veces la gente habla de Divorare sin que se lo pidamos."),
    ("Negocio", "Club Devorador y tráfico a local", "Altas al club, códigos y dinámicas medibles en tienda."),
]
c = ""
for i, (k, m, d) in enumerate(kpis):
    y = 290 + i * 128
    c += (
        etiqueta(k, 120, y + 6, -2, ROJO if i == 0 else TINTA)
        + anton(m, 420, y, 40, TINTA)
        + texto(d, 422, y + 52, 900, 21, "#333", 500)
    )
add("kpis", "KPIs", sec(
    marker("Qué medimos", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 560, 36, LIMA, -2, seed=25)
    + c
    + carta(1400, 290, 420, 600,
            f'<p style="font-family:{MARKER};font-size:36px;line-height:1.1">Reporting</p>'
            + "".join(f'<p style="font-size:22px;line-height:1.42;font-weight:500;margin-top:18px">'
                      f'<b style="color:{ROJO}">{a}</b><br>{b}</p>' for a, b in [
                          ("Mes 1", "Línea base y objetivos trimestrales pactados con vosotros."),
                          ("Cada mes", "Informe con resultados, qué ha funcionado, qué no y qué cambiamos."),
                          ("Cada trimestre", "Revisión de estrategia al cerrar cada temporada."),
                      ]),
            2, 38)
    + logo_esquina() + pie(n()),
))

# ════════════════════════════════════════════════════════════════════════
# 09 · FINANCIAL PROPOSAL
# ════════════════════════════════════════════════════════════════════════
divisoria("p9", 9, "FINANCIAL", "Proposal", "Planes, extras y condiciones")

c = ""
for i, p_ in enumerate(PLANES):
    x = 120 + i * 720
    reco = p_["reco"]
    bg = TINTA if reco else CREMA
    fg = "#fff" if reco else TINTA
    c += carta(x, 290, 680, 640,
               f'<p style="font-size:20px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:{LIMA if reco else ROJO}">Plan</p>'
               f'<p style="font-family:{MARKER};font-size:64px;line-height:1;color:{fg}">{p_["nombre"]}</p>'
               f'<p style="font-family:{ANTON};font-size:96px;line-height:1;margin-top:20px;color:{LIMA if reco else ROJO}">{p_["precio"]} €'
               f'<span style="font-family:Raleway,Arial,sans-serif;font-size:24px;font-weight:700;color:{fg}"> / mes + IVA</span></p>'
               f'<p style="font-size:24px;font-weight:800;margin-top:10px;color:{fg}">{p_["rodajes"]}</p>'
               + "".join(f'<p style="font-size:22px;line-height:1.38;font-weight:500;margin-top:14px;padding-left:32px;position:relative;color:{fg}">'
                         f'<span style="position:absolute;left:0;color:{LIMA if reco else ROJO};font-family:{MARKER}">✕</span>{t}</p>' for t in p_["items"]),
               [-1, 1][i], 44, bg)
    if reco:
        c += etiqueta("Recomendado", x + 420, 270, 4, LIMA, TINTA, 24)
add("planes", "Planes", sec(
    marker("Dos maneras de devorar", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 900, 36, LIMA, -2, seed=26)
    + c
    + carta(1580, 420, 260, 300,
            f'<p style="font-family:{MARKER};font-size:28px;line-height:1.12;color:{ROJO}">Mes 1</p>'
            f'<p style="font-size:20px;line-height:1.42;font-weight:600;margin-top:10px">Social Brand Book de Divorare incluido sin coste: guía visual, tono y series.</p>',
            4, 28)
    + pie(n()),
))

c = "".join(
    f'<div style="{pos(120, 300 + i * 92)}width:1080px;display:flex;justify-content:space-between;align-items:baseline;'
    f'border-bottom:3px dashed rgba(17,17,17,.25);padding-bottom:16px">'
    f'<span style="font-size:27px;font-weight:700">{a}</span>'
    f'<span style="font-family:{ANTON};font-size:32px;color:{ROJO};white-space:nowrap">{b}</span></div>'
    for i, (a, b) in enumerate(EXTRAS)
)
add("extras", "Extras y condiciones", sec(
    marker("Extras opcionales", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 740, 36, LIMA, -2, seed=27)
    + c
    + carta(1300, 290, 520, 620,
            f'<p style="font-family:{ANTON};font-size:52px;line-height:1;text-transform:uppercase">Condiciones</p>'
            + "".join(f'<p style="font-size:22px;line-height:1.42;font-weight:500;margin-top:18px;padding-left:34px;position:relative">'
                      f'<span style="position:absolute;left:0;color:{ROJO};font-family:{MARKER}">✕</span>{t}</p>' for t in [
                          "Precios sin IVA, facturación mensual por adelantado.",
                          "Compromiso inicial de 6 meses; después, mes a mes.",
                          "Dos rondas de cambios por pieza incluidas.",
                          "El material en bruto y editado es vuestro.",
                          "La inversión en publicidad y los fees de creadores van aparte.",
                      ]),
            2, 40)
    + logo_esquina() + pie(n()),
))

# ════════════════════════════════════════════════════════════════════════
# 10 · CHRISTMAS CREATIVE CHALLENGE
# ════════════════════════════════════════════════════════════════════════
divisoria("p10", 10, "CHRISTMAS", "at Divorare", "Christmas creative challenge")


def decimo(left, top, w=760, rot=-4, numero="17 048"):
    h = w * 0.5
    s = w / 760
    return (
        f'<div style="{pos(left, top, f"width:{w}px;height:{h:.0f}px;transform:rotate({rot}deg);filter:drop-shadow(0 18px 28px rgba(0,0,0,.35))")}">'
        f'<div style="position:relative;width:100%;height:100%;background:{CREMA} url({A}/doodles.jpg) 0 0/300px auto;'
        f'border:{6*s:.0f}px solid {TINTA};border-radius:{10*s:.0f}px;overflow:hidden">'
        f'<div style="position:absolute;left:0;top:0;width:{220*s:.0f}px;height:100%;background:{ROJO}"></div>'
        f'<img src="{A}/logo-llama.webp" alt="" style="position:absolute;left:{28*s:.0f}px;top:{60*s:.0f}px;width:{165*s:.0f}px;filter:brightness(0) invert(1)">'
        f'<p style="position:absolute;left:{250*s:.0f}px;top:{26*s:.0f}px;font-size:{18*s:.0f}px;font-weight:800;letter-spacing:{3*s:.1f}px">SORTEO DEVORADOR · 22 DIC 2026</p>'
        f'<p class="marker" style="position:absolute;left:{250*s:.0f}px;top:{62*s:.0f}px;font-size:{64*s:.0f}px;line-height:1;transform:rotate(-3deg)">El Gordo</p>'
        f'<p class="marker" style="position:absolute;left:{300*s:.0f}px;top:{128*s:.0f}px;font-size:{64*s:.0f}px;line-height:1;color:{ROJO};transform:rotate(-3deg)">se devora</p>'
        f'<p style="position:absolute;left:{250*s:.0f}px;top:{230*s:.0f}px;font-family:{ANTON};font-size:{86*s:.0f}px;line-height:1;letter-spacing:{4*s:.0f}px">{numero}</p>'
        f'<p style="position:absolute;right:{24*s:.0f}px;bottom:{18*s:.0f}px;font-size:{15*s:.0f}px;font-weight:700;color:{GRIS}">Valor: 1 focaccia</p>'
        f'</div></div>'
    )


add("navidad-concepto", "El Gordo se devora", sec(
    texto("CHRISTMAS CREATIVE CHALLENGE · CONCEPTO", 120, 100, 1100, 24, LIMA, 800, "letter-spacing:5px")
    + anton("El Gordo", 120, 160, 230, "#fff")
    + marker("se devora.", 140, 390, 190, ROJO, -4)
    + texto("En España la Navidad empieza el 22 de diciembre, cuando los niños de San Ildefonso cantan el Gordo. "
            "En Italia no hay Gordo. En Divorare, sí: <b>el gordo es la focaccia</b>, y este año toca en los 17 locales.",
            120, 650, 1000, 30, "#eee", 500)
    + texto("No es una campaña de Navidad con espumillón. Es una tradición española leída con el humor irreverente de una marca italiana de calle. "
            "Solo Divorare podría contarla.",
            120, 850, 1000, 25, LIMA, 600)
    + decimo(1180, 220, 680, -6)
    + decimo(1240, 560, 600, 5, "08 220")
    + pie(n(), True),
    "asfalto",
))

mood = [
    ("Paleta", "El rojo y la lima de siempre, con el dorado del décimo y el blanco del papel de la focaccia. Nada de verde abeto."),
    ("Tipografía", "La brocha de Divorare sobre el formato clásico del décimo de lotería: números grandes, sellos y series."),
    ("Atmósfera", "Colas de diciembre, abrigos, luces de calle, el directo del sorteo en la tele del bar y el grito al ver el número."),
]
c = ""
for i, (t, d) in enumerate(mood):
    y = 300 + i * 190
    c += etiqueta(t, 120, y, -2) + texto(d, 120, y + 50, 720, 24, "#222", 500)
add("navidad-mood", "Moodboard", sec(
    marker("Moodboard", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 520, 36, LIMA, -2, seed=28)
    + c
    + decimo(900, 140, 560, -5)
    + recorte("packaging.webp", 1560, 90, 270, 4)
    + recorte("tienda-noche.webp", 880, 520, 460, 3)
    + foto("foto-focaccias-oscuro.jpg", 1360, 600, 470, 300, -3)
    + f'<div style="{pos(120, 880, f"display:flex;gap:16px")}">'
    + "".join(f'<span style="width:90px;height:90px;background:{c_};border:3px solid {TINTA};display:block;transform:rotate({r}deg)"></span>'
              for c_, r in [(ROJO, -3), (LIMA, 2), ("#C9A227", -1), (CREMA, 3), (TINTA, -2)])
    + "</div>"
    + pie(n()),
))

ideas = [
    ("Los niños de San Divorare", "Reel / TikTok",
     "Parodia del sorteo: el equipo canta con la cantinela de San Ildefonso, pero en vez de premios salen focaccias. «Mortadella e pistacchio… ¡mil euros!». Teaser que lanza la campaña el 1 de diciembre."),
    ("¿Qué harías si te toca el Gordo?", "TikTok · calle",
     "Preguntamos en la cola qué haría cada uno con el Gordo. Respuestas reales y, al final, le damos el suyo: un décimo y una focaccia. Serie de 3 o 4 piezas en Madrid y Valencia."),
    ("El décimo más gordo", "Carrusel + stories",
     "Un décimo por local, fotografiado en cada uno de los 17. El 22, stories en directo con el número premiado y la reacción de los encargados en cada ciudad."),
]
c = ""
for i, (t, f, d) in enumerate(ideas):
    x = 120 + i * 580
    c += (
        carta(x, 300, 540, 560,
              f'<p style="font-family:{ANTON};font-size:70px;color:{ROJO};line-height:1">{i+1:02d}</p>'
              f'<p style="font-family:{MARKER};font-size:40px;line-height:1.05;margin-top:14px">{t}</p>'
              f'<p style="display:inline-block;margin-top:16px;background:{LIMA};padding:6px 14px;font-size:19px;font-weight:800;letter-spacing:1px;text-transform:uppercase">{f}</p>'
              f'<p style="font-size:25px;line-height:1.45;font-weight:500;margin-top:22px;color:#222">{d}</p>',
              [-1.5, 1, -1][i], 40)
        + cinta(x + 200, 286, [-6, 5, -4][i])
    )
add("navidad-ideas", "Tres ideas de contenido", sec(
    marker("Tres ideas de contenido", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 940, 36, LIMA, -2, seed=29)
    + c
    + texto("Las tres se graban en la ruta de rodajes de diciembre, sin producción extra: el decorado son vuestros locales y vuestras colas.", 120, 900, 1500, 24, GRIS, 700)
    + logo_esquina() + pie(n()),
))

add("navidad-activacion", "Activación y resultados", sec(
    marker("La activación", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 600, 36, LIMA, -2, seed=30)
    + lista([
        "<b>Del 1 al 21 de diciembre</b>, cada focaccia viene con un décimo Divorare numerado, en los 17 locales.",
        "Para jugar, el cliente registra su número con un QR, y así <b>se da de alta en el Club Devorador</b>.",
        "<b>El 22 de diciembre</b>, el número que coincide con las últimas cifras del Gordo real gana focaccias para todo un año.",
        "Todos los décimos llevan premio de consolación: <b>el reintegro</b>, una bebida gratis en enero, para traer de vuelta a la gente en el peor mes del año.",
    ], 120, 290, 1020, 26, 22)
    + carta(1230, 270, 590, 650,
            f'<p style="font-family:{ANTON};font-size:46px;line-height:1;text-transform:uppercase">Territorios que activa</p>'
            f'<div style="margin-top:20px;display:flex;flex-wrap:wrap;gap:12px">'
            + "".join(f'<span class="pildora">{t}</span>' for t in ["Ritual devorador", "Comunidad devoradora", "Italianidad instintiva"])
            + "</div>"
            f'<p style="font-family:{ANTON};font-size:46px;line-height:1;text-transform:uppercase;margin-top:40px">Qué buscamos</p>'
            + "".join(f'<p style="font-size:22px;line-height:1.4;font-weight:500;margin-top:14px;padding-left:32px;position:relative">'
                      f'<span style="position:absolute;left:0;color:{ROJO};font-family:{MARKER}">✕</span>{t}</p>' for t in [
                          "Más visitas en diciembre en los 17 locales.",
                          "Altas al Club Devorador con datos propios.",
                          "UGC con los décimos y conversación el 22.",
                          "Vuelta a local en enero con el reintegro.",
                      ]),
            2, 40)
    + "".join(
        carta(120 + i * 262, 690, 240, 170,
              f'<p style="font-family:{ANTON};font-size:40px;line-height:1;color:{ROJO}">{f}</p>'
              f'<p style="font-size:19px;line-height:1.35;font-weight:600;margin-top:10px">{d}</p>',
              [-2, 1.5, -1, 2][i], 22)
        for i, (f, d) in enumerate([
            ("1 DIC", "Teaser: los niños de San Divorare"),
            ("1–21 DIC", "Décimos en los 17 locales"),
            ("22 DIC", "Sorteo y stories en directo"),
            ("ENERO", "Vuelta a local con el reintegro"),
        ])
    )
    + texto("Las bases del sorteo se revisarían con vuestro asesor legal antes del lanzamiento.", 120, 900, 1020, 20, GRIS, 600)
    + pie(n()),
))

# ════════════════════════════════════════════════════════════════════════
# CIERRE
# ════════════════════════════════════════════════════════════════════════
add("cierre", "Grazie mille", sec(
    f'<img src="{A}/foto-focaccias-oscuro.jpg" alt="" style="{pos(0, 0, "width:1920px;height:1080px;object-fit:cover;opacity:.55")}">'
    + anton("¿Devoramos", 120, 200, 240, "#fff")
    + marker("juntos?", 160, 440, 220, ROJO, -4)
    + texto("Gracias por invitarnos al proceso. Nos encantaría presentaros todo esto en persona.", 120, 720, 1000, 32, "#fff", 600)
    + texto("Jandro Martín · jandro@maenstudios.com · +34 688 629 688", 120, 820, 1200, 28, LIMA, 700)
    + maen(120, 900, 360, claro=True)
    + logo(1440, 300, 360, rot=6)
    + corona(1530, 170, 160, LIMA, 8)
    + pie(n(), True),
    "asfalto",
))

# ── Salida ────────────────────────────────────────────────────────────────
out = Path("app/pitch/divorare/diapos.ts")
cabecera = (
    "/**\n"
    " * Propuesta de Maen Studios para el concurso de agencias de Divorare (nov 2026).\n"
    " * Generado con scripts/build-divorare.py: si cambia el contenido o los\n"
    " * precios, se edita el script y se vuelve a ejecutar.\n"
    " */\n\n"
    "export type DiapoHtml = { id: string; titulo: string; html: string };\n\n"
    "export const DIAPOS: DiapoHtml[] = "
)
out.write_text(cabecera + json.dumps(slides, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
print(f"{len(slides)} diapositivas → {out}")
