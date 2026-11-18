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


n = 0

# ── 1. Portada ─────────────────────────────────────────────────────────────
n += 1
add("portada", "Kick-off", sec(
    foto("cuatro-latas.jpg", 1060, 0, 860, 1080, "50% 40%", alt="Cuatro latas de Libertine Blends")
    + f'<img src="{IMG}/logo-negro.png" alt="Libertine Blends" style="position:absolute;left:128px;top:120px;width:520px;height:auto">'
    + f'<p style="position:absolute;left:128px;top:330px;{WIDE};font-size:26px;font-weight:700;letter-spacing:6px">× MAEN STUDIOS</p>'
    + f'<h1 style="position:absolute;left:120px;top:400px;{COND};font-size:250px;font-weight:700;line-height:.9;letter-spacing:4px">KICK-OFF</h1>'
    + f'<p style="position:absolute;left:128px;top:650px;width:820px;font-size:38px;line-height:1.3">'
    "Cómo vamos a trabajar juntos como vuestro equipo social y creativo en Instagram y TikTok.</p>"
    + f'<p style="position:absolute;left:128px;top:850px;padding:14px 30px;{WIDE};font-size:24px;font-weight:700;'
    f'letter-spacing:4px;color:{AMARILLO};background:{INK};border-radius:999px">18 · 11 · 2026</p>'
    + f'<img src="/pitch/libertine-blends/maen-logo-negro.png" alt="maen studios" style="position:absolute;left:128px;top:990px;height:26px;width:auto">'
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
    cc += (f'<div style="position:absolute;left:{x}px;top:360px;width:{w}px;height:500px;background:{c};border-radius:28px"></div>'
           f'<p style="position:absolute;left:{x + 36}px;top:396px;width:{w - 72}px;{WIDE};font-size:17px;font-weight:700;letter-spacing:3px">{k}</p>'
           f'<p style="position:absolute;left:{x + 36}px;top:470px;width:{w - 60}px;{COND};font-size:84px;font-weight:700;line-height:.95;text-transform:uppercase">{t}</p>'
           f'<p style="position:absolute;left:{x + 36}px;top:700px;width:{min(w - 72, 520)}px;font-size:26px;line-height:1.35">{sub}</p>')
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
    cy += (f'<div style="position:absolute;left:{x}px;top:420px;width:200px;height:200px;border-radius:50%;background:{c}"></div>'
           f'<p style="position:absolute;left:{x}px;top:470px;width:200px;text-align:center;{COND};font-size:96px;font-weight:700;color:{INK}">{i + 1:02d}</p>')
    if i < 5:
        cy += (f'<div style="position:absolute;left:{x + 212}px;top:519px;width:56px;height:2px;background:{CREMA};opacity:.5"></div>')
    cy += (f'<p style="position:absolute;left:{x - 20}px;top:660px;width:240px;text-align:center;{COND};font-size:36px;font-weight:700;letter-spacing:.5px;text-transform:uppercase">{t}</p>'
           f'<p style="position:absolute;left:{x - 20}px;top:720px;width:240px;text-align:center;font-size:22px;line-height:1.35;color:rgba(244,236,228,.75)">{s}</p>')
add("ciclo", "Cada mes, el mismo ciclo", sec(
    eyebrow("02 · CÓMO TRABAJAMOS", color=AMARILLO) + h("Cada mes, el mismo ciclo", color=CREMA)
    + cy
    + f'<p style="position:absolute;left:128px;top:860px;width:1664px;font-size:30px;line-height:1.4;color:{CREMA}">'
    "Lo repetimos todos los meses. Así cada mes sale mejor que el anterior.</p>"
    + foot(n, True), bg=INK, color=CREMA))

# ── 5. Un mes vista ───────────────────────────────────────────────────────
n += 1
add("mes-vista", "Siempre a un mes vista", sec(
    eyebrow("02 · CÓMO TRABAJAMOS") + h("Siempre a<br>un mes vista", w=900)
    + f'<p style="position:absolute;left:128px;top:420px;width:860px;font-size:32px;line-height:1.4">'
    "Preparamos y producimos un mes antes de que se publique. Así vosotros tenéis tiempo de revisarlo todo, y nada se hace con prisas.</p>"
    # línea de tiempo
    + f'<div style="position:absolute;left:128px;top:660px;width:400px;height:150px;background:{AMARILLO};border-radius:24px"></div>'
    f'<p style="position:absolute;left:164px;top:680px;{WIDE};font-size:17px;font-weight:700;letter-spacing:3px">ESTE MES</p>'
    f'<p style="position:absolute;left:164px;top:720px;width:340px;{COND};font-size:46px;font-weight:700;line-height:1;text-transform:uppercase">Briefing, rodaje y edición</p>'
    + f'<p style="position:absolute;left:548px;top:695px;{COND};font-size:80px;font-weight:700">→</p>'
    + f'<div style="position:absolute;left:640px;top:660px;width:340px;height:150px;background:{LILA};border-radius:24px"></div>'
    f'<p style="position:absolute;left:676px;top:680px;{WIDE};font-size:17px;font-weight:700;letter-spacing:3px">EL MES QUE VIENE</p>'
    f'<p style="position:absolute;left:676px;top:720px;width:280px;{COND};font-size:46px;font-weight:700;line-height:1;text-transform:uppercase">Se publica</p>'
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
     "Todo lo del mes sale de esa jornada",
     "Grabaciones extra: 100 €/h en horario laboral, 150 €/h fuera (+ IVA)"],
    ["Producto para grabar",
     "Espacio, si grabamos en vuestras localizaciones",
     "Quien salga, mayor de 25 años y con la cesión de imagen firmada"], n))

n += 1
add("post-calendario", "Postproducción y calendario", paso(
    "post-calendario", "03 + 04", "Postproducción<br>y calendario", LILA, "bolsillo.jpg", "45% 50%",
    ["Edición en 9:16 y 4:5",
     "Con vuestro logo y vuestra línea gráfica",
     "Calendario del mes en Canva: cada día con su pieza, su copy y el enlace a Drive"],
    ["Revisar el calendario y darnos feedback en una sola ronda",
     "Aprobarlo antes de que empiece el mes"], n))

n += 1
add("publicacion-reporte", "Publicación y reporte", paso(
    "publicacion-reporte", "05 + 06", "Publicación<br>y reporte", AZUL, "cuatro-latas.jpg", "50% 45%",
    ["Publicamos en Instagram y TikTok según el calendario",
     "Stories del día a día",
     "Respondemos comentarios y mensajes",
     "Reporte mensual: qué ha funcionado y qué cambiamos"],
    ["Acceso a las cuentas de Instagram y TikTok",
     "Avisarnos de lo que pase en el día a día (novedades, puntos de venta, prensa)"], n))

# ── 10. Creators y paid ───────────────────────────────────────────────────
n += 1
add("creators-paid", "Creators y paid", sec(
    eyebrow("03 · PASO A PASO") + h("Creators y paid")
    + f'<div style="position:absolute;left:128px;top:360px;width:812px;height:560px;background:{LIMA};border-radius:28px"></div>'
    f'<p style="position:absolute;left:176px;top:404px;{WIDE};font-size:18px;font-weight:700;letter-spacing:3px">CREATORS Y COLABORACIONES</p>'
    f'<p style="position:absolute;left:176px;top:470px;width:720px;{COND};font-size:72px;font-weight:700;line-height:.95;text-transform:uppercase">Objetivo:<br>5 creators al mes</p>'
    f'<p style="position:absolute;left:176px;top:700px;width:710px;font-size:28px;line-height:1.4">'
    "Cada mes proponemos perfiles y colaboraciones y cerramos 5 creators. Entran en el briefing, para que formen parte del plan y no vayan sueltos.</p>"
    + f'<div style="position:absolute;left:980px;top:360px;width:812px;height:560px;background:{INK};border-radius:28px"></div>'
    f'<p style="position:absolute;left:1028px;top:404px;{WIDE};font-size:18px;font-weight:700;letter-spacing:3px;color:{AMARILLO}">CREATIVOS PARA PAID</p>'
    f'<p style="position:absolute;left:1028px;top:470px;width:720px;{COND};font-size:72px;font-weight:700;line-height:.95;text-transform:uppercase;color:{CREMA}">Sus guiones,<br>nuestra creatividad.</p>'
    f'<p style="position:absolute;left:1028px;top:700px;width:710px;font-size:28px;line-height:1.4;color:{CREMA}">'
    "No Idea nos pasa los guiones de paid y nosotros los creativizamos. Ellos siguen llevando el paid en UK.</p>"
    + foot(n)))

# ── 11. Quién es quién ────────────────────────────────────────────────────
n += 1


def persona(x, y, nombre, rol, color, w=500):
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:118px;border-radius:20px;background:{color}"></div>'
            f'<p style="position:absolute;left:{x + 32}px;top:{y + 18}px;{COND};font-size:46px;font-weight:700;letter-spacing:1px;text-transform:uppercase">{nombre}</p>'
            f'<p style="position:absolute;left:{x + 32}px;top:{y + 72}px;font-size:22px">{rol}</p>')


