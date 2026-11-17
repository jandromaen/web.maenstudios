"""Genera app/pitch/kong/diapos.ts: plan de acción pre-apertura de KONG
(Grupo Ikibana, El Born), de noviembre 2026 a la apertura en febrero-marzo
2027 y los 90 días siguientes.

Mismo visor y estilos que el resto de /pitch (../maen-plan-100k/plan.css).
El acento rosa de Maen se cambia por el rojo brasa del mood de KONG
redefiniendo --rosa en cada diapositiva. El logo y los moods salen del
moodboard de interiorismo de Marabunta (public/pitch/kong/).

La fecha de apertura es de trabajo (DIA_A): si cambia, se edita aquí y se
vuelve a ejecutar desde la raíz del repo:

    python3 scripts/build-kong.py
"""

import json
from datetime import date
from pathlib import Path

INK = "#151515"
ACENTO = "#E2552E"
MARCA = "Maen Studios × KONG"

HOY = date(2026, 11, 17)
DIA_A = date(2027, 3, 1)


def sec(body, bg=INK, color="#F4F4F4"):
    return f'<section style="background:{bg};color:{color};--rosa:{ACENTO}">{body}</section>'


def foot(n):
    return f'<div class="foot" style="left:128px;"><span>{MARCA}</span><span class="n">{n:02d}</span></div>'


def eyebrow(t, top=128, left=128, d=0):
    return f'<p class="abs a pm-eyebrow" style="left:{left}px;top:{top}px;--d:{d}">{t}</p>'


def titulo(t, top=190, left=128, width=1660, size=72, d=1, extra=""):
    return (
        f'<h2 class="abs a disp" style="left:{left}px;top:{top}px;width:{width}px;'
        f'font-size:{size}px;line-height:1.05;{extra}--d:{d}">{t}</h2>'
    )


def p(t, left, top, width, size=26, d=2, cls="soft", extra=""):
    return (
        f'<p class="abs a {cls}" style="left:{left}px;top:{top}px;width:{width}px;'
        f'font-size:{size}px;line-height:1.4;{extra}--d:{d}">{t}</p>'
    )


def img(src, left, top, w, h, d=1, extra=""):
    return (
        f'<img class="abs a" src="{src}" alt="" style="left:{left}px;top:{top}px;width:{w}px;'
        f'height:{h}px;object-fit:cover;border-radius:20px;{extra}--d:{d}">'
    )


def tareas(items, x, top, width, size=25, d=2):
    """Lista de tareas: casilla, texto y responsable en gris."""
    lis = ""
    for it in items:
        txt, quien = it if isinstance(it, tuple) else (it, "")
        q = ""  # sin responsables: la presentación es para el cliente
        lis += (
            f'<p style="margin:0 0 24px;padding-left:44px;text-indent:-44px">'
            f'<span style="display:inline-block;width:22px;height:22px;margin-right:22px;'
            f'border:2px solid var(--rosa);border-radius:6px;vertical-align:-3px;text-indent:0"></span>'
            f'{txt}{q}</p>'
        )
    return (
        f'<div class="abs a" style="left:{x}px;top:{top}px;width:{width}px;font-size:{size}px;'
        f'line-height:1.3;color:#E4E2DE;--d:{d}">{lis}</div>'
    )


slides = []
n = 0


def add(id_, tit, html):
    slides.append({"id": id_, "titulo": tit, "html": html})


semanas = (DIA_A - HOY).days // 7

# ── 1. Portada ────────────────────────────────────────────────────────────
n += 1
add("portada", "KONG · Plan de acción", sec(
    img("/pitch/kong/portada.jpg", 1180, 120, 560, 840, d=1)
    + eyebrow("Plan de acción · Pre-apertura", top=170)
    + '<img class="abs a" src="/pitch/kong/logo-kong.png" alt="KONG Japanese Restaurant" '
    'style="left:128px;top:330px;width:760px;--d:1">'
    + p("De la obra a la apertura.", 128, 640, 820, size=40, d=2, cls="",
        extra="font-weight:800;")
    + p("Apertura prevista: febrero–marzo 2027 · El Born, Barcelona", 128, 710, 820, size=28, d=3)
))

