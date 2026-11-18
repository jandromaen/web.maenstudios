"""Genera app/pitch/libertine-kickoff/diapos.ts.

Kick-off de Maen Studios como equipo social y creativo de Libertine Blends
(planning mixto). Explica cómo trabajamos cada mes, con la identidad de
Libertine: logo oficial, crema, negro y los colores de las latas. Las
tipografías son las mismas sustitutas libres del briefing de rodaje (Barlow
Condensed, Syncopate y Archivo), alojadas en /pitch/libertine-blends/fonts.

Uso: python3 scripts/build-libertine-kickoff.py
"""
import json
from pathlib import Path

IMG = "/pitch/libertine-kickoff"
CREMA = "#F4ECE4"
CREMA2 = "#EFE3D6"
INK = "#151515"
AMARILLO = "#FCF655"
LILA = "#C8BCE9"
MELOCOTON = "#E9AC7A"
# Colores de las latas
NARANJA = "#F08A3C"   # Peach Bellini
AZUL = "#4D8FD6"      # Hibiscus Spritz
LIMA = "#CFDC4A"      # Pear & Cardamom
TURQUESA = "#1E9E8A"  # Cucumber Mule
LIMON = "#F2D33C"     # Gin Citrus Smash

COND = "font-family:'Barlow Condensed', Arial, sans-serif"
WIDE = "font-family:Syncopate, Arial, sans-serif"
BODY = "font-family:Archivo, Arial, sans-serif"

slides = []


def add(id_, titulo, html):
    slides.append({"id": id_, "titulo": titulo, "html": html})


def sec(inner, bg=CREMA, color=INK):
    return (f'<section style="background:{bg};color:{color};{BODY}">'
            f"{inner}</section>")


def eyebrow(t, x=128, y=110, color=INK):
    return (f'<p style="position:absolute;left:{x}px;top:{y}px;{WIDE};font-size:24px;'
            f'font-weight:700;letter-spacing:5px;color:{color}">{t}</p>')


def h(t, x=128, y=160, size=128, color=INK, w=1664):
    return (f'<h2 style="position:absolute;left:{x}px;top:{y}px;width:{w}px;{COND};'
            f'font-size:{size}px;font-weight:700;line-height:0.95;letter-spacing:3px;'
            f'text-transform:uppercase;color:{color}">{t}</h2>')


def foot(n, dark=False):
    logo = "logo-h-crema" if dark else "logo-h-negro"
    maen = "/maen-logo.png" if dark else "/pitch/libertine-blends/maen-logo-negro.png"
    col = CREMA if dark else INK
    return (f'<img src="{IMG}/{logo}.png" alt="Libertine Blends" '
            f'style="position:absolute;left:128px;top:996px;height:22px;width:auto;opacity:.85">'
            f'<img src="{maen}" alt="maen studios" '
            f'style="position:absolute;left:560px;top:994px;height:24px;width:auto;opacity:.6">'
            f'<p style="position:absolute;right:128px;top:990px;{COND};font-size:30px;font-weight:600;'
            f'letter-spacing:3px;color:{col};opacity:.7">{n:02d}</p>')


def foto(src, x, y, w, hh, pos="50% 50%", radius=0, alt=""):
    return (f'<img src="{IMG}/{src}" alt="{alt}" style="position:absolute;left:{x}px;top:{y}px;'
            f'width:{w}px;height:{hh}px;object-fit:cover;object-position:{pos};border-radius:{radius}px">')


def caja(x, y, w, hh, bg, partes, color=INK, pad=40, radius=28, gap=18):
    """Cajón con el contenido dentro, centrado en vertical."""
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{hh}px;background:{bg};'
            f'border-radius:{radius}px;color:{color};padding:0 {pad}px;display:flex;flex-direction:column;'
            f'justify-content:center;gap:{gap}px">{"".join(partes)}</div>')


def k_(t, color=None, size=17):
    c = f";color:{color}" if color else ""
    return f'<p style="{WIDE};font-size:{size}px;font-weight:700;letter-spacing:3px;line-height:1.3{c}">{t}</p>'


def t_(t, size=84, color=None):
    c = f";color:{color}" if color else ""
    return (f'<p style="{COND};font-size:{size}px;font-weight:700;line-height:.95;'
            f'text-transform:uppercase{c}">{t}</p>')


def s_(t, size=26, color=None):
    c = f";color:{color}" if color else ""
    return f'<p style="font-size:{size}px;line-height:1.35{c}">{t}</p>'