add("equipo", "Quién es quién", sec(
    eyebrow("04 · QUIÉN ES QUIÉN") + h("Quién es quién")
    + f'<p style="position:absolute;left:128px;top:330px;{WIDE};font-size:20px;font-weight:700;letter-spacing:4px">LIBERTINE BLENDS</p>'
    + persona(128, 390, "Sofía", "CEO · Valida briefings y calendarios", AMARILLO, 640)
    + persona(128, 530, "No Idea", "Agencia de growth en Londres · Paid en UK", CREMA2, 640)
    + f'<p style="position:absolute;left:900px;top:330px;{WIDE};font-size:20px;font-weight:700;letter-spacing:4px">MAEN STUDIOS</p>'
    + persona(900, 390, "Jandro Martín", "Dirección de cuentas · Vuestro contacto", LILA, 430)
    + persona(1362, 390, "Richi", "Dirección creativa", LILA, 430)
    + persona(900, 530, "Brand manager", "Briefings y rodajes", MELOCOTON, 430)
    + persona(1362, 530, "Community manager", "Calendario y publicación", MELOCOTON, 430)
    + persona(900, 670, "Equipo audiovisual", "Cámara, foto y edición", MELOCOTON, 892)
    + foot(n)))

# ── 12. Para arrancar ─────────────────────────────────────────────────────
n += 1
items = [
    ("Accesos", "Instagram y TikTok", False),
    ("Marca", "Logo y tipografías: ya los tenemos", True),
    ("Fechas", "Lanzamientos, eventos y fechas clave de los próximos meses", False),
    ("Validación", "Quién valida y en cuánto tiempo nos responde", False),
    ("Producto", "Latas para el primer rodaje", False),
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
    ("Primer rodaje", "Una jornada de 4 h", NARANJA),
    ("Primer calendario", "Para vuestra revisión, antes de que empiece el mes", LIMA),
]
ps = ""
for i, (t, s, c) in enumerate(pp):
    x = 128 + i * 424
    ps += (f'<div style="position:absolute;left:{x}px;top:380px;width:392px;height:420px;border-radius:28px;background:{c}"></div>'
           f'<p style="position:absolute;color:#151515;left:{x + 36}px;top:410px;{COND};font-size:110px;font-weight:700;line-height:1">{i + 1}</p>'
           f'<p style="position:absolute;color:#151515;left:{x + 36}px;top:560px;width:330px;{COND};font-size:52px;font-weight:700;line-height:1;text-transform:uppercase">{t}</p>'
           f'<p style="position:absolute;color:#151515;left:{x + 36}px;top:690px;width:320px;font-size:24px;line-height:1.35">{s}</p>')
