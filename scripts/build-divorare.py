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


def chip(t, bg=LIMA, color=TINTA, size=18):
    return (
        f'<span style="display:inline-block;background:{bg};color:{color};padding:5px 12px 4px;'
        f'font-size:{size}px;font-weight:800;letter-spacing:1px;text-transform:uppercase;'
        f'margin:0 8px 8px 0;white-space:nowrap">{t}</span>'
    )


def bullets(items, size=22, gap=12, color=TINTA, bullet=ROJO):
    return "".join(
        f'<p style="font-size:{size}px;line-height:1.4;font-weight:500;margin-top:{gap}px;'
        f'padding-left:30px;position:relative;color:{color}">'
        f'<span style="position:absolute;left:0;color:{bullet};font-family:{MARKER}">✕</span>{it}</p>'
        for it in items
    )


def divisoria(id_, parte, l1, l2, sub, pide=None):
    """Portada de bloque, como las «PART 0X» del brief, con lo que piden en ese bloque."""
    b = (
        f'<svg width="330" height="110" viewBox="0 0 330 110" style="{pos(110, 110, "transform:rotate(-6deg)")}">'
        f'<ellipse cx="165" cy="55" rx="150" ry="40" fill="none" stroke="{LIMA}" stroke-width="7"/></svg>'
        + marker(f"PART {parte:02d}", 168, 138, 50, TINTA, -6)
        + anton(l1, 130, 250, min(250, int(1330 / (0.5 * len(l1)))), "#fff", extra="text-shadow:0 4px 0 rgba(0,0,0,.08)")
        + brocha(110, 640, 1180, 120, LIMA, -2, seed=parte + 4)
        + marker(l2, 150, 520, min(170, int(1300 / (0.66 * len(l2)))), TINTA, -3)
        + texto(sub, 150, 800, 1000, 40, TINTA, 800, "text-transform:uppercase;font-family:Anton,Impact,sans-serif;letter-spacing:1px;font-weight:400")
        + subrayado(140, 870, 620, ROJO)
        + flecha(1250, 560, 300, LIMA, -14)
        + corona(1560, 120, 150)
        + logo(1510, 230, 300, rot=4)
        + pie(n())
    )
    if pide:
        b += carta(1180, 720, 650, 250,
                   f'<p style="font-size:17px;font-weight:800;letter-spacing:3px;color:{ROJO}">LO QUE NOS PEDÍS</p>'
                   f'<p style="font-size:23px;line-height:1.4;font-weight:600;margin-top:10px">{pide}</p>', 2, 30)
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

# 04 · CHECKLIST: todo lo que pide el brief, con su página
pedidos = [
    ("01", "Brand understanding", "Lectura, fortalezas, oportunidades y retos", "p1"),
    ("02", "Creative vision", "Concepto a 12 meses, narrativas y estilo", "p2"),
    ("03", "Brand territories", "Los cinco territorios con ejemplos y formatos", "p3"),
    ("04", "Content strategy", "Pilares, formatos, frecuencia, Instagram y TikTok", "p4"),
    ("05", "Community & influence", "Conversación, UGC, fidelización y creadores", "p5"),
    ("06", "Production & execution", "Grabación, foto, edición, gestión y trabajos reales", "p6"),
    ("07", "Team & ways of working", "Equipo, interlocutores, calendario y aprobaciones", "p7"),
    ("08", "Measurement & KPIs", "Indicadores, reporting, aprendizajes y optimización", "p8"),
    ("09", "Financial proposal", "Honorarios, entregables, volumen, extras y opcionales", "p9"),
    ("10", "Christmas challenge", "Concepto, moodboard, 3 ideas, activación y resultados", "p10"),
]
c = ""
for i, (nn, b, d, ref) in enumerate(pedidos):
    col, fila = divmod(i, 5)
    x = 120 + col * 860
    y = 300 + fila * 130
    c += (
        f'<div style="{pos(x, y + 6, f"width:44px;height:44px;border:4px solid {TINTA};background:{LIMA}")}"></div>'
        + marker("✓", x + 6, y - 8, 52, ROJO, 0)
        + anton(f"{nn} · {b}", x + 76, y, 40, TINTA)
        + texto(d, x + 78, y + 50, 600, 21, GRIS, 600)
        + f'<p class="marker" style="{pos(x + 690, y + 4)}font-size:40px;color:{ROJO}">p. {{{{p:{ref}}}}}</p>'
    )
add("checklist", "Respondemos a todo", sec(
    marker("Respondemos a todo lo que pedís", 120, 100, 80, TINTA, -3)
    + brocha(100, 196, 1130, 34, LIMA, -2, seed=40)
    + texto("Seguimos el orden de vuestro brief, bloque por bloque. Cada uno empieza con lo que nos pedís y termina con nuestra respuesta.", 120, 240, 1600, 25, "#333", 600)
    + c
    + logo_esquina() + pie(n()),
))

# ════════════════════════════════════════════════════════════════════════
# 01 · BRAND UNDERSTANDING
# ════════════════════════════════════════════════════════════════════════
divisoria("p1", 1, "BRAND", "Understanding", "Nuestra lectura de Divorare",
          "Vuestra lectura de Divorare: fortalezas, oportunidades y retos de comunicación.")

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
    marker("Los retos de comunicación", 120, 110, 84, TINTA, -3)
    + brocha(100, 214, 900, 36, LIMA, -2, seed=7)
    + c
    + recorte("cola.webp", 1350, 300, 470, 4)
    + carta(1390, 690, 400, 170,
            f'<p style="font-family:{MARKER};font-size:30px;line-height:1.15">Del vídeo a la fila…</p>'
            f'<p style="font-family:{MARKER};font-size:30px;line-height:1.15;color:{ROJO}">…y de la fila al club.</p>', -4)
    + logo_esquina() + pie(n()),
))

# Oportunidades
oport = [
    ("TikTok como canal de personalidad", "Instagram ya es vuestro escaparate. TikTok puede ser donde Divorare tenga voz, caras y humor propios, con formatos nativos y no reels reciclados."),
    ("Series que la gente espera", "Pasar de publicaciones sueltas a formatos recurrentes con nombre propio: la manera más rápida de construir reconocimiento y fidelidad."),
    ("Lo local como contenido", "Diecisiete locales en siete ciudades son diecisiete escenarios y diecisiete comunidades. Cada apertura es una historia que contar."),
    ("El Club Devorador como motor", "Convertir seguidores en miembros con datos propios: lanzamientos antes que nadie, dinámicas y premios que llevan gente al local."),
]
c = ""
for i, (tt, d) in enumerate(oport):
    col, fila = divmod(i, 2)
    x = 120 + col * 820
    y = 300 + fila * 300
    c += carta(x, y, 780, 260,
               f'<p style="font-family:{ANTON};font-size:46px;line-height:1;text-transform:uppercase">{tt}</p>'
               f'<p style="font-size:23px;line-height:1.45;font-weight:500;margin-top:16px;color:#222">{d}</p>',
               [-1, 1, 1, -1][i], 36) + num(i + 1, x - 10, y - 40, 50, ROJO, -6)