n = 0

# ── 1. Portada ─────────────────────────────────────────────────────────────
n += 1
add("portada", "Kick-off", sec(
    foto("cuatro-latas.jpg", 1060, 0, 860, 1080, "50% 40%", alt="Cuatro latas de Libertine Blends")
    + f'<img src="{IMG}/logo-negro.png" alt="Libertine Blends" style="position:absolute;left:128px;top:120px;width:520px;height:auto">'
    + f'<div style="position:absolute;left:128px;top:318px;display:flex;align-items:center;gap:18px">'
    f'<span style="{COND};font-size:60px;font-weight:500;line-height:1">×</span>'
    f'<img src="/pitch/libertine-blends/maen-logo-negro.png" alt="maen studios" style="height:34px;width:auto"></div>'
    + f'<h1 style="position:absolute;left:120px;top:400px;{COND};font-size:250px;font-weight:700;line-height:.9;letter-spacing:4px">KICK-OFF</h1>'
    + f'<p style="position:absolute;left:128px;top:650px;width:820px;font-size:38px;line-height:1.3">'
    "Cómo vamos a trabajar juntos como vuestro equipo social y creativo en Social Media.</p>"
    + f'<p style="position:absolute;left:128px;top:850px;padding:14px 30px;{WIDE};font-size:24px;font-weight:700;'
    f'letter-spacing:4px;color:{AMARILLO};background:{INK};border-radius:999px">18 · 11 · 2026</p>'
))

# ── 2. Hoy ─────────────────────────────────────────────────────────────────
n += 1
agenda = [
    ("Planning", AMARILLO),
    ("Cómo trabajamos cada mes", LILA),
    ("Paso a paso", MELOCOTON),
    ("Quién es quién", LIMA),
    ("Qué necesitamos para arrancar", AZUL),
]
ag = ""
for i, (t, c) in enumerate(agenda):
    y = 330 + i * 120
    ag += (f'<div style="position:absolute;left:128px;top:{y}px;width:1664px;height:1px;background:rgba(244,236,228,.2)"></div>'
           f'<p style="position:absolute;left:128px;top:{y + 18}px;{COND};font-size:72px;font-weight:700;color:{c}">{i + 1:02d}</p>'
           f'<p style="position:absolute;left:300px;top:{y + 26}px;{COND};font-size:64px;font-weight:600;letter-spacing:2px;text-transform:uppercase">{t}</p>')
add("hoy", "Hoy", sec(eyebrow("HOY", color=AMARILLO) + h("De qué vamos a hablar", color=CREMA) + ag + foot(n, True),
                      bg=INK, color=CREMA))

# ── 3. Lo acordado ────────────────────────────────────────────────────────
n += 1
cards = [
    (AMARILLO, "CADA SEMANA", "Instagram + TikTok<br>2 reels + 2 carruseles", "O posts, según lo que pida la idea.", 816),
    (MELOCOTON, "CADA MES", "1 rodaje<br>de 4 h", "Producción, foto y vídeo para todo el mes.", 392),
    (LIMA, "TAMBIÉN INCLUYE", "Creators<br>y paid", "Objetivo de 5 creators al mes. Y creativizamos los guiones de paid de No Idea.", 392),
]
cc = ""
x = 128
for c, k, t, sub, w in cards:
    cc += caja(x, 360, w, 500, c, [k_(k), t_(t, 72), s_(sub)], gap=26)
    x += w + 32
add("acordado", "Planning", sec(
    eyebrow("01 · PLANNING") + h("Planning mixto")
    + cc
    + f'<p style="position:absolute;left:128px;top:900px;font-size:26px;line-height:1.4;color:#5a5048">'
    "El paid en UK lo sigue llevando No Idea.</p>"
    + foot(n)))