add("siguientes", "Próximos pasos", sec(
    eyebrow("PRÓXIMOS PASOS", color=AMARILLO) + h("Y empezamos", color=CREMA)
    + ps
    + foot(n, True), bg=INK, color=CREMA))
# las tarjetas de color llevan texto oscuro
slides[-1]["html"] = slides[-1]["html"].replace(
    'border-radius:28px;background:', 'border-radius:28px;color:#151515;background:')

# ── 14. Cierre ────────────────────────────────────────────────────────────
n += 1
add("cierre", "Cheers", sec(
    foto("cuatro-latas.jpg", 0, 0, 1920, 1080, "50% 40%", alt="Latas de Libertine Blends")
    + '<div style="position:absolute;left:0;top:0;width:1920px;height:1080px;background:rgba(21,21,21,.55)"></div>'
    + f'<img src="{IMG}/logo-crema.png" alt="Libertine Blends" style="position:absolute;left:560px;top:330px;width:800px;height:auto">'
    + f'<p style="position:absolute;left:0;top:620px;width:1920px;text-align:center;{WIDE};font-size:30px;font-weight:700;letter-spacing:8px;color:{CREMA}">× MAEN STUDIOS</p>'
    + f'<p style="position:absolute;left:0;top:740px;width:1920px;text-align:center;{COND};font-size:64px;font-weight:700;letter-spacing:4px;color:{AMARILLO}">¿EMPEZAMOS?</p>',
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