# ── 2. Punto de partida ───────────────────────────────────────────────────
n += 1
datos = [
    ("Hoy", "17 nov", "El local está en obras."),
    ("Día A · hipótesis", "1 mar", "Fecha de trabajo, aún sin confirmar. Todo el calendario se mueve con ella."),
    ("Margen aprox.", f"{semanas} sem.", "Hasta esa apertura hipotética, para llegar con todo montado."),
]
dh = ""
for i, (k, v, s_) in enumerate(datos):
    x = 128 + i * 560
    dh += (
        f'<div class="abs pm-card pop" style="left:{x}px;top:360px;width:528px;height:380px;--d:{i}"></div>'
        f'<p class="abs a rosa" style="left:{x + 40}px;top:400px;font-size:22px;font-weight:700;'
        f'letter-spacing:.08em;text-transform:uppercase;--d:{i + 1}">{k}</p>'
        f'<p class="abs a disp" style="left:{x + 40}px;top:460px;font-size:84px;line-height:1;--d:{i + 1}">{v}</p>'
        f'<p class="abs a soft" style="left:{x + 40}px;top:600px;width:450px;font-size:25px;line-height:1.4;--d:{i + 2}">{s_}</p>'
    )
add("partida", "Punto de partida", sec(
    eyebrow("Punto de partida")
    + titulo("Abrir con todo listo, no a medias", size=64)
    + dh
    + p("Al abrir, KONG tiene que tener el nombre asegurado, la web publicada y las redes activadas.",
        128, 800, 1600, size=28, d=5, cls="", extra="color:#E4E2DE;")
    + foot(n),
))

# ── Alcance de Maen ──────────────────────────────────────────────────────
n += 1
bloques = [
    ("Web", "1.800 €", "+ IVA · pago único",
     ["Captación de dominios", "Diseño web", "SEO y copywriting", "Programación y publicación"]),
    ("Mantenimiento", "100 €", "al mes + IVA",
     ["Mantenimiento de la web", "Newsletter mensual"]),
    ("Pre-apertura", "1.500 €", "+ IVA · rodaje",
     ["Rodaje documentando el proceso", "Postproducción de las piezas", "Contenido para el teasing"]),
    ("Redes · desde apertura", "2.500 €", "al mes + IVA",
     ["Briefing creativo mensual", "Rodaje mensual", "Postproducción",
      "Calendario a un mes vista", "Publicación y reporte"]),
]
bh = ""
CW, GAP = 392, 32
for i, (k, v, suf, lst) in enumerate(bloques):
    x = 128 + i * (CW + GAP)
    lis = "".join(f'<p style="margin:0 0 12px">{t}</p>' for t in lst)
    bh += (
        f'<div class="abs pm-card pop" style="left:{x}px;top:310px;width:{CW}px;height:640px;--d:{i}"></div>'
        f'<p class="abs a rosa" style="left:{x + 32}px;top:348px;font-size:19px;font-weight:700;'
        f'letter-spacing:.08em;text-transform:uppercase;--d:{i + 1}">{k}</p>'
        f'<p class="abs a disp" style="left:{x + 32}px;top:396px;font-size:58px;line-height:1;--d:{i + 1}">{v}</p>'
        f'<p class="abs a soft" style="left:{x + 32}px;top:470px;font-size:21px;font-weight:700;'
        f'letter-spacing:.04em;--d:{i + 1}">{suf}</p>'
        f'<div class="abs a" style="left:{x + 32}px;top:550px;width:{CW - 64}px;font-size:24px;line-height:1.35;'
        f'color:#E4E2DE;--d:{i + 2}">{lis}</div>'
    )
add("alcance", "Nuestra parte", sec(
    eyebrow("Alcance de Maen")
    + titulo("Web, mantenimiento y redes", size=64)
    + bh + foot(n),
))

