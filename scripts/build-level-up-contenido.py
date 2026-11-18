"""Genera app/pitch/level-up-contenido/diapos.ts: auditoría de contenido y
redirección estratégica para Lucía (@lucia_entrenadorapersonal), sesión del
18 nov 2026.

Fuentes:
  - ~80 reels públicos de su perfil (dic 2024 – nov 2026), reproducciones
    públicas revisadas el 18 nov 2026.
  - Excel de Instagram may–oct 2026 (27 publicaciones, métricas completas).
  - Correo de Lucía del 9 nov (capacidad, referencias, herramientas).
  - Perfiles de @pau_inspirafit, @holacuore y @deliciousmartha.

Reutiliza los helpers de scripts/build-level-up-workout.py.

    python3 scripts/build-level-up-contenido.py
"""

import json
from pathlib import Path

_src = Path("scripts/build-level-up-workout.py").read_text(encoding="utf-8")
exec(_src.split("# ── 1. Portada")[0])

MARCA = "Maen Studios × Level Up Workout"
VERDE, ROJO, AZUL, LILA = "#7FD49B", "#E86A5C", "#8FB8FF", "#C9A7FF"

_lista = lista


def lista(*a, **k):
    k.setdefault("marca", "•")
    return _lista(*a, **k)


slides = []
n = 0


def add(id_, tit, html):
    slides.append({"id": id_, "titulo": tit, "html": html})


def label(t, x, y, w=700, color=None, d=1):
    c = f"color:{color};" if color else ""
    return p(t, x, y, w, size=20, d=d, cls="" if color else "rosa",
             extra=c + "font-weight:700;letter-spacing:.14em;text-transform:uppercase;")


WEB = "https://levelup.luciaentrenadorapersonal.com/wp-content/uploads/"
FOTOS = {  # fotos de su propia web (enlazadas desde allí)
    "mat": "2025/01/IMG_6844-scaled.jpg",            # tumbada en la esterilla, top amarillo
    "zancada": "2025/01/Portada.jpg",                 # B/N, zancada (portada web)
    "puente": "2025/03/Sobre-Lucia-scaled.jpg",       # B/N, puente de glúteo
    "clienta": "2025/03/mi-primer-contacto.-1-scaled.jpg",  # entrenando con una clienta en casa
    "libros": "2025/03/mi-primer-contacto.-2-e1742473349662.jpg",  # libros y apuntes
    "pared": "2025/03/despues-de-muchos-anos-como.jpg",   # sentadilla en pared, salón
    "salto": "2025/03/me-considero-una-persona-scaled.jpg",  # saltando de alegría en el salón
    "risa": "2025/03/porque-levelU-es-xra-ti-copia-scaled.jpg",  # riendo en la esterilla
    "minibanda": "2025/11/mini-band-final-scaled.jpg",
    "banda": "2025/11/banda-larga-fin-scaled.jpg",
    "mancuernas": "2025/11/MANUERNAS.jpg",
}


def foto(x, y, w, h, k, d=0, pos="center", radius=24, extra=""):
    return (
        f'<div class="abs pop" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:{radius}px;'
        f'background:#222 url({WEB}{FOTOS[k]}) {pos}/cover no-repeat;{extra}--d:{d}"></div>'
    )


REELS_IG = {  # código de cada reel en Instagram (instagram.com/reel/<código>/)
    "les-angles": "DVeXgSPjH6w", "agua-gluteos": "DbxqDbNMJBp", "pensamientos-intrusivos": "DdJ8HBLsEgA",
    "entrena-10-min": "DcnngSosAx3", "agua-brazos": "DcBK4vcspzE", "no-hay-viento": "DfPkVfksG2O",
    "gasto-calorico": "Dfpj4rzsQKF", "mas-pensamientos": "DfUZkYkslJI", "las-15": "DZ2mmi3sWyj",
    "superate-cada-nivel": "DYOi25LMpNs", "corro-cada-semana": "DXyumgMMLLT", "6-ejercicios": "DXmvMMRjAko",
    "si-no-eres-constante": "DXXRmOlDMRm", "quien-algo-quiere": "DQmV1arjNoS", "motivacion-disciplina": "DOto2L_jGfN",
    "beauty-tip": "DMGSPx9ow1H", "grasa-abdominal": "DKxWV73I6t9", "gluteos-siguiente-nivel": "DJdx0sHo1hn",
    "adios-flacidez": "DFtCsc-IdEc", "kite-normas": "DaiFFIBMpnC",
}


def reel(x, y, w, nombre, vistas, d=0):
    """Portada real de un reel de Lucía con sus reproducciones y un botón de play
    que abre el vídeo en Instagram (su cuenta no permite insertarlos)."""
    h = round(w * 596 / 335)
    if Path(f"public/pitch/level-up/reels/{nombre}.mp4").exists():
        # Vídeo alojado en maenstudios.com: se reproduce en la propia diapositiva.
        return (
            f'<div class="abs pop" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:16px;overflow:hidden;'
            f'background:#000;box-shadow:0 10px 30px rgba(0,0,0,.35);--d:{d}">'
            f'<video data-manual src="/pitch/level-up/reels/{nombre}.mp4" poster="/pitch/level-up/reels/{nombre}.jpg" '
            f'controls playsinline preload="none" style="width:100%;height:100%;object-fit:cover;display:block"></video>'
            f'<span style="position:absolute;left:10px;top:10px;padding:3px 10px;border-radius:999px;background:rgba(0,0,0,.65);'
            f'font-size:{16 if w < 180 else 18}px;font-weight:800;color:#fff;pointer-events:none">{vistas}</span></div>'
        )
    b = max(36, round(w * 0.2))  # diámetro del botón
    url = f"https://www.instagram.com/reel/{REELS_IG[nombre]}/"
    return (
        f'<a class="abs pop" href="{url}" target="_blank" rel="noopener" title="Ver el vídeo en Instagram" '
        f'style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:16px;overflow:hidden;display:block;'
        f'background:#222 url(/pitch/level-up/reels/{nombre}.jpg) center/cover no-repeat;box-shadow:0 10px 30px rgba(0,0,0,.35);--d:{d}">'
        f'<span style="position:absolute;left:50%;top:50%;width:{b}px;height:{b}px;margin:-{b // 2}px 0 0 -{b // 2}px;border-radius:50%;'
        f'background:rgba(255,255,255,.8);box-shadow:0 6px 20px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center">'
        f'<span style="width:0;height:0;margin-left:{round(b * .08)}px;border-style:solid;'
        f'border-width:{round(b * .2)}px 0 {round(b * .2)}px {round(b * .32)}px;border-color:transparent transparent transparent #151515"></span></span>'
        f'<span style="position:absolute;left:10px;bottom:10px;padding:3px 10px;border-radius:999px;background:rgba(0,0,0,.65);'
        f'font-size:{16 if w < 180 else 18}px;font-weight:800;color:#fff">{vistas}</span></a>'
    )


