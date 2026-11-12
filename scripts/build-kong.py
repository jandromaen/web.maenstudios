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

HOY = date(2026, 11, 12)
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
        q = f' <span class="muted" style="white-space:nowrap">· {quien}</span>' if quien else ""
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
    + p("Noviembre 2026 → marzo 2027 · El Born, Barcelona", 128, 710, 820, size=28, d=3)
))

# ── 2. Punto de partida ───────────────────────────────────────────────────
n += 1
datos = [
    ("Hoy", "12 nov", "El local está en obras."),
    ("Día A", "1 mar", "Fecha de trabajo para la apertura. Se ajusta cuando esté confirmada."),
    ("Margen", f"{semanas} sem.", "Para llegar a la apertura con todo montado."),
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
    + p("Al abrir, KONG tiene que tener el nombre asegurado, marca, web, comunidad en Instagram, "
        "contenido grabado y prensa avisada.", 128, 800, 1600, size=28, d=5, cls="",
        extra="color:#E4E2DE;")
    + foot(n),
))

# ── 3. Hoja de ruta (cronograma) ─────────────────────────────────────────
n += 1
fases = [
    ("0", "Kick-off y alcance", date(2026, 11, 12), date(2026, 11, 30)),
    ("1", "Dominios y perfiles", date(2026, 11, 17), date(2026, 12, 5)),
    ("2", "Estrategia e identidad", date(2026, 11, 24), date(2026, 12, 19)),
    ("3", "Web", date(2026, 12, 1), date(2027, 2, 15)),
    ("4", "Contenido de obra", date(2026, 12, 1), date(2027, 2, 15)),
    ("5", "Producción pre-apertura", date(2027, 2, 1), date(2027, 2, 20)),
    ("6", "Teasing, PR y lista de espera", date(2027, 2, 1), date(2027, 3, 1)),
    ("7", "Apertura", date(2027, 2, 22), date(2027, 3, 8)),
    ("8", "Primeros 90 días", date(2027, 3, 1), date(2027, 5, 31)),
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
       f'font-weight:800;--d:4">Día A · 1 mar</p>')
add("hoja-de-ruta", "Hoja de ruta", sec(
    eyebrow("Hoja de ruta")
    + titulo("Nueve fases, de la obra a los 90 días", size=60)
    + gh + foot(n),
))

# ── 4. Dirección visual ───────────────────────────────────────────────────
n += 1
moods = [
    ("Mood 1", "Ámbar y madera", "Madera acanalada, ónice retroiluminado, lámparas de papel y poca luz.",
     "Fotos cálidas y oscuras, mucho detalle de material. Encaja con el Omakase."),
    ("Mood 2", "Rojo nocturno", "Rojo profundo, lámparas rojas, DJ ante un dragón retroiluminado.",
     "El Record Bar de protagonista: vinilo, cócteles, vídeo con ritmo."),
    ("Mood 3", "Tokio pop", "Neón, murales de carpas koi, arte urbano y kanji.",
     "Más color y más viral, con un punto más desenfadado."),
]
mh = ""
for i, (k, nom, que, cont) in enumerate(moods):
    x = 128 + i * 576
    mh += (
        img(f"/pitch/kong/mood-{i + 1}.jpg", x, 300, 536, 380, d=i + 1)
        + f'<p class="abs a rosa" style="left:{x}px;top:705px;font-size:20px;font-weight:700;'
        f'letter-spacing:.08em;text-transform:uppercase;--d:{i + 2}">{k}</p>'
        + f'<p class="abs a" style="left:{x}px;top:740px;font-size:34px;font-weight:800;--d:{i + 2}">{nom}</p>'
        + p(que, x, 795, 520, size=22, d=i + 3)
        + p(cont, x, 880, 520, size=22, d=i + 3, cls="", extra="color:#E4E2DE;font-weight:600;")
    )
add("direccion-visual", "Dirección visual", sec(
    eyebrow("Dirección visual · Interiorismo de Marabunta")
    + titulo("El mood marca todo el contenido", size=56)
    + mh + foot(n),
))