# ── 4. El ciclo ────────────────────────────────────────────────────────────
n += 1
pasos = [
    ("Briefing", "Qué contamos este mes", AMARILLO),
    ("Rodaje", "Una jornada de 4 h", NARANJA),
    ("Postproducción", "Edición del mes", LILA),
    ("Calendario", "Todo el mes, para validar", LIMA),
    ("Publicación", "Y community management", AZUL),
    ("Reporte", "Qué ha funcionado", TURQUESA),
]
cy = ""
for i, (t, s, c) in enumerate(pasos):
    x = 128 + i * 280
    cy += (f'<div style="position:absolute;left:{x}px;top:420px;width:200px;height:200px;border-radius:50%;background:{c};'
           f'display:flex;align-items:center;justify-content:center">'
           f'<p style="{COND};font-size:96px;font-weight:700;line-height:1;transform:translateY(-4px);color:{INK}">{i + 1:02d}</p></div>')
    if i < 5:
        cy += (f'<div style="position:absolute;left:{x + 212}px;top:519px;width:56px;height:2px;background:{CREMA};opacity:.5"></div>')
    cy += (f'<p style="position:absolute;left:{x - 20}px;top:660px;width:240px;text-align:center;{COND};font-size:36px;font-weight:700;letter-spacing:.5px;text-transform:uppercase">{t}</p>'
           f'<p style="position:absolute;left:{x - 20}px;top:720px;width:240px;text-align:center;font-size:22px;line-height:1.35;color:rgba(244,236,228,.75)">{s}</p>')
add("ciclo", "Cada mes, el mismo ciclo", sec(
    eyebrow("02 · CÓMO TRABAJAMOS", color=AMARILLO) + h("Cada mes, el mismo ciclo", color=CREMA)
    + cy
    + foot(n, True), bg=INK, color=CREMA))

# ── 5. Un mes vista ───────────────────────────────────────────────────────
n += 1
add("mes-vista", "Siempre a un mes vista", sec(
    eyebrow("02 · CÓMO TRABAJAMOS") + h("Siempre a<br>un mes vista", w=900)
    + f'<p style="position:absolute;left:128px;top:420px;width:860px;font-size:32px;line-height:1.4">'
    "Preparamos y producimos un mes antes de que se publique. Así vosotros tenéis tiempo de revisarlo todo, y nada se hace con prisas.</p>"
    # línea de tiempo
    + caja(128, 640, 430, 180, AMARILLO, [k_("ESTE MES"), t_("Briefing, rodaje<br>y edición", 46)], pad=36, radius=24, gap=14)
    + f'<p style="position:absolute;left:578px;top:678px;{COND};font-size:80px;font-weight:700;line-height:1">→</p>'
    + caja(670, 640, 380, 180, LILA, [k_("EL MES QUE VIENE"), t_("Se publica", 46)], pad=36, radius=24, gap=14)
    + f'<p style="position:absolute;left:128px;top:860px;width:850px;font-size:26px;line-height:1.4;color:#5a5048">'
    "Ejemplo: en diciembre grabamos y montamos el contenido de enero.</p>"
    + foto("latas-hielo.jpg", 1100, 0, 820, 1080, "40% 50%", alt="Latas de Libertine Blends con hielo")
    + foot(n)))

# ── 6–9. Paso a paso ──────────────────────────────────────────────────────


def paso(id_, nums, titulo, color, img, pos, nosotros, vosotros, nn):
    li_n = "".join(
        f'<p style="position:relative;font-size:30px;line-height:1.35;padding-left:32px;margin-bottom:20px">'
        f'<span style="position:absolute;left:0;top:0;color:{INK};font-weight:700">—</span>{x}</p>' for x in nosotros)
    li_v = "".join(
        f'<p style="position:relative;font-size:30px;line-height:1.35;padding-left:32px;margin-bottom:20px">'
        f'<span style="position:absolute;left:0;top:0;font-weight:700">—</span>{x}</p>' for x in vosotros)
    return sec(
        foto(img, 0, 0, 720, 1080, pos)
        + f'<div style="position:absolute;left:0;top:0;width:720px;height:14px;background:{color}"></div>'
        + eyebrow(f"03 · PASO A PASO · {nums}", x=820)
        + h(titulo, x=820, y=160, size=110, w=1000)
        + f'<div style="position:absolute;left:820px;top:{330 if "<br>" not in titulo else 400}px;width:470px">'
        f'<p style="{WIDE};font-size:17px;font-weight:700;letter-spacing:3px;margin-bottom:26px;'
        f'display:inline-block;background:{color};padding:8px 16px;border-radius:999px">LO HACEMOS NOSOTROS</p>{li_n}</div>'
        + f'<div style="position:absolute;left:1330px;top:{330 if "<br>" not in titulo else 400}px;width:470px">'
        f'<p style="{WIDE};font-size:17px;font-weight:700;letter-spacing:3px;margin-bottom:26px;'
        f'display:inline-block;border:2px solid {INK};padding:6px 14px;border-radius:999px">NECESITAMOS DE VOSOTROS</p>{li_v}</div>'
        + foot(nn).replace("left:128px;top:996px", "left:820px;top:996px").replace("left:560px", "left:1230px"))