def portada_reel(x, y, texto, vistas, color, d=0, w=230, sub=""):
    """Mini portada vertical 9:16 con el texto de la portada y las reproducciones."""
    h = round(w * 16 / 9)
    s = f'<span style="display:block;font-size:13px;font-weight:600;margin-top:6px;opacity:.85">{sub}</span>' if sub else ""
    return (
        f'<div class="abs pop" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:18px;'
        f'background:linear-gradient(180deg,{color} 0%,#1b1d1c 100%);overflow:hidden;--d:{d}">'
        f'<p style="position:absolute;left:16px;right:16px;top:38%;text-align:center;font-family:var(--font-display);'
        f'font-size:{17 if len(texto) > 26 else 20}px;line-height:1.1;text-transform:uppercase;color:#fff;'
        f'text-shadow:0 2px 0 #1C2238">{texto}{s}</p>'
        f'<p style="position:absolute;left:16px;bottom:14px;font-size:18px;font-weight:800;color:#fff">▶ {vistas}</p></div>'
    )


# ── 1. Portada ───────────────────────────────────────────────────────────
n += 1
add("portada", "Auditoría de contenido", sec(
    foto(1060, 0, 860, 1080, "risa", d=0, pos="center 30%", radius=0)
    + f'<div class="abs" style="left:1060px;top:0;width:260px;height:1080px;background:linear-gradient(90deg,{INK},rgba(21,21,21,0))"></div>'
    + f'<div class="abs gy" style="left:1040px;top:0;width:20px;height:1080px;background:{ACENTO};--d:1"></div>'
    + eyebrow("Auditoría de contenido · Instagram", top=150)
    + '<h1 class="abs a disp" style="left:128px;top:290px;font-size:104px;line-height:1;--d:1">Más alcance.</h1>'
    '<h1 class="abs a disp outline" style="left:128px;top:404px;font-size:104px;line-height:1;--d:2">Más clientas.</h1>'
    + p("Análisis de tu contenido en Instagram y propuesta de cambios para llevar más gente a Level Up.",
        128, 580, 860, size=32, d=3, cls="", extra="font-weight:800;line-height:1.3;")
    + p("Maen Studios · 18 de noviembre de 2026", 128, 800, 860, size=22, d=4)
    + foot(n),
))

# ── 2. La pregunta de hoy ────────────────────────────────────────────────
n += 1
add("pregunta", "La pregunta de hoy", sec(
    eyebrow("Objetivo")
    + titulo("¿Cómo llegas a más gente<br>y conviertes más visitas en clientas?", size=60)
    + card(128, 390, 812, 500)
    + label("Alcance", 168, 430)
    + p("Que te vea más gente de tu público: mujeres que quieren empezar a entrenar y no saben cómo.", 168, 480, 730, size=32, d=2, cls="", extra="font-weight:800;line-height:1.25;")
    + p("Situación actual: has tenido reels de 748.000, 104.000 y 70.000 reproducciones.", 168, 700, 730, size=25, d=3)
    + card(980, 390, 812, 500, d=1, cls="pm-card-r")
    + label("Conversión", 1020, 430, color=NAVY, d=2)
    + p("Que quien te ve dé el siguiente paso: te siga, entre en la web y empiece la prueba gratis.", 1020, 480, 730, size=32, d=3, cls="", extra=f"color:{INK};font-weight:800;line-height:1.25;")
    + p("Situación actual: 5 pruebas gratis reales en 4 meses.", 1020, 700, 730, size=25, d=4, cls="", extra="color:#3A2F2F;")
    + foot(n),
))

# ── 3. Qué hemos analizado ───────────────────────────────────────────────
n += 1
fuentes = [
    ("≈ 80", "reels", "Todo lo publicado desde diciembre de 2024 hasta hoy: tema, portada y reproducciones."),
    ("27", "publicaciones a fondo", "Mayo–octubre con todas las métricas: guardados, compartidos y seguidoras."),
    ("2", "reels de noviembre", "Lo último que has publicado."),
    ("3", "cuentas de referencia", "@pau_inspirafit, @holacuore y @deliciousmartha."),
]
fh = ""
for i, (num, tit, desc) in enumerate(fuentes):
    x = 128 + i * 424
    fh += (
        card(x, 330, 396, 520, d=i)
        + f'<p class="abs a disp rosa" style="left:{x + 36}px;top:374px;font-size:72px;--d:{i + 1}">{num}</p>'
        + p(tit, x + 36, 480, 330, size=30, d=i + 1, cls="", extra="font-weight:800;line-height:1.2;")
        + p(desc, x + 36, 590, 330, size=23, d=i + 2)
    )
add("fuentes", "Qué hemos analizado", sec(
    eyebrow("Datos")
    + titulo("Qué hemos analizado", size=56)
    + fh
    + p("Reproducciones: datos públicos de Instagram. Guardados, compartidos y seguidoras: tu informe de mayo a octubre.",
        128, 890, 1664, size=21, d=6, cls="muted")
    + foot(n),
))

# ── PARTE 1 ──────────────────────────────────────────────────────────────
n += 1
add("parte1", "Parte 1 · Lo que has hecho", sec(
    eyebrow("Parte 1", k=True)
    + foto(1100, 0, 820, 1080, "zancada", d=1, pos="70% center", radius=0)
    + '<h2 class="abs a disp" style="left:128px;top:330px;font-size:120px;line-height:1;color:#151515;--d:1">Análisis</h2>'
    + p("Tus reels de diciembre de 2024 a noviembre de 2026.", 128, 640, 900, size=36, d=2, cls="", extra="color:#151515;font-weight:800;")
    + foot(n, k=True),
    bg=ACENTO, color=INK,
))