add("oportunidades", "Las oportunidades", sec(
    marker("Las oportunidades", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 760, 36, LIMA, -2, seed=41)
    + c
    + texto("Fortalezas, retos y oportunidades salen de vuestro brief, de la reunión del 27 de octubre y de lo que vemos como clientes de vuestros locales.", 120, 930, 1600, 21, GRIS, 600)
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
divisoria("p2", 2, "CREATIVE", "Vision", "El concepto para los próximos 12 meses",
          "Un concepto o dirección creativa para los próximos 12 meses, con sus narrativas y su estilo de contenido.")

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
divisoria("p3", 3, "BRAND", "Territories", "Cinco territorios, siete series propias",
          "Cómo activaríamos vuestros cinco territorios de marca, con ejemplos de contenidos y formatos.")

add("territorios", "De territorio a serie", sec(
    marker("De territorio a serie", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 860, 36, LIMA, -2, seed=15)
    + texto("Los territorios no se activan con posts sueltos sino con <b>formatos recurrentes</b> que la gente reconoce y espera. Cada territorio tiene al menos una serie propia, y respetamos lo que vuestro brief marca como esencial.", 120, 262, 1600, 27, "#333", 600)
    + "".join(
        carta(120 + i * 340, 400, 310, 400,
              f'<p style="font-family:{ANTON};font-size:66px;color:{ROJO};line-height:1">{i+1:02d}</p>'
              f'<p style="font-family:{MARKER};font-size:33px;line-height:1.05;margin-top:12px">{tt}</p>'
              f'<p style="font-size:19px;font-weight:800;letter-spacing:2px;text-transform:uppercase;margin-top:22px;color:{GRIS}">Series</p>'
              f'<p style="font-size:24px;font-weight:700;line-height:1.35;margin-top:6px">{s}</p>',
              [-1.5, 1, -1, 1.5, -1][i], 30)
        for i, (tt, s) in enumerate([
            ("El ritual devorador", "El Corte"),
            ("Artesanía real", "48 Horas · Detrás de la barra"),
            ("Comunidad devoradora", "¿Qué devoras? · Devorador del mes"),
            ("Arte urbano", "Paredes"),
            ("Italianidad instintiva", "Parla come mangi"),
        ])
    )
    + texto("En las cinco páginas siguientes, cada territorio con su serie, tres piezas de ejemplo y su formato.", 120, 860, 1500, 24, GRIS, 700)
    + logo_esquina() + pie(n()),
))

TERRITORIOS = [
    {
        "id": "t-ritual", "nombre": "El ritual devorador", "img": "trio.webp",
        "idea": "Comer Divorare es un ritual con su propia liturgia: el papel, el corte, las dos manos, el primer bocado. Lo convertimos en firma visual.",
        "preservar": "El producto como símbolo de placer, energía y actitud.",
        "series": [("El Corte", "Cada semana, una focaccia abierta en cámara lenta y con el sonido real del crujido. Siempre el mismo plano, para que se reconozca sin ver el logo.")],
        "ejemplos": [
            ("El Corte #12: Mortadella e Pistacchio", "Reel 15 s", "IG + TikTok", "Plano cenital fijo, cuchillo, crujido y caída de la burrata. Sin música: solo sonido."),
            ("Antojo de las 18:00", "Story + TikTok", "IG + TikTok", "Frases que dan hambre a la hora de la merienda, con la brocha de la marca encima de la foto."),
            ("Cómo se devora una Divorare", "Carrusel 6 láminas", "Instagram", "Guía irreverente del ritual: dónde se sujeta, cuántas servilletas y quién se queda la última esquina."),
        ],
    },
    {
        "id": "t-artesania", "nombre": "Artesanía real", "img": "eco-artesania.webp",
        "idea": "Detrás de cada focaccia hay 48 horas, ingredientes italianos y un equipo. Lo enseñamos sin artificio, con manos, harina y horno.",
        "preservar": "La verdad del proceso, la calidad de los ingredientes y el carácter artesanal.",
        "series": [("48 Horas", "Del saco de harina al primer mordisco, contado en un minuto."),
                   ("Detrás de la barra", "El día a día del equipo: turnos, prisas y bromas.")],
        "ejemplos": [
            ("48 Horas en 48 segundos", "Reel / TikTok 48 s", "IG + TikTok", "Timelapse de la fermentación con un contador en pantalla. Del amasado a la vitrina."),
            ("De Italia a tu focaccia", "Carrusel 8 láminas", "Instagram", "La mortadela, la burrata y el pistacho: de dónde vienen, quién los produce y por qué esos."),
            ("Turno de apertura, 7:00", "TikTok 30 s · POV", "TikTok", "La primera hora del obrador en primera persona, con el audio original del equipo."),
        ],
    },
    {
        "id": "t-comunidad", "nombre": "Comunidad devoradora", "img": "eco-lifestyle.webp",
        "idea": "Divorare son las personas que hacen cola, comparten y vuelven. Las ponemos delante de la cámara, por encima de cualquier actor.",
        "preservar": "La autenticidad de la comunidad y su conexión real con la marca.",
        "series": [("¿Qué devoras?", "Entrevistas rápidas en la cola."),
                   ("Devorador del mes", "El cliente más fiel de cada ciudad, protagonista.")],
        "ejemplos": [
            ("¿Qué devoras? · Valencia", "TikTok 30–45 s", "TikTok", "Tres preguntas rápidas en la cola: qué pides, con quién vienes y qué harías por la última focaccia."),
            ("Devorador del mes: Lucas, 47 visitas", "Reel + post Collab", "Instagram", "Mini perfil del cliente y premio del club. Se publica en colaboración con su cuenta."),
            ("Vuestras mejores fotos", "Carrusel UGC", "Instagram", "Selección mensual de lo que publica la comunidad, con crédito a cada cuenta."),
        ],
    },
    {
        "id": "t-arte", "nombre": "Arte urbano", "img": "mural.webp",
        "idea": "Divorare forma parte de la escena creativa de cada ciudad. Llevamos su lenguaje de grafiti, murales y tipografía a colaboraciones reales.",
        "preservar": "El lenguaje visual de la marca y su conexión con la cultura urbana.",
        "series": [("Paredes", "Un artista por temporada interviene un local, el papel o una edición limitada.")],
        "ejemplos": [
            ("Paredes #1: el mural de Malasaña", "Mini documental 60 s", "IG + TikTok", "Del boceto al último spray, con el artista explicando qué es para él Divorare."),
            ("Papel de edición limitada", "Reel 20 s + carrusel", "Instagram", "Un artista local diseña el papel de envolver durante un mes. Se colecciona."),
            ("Tipografía de calle", "Stories + TikTok", "IG + TikTok", "Frases de la carta pintadas con la brocha de la marca sobre las paredes del local."),
        ],
    },
    {
        "id": "t-italia", "nombre": "Italianidad instintiva", "img": "italia.webp",
        "idea": "Italia sin postal: lo que hace de verdad un italiano con la comida, la moda, el arte y la vida de calle, contado con humor.",
        "preservar": "La esencia italiana auténtica, sin estereotipos vacíos.",
        "series": [("Parla come mangi", "El equipo italiano traduce Italia: expresiones, gestos y costumbres.")],
        "ejemplos": [
            ("Parla come mangi: «Scarpetta»", "TikTok 25 s", "TikTok", "Qué significa, cómo se hace y por qué en Divorare no se deja ni una miga."),
            ("Errores de español en Italia", "Reel 30 s", "IG + TikTok", "El equipo reacciona a la «comida italiana» que se ve en España. Con cariño y sin piedad."),
            ("La dolce vita también se devora", "Carrusel 6 láminas", "Instagram", "Referencias de cine, moda y diseño italiano que inspiran cada temporada."),
        ],
    },
]

for i, T in enumerate(TERRITORIOS):
    ser = "".join(
        f'<p style="font-family:{MARKER};font-size:30px;line-height:1.1;margin-top:14px;color:{ROJO}">{s}</p>'
        f'<p style="font-size:20px;line-height:1.4;font-weight:500;margin-top:4px">{d}</p>'
        for s, d in T["series"]
    )
    ej = ""
    for k, (tt, fmt, pl, d) in enumerate(T["ejemplos"]):
        x = 820 + k * 345
        ej += carta(x, 300, 320, 600,
                    f'<p style="font-size:16px;font-weight:800;letter-spacing:2px;color:{GRIS}">EJEMPLO {k+1}</p>'
                    f'<p style="font-family:{MARKER};font-size:31px;line-height:1.1;margin-top:10px">{tt}</p>'
                    f'<div style="margin-top:16px">{chip(fmt)}{chip(pl, TINTA, "#fff")}</div>'
                    f'<p style="font-size:23px;line-height:1.45;font-weight:500;margin-top:8px;color:#222">{d}</p>',
                    [-1.5, 1, -1][k], 28)
    add(T["id"], T["nombre"], sec(
        texto(f"TERRITORIO {i+1:02d} DE 05", 120, 96, 600, 20, ROJO, 800, "letter-spacing:4px")
        + marker(T["nombre"], 120, 130, 74, TINTA, -3)
        + brocha(100, 226, 640, 30, LIMA, -2, seed=50 + i)
        + texto(T["idea"], 120, 290, 620, 24, "#222", 600)
        + etiqueta("Esencial preservar", 120, 470, -2)
        + texto(T["preservar"], 120, 515, 620, 22, "#333", 500)
        + f'<div style="{pos(120, 600)}width:620px">{ser}</div>'
        + f'<img src="{A}/{T["img"]}" alt="" class="recorte" style="{pos(120, 790, "width:620px;height:190px;object-fit:contain;object-position:left center;transform:rotate(-2deg)")}">'
        + ej
        + logo_esquina() + pie(n()),
    ))

# ════════════════════════════════════════════════════════════════════════
# 04 · CONTENT STRATEGY
# ════════════════════════════════════════════════════════════════════════
divisoria("p4", 4, "CONTENT", "Strategy", "Pilares, formatos y frecuencia",
          "Pilares editoriales, formatos, frecuencia y enfoque para Instagram y TikTok.")

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
    + texto("Los seis bloques de vuestro ecosistema de contenido, con su peso en el calendario.", 120, 256, 1300, 27, "#333", 600)
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
     ["Estética cuidada y consistente: es vuestro escaparate y la carta de presentación ante futuros franquiciados.",
      "Reels de las series, carruseles de producto y de cultura, y fotografía de producto de alto nivel.",
      "Stories cada día: locales, novedades, encuestas, reposts de la comunidad."],
     "5 publicaciones / semana + stories diarias"),
    ("TikTok", "La personalidad de la marca",
     ["Más crudo, más rápido y con caras: el equipo y los clientes hablan a cámara.",
      "¿Qué devoras?, Detrás de la barra, Parla come mangi y tendencias del momento.",
      "Piezas grabadas en vertical y con audio nativo, no reels reciclados."],
     "5 vídeos / semana"),
]
c = ""
for i, (pl, rol, its, fr) in enumerate(plataformas):
    x = 120 + i * 840
    c += carta(x, 300, 780, 600,
               f'<p style="font-family:{ANTON};font-size:84px;line-height:1;text-transform:uppercase">{pl}</p>'
               f'<p style="font-family:{MARKER};font-size:38px;color:{ROJO};margin-top:10px">{rol}</p>'
               + bullets(its, 24, 20)
               + f'<p style="margin-top:34px;display:inline-block;background:{LIMA};padding:10px 18px;font-size:24px;font-weight:800">{fr}</p>',
               [-1, 1][i], 44)
add("plataformas", "Instagram y TikTok", sec(
    marker("Cada red, su papel", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 760, 36, LIMA, -2, seed=19)
    + c
    + logo_esquina() + pie(n()),
))