n += 1
add("briefing", "Briefing", paso(
    "briefing", "01", "Briefing", AMARILLO, "caja-bellini.jpg", "40% 60%",
    ["Ideas y formatos para el mes: qué contamos y cómo",
     "Qué piezas salen y qué grabamos para cada una",
     "Los creators del mes y los guiones de paid que vamos a creativizar"],
    ["Lanzamientos, fechas clave y prioridades del mes",
     "Vuestro OK al briefing antes del rodaje"], n))

n += 1
add("rodaje", "Rodaje", paso(
    "rodaje", "02", "Rodaje", NARANJA, "latas-hielo.jpg", "55% 50%",
    ["Una jornada de 4 h al mes, con dirección, foto y vídeo",
     "Modelos y actores: todos mayores de 25 y con la cesión de imagen firmada",
     "Grabaciones extra: 100 €/h en horario laboral, 150 €/h fuera (+ IVA)"],
    ["Producto para grabar",
     "Espacio, si grabamos en vuestras localizaciones"], n))

n += 1
add("post-calendario", "Postproducción y calendario", paso(
    "post-calendario", "03 + 04", "Postproducción<br>y calendario", LILA, "bolsillo.jpg", "45% 50%",
    ["Edición en 9:16 y 4:5",
     "Con vuestro logo y vuestra línea gráfica",
     "Calendario del mes en Canva: cada día con su pieza, su copy y el enlace a Drive"],
    ["Revisar el calendario y darnos feedback",
     "Aprobarlo antes de que empiece el mes"], n))

n += 1
add("publicacion-reporte", "Publicación y reporte", paso(
    "publicacion-reporte", "05 + 06", "Publicación<br>y reporte", AZUL, "cuatro-latas.jpg", "50% 45%",
    ["Publicamos en Instagram y TikTok según el calendario",
     "Stories semanales",
     "Reporte mensual: qué ha funcionado y qué cambiamos"],
    ["Acceso a las cuentas de Instagram y TikTok",
     "Avisarnos de lo que pase en el día a día (novedades, puntos de venta, prensa)"], n))

# ── 10. Creators y paid ───────────────────────────────────────────────────
n += 1
add("creators-paid", "Creators y paid", sec(
    eyebrow("03 · PASO A PASO") + h("Creators y paid")
    + caja(128, 360, 812, 560, LIMA, [
        k_("CREATORS Y COLABORACIONES", size=18),
        t_("Objetivo:<br>5 creators al mes", 72),
        s_("Cada mes proponemos perfiles y colaboraciones y cerramos 5 creators. Entran en el briefing, para que formen parte del plan y no vayan sueltos.", 28)],
        pad=48, gap=28)
    + caja(980, 360, 812, 560, INK, [
        k_("CREATIVOS PARA PAID", AMARILLO, 18),
        t_("Sus guiones,<br>nuestra creatividad.", 72, CREMA),
        s_("No Idea nos pasa los guiones de paid y nosotros los creativizamos. Ellos siguen llevando el paid en UK.", 28, CREMA)],
        color=CREMA, pad=48, gap=28)
    + foot(n)))

# ── 11. Quién es quién ────────────────────────────────────────────────────
n += 1


def persona(x, y, nombre, rol, color, w=500):
    return caja(x, y, w, 118, color, [t_(nombre, 46), s_(rol, 22)], pad=32, radius=20, gap=6)

add("equipo", "Quién es quién", sec(
    eyebrow("04 · QUIÉN ES QUIÉN") + h("Quién es quién")
    + f'<img src="{IMG}/logo-h-negro.png" alt="Libertine Blends" style="position:absolute;left:128px;top:336px;height:22px;width:auto">'
    + persona(128, 390, "Sofía", "CEO · Valida briefings y calendarios", AMARILLO, 640)
    + persona(128, 530, "No Idea", "Agencia de growth en Londres · Paid en UK", CREMA2, 640)
    + f'<img src="/pitch/libertine-blends/maen-logo-negro.png" alt="maen studios" style="position:absolute;left:900px;top:333px;height:26px;width:auto">'
    + persona(900, 390, "Jandro Martín", "Dirección de cuentas", LILA, 430)
    + persona(1362, 390, "Richi", "Dirección creativa", LILA, 430)
    + persona(900, 530, "Helen", "Brand manager · Briefings y rodajes", MELOCOTON, 430)
    + persona(1362, 530, "Blanca", "Community manager · Publicación", MELOCOTON, 430)
    + persona(900, 670, "Equipo audiovisual", "Cámara, foto y edición", MELOCOTON, 892)
    + foot(n)))