# ── 5. Tus tres picos ────────────────────────────────────────────────────
n += 1
picos = [
    ("les-angles", "748K", "#3E6FA8", "Les Angles · marzo 2026", "Humor de situación en la nieve. 10.700 me gusta. Comentarios de esquiadores, chicos, gente de Andorra… <b>casi nadie de tu público.</b>"),
    ("agua-gluteos", "104K", "#2E8FA0", "Piscina · agosto 2026", "Rutina útil en un escenario inesperado. 1.690 guardados y 511 seguidoras: <b>el mejor captador de clientas potenciales del año.</b>"),
    ("pensamientos-intrusivos", "70,2K", "#2F8A6A", "Kite · 2026", "Humor con el kite de fondo. Se comparte muchísimo, pero atrae a gente del kite, <b>no a quien quiere empezar a entrenar.</b>"),
]
ph = ""
for i, (t, v, c, cuando, txt) in enumerate(picos):
    x = 128 + i * 580
    ph += (
        reel(x, 290, 250, t, v, d=i)
        + p(cuando, x + 275, 300, 290, size=20, d=i + 1, cls="rosa", extra="font-weight:700;")
        + f'<p class="abs a disp" style="left:{x + 275}px;top:340px;font-size:56px;--d:{i + 1}">{v}</p>'
        + p(txt, x + 275, 430, 285, size=21, d=i + 2)
    )
add("picos", "Tus tres picos", sec(
    eyebrow("Análisis")
    + titulo("Tus vídeos con más reproducciones", size=56)
    + ph
    + p("Los tres se vieron mucho, pero solo el de la piscina llegó a tu público y trajo seguidoras que pueden acabar en Level Up.",
        128, 880, 1664, size=28, d=6, cls="soft", extra="line-height:1.3;")
    + foot(n),
))

# ── 6. Mapa alcance × conversión ─────────────────────────────────────────
n += 1
ox, oy, W, H = 300, 300, 1000, 600  # caja del gráfico
mapa = (
    f'<div class="abs" style="left:{ox}px;top:{oy}px;width:{W}px;height:{H}px;border-left:2px solid #4A4D4C;border-bottom:2px solid #4A4D4C"></div>'
    f'<div class="abs" style="left:{ox + W // 2}px;top:{oy}px;width:0;height:{H}px;border-left:2px dashed #2E3130"></div>'
    f'<div class="abs" style="left:{ox}px;top:{oy + H // 2}px;width:{W}px;height:0;border-top:2px dashed #2E3130"></div>'
    + p("Más alcance →", ox + W - 260, oy + H + 16, 260, size=20, d=1, cls="muted", extra="text-align:right;")
    + p("Más conversión →", ox - 250, oy + 10, 200, size=20, d=1, cls="muted", extra="text-align:right;")
)
burbujas = [  # nombre, cx, cy (0-1, y arriba=1), tamaño, color, detalle
    ("Humor", .88, .18, 150, "#5A5D5C", "31K de mediana · 1,9 seguidoras por cada mil"),
    ("Entreno útil", .52, .62, 170, ACENTO, "15,7 guardados y 5,4 seguidoras por cada mil"),
    ("Kitesurf", .38, .40, 120, "#5A5D5C", "5K de mediana · casi todo de un solo reel"),
    ("Producto", .14, .86, 140, AZUL, "7,5 seguidoras por cada mil, pero casi no se ve"),
]
for i, (nom, cx, cy, s, c, det) in enumerate(burbujas):
    x = ox + round(cx * W) - s // 2
    y = oy + round((1 - cy) * H) - s // 2
    mapa += (
        f'<div class="abs pop" style="left:{x}px;top:{y}px;width:{s}px;height:{s}px;border-radius:50%;background:{c};opacity:.9;--d:{i}"></div>'
        + f'<p class="abs a" style="left:{x - 40}px;top:{y + s // 2 - 16}px;width:{s + 80}px;text-align:center;font-size:24px;font-weight:800;color:{INK};--d:{i + 1}">{nom}</p>'
    )
mapa += (
    p("<b style='color:#F4F4F4'>Objetivo</b><br>Contenido con mucho alcance y que también convierta.", ox + W - 360, oy + 20, 340, size=21, d=5, cls="muted")
)
add("mapa", "Alcance y conversión", sec(
    eyebrow("Análisis")
    + titulo("Alcance y conversión por tipo de contenido", size=52)
    + mapa
    + lista([
        "<b>Humor:</b> mucho alcance, pero de un público que no es el tuyo.",
        "<b>Entreno útil:</b> buen equilibrio entre alcance y seguidoras.",
        "<b>Producto:</b> convierte bien, pero llega a muy poca gente.",
    ], 1360, 380, 432, size=23, d=6, gap=22)
    + foot(n),
))

# ── 7. Lo que funciona: tres fórmulas ────────────────────────────────────
n += 1
form = [
    ("Escenario inesperado + rutina útil", "Un sitio que llama la atención y una rutina que se puede guardar.",
     [("agua-gluteos", "104K"), ("entrena-10-min", "17,4K"), ("agua-brazos", "12K")]),
    ("Promesa concreta en la portada", "Un resultado concreto que tu público quiere.",
     [("adios-flacidez", "33,3K"), ("gluteos-siguiente-nivel", "19,8K"), ("si-no-eres-constante", "19,7K")]),
    ("Situación con la que se identifican", "Humor o situaciones del día a día.",
     [("corro-cada-semana", "48,5K"), ("las-15", "14,5K"), ("no-hay-viento", "12,2K")]),
]
fh = ""
for i, (t, s_, ej) in enumerate(form):
    x = 128 + i * 566
    fh += (
        card(x, 290, 530, 650, d=i)
        + f'<p class="abs a disp rosa" style="left:{x + 36}px;top:326px;font-size:44px;--d:{i + 1}">0{i + 1}</p>'
        + p(t, x + 36, 396, 460, size=29, d=i + 1, cls="", extra="font-weight:800;line-height:1.2;")
        + p(s_, x + 36, 500, 460, size=21, d=i + 2)
    )
    for j, (tt, vv) in enumerate(ej):
        fh += reel(x + 36 + j * 156, 600, 142, tt, vv, d=i + j)