# ── 3. Hoja de ruta (cronograma) ─────────────────────────────────────────
n += 1
fases = [
    ("1", "Captación de dominios", date(2026, 11, 17), date(2026, 11, 30)),
    ("2", "Conceptualización y branding", date(2026, 11, 17), date(2026, 12, 1)),
    ("3", "Diseño web", date(2026, 12, 1), date(2026, 12, 22)),
    ("4", "SEO y copywriting", date(2026, 12, 1), date(2027, 1, 15)),
    ("5", "Programación y publicación", date(2027, 1, 8), date(2027, 2, 15)),
    ("6", "Mantenimiento y newsletter", date(2027, 2, 15), date(2027, 5, 31)),
    ("7", "Rodaje de pre-apertura", date(2027, 2, 1), date(2027, 2, 28)),
    ("8", "Redes sociales desde la apertura", date(2027, 3, 1), date(2027, 5, 31)),
]
ini, fin = date(2026, 11, 1), date(2027, 6, 1)
X0, X1 = 640, 1792
total = (fin - ini).days


def X(d_):
    return X0 + (d_ - ini).days / total * (X1 - X0)


ROW0, ROWH = 330, 66
gh = ""
meses = [(date(2026, 11, 1), "Nov"), (date(2026, 12, 1), "Dic"), (date(2027, 1, 1), "Ene"),
         (date(2027, 2, 1), "Feb"), (date(2027, 3, 1), "Mar"), (date(2027, 4, 1), "Abr"),
         (date(2027, 5, 1), "May")]
for m, lab in meses:
    x = X(m)
    gh += (f'<div class="abs a" style="left:{x:.0f}px;top:300px;width:1px;height:{ROWH * 9 + 20}px;'
           f'background:rgba(255,255,255,.1);--d:1"></div>'
           f'<p class="abs a muted" style="left:{x + 10:.0f}px;top:262px;font-size:20px;'
           f'letter-spacing:.08em;text-transform:uppercase;--d:1">{lab}</p>')
for i, (num, nom, a_, b_) in enumerate(fases):
    y = ROW0 + i * ROWH
    x, w = X(a_), max(X(b_) - X(a_), 14)
    gh += (
        f'<p class="abs a" style="left:128px;top:{y - 4}px;width:500px;font-size:25px;font-weight:700;--d:{2 + i * 0.2:.1f}">'
        f'<span class="rosa" style="display:inline-block;width:44px">{num}</span>{nom}</p>'
        f'<div class="abs a" style="left:{x:.0f}px;top:{y - 2}px;width:{w:.0f}px;height:30px;'
        f'border-radius:15px;background:rgba(226,85,46,.28);border:2px solid var(--rosa);--d:{2 + i * 0.2:.1f}"></div>'
    )
xa = X(DIA_A)
gh += (f'<div class="abs a" style="left:{xa:.0f}px;top:300px;width:0;height:{ROWH * 9 + 20}px;'
       f'border-left:3px dashed var(--rosa);--d:4"></div>'
       f'<p class="abs a rosa" style="left:{xa + 12:.0f}px;top:{ROW0 + ROWH * 9 + 6}px;font-size:22px;'
       f'font-weight:800;--d:4">Día A · 1 mar (hipótesis)</p>')
add("hoja-de-ruta", "Hoja de ruta", sec(
    eyebrow("Hoja de ruta")
    + titulo("Ocho fases, de los dominios a las redes", size=46)
    + p("Fechas orientativas sobre una apertura hipotética el 1 de marzo. Se recalculan con la fecha real.", 128, 905, 470, size=20, d=4, cls="muted")
    + gh + foot(n),
))