formatos = [
    ("Reel de serie", "15–60 s", "IG + TikTok", "3 / semana", "El Corte, 48 Horas, Paredes"),
    ("TikTok nativo", "15–45 s", "TikTok", "2–3 / semana", "Caras, calle, tendencias, POV"),
    ("Carrusel", "5–8 láminas", "Instagram", "2 / semana", "Producto, origen, cultura, planes"),
    ("Foto de producto", "—", "IG, web y delivery", "40 / mes", "Carta completa y novedades"),
    ("Stories", "5–10 al día", "Instagram", "Diario", "Locales, encuestas, UGC, avisos"),
    ("Post Collab", "—", "Instagram", "2 / mes", "Con creadores, artistas y clientes"),
    ("Campaña", "Variable", "IG + TikTok", "Por temporada", "Lanzamientos, aperturas, Navidad"),
]
filas = "".join(
    f'<tr style="{"background:rgba(212,251,4,.35);" if k % 2 == 0 else ""}">'
    f'<td style="font-family:{ANTON};font-size:30px;text-transform:uppercase;padding:14px 18px">{a}</td>'
    f'<td style="font-size:22px;font-weight:600;padding:14px 18px">{b}</td>'
    f'<td style="font-size:22px;font-weight:600;padding:14px 18px">{c_}</td>'
    f'<td style="font-size:22px;font-weight:800;padding:14px 18px;color:{ROJO}">{d}</td>'
    f'<td style="font-size:21px;font-weight:500;padding:14px 18px;color:#333">{e}</td></tr>'
    for k, (a, b, c_, d, e) in enumerate(formatos)
)
cab = "".join(
    f'<th style="font-size:17px;font-weight:800;letter-spacing:2px;text-transform:uppercase;padding:12px 18px;border-bottom:4px solid {TINTA};text-align:left">{h}</th>'
    for h in ["Formato", "Duración", "Dónde", "Frecuencia", "Para qué"]
)
add("formatos", "Formatos y frecuencia", sec(
    marker("Formatos y frecuencia", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 860, 36, LIMA, -2, seed=42)
    + f'<table style="{pos(120, 280)}width:1680px;background:{CREMA};box-shadow:0 14px 30px rgba(0,0,0,.12)"><thead><tr>{cab}</tr></thead><tbody>{filas}</tbody></table>'
    + texto("Volúmenes del plan Devorador. Los tres planes y lo que incluye cada uno están en el bloque 09.", 120, 940, 1500, 21, GRIS, 700)
    + logo_esquina() + pie(n()),
))

semana = [
    ("Lun", "Reel · El Corte", "Local del día", "Detrás de la barra"),
    ("Mar", "Carrusel · producto", "Encuesta: ¿cuál pides?", "¿Qué devoras?"),
    ("Mié", "—", "Behind the scenes", "Parla come mangi"),
    ("Jue", "Reel · serie de temporada", "Novedades y avisos", "Tendencia de la semana"),
    ("Vie", "Carrusel · plan de finde", "Reposts de la comunidad", "El Corte, versión nativa"),
    ("Sáb", "Reel · UGC o Devorador del mes", "Directo desde un local", "—"),
    ("Dom", "—", "Resumen de la semana", "—"),
]
colw = [150, 520, 500, 500]
cols = ["", "Instagram feed", "Instagram stories", "TikTok"]
g = ""
x0 = 120
for j, hname in enumerate(cols):
    x = x0 + sum(colw[:j])
    if hname:
        g += f'<p style="{pos(x + 12, 280)}font-size:18px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:{ROJO}">{hname}</p>'
for k, fila in enumerate(semana):
    y = 320 + k * 86
    g += f'<div style="{pos(x0, y, f"width:{sum(colw)}px;height:76px;background:{CREMA};box-shadow:0 6px 14px rgba(0,0,0,.08)")}"></div>'
    for j, val in enumerate(fila):
        x = x0 + sum(colw[:j])
        if j == 0:
            g += f'<p class="anton" style="{pos(x + 20, y + 16)}font-size:40px;color:{TINTA}">{val}</p>'
        else:
            bg = "" if val == "—" else f"border-left:6px solid {LIMA if j == 1 else (ROJO if j == 3 else TINTA)};"
            g += f'<p style="{pos(x + 12, y + 22)}width:{colw[j]-24}px;{bg}padding-left:14px;font-size:22px;font-weight:700;color:{"#999" if val == "—" else TINTA}">{val}</p>'
add("semana", "Una semana tipo", sec(
    marker("Una semana tipo", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 640, 36, LIMA, -2, seed=43)
    + g
    + texto("× 4 semanas = un mes. Las series se alternan para que ninguna se repita dos semanas seguidas en el mismo hueco.", 120, 940, 1500, 21, GRIS, 700)
    + logo_esquina() + pie(n()),
))