add("formulas", "Lo que funciona", sec(
    eyebrow("Análisis")
    + titulo("Lo que mejor te funciona", size=56)
    + fh + foot(n),
))

# ── 8. Lo que no funciona ────────────────────────────────────────────────
n += 1
no = [
    ("Consejos abstractos", "motivacion-disciplina", "2.360", "También «Agosto: trabajes o descanses» (2.633) y «¿Milagros antes de vacaciones?» (3.505).", "No hay un resultado concreto ni un ejercicio que guardar."),
    ("Temas fuera de tu terreno", "beauty-tip", "5.171", "También «Mi suplemento» (3.342) y el del café (4.747).", "No tienen relación con el entrenamiento."),
    ("Kite técnico", "quien-algo-quiere", "2.242", "También «Kitesurf: algunas normas» (6.291).", "Solo interesa a quien hace kite."),
    ("Segundas partes", "mas-pensamientos", "4.136", "Noviembre, frente a los 70,2K de «Mis pensamientos intrusivos».", "Repetir la idea sin un enfoque nuevo no funciona."),
]
nh = ""
for i, (t, img, v, ej, lec) in enumerate(no):
    x = 128 + i * 424
    nh += (
        reel(x, 270, 230, img, v, d=i)
        + p(t, x + 246, 280, 150, size=24, d=i + 1, cls="", extra="font-weight:800;line-height:1.2;")
        + p(lec, x + 246, 380, 150, size=19, d=i + 2)
        + p(ej, x, 700, 380, size=19, d=i + 3, cls="muted")
    )
add("nofunciona", "Lo que no funciona", sec(
    eyebrow("Análisis")
    + titulo("Lo que no está funcionando", size=56)
    + nh + foot(n),
))

# ── 9. Portadas ──────────────────────────────────────────────────────────
n += 1
add("portadas", "Tus portadas", sec(
    eyebrow("Análisis")
    + titulo("Portadas", size=56)
    + reel(128, 290, 210, "adios-flacidez", "33,3K", d=0)
    + reel(352, 290, 210, "las-15", "14,5K", d=1)
    + reel(576, 290, 210, "superate-cada-nivel", "41,9K", d=2)
    + label("Lo bueno", 860, 300)
    + lista([
        "Titular grande, legible y con un estilo constante.",
        "Las portadas con promesa concreta son las que más se ven.",
    ], 860, 350, 932, size=25, d=3, gap=16)
    + label("A mejorar", 860, 560, color=ROJO, d=3)
    + lista([
        "Un vídeo de humor, una rutina y un post de Level Up se ven igual.",
        "Level Up casi no aparece en el perfil.",
    ], 860, 610, 932, size=25, d=4, gap=16)
    + foot(n),
))

# ── 9b. Banco de fotos ───────────────────────────────────────────────────
n += 1
add("bancofotos", "Tu banco de fotos", sec(
    eyebrow("Recursos")
    + titulo("Fotos de tu web que puedes aprovechar", size=56)
    + foto(128, 330, 400, 590, "risa", d=0)
    + foto(548, 330, 300, 285, "zancada", d=1, pos="65% center")
    + foto(548, 635, 300, 285, "puente", d=2)
    + foto(868, 330, 300, 590, "pared", d=3)
    + foto(1188, 330, 300, 285, "minibanda", d=4)
    + foto(1188, 635, 300, 285, "banda", d=5)
    + p("Se pueden usar en:", 1530, 330, 262, size=22, d=4, cls="", extra="font-weight:800;")
    + lista([
        "Portadas de la serie Dentro de Level Up.",
        "Destacados con una imagen coherente.",
        "Historias con enlace a la prueba.",
        "Carruseles de «Mitos 35+».",
    ], 1530, 380, 262, size=19, d=5, gap=10)
    + p("Y además:", 1530, 640, 262, size=22, d=6, cls="", extra="font-weight:800;")
    + lista([
        "El vídeo de kite y las fotos de la boda que no has publicado.",
        "TikTok (@lucia_pt): subir los mismos reels, sin trabajo extra.",
    ], 1530, 690, 262, size=19, d=7, gap=10)
    + foot(n),
))

# ── 10. Copies y CTAs ────────────────────────────────────────────────────
n += 1
add("copies", "Copies y llamadas a la acción", sec(
    eyebrow("Análisis")
    + titulo("Textos y llamadas a la acción", size=56)
    + card(128, 300, 812, 620)
    + reel(168, 336, 190, "gasto-calorico", "2.933", d=1)
    + label("Noviembre", 390, 340, 500)
    + p("«…Y esto también forma parte de la filosofía de mi metodología Level Up Workout…»", 390, 390, 510, size=25, d=2, cls="", extra="font-weight:800;line-height:1.3;font-style:italic;")
    + lista([
        "Bien: el contenido ya menciona Level Up.",
        "68 me gusta. El enlace está al final de un texto largo.",
        "La portada habla de «gasto calórico», que no es lo que diferencia a tu método.",
    ], 168, 700, 740, size=21, d=3, gap=10)
    + label("Lo que cambiamos", 1020, 300)
    + lista([
        "<b>La llamada a la acción va en el vídeo</b>, no solo en el texto: dicha por ti o en pantalla.",
        "<b>Palabra clave en comentarios:</b> «comenta NIVEL0 y te mando la prueba gratis». Con KITE tuviste 86 comentarios.",
        "<b>Copy corto:</b> 3 líneas. Gancho, valor y siguiente paso.",
        "<b>Hashtags de lo online</b>, no de entrenadora en Barcelona.",
    ], 1020, 350, 772, size=24, d=3, gap=20)
    + foot(n),
))