# ── 5-13. Fases ───────────────────────────────────────────────────────────
FASES = [
    ("1", "Captación de dominios", "17 – 30 de noviembre",
     "Asegurar el nombre antes de que nos lo quiten. Todo a nombre de KONG, con Maen como administrador.",
     [("Elegir el nombre para dominio y redes, sin macrón", "Dirección de cuentas y creativa"),
      ("Registrar el dominio principal", "Maen"),
      ("Registrar variantes (.com, .es, .barcelona, .cat) y redirigirlas", "Maen"),
      ("Reservar el mismo handle en Instagram, TikTok y Facebook", "CM"),
      ("Titularidad a nombre de KONG y accesos documentados", "Maen")]),
    ("2", "Conceptualización y branding", "17 de noviembre – 1 de diciembre",
     "Decidir cómo habla y cómo se ve KONG en la web y en redes. Los pilares ya están en el nombre: Kaizen, Omakase, Noren y Gohan.",
     [("Concepto y tono de voz", "Dirección creativa"),
      ("Pilares de contenido", "Dirección creativa + Brand Manager"),
      ("Sistema gráfico para web y redes a partir del logo", "Dirección creativa"),
      ("Referentes y competencia en El Born", "Brand Manager"),
      ("Validación del concepto con KONG, antes del 1/12", "Dirección de cuentas")]),
    ("3", "Diseño web", "Diciembre",
     "Una web que transmita el paso del Record Bar a la sala, y que lleve a reservar.",
     [("Arquitectura: Record Bar, Sala y Omakase, Carta, Equipo, Eventos y Contacto", "Brand Manager"),
      ("Diseño de la home y de las páginas interiores", "Dirección creativa"),
      ("Versión móvil", "Dirección creativa"),
      ("Revisión y validación con KONG", "Dirección de cuentas")]),
    ("4", "SEO y copywriting", "Diciembre – mediados de enero",
     "Que KONG aparezca cuando alguien busca dónde cenar japonés en El Born, y que los textos vendan la experiencia.",
     [("Estudio de palabras clave: japonés Born, omakase Barcelona, cocktail bar Born", "Brand Manager"),
      ("Textos de todas las páginas", "Brand Manager"),
      ("Títulos y descripciones para Google", "Brand Manager"),
      ("Revisión y validación de los textos con KONG", "Dirección de cuentas")]),
    ("5", "Programación y publicación", "Enero – 15 de febrero",
     "Web programada, probada y publicada antes de que empiece el teasing.",
     [("Programación de la web", "Maen"),
      ("Integración con la plataforma de reservas", "Maen"),
      ("Carta fácil de actualizar", "Maen"),
      ("SEO técnico: velocidad y datos estructurados de restaurante", "Maen"),
      ("Pruebas en móvil y ordenador", "Maen"),
      ("Publicación, antes del 15/02", "Maen")]),
    ("6", "Mantenimiento web y newsletter", "Desde la publicación · mensual",
     "La web siempre al día y una newsletter al mes para mantener el contacto con los clientes. 100 € al mes + IVA.",
     [("Actualizaciones de carta, horarios y eventos", "Maen"),
      ("Revisión técnica y copias de seguridad", "Maen"),
      ("Newsletter mensual: contenido, diseño y envío", "Brand Manager")]),
    ("7", "Rodaje de pre-apertura", "Pre-apertura · fecha a definir",
     "Un primer rodaje que documenta el proceso hasta la apertura. Es el contenido del teasing. 1.500 € + IVA.",
     [("Briefing del rodaje", "Dirección creativa + Brand Manager"),
      ("Rodaje documentando el proceso: obra, equipo, cocina y coctelería", "Mati + Víctor"),
      ("Postproducción de las piezas", "Go"),
      ("Calendario y publicación del teasing", "CM")]),
    ("8", "Redes sociales desde la apertura", "Desde la apertura · ciclo mensual",
     "El workflow completo de Maen: cada mes, del briefing al reporte, con el calendario siempre a un mes vista. 2.500 € al mes + IVA.",
     [("Briefing creativo mensual", "Dirección creativa + Brand Manager"),
      ("Rodaje mensual en el local", "Mati + Víctor"),
      ("Postproducción de las piezas", "Go"),
      ("Calendario editorial a un mes vista", "CM"),
      ("Publicación en los perfiles", "CM"),
      ("Reporte mensual de resultados", "Brand Manager")]),
]