add("ciudades", "Una marca, 17 locales", sec(
    marker("Una marca, 17 locales", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 860, 36, LIMA, -2, seed=20)
    + texto("Con siete ciudades y un modelo de franquicia en marcha, la cuenta central tiene que hablar en nombre de todos sin perder lo local.", 120, 262, 1500, 27, "#333", 600)
    + "".join(
        carta(120 + i * 560, 340, 520, 340,
              f'<p style="font-family:{ANTON};font-size:60px;line-height:1;text-transform:uppercase">{tt}</p>'
              f'<p style="font-size:23px;line-height:1.45;font-weight:500;margin-top:22px;color:#222">{d}</p>',
              [-1.5, 1, -1][i], 40)
        for i, (tt, d) in enumerate([
            ("Hub central", "Una sola cuenta con una sola voz y una dirección visual común. Madrid, con 10 locales, es la base de producción semanal."),
            ("Rutas por ciudad", "Rodajes en Valencia, Sevilla, Zaragoza, Salamanca, Granada y Alcalá. Cada ciudad tiene su momento en el calendario."),
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
divisoria("p5", 5, "COMMUNITY", "& Influence", "Comunidad más allá del seguidor",
          "Estrategia para generar conversación, UGC, fidelización y colaboraciones con creadores.")

comunidad = [
    ("Conversación", "Encuestas, retos y debates que piden respuesta («¿mortadela o porchetta?»). Respondemos comentarios y mensajes con el tono de la marca, de tú a tú y sin plantillas."),
    ("UGC con criterio", "Hashtag y formato de reposteo propios. Cada mes seleccionamos lo mejor de lo que publica vuestra gente y lo convertimos en contenido, siempre con crédito."),
    ("Fidelización: Club Devorador", "Le damos contenido propio: lanzamientos antes que nadie, dinámicas exclusivas, Devorador del mes y premios que se canjean en local."),
    ("Escucha social", "Seguimos qué se dice de Divorare y de la categoría en Instagram, TikTok y Google. Lo que funciona en la conversación entra en el calendario."),
]
c = ""
for i, (tt, d) in enumerate(comunidad):
    col, fila = divmod(i, 2)
    x = 120 + col * 640
    y = 290 + fila * 320
    c += carta(x, y, 600, 290,
               f'<p style="font-family:{MARKER};font-size:38px;line-height:1.05">{tt}</p>'
               f'<p style="font-size:22px;line-height:1.45;font-weight:500;margin-top:16px;color:#222">{d}</p>',
               [-1, 1, 1, -1][i], 36)
add("comunidad", "Comunidad y fidelización", sec(
    marker("Comunidad, no audiencia", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 940, 36, LIMA, -2, seed=21)
    + c
    + recorte("eco-lifestyle.webp", 1420, 330, 420, 3)
    + carta(1440, 640, 380, 250,
            f'<p style="font-family:{MARKER};font-size:30px;line-height:1.1;color:{ROJO}">Del seguidor al miembro</p>'
            f'<p style="font-size:20px;line-height:1.45;font-weight:600;margin-top:12px">Seguir → comentar → publicar → apuntarse al club → volver al local.</p>', -2, 28)
    + logo_esquina() + pie(n()),
))

niveles = [
    ("Creadores de referencia", "3 al año · según temporada", "Perfiles gastronómicos y urbanos del tipo de Jack Dining Room, para los grandes momentos de cada temporada."),
    ("Microinfluencers locales", "5–10 al mes", "Cuentas de cada ciudad con comunidad real. Visitas honestas que llenan el local de su barrio."),
    ("UGC de Maen Talents", "Bajo demanda", "Creadores de nuestra cantera que graban piezas para vuestra cuenta y para anuncios."),
]
c = ""
for i, (tt, f_, d) in enumerate(niveles):
    x = 120 + i * 440
    c += carta(x, 290, 410, 360,
               f'<p style="font-family:{MARKER};font-size:34px;line-height:1.05">{tt}</p>'
               f'<div style="margin-top:14px">{chip(f_)}</div>'
               f'<p style="font-size:21px;line-height:1.45;font-weight:500;margin-top:8px;color:#222">{d}</p>',
               [-1.5, 1, -1][i], 32)
pasos = ["Identificación", "Contacto", "Briefing", "Rodaje", "Publicación", "Resultados"]
pp = "".join(
    f'<div style="{pos(120 + k * 225, 720, f"width:200px;height:110px;background:{TINTA if k < 5 else ROJO};color:#fff;transform:rotate({[-2, 1, -1, 2, -1, 1][k]}deg);padding:16px")}">'
    f'<p style="font-family:{ANTON};font-size:34px;color:{LIMA}">{k+1:02d}</p>'
    f'<p style="font-size:20px;font-weight:800;margin-top:4px">{s}</p></div>'
    for k, s in enumerate(pasos)
)
add("creadores", "Creadores", sec(
    marker("Creadores, con método", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 820, 36, LIMA, -2, seed=44)
    + c
    + pp
    + texto("Medimos cada colaboración por alcance, guardados, menciones, visitas con código y altas al Club Devorador. Los fees de los creadores se pactan aparte, con vuestra aprobación.", 120, 880, 1300, 21, GRIS, 700)
    + recorte("jack-video.webp", 1490, 260, 340, 4)
    + carta(1480, 720, 350, 170,
            f'<p style="font-size:17px;font-weight:800;letter-spacing:2px;color:{ROJO}">CRITERIOS</p>'
            f'<p style="font-size:19px;line-height:1.4;font-weight:600;margin-top:8px">Afinidad urbana, comunidad real, local y sin filtros. Nada de perfiles comprados.</p>', 2, 24)
    + pie(n()),
))

# ════════════════════════════════════════════════════════════════════════
# 06 · PRODUCTION & EXECUTION
# ════════════════════════════════════════════════════════════════════════
divisoria("p6", 6, "PRODUCTION", "& Execution", "Cómo rodamos y trabajos reales",
          "Metodología de grabación, fotografía, edición, gestión y planificación, con ejemplos de trabajos reales.")

ciclo = [
    ("Semana 1", "Planificación", "Calendario del mes siguiente, guiones y briefing de rodaje. Lo aprobáis vosotros."),
    ("Semana 2", "Rodajes", "Sesiones de unas 4 horas por local, con cámara de cine, móvil para TikTok y set de foto de producto."),
    ("Semana 3", "Edición", "Montaje, color, sonido y textos. Dos rondas de cambios incluidas."),
    ("Semana 4", "Publicación", "Calendario cerrado y programado. Trabajamos siempre con un mes de margen."),
]
c = ""
for i, (s, tt, d) in enumerate(ciclo):
    x = 120 + i * 430
    c += (
        carta(x, 330, 400, 420,
              f'<p style="font-size:20px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:{ROJO}">{s}</p>'
              f'<p style="font-family:{ANTON};font-size:62px;line-height:1;margin-top:10px;text-transform:uppercase">{tt}</p>'
              f'<p style="font-size:23px;line-height:1.45;font-weight:500;margin-top:20px;color:#222">{d}</p>',
              [-1.5, 1, -1, 1.5][i], 36)
        + (flecha(x + 350, 520, 110, ROJO, 0, 6) if i < 3 else "")
    )
add("produccion", "Metodología", sec(
    marker("Un ciclo mensual, sin sorpresas", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 1100, 36, LIMA, -2, seed=22)
    + texto("Producción 100 % propia: no subcontratamos ni la cámara, ni la foto, ni la edición.", 120, 260, 1300, 27, "#333", 600)
    + c
    + lista([
        "Madrid: rodaje semanal con nuestro equipo de cámara de Madrid, a pocos minutos de vuestros locales.",
        "Resto de ciudades: rutas de rodaje coordinadas con los encargados de cada local.",
        "Todo el material en bruto y editado os queda en Drive, ordenado por mes y por local.",
    ], 120, 800, 1600, 24, 10)
    + logo_esquina() + pie(n()),
))

estandares = [
    ("Grabación", ["Cámara de cine 4K, gimbal y ópticas luminosas.", "Móvil dedicado para piezas nativas de TikTok.", "Sonido directo: el crujido también se graba."]),
    ("Fotografía", ["Set portátil de producto para cada rodaje.", "Toda la carta y cada novedad, en vertical y horizontal.", "Banco de fotos listo para web, delivery y franquicias."]),
    ("Edición", ["Color propio de Divorare, igual en todas las ciudades.", "Rótulos y subtítulos con la brocha de la marca.", "Versiones por red: 9:16, 4:5 y 1:1."]),
    ("Gestión", ["Calendario en Canva con cada pieza enlazada en Drive.", "Nombres y carpetas por mes, serie y local.", "Contenido reactivo de tendencias en 24–48 horas."]),
]
c = ""
for i, (tt, its) in enumerate(estandares):
    x = 120 + i * 430
    c += carta(x, 290, 400, 470,
               f'<p style="font-family:{ANTON};font-size:52px;line-height:1;text-transform:uppercase">{tt}</p>'
               + bullets(its, 22, 16),
               [-1, 1.5, -1.5, 1][i], 36)
add("estandares", "Estándares de producción", sec(
    marker("Grabación, foto, edición y gestión", 120, 100, 80, TINTA, -3)
    + brocha(100, 200, 1180, 34, LIMA, -2, seed=45)
    + c
    + f'<img src="{A}/equipo.webp" alt="" class="recorte" style="{pos(120, 790, "width:280px;height:190px;object-fit:contain;transform:rotate(-3deg)")}">'
    + texto("El mismo estándar para Madrid que para Granada: la consistencia visual es lo que hace que 17 locales parezcan una sola marca.", 440, 840, 1300, 26, TINTA, 700)
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
divisoria("p7", 7, "TEAM", "& Ways of Working", "Equipo, interlocutores y ciclo mensual",
          "Equipo asignado, responsabilidades, interlocutores, calendario de trabajo y aprobaciones.")

equipo = [
    ("Jandro", "Dirección de cuentas", "Interlocutor principal con Divorare. Estrategia, negocio y prioridades."),
    ("Richi", "Dirección creativa", "Concepto, temporadas, series y supervisión de cada pieza."),
    ("Helen", "Brand manager", "Lleva el día a día de la cuenta: calendario, briefings y aprobaciones."),
    ("Laura", "Community manager · Madrid", "Publicación, stories, comunidad y coordinación con los locales."),
    ("Mati y Víctor", "Dirección de fotografía", "Rodajes semanales en Madrid y rutas por ciudades."),
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
            f'<p style="font-family:{ANTON};font-size:52px;line-height:1;text-transform:uppercase">Interlocutores</p>'
            + bullets([
                "Un único interlocutor por cada lado: Jandro en Maen y vuestra brand manager en Divorare.",
                "Helen, en copia de todo y disponible a diario.",
                "Encargados de cada local: punto de contacto para rodajes y stories.",
                "Llamada de seguimiento de 30 minutos cada semana.",
                "Grupo directo para urgencias y aprobaciones rápidas.",
            ], 22, 16),
            2, 40)
    + pie(n()),
))

hitos = [
    ("Días 1–5", "Propuesta", "Calendario del mes siguiente, guiones y plan de rodajes."),
    ("Día 8", "Aprobación", "Lo revisáis en una llamada de 45 minutos y lo validáis por escrito."),
    ("Días 10–20", "Rodajes", "Madrid cada semana y la ruta de ciudades del mes."),
    ("Días 15–25", "Entregas", "Por tandas, con dos rondas de cambios. Respuesta en 48 horas."),
    ("Día 28", "Cierre", "Mes siguiente programado. Reunión de resultados del mes que acaba."),
]
c = ""
for i, (d_, tt, d) in enumerate(hitos):
    x = 120 + i * 345
    c += (
        f'<div style="{pos(x, 470, f"width:28px;height:28px;border-radius:99px;background:{ROJO};border:5px solid {TINTA}")}"></div>'
        + carta(x - 10, 530, 320, 280,
                f'<p style="font-family:{ANTON};font-size:44px;line-height:1;color:{ROJO}">{d_}</p>'
                f'<p style="font-family:{MARKER};font-size:32px;margin-top:10px">{tt}</p>'
                f'<p style="font-size:20px;line-height:1.42;font-weight:500;margin-top:10px">{d}</p>',
                [-1.5, 1, -1, 1.5, -1][i], 26)
    )
add("aprobaciones", "Calendario y aprobaciones", sec(
    marker("Calendario de trabajo y aprobaciones", 120, 100, 76, TINTA, -3)
    + brocha(100, 196, 1300, 32, LIMA, -2, seed=46)
    + texto("Cada mes funciona igual, para que vuestro equipo sepa cuándo le toca revisar y nunca le pillemos con prisas.", 120, 250, 1500, 25, "#333", 600)
    + f'<div style="{pos(120, 482, f"width:1640px;height:6px;background:{TINTA}")}"></div>'
    + c
    + carta(120, 850, 1700, 110,
            f'<p style="font-size:22px;line-height:1.4;font-weight:600"><span style="font-family:{MARKER};color:{ROJO};font-size:28px">Contenido reactivo:</span> '
            f'tendencias y momentos del día se proponen por el grupo directo y salen en 24 horas con un «ok» de vuestra brand manager.</p>', 0, 24)
    + logo_esquina() + pie(n()),
))

# ════════════════════════════════════════════════════════════════════════
# 08 · MEASUREMENT & KPIs
# ════════════════════════════════════════════════════════════════════════
divisoria("p8", 8, "MEASUREMENT", "& KPIs", "Qué medimos y cómo mejoramos",
          "Indicadores, reporting, aprendizajes y proceso de optimización.")

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

loop = [
    ("Medir", "Cada pieza, por serie, formato, hora y ciudad."),
    ("Aprender", "Un registro de aprendizajes que crece mes a mes."),
    ("Probar", "Dos experimentos al mes: ganchos, duraciones, horarios o formatos."),
    ("Escalar", "Lo que gana se queda en el calendario; lo que no, sale."),
]
c = ""
for i, (tt, d) in enumerate(loop):
    x = 120 + i * 330
    c += (
        f'<div style="{pos(x, 300, f"width:280px;height:280px;border-radius:999px;background:{[ROJO, TINTA, LIMA, TINTA][i]};color:{TINTA if i == 2 else "#fff"};padding:56px 30px;text-align:center")}">'
        f'<p style="font-family:{ANTON};font-size:56px;text-transform:uppercase;line-height:1">{tt}</p>'
        f'<p style="font-size:20px;line-height:1.35;font-weight:600;margin-top:14px">{d}</p></div>'
        + (flecha(x + 250, 410, 110, ROJO if i != 0 else LIMA, 0, 6) if i < 3 else "")
    )
objetivos = [
    ("Instagram", "De 147K a 180K seguidores en 12 meses"),
    ("TikTok", "Duplicar seguidores el primer año, con 5 vídeos por semana"),
    ("Deseo", "+25 % de guardados y compartidos por pieza frente a la línea base"),
    ("Club", "Altas mensuales al Club Devorador desde redes, medidas por código"),
]
o = "".join(
    f'<p style="font-size:22px;line-height:1.4;font-weight:600;margin-top:12px"><b style="color:{ROJO}">{a}:</b> {b}</p>'
    for a, b in objetivos
)
add("optimizacion", "Optimización", sec(
    marker("Cómo optimizamos", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 700, 36, LIMA, -2, seed=47)
    + c
    + carta(120, 640, 1000, 300,
            f'<p style="font-family:{ANTON};font-size:44px;line-height:1;text-transform:uppercase">Objetivos orientativos a 12 meses</p>' + o
            + f'<p style="font-size:17px;font-weight:700;color:{GRIS};margin-top:12px">Se fijan en firme con la línea base del primer mes.</p>', -1, 32)
    + carta(1200, 640, 620, 300,
            f'<p style="font-family:{MARKER};font-size:32px;line-height:1.1;color:{ROJO}">Ejemplo de experimento</p>'
            f'<p style="font-size:21px;line-height:1.45;font-weight:500;margin-top:12px">El Corte a las 13:30 frente a las 19:00, cuatro semanas. '
            f'Si gana el mediodía por guardados, la serie cambia de hora en todo el calendario.</p>', 1.5, 32)
    + logo_esquina() + pie(n()),
))

# ════════════════════════════════════════════════════════════════════════
# 09 · FINANCIAL PROPOSAL
# ════════════════════════════════════════════════════════════════════════
divisoria("p9", 9, "FINANCIAL", "Proposal", "Planes, extras y condiciones",
          "Honorarios, entregables incluidos, volumen de producción, extras y servicios opcionales.")

PLANES = [
    {"nombre": "Esencial", "precio": "6.500", "rodajes": "2 rodajes al mes",
     "resumen": "Para mantener la marca viva con calidad y constancia.", "reco": False},
    {"nombre": "Devorador", "precio": "9.800", "rodajes": "4 rodajes al mes + 1 ruta de ciudad",
     "resumen": "El plan que responde a todo vuestro brief: estrategia, series propias, comunidad y creadores.", "reco": True},
    {"nombre": "360", "precio": "13.900", "rodajes": "6 rodajes al mes + 2 rutas de ciudad",
     "resumen": "Para la expansión: más volumen, community 7 días, paid media y una activación por trimestre.", "reco": False},
]
c = ""
for i, p_ in enumerate(PLANES):
    x = 120 + i * 570
    reco = p_["reco"]
    bg = TINTA if reco else CREMA
    fg = "#fff" if reco else TINTA
    ac = LIMA if reco else ROJO
    c += carta(x, 300, 540, 560,
               f'<p style="font-size:20px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:{ac}">Plan</p>'
               f'<p style="font-family:{MARKER};font-size:66px;line-height:1;color:{fg}">{p_["nombre"]}</p>'
               f'<p style="font-family:{ANTON};font-size:100px;line-height:1;margin-top:24px;color:{ac}">{p_["precio"]} €</p>'
               f'<p style="font-size:22px;font-weight:700;color:{fg};margin-top:6px">al mes + IVA</p>'
               f'<p style="font-size:24px;font-weight:800;margin-top:26px;color:{fg}">{p_["rodajes"]}</p>'
               f'<p style="font-size:22px;line-height:1.45;font-weight:500;margin-top:14px;color:{fg}">{p_["resumen"]}</p>',
               [-1, 1, -1][i], 44, bg)
    if reco:
        c += etiqueta("Recomendado", x + 300, 280, 4, LIMA, TINTA, 24)
add("planes", "Planes", sec(
    marker("Tres maneras de devorar", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 940, 36, LIMA, -2, seed=26)
    + c
    + texto("El detalle de lo que incluye cada plan, cruzado con el scope de vuestro brief, en la página siguiente.", 120, 920, 1500, 23, GRIS, 700)
    + pie(n()),
))

ENTREGABLES = [
    ("Estrategia & planificación",
     "Estrategia anual, calendario mensual",
     "+ campañas por temporada y Social Brand Book",
     "+ workshop trimestral con dirección"),
    ("Creación & producción",
     "12 vídeos · 6 carruseles · 25 fotos",
     "20 vídeos · 10 carruseles · 40 fotos",
     "30 vídeos · 14 carruseles · 60 fotos"),
    ("Social media management",
     "IG + TikTok · stories 3 días/semana",
     "IG + TikTok · stories diarias L–V",
     "IG + TikTok · stories 7 días"),
    ("Community & engagement",
     "Comentarios L–V · 1 dinámica al mes",
     "Comentarios y DMs L–V · escucha social · UGC",
     "Comunidad 7 días · Club Devorador"),
    ("Influencers & colaboraciones",
     "No incluido (opcional)",
     "5–10 microinfluencers al mes + 3 creadores de referencia al año",
     "10 microinfluencers al mes + 3 creadores de referencia al año + 1 artista por temporada"),
    ("Análisis & optimización",
     "Informe mensual",
     "Informe + experimentos + revisión trimestral",
     "+ panel de datos en directo"),
]
cab = (
    f'<th style="width:420px;padding:14px 18px;border-bottom:4px solid {TINTA};text-align:left;font-size:17px;font-weight:800;letter-spacing:2px">SCOPE DEL BRIEF</th>'
    + "".join(
        f'<th style="padding:14px 18px;border-bottom:4px solid {TINTA};text-align:left;font-family:{MARKER};font-size:34px;font-weight:400;'
        f'{"background:" + TINTA + ";color:" + LIMA if p_["reco"] else ""}">{p_["nombre"]}</th>'
        for p_ in PLANES
    )
)
filas = "".join(
    f'<tr><td style="font-family:{ANTON};font-size:28px;text-transform:uppercase;padding:16px 18px;border-bottom:2px dashed rgba(17,17,17,.2)">{r[0]}</td>'
    + "".join(
        f'<td style="font-size:21px;font-weight:600;line-height:1.35;padding:16px 18px;border-bottom:2px dashed rgba(17,17,17,.2);'
        f'{"background:rgba(212,251,4,.28)" if j == 1 else ""}">{v}</td>'
        for j, v in enumerate(r[1:])
    )
    + "</tr>"
    for r in ENTREGABLES
)
add("entregables", "Entregables por plan", sec(
    marker("Qué incluye cada plan", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 860, 36, LIMA, -2, seed=48)
    + f'<table style="{pos(120, 270)}width:1680px;background:{CREMA};box-shadow:0 14px 30px rgba(0,0,0,.12)"><thead><tr>{cab}</tr></thead><tbody>{filas}</tbody></table>'
    + texto("Los tres planes incluyen el primer mes de arranque con el Social Brand Book de Divorare: guía visual, tono, series y plantillas.", 120, 950, 1600, 21, GRIS, 700)
    + pie(n()),
))

EXTRAS = [
    ("Rodaje adicional en Madrid o Barcelona", "950 € / jornada"),
    ("Ruta de rodaje en otra ciudad", "1.400 € / jornada + desplazamiento"),
    ("Cobertura de apertura o evento", "950 € / evento"),
    ("Piezas UGC con creadores de Maen Talents", "desde 250 € / pieza"),
    ("Gestión de paid media en Meta y TikTok", "15 % de la inversión · mín. 750 € / mes"),
    ("Campaña de Navidad «El Gordo se devora»", "8.900 € (cerrado)"),
]
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
    + carta(1300, 290, 520, 640,
            f'<p style="font-family:{ANTON};font-size:52px;line-height:1;text-transform:uppercase">Condiciones</p>'
            + bullets([
                "Precios sin IVA, con facturación mensual por adelantado.",
                "Compromiso inicial de 6 meses; después, mes a mes.",
                "Dos rondas de cambios por pieza incluidas.",
                "El material en bruto y editado es vuestro.",
                "La inversión en publicidad, los fees de creadores, la imprenta y los premios van aparte.",
            ], 22, 18),
            2, 40)
    + logo_esquina() + pie(n()),
))

# ════════════════════════════════════════════════════════════════════════
# 10 · CHRISTMAS CREATIVE CHALLENGE
# ════════════════════════════════════════════════════════════════════════
divisoria("p10", 10, "CHRISTMAS", "at Divorare", "Christmas creative challenge",
          "Concepto creativo y racional, moodboard, tres ideas de contenido para Instagram y TikTok, una activación conectada con los locales, y los territorios y resultados.")


def decimo(left, top, w=760, rot=-4, numero="17 048", serie="SERIE MAD-03"):
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
        f'<p style="position:absolute;right:{24*s:.0f}px;top:{250*s:.0f}px;font-size:{16*s:.0f}px;font-weight:800;color:{ROJO}">{serie}</p>'
        f'<p style="position:absolute;right:{24*s:.0f}px;bottom:{18*s:.0f}px;font-size:{15*s:.0f}px;font-weight:700;color:{GRIS}">Valor: 1 focaccia</p>'
        f'</div></div>'
    )


# C1 · el reto
add("navidad-reto", "El reto de Navidad", sec(
    texto("CHRISTMAS CREATIVE CHALLENGE · EL RETO", 120, 110, 1200, 24, LIMA, 800, "letter-spacing:5px")
    + anton("¿Cómo vive la Navidad", 120, 180, 120, "#fff")
    + anton("una marca que no muerde,", 120, 300, 120, "#fff")
    + anton("sino que devora?", 120, 420, 120, ROJO)
    + texto("Nos pedís una idea que solo Divorare pueda contar: urbana, irreverente, auténtica, conectada con los locales y con la comunidad, y que nada tenga de campaña navideña convencional.",
            120, 590, 1100, 30, "#ddd", 500)
    + brocha(100, 790, 1300, 120, LIMA, -2, seed=60)
    + marker("No tocamos la Navidad. Tocamos el Gordo.", 150, 812, 58, TINTA, -2)
    + recorte("packaging.webp", 1560, 120, 270, 5)
    + pie(n(), True),
    "asfalto",
))

# C2 · concepto y racional
add("navidad-concepto", "El Gordo se devora", sec(
    texto("01 · CONCEPTO CREATIVO", 120, 100, 1100, 24, LIMA, 800, "letter-spacing:5px")
    + anton("El Gordo", 120, 150, 210, "#fff")
    + marker("se devora.", 140, 360, 170, ROJO, -4)
    + texto("<b>Racional.</b> En España la Navidad no empieza con las luces: empieza el 22 de diciembre, cuando los niños de San Ildefonso cantan el Gordo y el país entero se para delante de la tele del bar. "
            "Es el único ritual navideño que compartimos todos, jóvenes incluidos, y gira alrededor de una palabra que en Divorare tiene doble sentido: <b>el gordo es la focaccia</b>.",
            120, 590, 1050, 26, "#eee", 500)
    + texto("En Madrid hay dos colas famosas en diciembre: la de Doña Manolita y la de Divorare. Este año, la segunda también reparte premio.",
            120, 830, 1050, 28, LIMA, 700)
    + decimo(1200, 200, 640, -6)
    + decimo(1250, 540, 580, 5, "08 220", "SERIE VLC-01")
    + pie(n(), True),
    "asfalto",
))

# C3 · por qué funciona (los tres criterios del brief)
crit = [
    ("Auténtica", "Conectada con vuestros locales, producto y gente",
     ["El décimo solo se consigue comprando una focaccia en uno de los 17 locales.", "Cada local tiene su propia serie de números y su propio premio.", "Los protagonistas del contenido son el equipo y los clientes."]),
    ("Irreverente", "Con el tono y la personalidad de Divorare",
     ["Una marca italiana que se apropia de la tradición más española.", "Parodiamos la cantinela de San Ildefonso: en vez de premios, focaccias.", "Nada de espumillón, renos ni gorros de Papá Noel."]),
    ("Relevante", "Que genere conversación y participación real",
     ["Engancha con el momento de máxima conversación de diciembre.", "Para jugar hay que registrarse: altas reales al Club Devorador.", "Cada décimo es una foto que la gente quiere compartir."]),
]
c = ""
for i, (tt, sub, its) in enumerate(crit):
    x = 120 + i * 580
    c += carta(x, 300, 540, 600,
               f'<p style="font-family:{MARKER};font-size:52px;line-height:1;color:{ROJO}">{tt}</p>'
               f'<p style="font-size:21px;font-weight:800;margin-top:12px">{sub}</p>'
               + bullets(its, 22, 18),
               [-1.5, 1, -1][i], 40)
add("navidad-criterios", "Por qué funciona", sec(
    marker("Por qué funciona", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 640, 36, LIMA, -2, seed=61)
    + texto("Pasamos la idea por los tres criterios que marca vuestro brief.", 120, 252, 1300, 25, "#333", 600)
    + c
    + logo_esquina() + pie(n()),
))

# C4 · moodboard
mood = [
    ("Paleta", "El rojo y la lima de siempre, con el dorado del décimo y el blanco del papel de la focaccia. Nada de verde abeto."),
    ("Tipografía", "La brocha de Divorare sobre el formato clásico del décimo: números grandes, sellos, series y fracciones."),
    ("Atmósfera", "Colas de diciembre, abrigos, luces de calle, el directo del sorteo en la tele del bar y el grito al ver el número."),
    ("Referencias", "La cantinela de San Ildefonso, el bombo dorado, la cola de Doña Manolita y el «¿y si nos toca?» de cada cena de empresa."),
]
c = ""
for i, (tt, d) in enumerate(mood):
    y = 280 + i * 165
    c += etiqueta(tt, 120, y, -2) + texto(d, 120, y + 50, 720, 22, "#222", 500)
add("navidad-mood", "Moodboard", sec(
    texto("02 · MOODBOARD", 120, 56, 700, 20, ROJO, 800, "letter-spacing:4px")
    + marker("Moodboard", 120, 110, 84, TINTA, -3)
    + brocha(100, 214, 520, 36, LIMA, -2, seed=28)
    + c
    + decimo(900, 140, 560, -5)
    + recorte("packaging.webp", 1560, 90, 270, 4)
    + recorte("tienda-noche.webp", 880, 520, 460, 3)
    + foto("foto-focaccias-oscuro.jpg", 1360, 600, 470, 300, -3)
    + f'<div style="{pos(120, 940, "display:flex;gap:14px")}">'
    + "".join(f'<span style="width:60px;height:60px;background:{c_};border:3px solid {TINTA};display:block;transform:rotate({r}deg)"></span>'
              for c_, r in [(ROJO, -3), (LIMA, 2), ("#C9A227", -1), (CREMA, 3), (TINTA, -2)])
    + "</div>"
    + pie(n()),
))

# C5 · identidad de campaña: piezas físicas y digitales
cartel = (
    f'<div style="{pos(780, 280, "width:380px;height:540px;transform:rotate(3deg);filter:drop-shadow(0 18px 28px rgba(0,0,0,.3))")}">'
    f'<div style="position:relative;width:100%;height:100%;background:{ROJO};border:6px solid {TINTA};overflow:hidden;padding:30px">'
    f'<p class="anton" style="font-size:62px;color:#fff;line-height:.95">¿Llevas el gordo?</p>'
    f'<p class="marker" style="font-size:38px;color:{LIMA};margin-top:20px;transform:rotate(-3deg)">Cada focaccia lleva su décimo</p>'
    f'<p style="font-size:20px;font-weight:800;color:#fff;margin-top:26px">DEL 1 AL 21 DE DICIEMBRE<br>SORTEO EL 22 · EN LOS 17 LOCALES</p>'
    f'<div style="position:absolute;right:26px;bottom:26px;width:100px;height:100px;background:#fff;border:6px solid {TINTA};'
    f'background-image:repeating-linear-gradient(90deg,{TINTA} 0 10px,#fff 10px 20px),repeating-linear-gradient(0deg,{TINTA} 0 10px,#fff 10px 20px);background-blend-mode:difference"></div>'
    f'</div></div>'
)
pegatina = (
    f'<div style="{pos(1220, 300, f"width:240px;height:240px;border-radius:999px;background:{LIMA};border:6px solid {TINTA};transform:rotate(-12deg);display:flex;align-items:center;justify-content:center;text-align:center;box-shadow:0 14px 26px rgba(0,0,0,.25)")}">'
    f'<p class="marker" style="font-size:34px;line-height:1.05">Esta focaccia<br>lleva<br>premio</p></div>'
)
story = (
    f'<div style="{pos(1530, 260, "width:290px;height:560px;transform:rotate(4deg);filter:drop-shadow(0 18px 28px rgba(0,0,0,.3))")}">'
    f'<div style="position:relative;width:100%;height:100%;border-radius:28px;border:8px solid {TINTA};background:{TINTA} url({A}/foto-focaccias-oscuro.jpg) center/cover;overflow:hidden">'
    f'<div style="position:absolute;inset:0;background:rgba(0,0,0,.35)"></div>'
    f'<p class="anton" style="position:absolute;left:20px;top:40px;font-size:30px;color:#fff">Faltan</p>'
    f'<p class="anton" style="position:absolute;left:20px;top:76px;font-size:120px;color:{LIMA};line-height:1">7</p>'
    f'<p class="anton" style="position:absolute;left:20px;top:200px;font-size:30px;color:#fff">días para el gordo</p>'
    f'<p class="marker" style="position:absolute;left:20px;bottom:60px;font-size:28px;color:#fff;transform:rotate(-4deg)">¿Ya tienes tu décimo?</p>'
    f'<p style="position:absolute;left:20px;bottom:24px;font-size:15px;font-weight:800;color:{LIMA}">#ELGORDOSEDEVORA</p>'
    f'</div></div>'
)
add("navidad-identidad", "Identidad de campaña", sec(
    marker("La campaña, en la calle y en el móvil", 120, 100, 76, TINTA, -3)
    + brocha(100, 196, 1250, 32, LIMA, -2, seed=62)
    + decimo(110, 300, 600, -4)
    + cartel + pegatina + story
    + texto("Décimo", 140, 640, 300, 26, TINTA, 800)
    + texto("Numerado, con la serie de cada local. Se entrega con cada focaccia y se guarda: es la papeleta y es el recuerdo.", 140, 680, 560, 21, "#333", 500)
    + texto("Cartel de escaparate · pegatina para el papel · plantillas de stories con cuenta atrás", 780, 880, 1050, 22, TINTA, 700)
    + texto("Mockups orientativos: el diseño final se cierra con vuestro equipo de marca.", 140, 950, 900, 18, GRIS, 600)
    + pie(n()),
))

# C6 · mecánica
pasos = [
    ("Compras", "Del 1 al 21 de diciembre, cada focaccia en cualquiera de los 17 locales lleva su décimo."),
    ("Recibes tu número", "Numerado del 00000 al 99999. Cada local reparte su propia serie."),
    ("Lo registras", "Con el QR del décimo: nombre, email y número. Así entras en el Club Devorador."),
    ("Lo compartes", "Foto o story con el décimo y #ElGordoSeDevora. Cuantas más, más conversación."),
    ("22 de diciembre", "Cuando salga el Gordo de verdad, se cruza con los décimos registrados."),
    ("Premios", "Gordo, pedrea por local y reintegro. Los premios se recogen en el local."),
]
c = ""
for i, (tt, d) in enumerate(pasos):
    col, fila = i % 3, i // 3
    x = 120 + col * 580
    y = 290 + fila * 330
    c += (
        carta(x, y, 530, 290,
              f'<p style="font-family:{ANTON};font-size:64px;line-height:1;color:{ROJO}">{i+1:02d}</p>'
              f'<p style="font-family:{MARKER};font-size:36px;line-height:1.05;margin-top:8px">{tt}</p>'
              f'<p style="font-size:21px;line-height:1.45;font-weight:500;margin-top:12px;color:#222">{d}</p>',
              [-1.5, 1, -1, 1, -1.5, 1.5][i], 32)
        + (flecha(x + 522, y + 110, 64, ROJO, 0, 6) if col < 2 else "")
    )
add("navidad-mecanica", "La mecánica", sec(
    texto("04 · ACTIVACIÓN", 120, 56, 700, 20, ROJO, 800, "letter-spacing:4px")
    + marker("La mecánica, paso a paso", 120, 110, 80, TINTA, -3)
    + brocha(100, 210, 980, 34, LIMA, -2, seed=63)
    + c
    + logo_esquina() + pie(n()),
))

# C7 · premios y reglas
premios = [
    ("El Gordo", "1 ganador", "Una focaccia a la semana durante todo 2027: 52 focaccias. Va para el décimo registrado más cercano al número del Gordo.", ROJO),
    ("La pedrea", "17 ganadores", "Uno por local: una focaccia al mes durante 2027 para el décimo de esa serie más cercano al Gordo.", TINTA),
    ("El reintegro", "1 de cada 10", "Si tu décimo acaba en la misma cifra que el Gordo, bebida gratis en enero. Para volver al local en la cuesta de enero.", "#8a7400"),
]
c = ""
for i, (tt, q, d, col_) in enumerate(premios):
    x = 120 + i * 580
    c += carta(x, 290, 540, 420,
               f'<p style="font-family:{MARKER};font-size:56px;line-height:1;color:{col_}">{tt}</p>'
               f'<div style="margin-top:16px">{chip(q, LIMA if i != 1 else TINTA, TINTA if i != 1 else "#fff", 20)}</div>'
               f'<p style="font-size:23px;line-height:1.45;font-weight:500;margin-top:10px;color:#222">{d}</p>',
               [-1.5, 1, -1][i], 40)
add("navidad-premios", "Premios y reglas", sec(
    marker("Premios y reglas del juego", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 1000, 36, LIMA, -2, seed=64)
    + c
    + carta(120, 760, 1700, 180,
            f'<p style="font-family:{ANTON};font-size:36px;line-height:1;text-transform:uppercase">Reglas que lo hacen funcionar</p>'
            f'<p style="font-size:21px;line-height:1.5;font-weight:500;margin-top:12px">Solo cuentan los décimos registrados antes del sorteo, así que siempre hay ganador y el registro es imprescindible. '
            f'Empate de distancia: gana quien se registró antes. Si no se celebrara el sorteo, se usaría el del Niño del 6 de enero.</p>', 0, 30)
    + pie(n()),
))

# C8–C10 · las tres ideas de contenido, cada una con su versión para Instagram y TikTok
IDEAS = [
    {
        "id": "navidad-idea-1", "n": "01", "nombre": "Los niños de San Divorare",
        "rol": "Lanzamiento · 1 de diciembre", "img": "equipo.webp", "terr": "Ritual devorador · Italianidad instintiva", "obj": "Dar a conocer la mecánica en 48 horas y que se comparta.",
        "idea": "Parodia del sorteo: dos personas del equipo, con el uniforme de Divorare y delante de un bombo, cantan con la cantinela de San Ildefonso. Pero lo que sale del bombo son focaccias.",
        "guion": [
            "0–3 s · Bombo dorado girando. Texto: «22 de diciembre. Bueno, casi».",
            "3–15 s · «Cuarenta y ocho mil doscientos… ¡Mortadella e pistacchio!» Corte a la focaccia abriéndose.",
            "15–25 s · Tres números más, tres focaccias más, cada vez más rápido.",
            "25–30 s · «Este año el Gordo se devora. Del 1 al 21, en los 17 Divorare.»",
        ],
        "ig": ["Reel de 30 s, pulido, con portada de décimo.", "Carrusel «Cómo jugar» de 5 láminas, publicado el mismo día.", "Copy: «Este año no hace falta hacer cola en Doña Manolita.»"],
        "tt": ["Versión de 45 s, más cruda, con tomas falsas al final.", "Audio original para que la comunidad cante su focaccia favorita.", "Los mejores dúos se llevan un décimo extra."],
    },
    {
        "id": "navidad-idea-2", "n": "02", "nombre": "¿Qué harías si te toca el Gordo?",
        "rol": "Sostenimiento · del 2 al 21", "img": "eco-tienda.webp", "terr": "Comunidad devoradora", "obj": "Mantener la conversación tres semanas y llevar gente a los locales.",
        "idea": "Serie de entrevistas en la cola. Preguntamos qué haría cada uno si le toca el Gordo. Respuestas reales y, al final, le damos el suyo: una focaccia con su décimo.",
        "guion": [
            "0–2 s · Pregunta directa a cámara, sin introducción.",
            "2–25 s · Respuestas rápidas: viajes, deudas, dejar el trabajo, «invitar a toda la cola».",
            "25–35 s · Giro: «Pues te ha tocado este». Focaccia y décimo a cámara.",
            "35–40 s · Reacción y cierre con el número del décimo.",
        ],
        "ig": ["Reel recopilatorio con lo mejor de cada semana.", "Stories con encuesta «¿Qué harías tú?» y caja de respuestas.", "Repost de las mejores respuestas de los seguidores."],
        "tt": ["4 episodios de 30–40 s: Madrid ×2, Valencia y Sevilla.", "Subtítulos grandes y gancho en los dos primeros segundos.", "Respondemos comentarios con vídeo: «te leemos en el próximo episodio»."],
    },
    {
        "id": "navidad-idea-3", "n": "03", "nombre": "La tele del bar",
        "rol": "Sorteo · 22 de diciembre", "img": "tienda-noche.webp", "terr": "Comunidad devoradora · Ritual devorador", "obj": "Convertir el sorteo en un evento en directo en los 17 locales.",
        "idea": "El 22 por la mañana, los 17 locales ponen el sorteo en pantalla. Contamos en directo cómo se vive en Divorare y, en cuanto sale el Gordo, buscamos a los ganadores.",
        "guion": [
            "9:00 · Stories desde los locales abriendo con el sorteo en pantalla.",
            "Mañana · Los encargados graban las reacciones con una plantilla común.",
            "Al salir el Gordo · Post con el número y el décimo registrado más cercano.",
            "23 dic · Reel «resaca»: entregamos el premio al ganador en su local.",
        ],
        "ig": ["Stories minuto a minuto desde varias ciudades.", "Post del número premiado y post Collab con el ganador.", "Destacado «El Gordo» con todo el recorrido de la campaña."],
        "tt": ["LIVE de una hora desde un local de Madrid durante el sorteo.", "Comprobamos en directo los décimos de la gente que se acerca.", "Pieza de reacciones de los 17 locales al día siguiente."],
    },
]
for I in IDEAS:
    add(I["id"], I["nombre"], sec(
        texto(f"03 · IDEA DE CONTENIDO {I['n']} DE 03", 120, 56, 900, 20, ROJO, 800, "letter-spacing:4px")
        + marker(I["nombre"], 120, 120, min(76, int(1500 / (0.62 * len(I["nombre"])))), TINTA, -1)
        + brocha(100, 206, 900, 30, LIMA, -2, seed=70 + int(I["n"]))
        + etiqueta(I["rol"], 120, 262, -2, TINTA, "#fff", 20)
        + texto(I["idea"], 120, 320, 700, 23, "#222", 600)
        + carta(120, 520, 700, 400,
                f'<p style="font-family:{ANTON};font-size:38px;line-height:1;text-transform:uppercase">Guion</p>'
                + "".join(f'<p style="font-size:21px;line-height:1.4;font-weight:500;margin-top:12px">{g_}</p>' for g_ in I["guion"]),
                -1, 32)
        + carta(900, 290, 440, 540,
                f'<p style="font-family:{ANTON};font-size:52px;line-height:1;text-transform:uppercase">Instagram</p>'
                + bullets(I["ig"], 23, 18),
                1.5, 34)
        + carta(1380, 290, 440, 540,
                f'<p style="font-family:{ANTON};font-size:52px;line-height:1;text-transform:uppercase;color:{LIMA}">TikTok</p>'
                + bullets(I["tt"], 23, 18, "#fff", LIMA),
                -1.5, 34, TINTA)
        + etiqueta("Territorios", 900, 880, -2) + texto(I["terr"], 1100, 878, 720, 23, TINTA, 700)
        + etiqueta("Objetivo", 900, 930, -2, TINTA) + texto(I["obj"], 1100, 928, 720, 23, TINTA, 600)
        + pie(n()),
    ))

# C11 · calendario de campaña
fases = [
    ("24–30 nov", "Teaser", "«Algo gordo se acerca»: stories con un décimo misterioso y el equipo ensayando la cantinela.", "Stories · 1 TikTok"),
    ("1 dic", "Lanzamiento", "Los niños de San Divorare y carrusel «Cómo jugar». Cartel y pegatina en los 17 locales.", "1 reel · 1 TikTok · 1 carrusel"),
    ("2–21 dic", "Sostenimiento", "¿Qué harías si te toca el Gordo?, cuenta atrás, reposts de décimos y «el décimo de cada ciudad».", "4 episodios · 2 carruseles · stories diarias"),
    ("22 dic", "Sorteo", "La tele del bar: directo desde los locales, LIVE en TikTok y número premiado.", "LIVE · stories · 1 post"),
    ("23–31 dic", "Resaca", "Entrega del Gordo al ganador, reacciones de los 17 locales y resumen de la campaña.", "1 reel · 1 TikTok"),
    ("Enero", "Reintegro", "Recordatorio para canjear la bebida gratis y bienvenida a los nuevos del Club.", "Stories · 1 post"),
]
c = ""
for i, (f_, tt, d, piezas) in enumerate(fases):
    y = 270 + i * 112
    c += (
        f'<div style="{pos(120, y, f"width:1680px;height:98px;background:{CREMA};box-shadow:0 6px 14px rgba(0,0,0,.08);border-left:12px solid {ROJO if i in (1, 3) else LIMA}")}"></div>'
        + f'<p class="anton" style="{pos(150, y + 26)}font-size:40px;color:{ROJO}">{f_}</p>'
        + f'<p class="marker" style="{pos(420, y + 28)}font-size:34px">{tt}</p>'
        + texto(d, 700, y + 14, 720, 20, "#222", 500)
        + f'<p style="{pos(1450, y + 20)}width:330px;font-size:18px;font-weight:800;line-height:1.35;color:{GRIS};text-align:right">{piezas}</p>'
    )
add("navidad-calendario", "Calendario de campaña", sec(
    marker("Calendario de campaña", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 900, 36, LIMA, -2, seed=65)
    + c
    + texto("En total: 9 vídeos, 4 carruseles, un LIVE y más de 60 stories, además de los materiales de los locales.", 120, 950, 1600, 21, GRIS, 700)
    + logo_esquina() + pie(n()),
))

# C12 · operativa en los locales
ope = [
    ("Kit por local", ["Talonario de décimos numerados con la serie del local.", "Cartel de escaparate, display de mostrador con QR y pegatinas para el papel.", "Llega antes del 28 de noviembre, también a las franquicias."]),
    ("El equipo", ["Una sola frase al cobrar: «¿Llevas el gordo?».", "Vídeo de formación de 2 minutos para todos los turnos.", "Los encargados graban stories con una plantilla común."]),
    ("El 22 de diciembre", ["Sorteo en pantalla en los 17 locales.", "Comprobación de décimos en mostrador.", "Entrega de premios en el local del ganador, grabada para redes."]),
    ("Los datos", ["Registro con consentimiento RGPD para el Club Devorador.", "Panel diario de décimos registrados por local.", "Informe final con altas, visitas y canjes del reintegro."]),
]
c = ""
for i, (tt, its) in enumerate(ope):
    x = 120 + i * 430
    c += carta(x, 290, 400, 480,
               f'<p style="font-family:{ANTON};font-size:46px;line-height:1;text-transform:uppercase">{tt}</p>'
               + bullets(its, 23, 16),
               [-1, 1.5, -1.5, 1][i], 34)
add("navidad-locales", "Operativa en los locales", sec(
    texto("04 · ACTIVACIÓN EN LOS LOCALES", 120, 56, 900, 20, ROJO, 800, "letter-spacing:4px")
    + marker("Así se vive en los 17 locales", 120, 110, 80, TINTA, -3)
    + brocha(100, 210, 1080, 34, LIMA, -2, seed=66)
    + c
    + texto("Nada depende de que el equipo de sala haga contenido: la campaña funciona con un gesto al cobrar y un décimo en la bolsa.", 120, 900, 1600, 23, TINTA, 700)
    + logo_esquina() + pie(n()),
))

# C13 · territorios y resultados
kn = [
    ("Décimos registrados", "≥ 25 %", "de los décimos entregados se registran con el QR"),
    ("Altas al Club", "100 %", "de los registros entran en el Club Devorador, como alta nueva o reactivada"),
    ("Contenido de la comunidad", "≥ 300", "stories y publicaciones con el décimo y #ElGordoSeDevora"),
    ("Alcance de campaña", "≥ 1,5 M", "visualizaciones orgánicas entre Instagram y TikTok"),
    ("Vuelta en enero", "≥ 30 %", "de los reintegros se canjean en local"),
]
c = ""
for i, (tt, v, d) in enumerate(kn):
    y = 300 + i * 118
    c += (
        f'<p class="anton" style="{pos(860, y)}font-size:56px;color:{ROJO};width:300px">{v}</p>'
        + f'<p style="{pos(1170, y + 2)}font-size:24px;font-weight:800;width:650px">{tt}</p>'
        + texto(d, 1170, y + 38, 650, 20, "#333", 500)
    )
add("navidad-resultados", "Territorios y resultados", sec(
    texto("05 · TERRITORIOS Y RESULTADOS", 120, 56, 900, 20, ROJO, 800, "letter-spacing:4px")
    + marker("Qué activa y qué buscamos", 120, 110, 80, TINTA, -3)
    + brocha(100, 210, 980, 34, LIMA, -2, seed=67)
    + carta(120, 300, 640, 600,
            f'<p style="font-family:{ANTON};font-size:44px;line-height:1;text-transform:uppercase">Territorios</p>'
            + "".join(
                f'<p style="font-family:{MARKER};font-size:30px;margin-top:22px;color:{ROJO}">{a}</p>'
                f'<p style="font-size:20px;line-height:1.4;font-weight:500;margin-top:4px">{b}</p>'
                for a, b in [
                    ("Ritual devorador", "La focaccia es el gordo: el producto, protagonista del momento más esperado del año."),
                    ("Comunidad devoradora", "La gente juega, comparte su décimo y celebra en los locales."),
                    ("Italianidad instintiva", "Una marca italiana que hace suya, con humor, la tradición más española."),
                ]
            ),
            -1, 36)
    + c
    + texto("Objetivos propuestos; los ajustamos con vuestros datos de ventas de diciembre.", 860, 900, 960, 19, GRIS, 700)
    + pie(n()),
))

# C14 · plazos, legal y presupuesto
add("navidad-plazos", "Plazos y presupuesto", sec(
    marker("Llegamos a tiempo", 120, 100, 84, TINTA, -3)
    + brocha(100, 204, 700, 36, LIMA, -2, seed=68)
    + carta(120, 290, 820, 420,
            f'<p style="font-family:{ANTON};font-size:44px;line-height:1;text-transform:uppercase">Si nos elegís el 20 de noviembre</p>'
            + "".join(
                f'<p style="font-size:22px;line-height:1.4;font-weight:600;margin-top:14px"><b style="color:{ROJO}">{a}</b> · {b}</p>'
                for a, b in [
                    ("21 nov", "Cierre del concepto, bases legales y diseño de piezas."),
                    ("24 nov", "Imprenta del kit y landing de registro lista."),
                    ("24–27 nov", "Rodaje del teaser y de Los niños de San Divorare."),
                    ("28 nov", "Kits en los 17 locales y vídeo de formación enviado."),
                    ("1 dic", "Lanzamiento."),
                ]
            ),
            -1, 36)
    + carta(120, 750, 820, 200,
            f'<p style="font-family:{MARKER};font-size:30px;color:{ROJO}">Legal</p>'
            f'<p style="font-size:20px;line-height:1.45;font-weight:500;margin-top:8px">Bases depositadas ante notario, registro con consentimiento RGPD y revisión de vuestro asesor legal antes del lanzamiento.</p>',
            1, 30)
    + carta(1020, 290, 800, 660,
            f'<p style="font-size:20px;font-weight:800;letter-spacing:3px;color:{LIMA}">PRESUPUESTO DE CAMPAÑA</p>'
            f'<p style="font-family:{ANTON};font-size:110px;line-height:1;color:{LIMA};margin-top:14px">8.900 €</p>'
            f'<p style="font-size:22px;font-weight:700;color:#fff">+ IVA · precio cerrado</p>'
            + bullets([
                "Concepto final, bases y guiones.",
                "Diseño del décimo, cartel, display, pegatina y plantillas.",
                "Landing de registro y base de datos del Club.",
                "3 jornadas de rodaje extra y cobertura en directo del 22.",
                "9 vídeos, 4 carruseles, stories y LIVE.",
                "Informe de resultados en enero.",
            ], 21, 12, "#fff", LIMA)
            + f'<p style="font-size:18px;font-weight:600;color:#bbb;margin-top:18px">No incluye imprenta, premios ni inversión en publicidad (recomendamos entre 1.500 y 3.000 € para empujar el lanzamiento).</p>',
            1.5, 44, TINTA)
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
import re
_pag = {s["id"]: i + 1 for i, s in enumerate(slides)}
for s in slides:
    s["html"] = re.sub(r"\{\{p:([\w-]+)\}\}", lambda m: f"{_pag[m.group(1)]:02d}", s["html"])
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