# ── 11. Audiencia ────────────────────────────────────────────────────────
n += 1
add("audiencia", "Para quién publicas", sec(
    eyebrow("Público")
    + titulo("¿Para quién publicas?", size=56)
    + card(128, 300, 560, 600)
    + label("Quien te encuentra hoy", 168, 340, 480)
    + lista([
        "Gente del kite y del esquí.",
        "Quien busca humor rápido y se va.",
        "Deportistas que ya entrenan.",
        "Gente de Barcelona que busca entrenadora presencial.",
    ], 168, 396, 480, size=26, d=2, gap=18)
    + foto(728, 300, 440, 600, "pared", d=1, pos="center")
    + card(1208, 300, 584, 600, d=1, cls="pm-card-r")
    + label("Quien necesita Level Up", 1248, 340, 500, color=NAVY, d=2)
    + p("Mujer de 35 a 55 años que lleva tiempo sin entrenar o nunca lo ha hecho. Poco tiempo, quizá con hijos. Le da vergüenza el gimnasio y no sabe por dónde empezar.",
        1248, 396, 504, size=27, d=3, cls="", extra=f"color:{INK};font-weight:800;line-height:1.3;")
    + p("No busca rendimiento. Busca empezar, no hacerse daño y verse capaz.", 1248, 760, 504, size=23, d=4, cls="", extra="color:#3A2F2F;")
    + foot(n),
))

# ── PARTE 2 ──────────────────────────────────────────────────────────────
n += 1
add("parte2", "Parte 2 · La redirección", sec(
    eyebrow("Parte 2", k=True)
    + foto(1100, 0, 820, 1080, "salto", d=1, pos="center", radius=0)
    + '<h2 class="abs a disp" style="left:128px;top:330px;font-size:110px;line-height:1;color:#151515;--d:1">Propuesta</h2>'
    + p("Cómo enfocar el contenido a partir de ahora.", 128, 640, 900, size=36, d=2, cls="", extra="color:#151515;font-weight:800;")
    + foot(n, k=True),
    bg=ACENTO, color=INK,
))