for num, nom, cuando, obj, items in FASES:
    n += 1
    extra = ""
    if num == "1":
        extra = (
            '<div class="abs pm-card a" style="left:128px;top:760px;width:620px;height:190px;--d:4"></div>'
            '<p class="abs a rosa" style="left:160px;top:788px;font-size:18px;font-weight:700;'
            'letter-spacing:.08em;text-transform:uppercase;--d:4">Opciones a validar</p>'
            '<p class="abs a" style="left:160px;top:830px;width:560px;font-size:23px;line-height:1.55;'
            'color:#E4E2DE;--d:5">kongbarcelona.com · kong.barcelona · kongborn.com<br>'
            '@kongbarcelona · @kong.bcn · @kong.born</p>'
        )
    size = 27 if len(items) > 8 else 30
    add(f"fase-{num}", f"Fase {num} · {nom}", sec(
        f'<p class="abs a disp outline" style="left:120px;top:110px;font-size:180px;line-height:1;--d:0">{num.zfill(2)}</p>'
        + p(cuando, 128, 320, 640,
            size=22, d=1, cls="rosa", extra="font-weight:700;letter-spacing:.06em;text-transform:uppercase;")
        + titulo(nom, top=370, width=680, size=46, d=2)
        + p(obj, 128, 540, 620, size=26, d=3)
        + extra
        + tareas(items, 880, 170, 910, size=size, d=3)
        + foot(n),
    ))

# ── 14. Pendientes de KONG ───────────────────────────────────────────────
n += 1
pend = [
    "Fecha exacta de apertura",
    "Interlocutor y firmante por parte de KONG",
    "Quién es titular y paga los dominios",
    "Logo en vectorial y tipografías",
    "Si hay manual de marca más allá del logo",
    "Plataforma de reservas que vais a usar",
    "Idiomas de la web",
    "Renders del interiorismo cuando estén",
    "Acceso al local para los rodajes",
]
add("pendientes", "Pendientes de KONG", sec(
    eyebrow("Para arrancar")
    + titulo("Lo que necesitamos de vosotros", size=64)
    + tareas(pend[:5], 128, 360, 780, size=32, d=2)
    + tareas(pend[5:], 1010, 360, 780, size=32, d=3)
    + foot(n),
))

# ── 15. Cierre ───────────────────────────────────────────────────────────
n += 1
add("cierre", "Próximo paso", sec(
    img("/pitch/kong/cierre.jpg", 1220, 140, 560, 800, d=1)
    + eyebrow("Próximo paso")
    + titulo("Arrancamos<br>esta semana", top=260, width=960, size=80)
    + p("Empezamos por la captación de dominios y la conceptualización, para tener el concepto validado el 1 de diciembre.", 128, 500, 900, size=30, d=2)
    + '<div class="abs a" style="left:128px;top:720px;font-size:28px;line-height:1.5;--d:3">'
    '<p style="font-weight:800">Maen Studios</p>'
    '<p><a href="mailto:jandro@maenstudios.com" style="color:inherit">jandro@maenstudios.com</a> · +34 688 629 688</p>'
    "</div>"
    + foot(n),
))

out = Path("app/pitch/kong/diapos.ts")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(
    "/**\n * Plan de acción pre-apertura de KONG (Grupo Ikibana, El Born).\n"
    " * Generado con scripts/build-kong.py: si cambia el contenido o la\n"
    " * fecha de apertura, se edita el script y se vuelve a ejecutar.\n */\n\n"
    'import type { DiapoHtml } from "../maen-plan-100k/diapos";\n\n'
    "export const DIAPOS: DiapoHtml[] = "
    + json.dumps(slides, ensure_ascii=False, indent=2)
    + ";\n"
)
print(f"{len(slides)} diapositivas → {out}")