# ── 5-13. Fases ───────────────────────────────────────────────────────────
FASES = [
    ("0", "Kick-off y alcance", "Semana del 17 de noviembre",
     "Cerrar qué hacemos, por cuánto y con qué accesos. El hueco de marketing de la presentación de KONG es el nuestro.",
     [("Reunión de kick-off con el encargado", "Jandro"),
      ("Confirmar fecha de apertura y soft opening", "Jandro"),
      ("Cerrar alcance: diseño, web, Instagram, Google, estrategia, PR y teasing", "Jandro"),
      ("Propuesta y presupuesto", "Jandro + Richi"),
      ("Contrato firmado", "Jandro"),
      ("Material de marca: logo vectorial, tipografías, renders y carta provisional", "Brand Manager"),
      ("Cómo convive KONG con Ikibana Born en comunicación", "Jandro")]),
    ("1", "Dominios, perfiles y activos digitales", "17 – 30 de noviembre",
     "Asegurar el nombre antes de que nos lo quiten. Todo a nombre de KONG, con Maen como administrador.",
     [("Elegir el nombre para dominio y redes, sin macrón", "Jandro + Richi"),
      ("Registrar dominio y variantes (.com, .es, .barcelona, .cat)", "Brand Manager"),
      ("Correo corporativo: hola@, reservas@, prensa@", "Brand Manager"),
      ("Instagram de empresa, sin publicar hasta el teasing", "CM"),
      ("El mismo handle en TikTok, Facebook, YouTube, Threads, Pinterest y Spotify", "CM"),
      ("Meta Business: portfolio, cuenta publicitaria y píxel", "Brand Manager"),
      ("Google Business Profile con fecha de apertura (desde diciembre)", "Brand Manager"),
      ("Plataforma de reservas (CoverManager, TheFork…)", "KONG"),
      ("Registro de marca en OEPM o EUIPO, clase 43", "KONG")]),
    ("2", "Estrategia e identidad", "24 de noviembre – 19 de diciembre",
     "Decidir cómo habla KONG antes de existir. Los pilares ya están en el nombre: Kaizen, Omakase, Noren y Gohan.",
     [("Auditoría de referentes y de la competencia en El Born", "Brand Manager"),
      ("Estrategia: público, objetivos y KPIs de apertura", "Jandro + Brand Manager"),
      ("Tono de voz y pilares de contenido", "Richi"),
      ("Sistema gráfico de redes y web según el mood elegido", "Richi"),
      ("Piezas básicas: avatar, portadas y highlights", "Richi"),
      ("Concepto creativo del lanzamiento", "Richi"),
      ("Plan SEO local y GEO", "Brand Manager"),
      ("Validación de la estrategia con KONG, antes del 19/12", "Jandro")]),
    ("3", "Web", "Diciembre – febrero",
     "En dos tiempos: en diciembre, una landing que capta lista de espera. En febrero, la web completa con reservas.",
     [("Landing con cuenta atrás y lista de espera, antes del 15/12", "Maen"),
      ("Email marketing conectado a la lista de espera", "Brand Manager"),
      ("Arquitectura: Record Bar, Sala y Omakase, Carta, Equipo, Eventos, Grupos y Prensa", "Brand Manager"),
      ("Diseño de la web", "Richi · enero"),
      ("Desarrollo en ES, EN y CA, con reservas integradas", "Maen · ene–feb"),
      ("SEO técnico y ficha de Google enlazada", "Brand Manager"),
      ("Fotos y vídeos reales del local (fase 5)", "Mati + Víctor"),
      ("Web completa publicada, antes del 15/02", "Maen")]),
    ("4", "Contenido de obra", "Diciembre – febrero",
     "La obra es la historia, y solo se puede grabar ahora. Es el contenido que después vende la apertura.",
     [("Plan de rodaje: una visita cada 2 o 3 semanas", "Mati"),
      ("El local en bruto, el «antes» (diciembre)", "Mati + Víctor"),
      ("Hitos: barra, noren, cabina de vinilo y sala", "Mati + Víctor"),
      ("Entrevistas a Franco Dorosario y Jere", "Mati + Richi"),
      ("Pruebas de cocina y coctelería", "Mati + Víctor"),
      ("Serie «Construyendo KONG» para el teasing", "Go"),
      ("Banco de contenido ordenado por pilar", "Go")]),
    ("5", "Producción pre-apertura", "Febrero",
     "El rodaje grande, con el local terminado y la carta cerrada. De aquí salen la web, el teasing y los primeros meses.",
     [("Briefing y guion del rodaje", "Richi + Brand Manager"),
      ("El espacio: Record Bar, noren, sala y barra de sushi, de día y de noche", "Mati + Víctor"),
      ("Producto: platos, Omakase, KONG table y cócteles", "Mati + Víctor"),
      ("Retratos del equipo y de los DJs", "Víctor"),
      ("Edición: vídeo de marca, reels de lanzamiento y fotos", "Go"),
      ("Dossier de prensa", "Brand Manager"),
      ("Calendario del teasing y los 30 primeros días", "CM")]),
    ("6", "Teasing, PR y lista de espera", "1 de febrero → día A",
     "Llegar a la apertura con lista de espera, prensa avisada y conserjes de hotel que ya conozcan KONG.",
     [("Instagram en abierto con un grid de lanzamiento", "CM · 1/02"),
      ("Cuenta atrás y presentación de Franco y Jere", "CM"),
      ("Campaña en Meta para captar lista de espera", "Brand Manager"),
      ("Dossier a medios: Time Out, Barcelona Secreta, Metrópoli y prensa gastronómica", "Brand Manager"),
      ("Conserjes de hoteles de 5 estrellas y agencias", "Jandro"),
      ("Creadores de gastronomía y nightlife para la apertura", "CM"),
      ("Emails a la lista de espera: fecha y reserva anticipada", "Brand Manager"),
      ("Friends & family y soft opening", "Jandro + Mati")]),
    ("7", "Apertura", "Semana del día A",
     "Cubrirlo todo en directo y que cada visita deje contenido y una reseña.",
     [("Evento de apertura con prensa, creadores y DJ en vinilo", "Mati + Víctor + CM"),
      ("Stories en directo y aftermovie en 48 horas", "Go"),
      ("Google Business activo: fotos, horario, carta y reservas", "Brand Manager"),
      ("Campaña de apertura dirigida a reservas", "Brand Manager"),
      ("Equipo de sala preparado para pedir reseñas", "Jandro + KONG")]),
    ("8", "Primeros 90 días", "Marzo – mayo",
     "Pasar del lanzamiento a la operativa mensual y medir qué llena el local.",
     [("Calendario mensual y un rodaje fijo al mes", "CM + Mati"),
      ("Agenda de DJs y eventos del Record Bar como contenido", "CM"),
      ("Informe mensual: alcance, reservas, reseñas y Google", "Brand Manager"),
      ("Revisión con KONG a los 30 y a los 90 días", "Jandro"),
      ("Camino a 50 Best: prensa, críticos y guías", "Jandro")]),
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
    "Fecha exacta de apertura y de soft opening",
    "Qué mood eligen, o qué mezcla",
    "Interlocutor y firmante por parte de KONG",
    "Quién es titular y paga dominios, Meta Ads y Google",
    "Si hay manual de marca más allá del logo",
    "Si la web es nuestra o de un proveedor del grupo",
    "Cómo contar la relación con Ikibana y la reforma de Ikibana Born",
    "Presupuesto de paid media para teasing y apertura",
    "Calendario de obra, para planificar las visitas de rodaje",
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
    + titulo("Kick-off con<br>el encargado", top=260, width=960, size=80)
    + p("Propuesta: la semana del 17 de noviembre. Ahí cerramos alcance, fecha y accesos, y arrancamos con dominios y perfiles.", 128, 500, 900, size=30, d=2)
    + '<div class="abs a" style="left:128px;top:720px;font-size:28px;line-height:1.5;--d:3">'
    '<p style="font-weight:800">Jandro Martín · Maen Studios</p>'
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