# ── 12b. Lo que nos contaste ─────────────────────────────────────────────
n += 1
dijo = [
    ("«Puedo dedicar aproximadamente 2-3 horas a la semana a grabar»", "Grabación por lotes los lunes y viernes por la mañana, con formatos que se repiten."),
    ("Cardedeu: jardín y campo, «el problema es que no sé qué grabar»", "Serie «Entrena donde estés»: rutinas cortas al aire libre."),
    ("«No tengo un calendario de ideas… me van surgiendo sobre la marcha»", "Formatos fijos y una lista de ideas para cada sesión de grabación."),
    ("«Muchas veces funcionan mejor los vídeos más espontáneos y de humor»", "Mantener el humor, con situaciones de tu clienta y un final que lleve a Level Up."),
    ("Promociones en Meta: visitas a la web, pero ni compras ni suscripciones", "Antes de volver a invertir: palabra clave, landing con testimonios y emails."),
    ("Lo que no te convence: lo «muy guionizado»", "Contenido natural, grabado por ti y con tu forma de hablar."),
]
dh = (p("Lo que nos contaste", 128, 280, 760, size=20, d=1, cls="rosa", extra="font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
      + p("Cómo lo planteamos", 1000, 280, 760, size=20, d=1, cls="rosa", extra="font-weight:700;letter-spacing:.14em;text-transform:uppercase;"))
for i, (a_, b_) in enumerate(dijo):
    y = 330 + i * 100
    dh += (
        p(a_, 128, y, 820, size=24, d=i + 2, cls="", extra="font-weight:700;line-height:1.3;")
        + p(b_, 1000, y, 792, size=23, d=i + 3)
        + f'<div class="abs line-h" style="left:128px;top:{y + 80}px;width:1664px;background:#2E3130"></div>'
    )
add("tucorreo", "Lo que nos contaste", sec(
    eyebrow("Tu correo del 9 de noviembre")
    + titulo("Partimos de lo que nos contaste", size=56)
    + dh + foot(n),
))

# ── 13. Posicionamiento ──────────────────────────────────────────────────
n += 1
add("posicionamiento", "Tu posicionamiento", sec(
    eyebrow("Propuesta")
    + titulo("Posicionamiento", size=56)
    + foto(1300, 300, 492, 620, "clienta", d=2, pos="35% center")
    + card(128, 330, 1120, 300, d=1, cls="pm-card-r")
    + p("«Te enseño a empezar a entrenar desde cero, en casa y en 20 minutos. Y a no dejarlo.»",
        176, 380, 1030, size=44, d=2, cls="", extra=f"color:{INK};font-weight:800;line-height:1.2;")
    + label("Por qué", 128, 680)
    + lista([
        "Es lo que vende Level Up, así que todo lo que publiques apunta al producto.",
        "Tu historia lo respalda: llevas años entrenando a mujeres que empezaban de cero, y en tus redes ya se ve tu día a día como madre y como deportista.",
        "Lo personal (kite, maternidad, humor) encaja como ejemplo de lo que enseñas.",
    ], 128, 730, 1120, size=24, d=3, gap=12)
    + foot(n),
))

# ── 14. Cuatro pilares con trabajo ───────────────────────────────────────
n += 1
pil = [
    ("Atraer", "30 %", "Humor y escenarios inesperados, siempre con situaciones de TU público.", "Que te descubran las que todavía no te siguen.", "#3E6FA8", "risa"),
    ("Enseñar", "35 %", "Rutinas y ejercicios guardables para empezar desde cero.", "Que te guarden, te sigan y confíen en ti.", ACENTO, "mat"),
    ("Conectar", "15 %", "Kite, maternidad, tu vida. Con un puente hacia el «yo también puedo».", "Que te quieran y se queden.", "#2F8A6A", "salto"),
    ("Convertir", "20 %", "Level Up por dentro, alumnas, prueba gratis, dudas frecuentes.", "Que se apunten.", AZUL, "minibanda"),
]
ph = ""
for i, (t, pct, que, para, c, ft) in enumerate(pil):
    x = 128 + i * 424
    ph += (
        card(x, 290, 396, 650, d=i)
        + foto(x, 290, 396, 200, ft, d=i, pos="center 35%", radius=24, extra="border-radius:24px 24px 0 0;")
        + f'<div class="abs gx" style="left:{x}px;top:490px;width:396px;height:8px;background:{c};--d:{i}"></div>'
        + f'<p class="abs a disp" style="left:{x + 32}px;top:520px;font-size:48px;color:{c};--d:{i + 1}">{pct}</p>'
        + p(t, x + 32, 590, 340, size=32, d=i + 1, cls="", extra="font-weight:800;")
        + p(que, x + 32, 648, 340, size=21, d=i + 2)
        + label("Para qué", x + 32, 790, 340, color=c, d=i + 2)
        + p(para, x + 32, 826, 340, size=21, d=i + 3, cls="", extra="font-weight:700;")
    )
add("pilares", "Cuatro pilares", sec(
    eyebrow("Propuesta")
    + titulo("Reparto de contenido", size=56)
    + ph + foot(n),
))

# ── 15. Seis series fijas ────────────────────────────────────────────────
n += 1
series = [
    ("Nivel 0", "Enseñar", ACENTO, "Un ejercicio o una rutina para quien nunca ha entrenado. Con silla y esterilla, como el Pre-Entreno.", "6 ejercicios para empezar desde 0 (11,3K)"),
    ("Entrena donde estés", "Atraer", "#3E6FA8", "Rutina de 10 minutos en un sitio inesperado: el jardín de Cardedeu, la piscina, un hotel, la nieve.", "Entrena en el agua (104K y 12K)"),
    ("¿Te ha pasado?", "Atraer", "#3E6FA8", "Humor de situaciones de mujeres que intentan entrenar: la pereza de las 15:00, el niño encima, la lavadora.", "Las 15:00 y ya no sé qué hacer (14,5K)"),
    ("No hay viento", "Conectar", "#2F8A6A", "Días sin kite: entreno en casa para seguir haciendo lo que te gusta.", "No hay viento… (12,2K)"),
    ("Mitos 35+", "Enseñar", ACENTO, "Grasa abdominal, flacidez, huesos, cambios hormonales. Tu formación como argumento.", "Grasa abdominal (18,7K)"),
    ("Dentro de Level Up", "Convertir", AZUL, "Pre-Entreno, cuándo entran bandas y pesas, recetas de la nutricionista, seguimiento con fotos y dudas comunes.", "Supérate con cada nivel (41,9K)"),
]
sh = ""
reels_series = [("6-ejercicios", "11,3K"), ("agua-brazos", "12K"), ("las-15", "14,5K"), ("no-hay-viento", "12,2K"), ("grasa-abdominal", "18,7K"), ("superate-cada-nivel", "41,9K")]
for i, (t, pil_, c, txt, prueba) in enumerate(series):
    col, fila = i % 3, i // 3
    x = 128 + col * 566
    y = 290 + fila * 330
    sh += (
        card(x, y, 530, 300, d=i)
        + reel(x + 8, y + 8, 160, reels_series[i][0], reels_series[i][1], d=i)
        + f'<div class="abs a" style="left:{x + 206}px;top:{y + 26}px;padding:4px 12px;border-radius:999px;background:{c};color:{INK};font-size:15px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;--d:{i}">{pil_}</div>'
        + p(t, x + 206, y + 66, 300, size=27, d=i + 1, cls="", extra="font-weight:800;line-height:1.1;")
        + p(txt, x + 206, y + 112, 300, size=18, d=i + 2, extra="line-height:1.3;")
        + p(f"Ya probado: {prueba}", x + 206, y + 252, 300, size=15, d=i + 2, cls="muted")
    )
add("series", "Seis series fijas", sec(
    eyebrow("Propuesta")
    + titulo("Formatos fijos", size=56)
    + sh + foot(n),
))

# ── 16. Del humor viral al humor que vende ───────────────────────────────
n += 1
add("humor", "El humor que vende", sec(
    eyebrow("Propuesta")
    + titulo("Humor: ejemplos", size=56)
    + card(128, 300, 812, 600)
    + reel(168, 340, 220, "les-angles", "748K", d=1)
    + label("Hasta ahora", 420, 340, 480, color=MUTED)
    + p("«En mi defensa diré que no recordaba que llevaba más forfaits en el bolsillo»", 420, 390, 480, size=26, d=2, cls="", extra="font-weight:800;line-height:1.25;font-style:italic;")
    + p("Es un chiste de esquí. No tiene relación con Level Up.", 420, 620, 480, size=23, d=3)
    + card(980, 300, 812, 600, d=1, cls="pm-card-r")
    + label("Propuesta", 1020, 340, color=NAVY, d=2)
    + lista([
        "«Yo a las 7:00 planeando entrenar vs. yo a las 19:00 con el niño en brazos»",
        "«Cuando llevas 10 años sin entrenar y te dicen “haz una sentadilla”»",
        "«Mi cuerpo el día 1 del Nivel 0 vs. mi cuerpo el día 1 del Nivel 3»",
    ], 1020, 390, 730, size=26, d=3, color=INK, gap=20, mcolor=INK)
    + p("El mismo tipo de humor, con situaciones de tu clienta y un final que lleve a Level Up.", 1020, 760, 730, size=22, d=4, cls="", extra="color:#3A2F2F;")
    + foot(n),
))

# ── 17. Anatomía de un reel ──────────────────────────────────────────────
n += 1
pasos = [
    ("0–1 s", "Inicio", "Un sitio, un gesto o una frase que llame la atención. Portada con un resultado concreto."),
    ("1–3 s", "Primera frase", "«Si llevas años sin entrenar, empieza por aquí.»"),
    ("3–25 s", "Contenido", "La rutina, el truco o la situación. Corto y claro."),
    ("Final", "Level Up", "«Esto es el Nivel 0 de Level Up.»"),
    ("Final", "Llamada a la acción", "«Comenta NIVEL0 y te mando 5 días gratis.»"),
]
ah = ""
for i, (t, nom, txt) in enumerate(pasos):
    x = 128 + i * 340
    ah += (
        f'<div class="abs gx" style="left:{x}px;top:330px;width:316px;height:12px;border-radius:6px;background:{ACENTO if i in (0, 4) else "#5A5D5C"};--d:{i}"></div>'
        + p(t, x, 370, 316, size=20, d=i + 1, cls="rosa", extra="font-weight:700;")
        + p(nom, x, 410, 316, size=30, d=i + 1, cls="", extra="font-weight:800;")
        + p(txt, x, 470, 300, size=22, d=i + 2)
    )
add("anatomia", "Anatomía de un reel", sec(
    eyebrow("Propuesta")
    + titulo("Estructura de un reel", size=56)
    + ah
    + card(128, 690, 1664, 230, d=5)
    + foto(128, 690, 300, 230, "pared", d=5, pos="center 30%", extra="border-radius:24px 0 0 24px;")
    + label("Ejemplo · serie Entrena donde estés", 470, 720, 1200)
    + p("Jardín de Cardedeu. Portada: «10 minutos, una silla y cero excusas». Rutina de 4 ejercicios del Pre-Entreno. Cierre: «Esto es el Nivel 0 de Level Up. Comenta NIVEL0 y empieza gratis».",
        470, 765, 1280, size=24, d=6)
    + foot(n),
))

# ── 18. Sistema de conversión ────────────────────────────────────────────
n += 1
camino = [
    ("Reel", "Con gancho y palabra clave"),
    ("Comentario", "«NIVEL0»"),
    ("Mensaje", "Automático, con el enlace a la prueba"),
    ("Prueba gratis", "5 días"),
    ("Email día 4", "«Mañana empieza tu suscripción»"),
    ("Clienta", "Y una pregunta si se va"),
]
ch = ""
for i, (t, s_) in enumerate(camino):
    x = 128 + i * 280
    ch += (
        f'<div class="abs pop" style="left:{x}px;top:340px;width:250px;height:180px;border-radius:20px;background:{ACENTO if i in (0, 5) else "#2A2D2C"};--d:{i}"></div>'
        + p(t, x + 22, 372, 210, size=26, d=i + 1, cls="", extra="font-weight:800;" + (f"color:{INK};" if i in (0, 5) else ""))
        + p(s_, x + 22, 430, 210, size=19, d=i + 1, cls="", extra=(f"color:{INK};" if i in (0, 5) else "color:#C9C7C3;"))
        + (f'<p class="abs a" style="left:{x + 252}px;top:400px;font-size:26px;color:{ACENTO};--d:{i + 1}">→</p>' if i < 5 else "")
    )
add("conversion", "El camino a clienta", sec(
    eyebrow("Propuesta")
    + titulo("De seguidora a clienta", size=56)
    + ch
    + lista([
        "<b>Palabra clave + mensaje automático</b> (ManyChat o similar).",
        "<b>Historias con enlace</b> 2-3 veces por semana: «hoy he hecho esta sesión del Nivel 2, puedes probarla gratis».",
        "<b>Bio y destacado «Empieza aquí»</b>: ya has puesto «Entrena online» el primero.",
        "<b>Email antes del cobro y pregunta al darse de baja</b>, con una herramienta sencilla como MailerLite (ahora no tienes ninguna).",
    ], 128, 590, 1664, size=24, d=7, gap=16)
    + foot(n),
))

# ── 19. Referentes ───────────────────────────────────────────────────────
n += 1
refs = [
    ("@pau_inspirafit", "159K · fundadora de su método (Phi)", ["Su método tiene destacados propios («Phi fuerza»).", "Enlace a una página propia para Instagram (phimetodo.com/instagram).", "Portadas elegantes, con un estilo que se reconoce."]),
    ("@holacuore", "314K · INEF y fundadora de una marca", ["Contenido de su día a día; la marca aparece de forma natural.", "Destacados por capítulos de su vida (su hijo, viajes).", "Casi sin texto en las portadas."]),
    ("@deliciousmartha", "2,4M · recetas fáciles", ["Una promesa en la bio: «Ser FIT nunca fue tan DELICIOUS».", "Un mismo formato que se repite y se reconoce.", "Enlace a su app en la bio."]),
]
rh = ""
for i, (cta, sub, items) in enumerate(refs):
    x = 128 + i * 566
    rh += (
        card(x, 290, 530, 520, d=i)
        + p(cta, x + 36, 326, 460, size=30, d=i + 1, cls="", extra="font-weight:800;")
        + p(sub, x + 36, 376, 460, size=20, d=i + 1, cls="rosa", extra="font-weight:700;")
        + lista(items, x + 36, 430, 460, size=21, d=i + 2, gap=12)
    )
add("referentes", "Lo que hacen tus referentes", sec(
    eyebrow("Referencias")
    + titulo("Qué hacen tus referentes", size=56)
    + rh
    + p("También nos dijiste que te gusta cómo comunican @drablancal, @isabelvina y @cescescola, y que no te convence el contenido muy guionizado. En las tres que hemos analizado se ve claro qué venden, sin que parezca publicidad.",
        128, 850, 1664, size=25, d=6, cls="soft")
    + foot(n),
))

# ── 20. Tu semana con 2-3 horas ──────────────────────────────────────────
n += 1
dias = [
    ("Lunes", "Grabar · 2 h", "4 piezas de una sentada: 2 de Nivel 0, 1 de Mitos 35+ y 1 de Dentro de Level Up. Misma ropa, mismo sitio.", ACENTO),
    ("Martes", "Publicar", "Nivel 0 + historias con enlace.", "#2A2D2C"),
    ("Jueves", "Publicar", "Mitos 35+ o Dentro de Level Up.", "#2A2D2C"),
    ("Viernes", "Grabar · 30 min", "Lo espontáneo: ¿Te ha pasado? y No hay viento. Banco de historias.", ACENTO),
    ("Sábado", "Publicar", "Entrena donde estés (Cardedeu) o humor.", "#2A2D2C"),
    ("Cada día", "Historias · 10 min", "3 historias: algo real, una encuesta o pregunta, y 2-3 veces por semana el enlace.", "#2A2D2C"),
]
dh = ""
for i, (d, t, txt, c) in enumerate(dias):
    col, fila = i % 3, i // 3
    x = 128 + col * 566
    y = 290 + fila * 310
    tinta = f"color:{INK};" if c == ACENTO else ""
    dh += (
        f'<div class="abs pop" style="left:{x}px;top:{y}px;width:530px;height:280px;border-radius:24px;background:{c};--d:{i}"></div>'
        + p(d, x + 36, y + 32, 460, size=20, d=i + 1, cls="" if c == ACENTO else "rosa", extra="font-weight:700;letter-spacing:.12em;text-transform:uppercase;" + tinta)
        + p(t, x + 36, y + 72, 460, size=32, d=i + 1, cls="", extra="font-weight:800;" + tinta)
        + p(txt, x + 36, y + 130, 460, size=22, d=i + 2, cls="" if c == ACENTO else "soft", extra=("color:#3A2F2F;" if c == ACENTO else ""))
    )
add("semana", "Tu semana tipo", sec(
    eyebrow("Organización · 2-3 horas a la semana")
    + titulo("Tu semana tipo", size=56)
    + dh
    + p("La edición, por las noches como ahora, con InShot o Edits. Lo programas todo desde Meta Business Suite.",
        128, 920, 1664, size=22, d=8, cls="muted")
    + foot(n),
))

# ── 21. Diez ideas listas para grabar ────────────────────────────────────
n += 1
ideas = [
    ("Nivel 0", "Si llevas años sin entrenar, empieza por estos 3 ejercicios"),
    ("Nivel 0", "Tu primera sentadilla bien hecha (con una silla)"),
    ("Entrena donde estés", "10 minutos en el jardín: cero material, cero excusas"),
    ("Entrena donde estés", "Cardedeu: circuito en el jardín con una silla y una banda"),
    ("¿Te ha pasado?", "Yo planeando entrenar a las 7:00 vs. yo a las 19:00"),
    ("¿Te ha pasado?", "Cuando tu hijo decide que la esterilla es suya"),
    ("No hay viento", "Tu vídeo de kite sin publicar + el entreno de los días sin viento"),
    ("Mitos 35+", "¿Por qué la grasa abdominal cuesta más a partir de los 40?"),
    ("Dentro de Level Up", "Pre-Entreno: 8 sesiones de 20 minutos con esterilla y silla"),
    ("Dentro de Level Up", "Tus dudas: ¿y si nunca he entrenado? ¿Y si no tengo tiempo?"),
]
ih = ""
for i, (s_, t) in enumerate(ideas):
    col, fila = i % 2, i // 2
    x = 128 + col * 852
    y = 290 + fila * 120
    ih += (
        f'<p class="abs a disp outline" style="left:{x}px;top:{y}px;font-size:40px;line-height:1;--d:{i % 5 + 1}">{i + 1:02d}</p>'
        + p(s_, x + 90, y - 4, 700, size=18, d=i % 5 + 1, cls="rosa", extra="font-weight:700;letter-spacing:.1em;text-transform:uppercase;")
        + p(t, x + 90, y + 26, 720, size=25, d=i % 5 + 2, cls="", extra="font-weight:800;line-height:1.2;")
    )
add("ideas", "Diez ideas para grabar", sec(
    eyebrow("Propuesta")
    + titulo("Ideas para grabar", size=56)
    + ih + foot(n),
))

# ── 22. Qué medimos ──────────────────────────────────────────────────────
n += 1
kp = [
    ("Seguidoras por cada 1.000 reproducciones", "Hoy: 4,3 de media", "Si el alcance trae seguidoras."),
    ("Guardados por reel", "Hoy: 105 de media", "Si el contenido es útil."),
    ("Comentarios con la palabra clave", "Hoy: 0", "Interés real en Level Up."),
    ("Clics en el enlace de la bio", "Hoy: sin medir", "Lo vemos en cuanto tengamos acceso a Meta."),
    ("Pruebas gratis al mes", "Hoy: 1,25", "El objetivo final."),
]
kh = ""
for i, (t, hoy, por) in enumerate(kp):
    y = 300 + i * 112
    kh += (
        p(t, 128, y, 760, size=28, d=i + 1, cls="", extra="font-weight:800;")
        + p(hoy, 920, y + 2, 340, size=26, d=i + 2, cls="rosa", extra="font-weight:800;")
        + p(por, 1290, y + 4, 500, size=22, d=i + 2)
        + f'<div class="abs line-h" style="left:128px;top:{y + 84}px;width:1664px;background:#2E3130"></div>'
    )
add("medimos", "Qué medimos", sec(
    eyebrow("Seguimiento")
    + titulo("Lo que medimos cada semana", size=56)
    + kh + foot(n),
))

# ── 23. Esta semana ──────────────────────────────────────────────────────
n += 1
acc = [
    ("Bio y enlace", "Nueva bio con la promesa y un único enlace a la prueba gratis."),
    ("Palabra clave", "Activar NIVEL0 con respuesta automática."),
    ("Primer lote", "Grabar el lunes 4 piezas de la lista de ideas."),
    ("Testimonios", "Pedir 3 valoraciones a tus 18 clientas presenciales, sobre todo a las que han probado Level Up."),
    ("Accesos", "Que Maen pueda ver las estadísticas en Meta, para medir desde ya."),
]
ah = ""
for i, (t, s_) in enumerate(acc):
    y = 300 + i * 116
    ah += (
        f'<div class="abs pop" style="left:128px;top:{y}px;width:44px;height:44px;border-radius:12px;border:3px solid {ACENTO};--d:{i}"></div>'
        + p(t, 210, y + 2, 460, size=32, d=i + 1, cls="", extra="font-weight:800;")
        + p(s_, 700, y + 6, 1090, size=25, d=i + 2)
    )
add("semana1", "Esta semana", sec(
    eyebrow("Próximos pasos")
    + titulo("Esta semana", size=56)
    + ah + foot(n),
))

# ── 24. Cierre ───────────────────────────────────────────────────────────
n += 1
add("cierre", "Cierre", sec(
    foto(1180, 0, 740, 1080, "mat", d=0, pos="center", radius=0)
    + f'<div class="abs" style="left:1180px;top:0;width:220px;height:1080px;background:linear-gradient(90deg,{INK},rgba(21,21,21,0))"></div>'
    + titulo("Gracias, Lucía", top=380, size=96, width=1040)
    + '<div class="abs a" style="left:128px;top:760px;font-size:28px;line-height:1.5;--d:3">'
    '<p style="font-weight:800">Jandro Martín · Maen Studios</p>'
    '<p><a href="mailto:jandro@maenstudios.com" style="color:inherit">jandro@maenstudios.com</a> · +34 688 629 688</p>'
    "</div>"
    + foot(n),
))

out = Path("app/pitch/level-up-contenido/diapos.ts")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(
    "/**\n * Auditoría de contenido y redirección para Level Up Workout (18 nov 2026).\n"
    " * Generado con scripts/build-level-up-contenido.py: si cambia el contenido\n"
    " * o las cifras, se edita el script y se vuelve a ejecutar.\n */\n\n"
    'import type { DiapoHtml } from "../maen-plan-100k/diapos";\n\n'
    "export const DIAPOS: DiapoHtml[] = "
    + json.dumps(slides, ensure_ascii=False, indent=2)
    + ";\n",
    encoding="utf-8",
)
print(len(slides), "diapositivas")