# ── 12. Para arrancar ─────────────────────────────────────────────────────
n += 1
items = [
    ("Accesos", "Instagram y TikTok", False),
    ("Marca", "Logo y tipografías: ya los tenemos", True),
    ("Fechas", "Lanzamientos, eventos y fechas clave de los próximos meses", False),
    ("Validación", "Sofía valida briefings y calendarios", True),
    ("Rodajes", "Productos y espacios para grabar", False),
]
it = ""
for i, (k, s, ok) in enumerate(items):
    y = 340 + i * 118
    box = (f'<div style="position:absolute;left:128px;top:{y + 8}px;width:56px;height:56px;border-radius:14px;'
           f'border:3px solid {INK};background:{LIMA if ok else "transparent"}"></div>')
    if ok:
        box += f'<p style="position:absolute;left:138px;top:{y + 2}px;{COND};font-size:52px;font-weight:700">✓</p>'
    it += (box
           + f'<p style="position:absolute;left:220px;top:{y}px;{COND};font-size:60px;font-weight:700;letter-spacing:1px;text-transform:uppercase">{k}</p>'
           f'<p style="position:absolute;left:560px;top:{y + 16}px;width:560px;font-size:28px;line-height:1.3">{s}</p>')
add("arrancar", "Qué necesitamos para arrancar", sec(
    eyebrow("05 · PARA ARRANCAR") + h("Qué necesitamos", w=1000)
    + it
    + foto("caja-bellini.jpg", 1240, 300, 552, 640, "45% 55%", 28)
    + foot(n)))

# ── 13. Próximos pasos ────────────────────────────────────────────────────
n += 1
pp = [
    ("Accesos y materiales", "Nos pasáis lo de la diapositiva anterior", AMARILLO),
    ("Briefing del primer mes", "Os lo presentamos y lo validáis", LILA),
    ("Primer<br>rodaje", "Una jornada de 4 h", NARANJA),
    ("Primer calendario", "Para vuestra revisión, antes de que empiece el mes", LIMA),
]
ps = ""
for i, (t, sub, c) in enumerate(pp):
    x = 128 + i * 424
    ps += caja(x, 380, 392, 420, c, [t_(str(i + 1), 110), t_(t, 52), s_(sub, 24)], pad=36, gap=22)
add("siguientes", "Próximos pasos", sec(
    eyebrow("PRÓXIMOS PASOS", color=AMARILLO) + h("Y empezamos", color=CREMA)
    + ps
    + foot(n, True), bg=INK, color=CREMA))

# ── 14. Cierre ────────────────────────────────────────────────────────────
n += 1
add("cierre", "Cheers", sec(
    foto("cuatro-latas.jpg", 0, 0, 1920, 1080, "50% 40%", alt="Latas de Libertine Blends")
    + '<div style="position:absolute;left:0;top:0;width:1920px;height:1080px;background:rgba(21,21,21,.55)"></div>'
    + f'<img src="{IMG}/logo-crema.png" alt="Libertine Blends" style="position:absolute;left:560px;top:330px;width:800px;height:auto">'
    + f'<div style="position:absolute;left:0;top:610px;width:1920px;display:flex;justify-content:center;align-items:center;gap:22px">'
    f'<span style="{COND};font-size:70px;font-weight:500;line-height:1;color:{CREMA}">×</span>'
    f'<img src="/maen-logo.png" alt="maen studios" style="height:42px;width:auto"></div>'
    ,
    bg=INK, color=CREMA))

out = Path(__file__).resolve().parent.parent / "app/pitch/libertine-kickoff/diapos.ts"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(
    "/**\n * Diapositivas del kick-off con Libertine Blends.\n"
    " * Generadas con scripts/build-libertine-kickoff.py: no se editan a mano.\n */\n\n"
    'import type { DiapoHtml } from "../libertine-blends/diapos";\n\n'
    f"export const DIAPOS: DiapoHtml[] = {json.dumps(slides, ensure_ascii=False, indent=2)};\n",
    encoding="utf-8")
print(len(slides), "diapositivas →", out)
