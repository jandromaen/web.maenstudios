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

slides = []
n = 0


def add(id_, tit, html):
    slides.append({"id": id_, "titulo": tit, "html": html})


def label(t, x, y, w=700, color=None, d=1):
    c = f"color:{color};" if color else ""
    return p(t, x, y, w, size=20, d=d, cls="" if color else "rosa",
             extra=c + "font-weight:700;letter-spacing:.14em;text-transform:uppercase;")


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
    '<div class="abs deco f" style="left:1180px;top:-120px;width:900px;height:1320px;'
    f'background:{ACENTO};transform:rotate(14deg);border-radius:60px;--d:0"></div>'
    + portada_reel(1330, 200, "Tu contenido", "748K", NAVY, d=2, w=300, sub="rediseñado")
    + eyebrow("Sesión de contenido · 18 nov 2026", top=150)
    + '<h1 class="abs a disp" style="left:128px;top:290px;font-size:104px;line-height:1;--d:1">Más alcance.</h1>'
    '<h1 class="abs a disp outline" style="left:128px;top:404px;font-size:104px;line-height:1;--d:2">Más clientas.</h1>'
    + p("Auditoría de todo tu contenido y la redirección para que cada vídeo, además de gustar, lleve a Level Up.",
        128, 580, 940, size=32, d=3, cls="", extra="font-weight:800;line-height:1.3;")
    + p("Preparado por Maen Studios para Lucía · @lucia_entrenadorapersonal", 128, 800, 900, size=22, d=4)
    + foot(n),
))

# ── 2. La pregunta de hoy ────────────────────────────────────────────────
n += 1
add("pregunta", "La pregunta de hoy", sec(
    eyebrow("La pregunta de hoy")
    + titulo("¿Cómo llegas a más gente<br>y conviertes más visitas en clientas?", size=60)
    + card(128, 390, 812, 500)
    + label("Palanca 1 · Alcance", 168, 430)
    + p("Que te vea más gente <b>de la buena</b>: mujeres que quieren empezar a entrenar y no saben cómo.", 168, 480, 730, size=32, d=2, cls="", extra="font-weight:800;line-height:1.25;")
    + p("Hoy: sabes hacerlo. Has tenido reels de 748.000, 104.000 y 70.000 reproducciones.", 168, 700, 730, size=25, d=3)
    + card(980, 390, 812, 500, d=1, cls="pm-card-r")
    + label("Palanca 2 · Conversión", 1020, 430, color=NAVY, d=2)
    + p("Que quien te ve dé el siguiente paso: te siga, entre en la web y empiece la prueba gratis.", 1020, 480, 730, size=32, d=3, cls="", extra=f"color:{INK};font-weight:800;line-height:1.25;")
    + p("Hoy: aquí está el cuello de botella. 5 pruebas reales en 4 meses.", 1020, 700, 730, size=25, d=4, cls="", extra="color:#3A2F2F;")
    + foot(n),
))

# ── 3. Qué hemos analizado ───────────────────────────────────────────────
n += 1
fuentes = [
    ("≈ 80", "reels", "Todo lo publicado desde diciembre de 2024 hasta hoy: tema, portada y reproducciones."),
    ("27", "publicaciones a fondo", "Mayo–octubre con todas las métricas: guardados, compartidos y seguidoras."),
    ("2", "reels de noviembre", "Lo último que has publicado, para ver qué ya estás cambiando."),
    ("3", "cuentas que te gustan", "@pau_inspirafit, @holacuore y @deliciousmartha: qué hacen que podamos traer a tu terreno."),
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
    eyebrow("Metodología")
    + titulo("Qué hemos analizado", size=56)
    + fh
    + p("Las cifras de reproducciones son las públicas de Instagram. Guardados, compartidos y seguidoras salen de tu informe de mayo a octubre.",
        128, 890, 1664, size=21, d=6, cls="muted")
    + foot(n),
))

# ── PARTE 1 ──────────────────────────────────────────────────────────────
n += 1
add("parte1", "Parte 1 · Lo que has hecho", sec(
    eyebrow("Parte 1", k=True)
    + '<h2 class="abs a disp" style="left:128px;top:330px;font-size:120px;line-height:1;color:#151515;--d:1">Lo que<br>has hecho</h2>'
    + p("Dos años de contenido, mirados con lupa.", 128, 640, 1200, size=36, d=2, cls="", extra="color:#151515;font-weight:800;")
    + foot(n, k=True),
    bg=ACENTO, color=INK,
))

# ── 5. Tus tres picos ────────────────────────────────────────────────────
n += 1
picos = [
    ("¿Te ha pasado?", "748K", "#3E6FA8", "Les Angles · marzo 2026", "Humor de situación en la nieve. 10.700 me gusta. Comentarios de esquiadores, chicos, gente de Andorra… <b>casi nadie de tu público.</b>"),
    ("Entrena en el agua", "104K", "#2E8FA0", "Piscina · agosto 2026", "Rutina útil en un escenario inesperado. 1.690 guardados y 511 seguidoras: <b>el mejor captador de clientas potenciales del año.</b>"),
    ("Mis pensamientos intrusivos", "70,2K", "#2F8A6A", "Kite · 2026", "Humor con el kite de fondo. Se comparte muchísimo, pero atrae a gente del kite, <b>no a quien quiere empezar a entrenar.</b>"),
]
ph = ""
for i, (t, v, c, cuando, txt) in enumerate(picos):
    x = 128 + i * 580
    ph += (
        portada_reel(x, 300, t, v, c, d=i, w=200)
        + p(cuando, x + 230, 300, 320, size=20, d=i + 1, cls="rosa", extra="font-weight:700;")
        + f'<p class="abs a disp" style="left:{x + 230}px;top:340px;font-size:64px;--d:{i + 1}">{v}</p>'
        + p(txt, x + 230, 440, 320, size=22, d=i + 2)
    )
add("picos", "Tus tres picos", sec(
    eyebrow("Lo primero: sabes hacerlo")
    + titulo("Tres vídeos que lo petaron", size=56)
    + ph
    + p("Sabes hacer contenido que se ve. La pregunta no es cómo hacerte viral, sino <b style='color:#F4F4F4'>quién te ve cuando te haces viral.</b>",
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
    p("<b style='color:#F4F4F4'>La zona que buscamos</b><br>Mucho alcance y mucha conversión: hoy está vacía.", ox + W - 360, oy + 20, 340, size=21, d=5, cls="muted")
)
add("mapa", "Alcance y conversión", sec(
    eyebrow("Tu contenido en un mapa")
    + titulo("Lo que atrae no convierte,<br>y lo que convierte no se ve", size=52)
    + mapa
    + lista([
        "<b>Humor:</b> la máquina de alcance. Trae gente, pero no la tuya.",
        "<b>Entreno útil:</b> el que mejor equilibra las dos cosas.",
        "<b>Producto:</b> convierte, pero suena a anuncio y nadie lo ve.",
    ], 1360, 380, 432, size=23, d=6, gap=22)
    + foot(n),
))

# ── 7. Lo que funciona: tres fórmulas ────────────────────────────────────
n += 1
form = [
    ("Escenario inesperado + rutina útil", "Entrenar donde nadie entrena hace que pares el dedo; la rutina hace que lo guardes.",
     [("Entrena en el agua · glúteos", "104K"), ("Entrena en 10 min (campo)", "17,4K"), ("Entrena en el agua · brazos", "12K")]),
    ("Promesa concreta en la portada", "Un resultado que tu público quiere, dicho con sus palabras.",
     [("Adiós flacidez, hola firmeza", "33,3K"), ("Glúteos al siguiente nivel", "19,8K"), ("Si no eres constante, mira esto", "19,7K")]),
    ("Situación con la que se identifican", "Humor o confesión de algo que nos pasa a todas.",
     [("Corro cada semana… y no hay manera", "48,5K"), ("Las 15:00 y ya no sé qué hacer", "14,5K"), ("No hay viento… pero hay que practicar", "12,2K")]),
]
fh = ""
for i, (t, s_, ej) in enumerate(form):
    x = 128 + i * 566
    fh += (
        card(x, 290, 530, 620, d=i)
        + f'<p class="abs a disp rosa" style="left:{x + 36}px;top:326px;font-size:44px;--d:{i + 1}">0{i + 1}</p>'
        + p(t, x + 36, 396, 460, size=29, d=i + 1, cls="", extra="font-weight:800;line-height:1.2;")
        + p(s_, x + 36, 500, 460, size=22, d=i + 2)
    )
    for j, (tt, vv) in enumerate(ej):
        y = 650 + j * 76
        fh += (
            f'<div class="abs line-h" style="left:{x + 36}px;top:{y - 12}px;width:458px;background:#3A3D3C"></div>'
            + p(tt, x + 36, y, 330, size=20, d=i + 3, cls="soft")
            + p(vv, x + 380, y - 2, 114, size=24, d=i + 3, cls="rosa", extra="font-weight:800;text-align:right;")
        )
add("formulas", "Lo que funciona", sec(
    eyebrow("Lo que funciona")
    + titulo("Tus tres fórmulas ganadoras", size=56)
    + fh + foot(n),
))

# ── 8. Lo que no funciona ────────────────────────────────────────────────
n += 1
no = [
    ("Consejos abstractos", "«¿Motivación o disciplina?» 2.360 · «Agosto: trabajes o descanses» 2.633 · «¿Milagros antes de vacaciones?» 3.505", "Sin un resultado concreto ni un ejercicio que guardar, no hay motivo para quedarse."),
    ("Temas fuera de tu terreno", "Beauty tip 5.171 · Mi suplemento 3.342 · Café 4.747", "Diluyen quién eres. Tu público tiene que saber en un segundo de qué va tu cuenta."),
    ("Kite técnico", "«Quien algo quiere algo le cuesta» 2.242 · «Algunas normas» 6.291", "Interesa solo a quien hace kite. El kite funciona como personaje, no como tema."),
    ("Repetir sin cambiar el gancho", "Movilidad resubida: 548 frente a 9.674 · «Más pensamientos intrusivos» (nov) 4.136 frente a 70,2K", "Las segundas partes necesitan un giro nuevo, no el mismo vídeo otra vez."),
]
nh = ""
for i, (t, ej, lec) in enumerate(no):
    y = 290 + i * 152
    nh += (
        p(t, 128, y, 460, size=30, d=i + 1, cls="", extra="font-weight:800;line-height:1.2;")
        + p(ej, 620, y + 2, 600, size=21, d=i + 2, cls="muted")
        + p(lec, 1260, y + 2, 532, size=22, d=i + 3)
        + f'<div class="abs line-h" style="left:128px;top:{y + 124}px;width:1664px;background:#2E3130"></div>'
    )
add("nofunciona", "Lo que no funciona", sec(
    eyebrow("Lo que no funciona")
    + titulo("Cuatro patrones que frenan", size=56)
    + nh + foot(n),
))

# ── 9. Portadas ──────────────────────────────────────────────────────────
n += 1
add("portadas", "Tus portadas", sec(
    eyebrow("Identidad visual")
    + titulo("Tus portadas: muy bien, con un pero", size=56)
    + portada_reel(128, 300, "Adiós flacidez,<br>hola firmeza", "33,3K", "#6E6A63", d=0, w=200)
    + portada_reel(352, 300, "Mis pensamientos intrusivos", "70,2K", "#2F8A6A", d=1, w=200)
    + portada_reel(576, 300, "Supérate con cada nivel", "41,9K", "#8A8070", d=2, w=200)
    + label("Lo bueno", 860, 300)
    + lista([
        "Titular grande, legible y siempre con el mismo estilo. Tu grid se reconoce.",
        "Las portadas con promesa concreta son las que más se ven.",
    ], 860, 350, 932, size=25, d=3, gap=16)
    + label("El pero", 860, 560, color=ROJO, d=3)
    + lista([
        "Un vídeo de humor, una rutina y un anuncio de Level Up se ven igual. Nadie sabe de un vistazo qué es cada cosa.",
        "Level Up casi no aparece. Quien entra en tu perfil no ve que tienes un método.",
    ], 860, 610, 932, size=25, d=4, gap=16)
    + foot(n),
))

# ── 10. Copies y CTAs ────────────────────────────────────────────────────
n += 1
add("copies", "Copies y llamadas a la acción", sec(
    eyebrow("Copies y llamadas a la acción")
    + titulo("Ya conectas con Level Up", size=56)
    + card(128, 300, 812, 600)
    + label("Noviembre · «Aumenta tu gasto calórico sin entrenar más»", 168, 336, 740)
    + p("«…Y esto también forma parte de la filosofía de mi metodología Level Up Workout…»", 168, 400, 740, size=28, d=2, cls="", extra="font-weight:800;line-height:1.3;font-style:italic;")
    + lista([
        "✔ Por fin el contenido habla de Level Up. Es el cambio que buscábamos.",
        "✖ 2.933 reproducciones y 68 me gusta. El enlace llega al final de un texto largo que casi nadie lee.",
        "✖ La portada promete algo genérico («gasto calórico») que no es lo que hace único a tu método.",
    ], 168, 560, 740, size=23, d=3, gap=14, marca="")
    + label("Lo que cambiamos", 1020, 300)
    + lista([
        "<b>La llamada a la acción va en el vídeo</b>, no solo en el texto: dicha por ti o en pantalla.",
        "<b>Palabra clave en comentarios:</b> «comenta NIVEL0 y te mando la prueba gratis». La única vez que la usaste (KITE) tuvo 86 comentarios.",
        "<b>Copy corto:</b> 3 líneas. Gancho, valor y siguiente paso.",
        "<b>Hashtags de lo online</b>, no de entrenadora en Barcelona.",
    ], 1020, 350, 772, size=24, d=3, gap=20)
    + foot(n),
))

# ── 11. Audiencia ────────────────────────────────────────────────────────
n += 1
add("audiencia", "Para quién publicas", sec(
    eyebrow("La pregunta clave")
    + titulo("¿Para quién publicas?", size=56)
    + card(128, 300, 812, 600)
    + label("Quien te encuentra hoy", 168, 340)
    + lista([
        "Gente del kite y del esquí.",
        "Quien busca humor rápido y se va.",
        "Deportistas que ya entrenan.",
        "Gente de Barcelona que busca entrenadora presencial.",
    ], 168, 396, 740, size=27, d=2, gap=18)
    + card(980, 300, 812, 600, d=1, cls="pm-card-r")
    + label("Quien necesita Level Up", 1020, 340, color=NAVY, d=2)
    + p("Mujer de 35 a 55 años que lleva tiempo sin entrenar o nunca lo ha hecho. Poco tiempo, quizá con hijos. Le da vergüenza el gimnasio y no sabe por dónde empezar.",
        1020, 396, 730, size=30, d=3, cls="", extra=f"color:{INK};font-weight:800;line-height:1.3;")
    + p("No busca rendimiento. Busca empezar, no hacerse daño y verse capaz.", 1020, 720, 730, size=25, d=4, cls="", extra="color:#3A2F2F;")
    + foot(n),
))

# ── PARTE 2 ──────────────────────────────────────────────────────────────
n += 1
add("parte2", "Parte 2 · La redirección", sec(
    eyebrow("Parte 2", k=True)
    + '<h2 class="abs a disp" style="left:128px;top:330px;font-size:120px;line-height:1;color:#151515;--d:1">La<br>redirección</h2>'
    + p("Mismo talento, otro destino: que cada vídeo acerque a alguien a su Nivel 0.", 128, 640, 1400, size=36, d=2, cls="", extra="color:#151515;font-weight:800;")
    + foot(n, k=True),
    bg=ACENTO, color=INK,
))

# ── 13. Posicionamiento ──────────────────────────────────────────────────
n += 1
add("posicionamiento", "Tu posicionamiento", sec(
    eyebrow("La idea que lo ordena todo")
    + titulo("De «entrenadora que hace kite»<br>a «la que te enseña a empezar»", size=52)
    + card(128, 380, 1664, 250, d=1, cls="pm-card-r")
    + p("«Te enseño a empezar a entrenar desde cero, en casa y en 20 minutos. Y a no dejarlo.»",
        176, 440, 1560, size=46, d=2, cls="", extra=f"color:{INK};font-weight:800;line-height:1.2;")
    + label("Por qué funciona", 128, 690)
    + lista([
        "Es exactamente lo que vende Level Up. Cada vídeo es un anuncio que no lo parece.",
        "Tu historia lo respalda: llevas años entrenando a mujeres que empezaban de cero, y en tus redes ya se ve tu día a día como madre y como deportista.",
        "Lo personal (kite, maternidad, humor) deja de competir con lo profesional y pasa a demostrarlo.",
    ], 128, 740, 1664, size=25, d=3, gap=14)
    + foot(n),
))

# ── 14. Cuatro pilares con trabajo ───────────────────────────────────────
n += 1
pil = [
    ("Atraer", "30 %", "Humor y escenarios inesperados, siempre con situaciones de TU público.", "Que te descubran las que todavía no te siguen.", "#3E6FA8"),
    ("Enseñar", "35 %", "Rutinas y ejercicios guardables para empezar desde cero.", "Que te guarden, te sigan y confíen en ti.", ACENTO),
    ("Conectar", "15 %", "Kite, maternidad, tu vida. Con un puente hacia el «yo también puedo».", "Que te quieran y se queden.", "#2F8A6A"),
    ("Convertir", "20 %", "Level Up por dentro, alumnas, prueba gratis, dudas frecuentes.", "Que se apunten.", AZUL),
]
ph = ""
for i, (t, pct, que, para, c) in enumerate(pil):
    x = 128 + i * 424
    ph += (
        card(x, 300, 396, 600, d=i)
        + f'<div class="abs gx" style="left:{x}px;top:300px;width:396px;height:12px;border-radius:16px 16px 0 0;background:{c};--d:{i}"></div>'
        + f'<p class="abs a disp" style="left:{x + 36}px;top:350px;font-size:64px;color:{c};--d:{i + 1}">{pct}</p>'
        + p(t, x + 36, 440, 330, size=36, d=i + 1, cls="", extra="font-weight:800;")
        + p(que, x + 36, 510, 330, size=23, d=i + 2)
        + label("Para qué", x + 36, 700, 330, color=c, d=i + 2)
        + p(para, x + 36, 740, 330, size=23, d=i + 3, cls="", extra="font-weight:700;")
    )
add("pilares", "Cuatro pilares", sec(
    eyebrow("El nuevo reparto")
    + titulo("Cada vídeo tiene un trabajo", size=56)
    + ph + foot(n),
))

# ── 15. Seis series fijas ────────────────────────────────────────────────
n += 1
series = [
    ("Nivel 0", "Enseñar", ACENTO, "Un ejercicio o una rutina para quien nunca ha entrenado. Con silla y esterilla, como el Pre-Entreno.", "6 ejercicios para empezar desde 0 (11,3K)"),
    ("Entrena donde estés", "Atraer", "#3E6FA8", "Rutina de 10 minutos en un sitio inesperado: el jardín de Cardedeu, la piscina, un hotel, la nieve.", "Entrena en el agua (104K)"),
    ("¿Te ha pasado?", "Atraer", "#3E6FA8", "Humor de situaciones de mujeres que intentan entrenar: la pereza de las 15:00, el niño encima, la lavadora.", "Les Angles (748K), pero con tu público"),
    ("No hay viento", "Conectar", "#2F8A6A", "Días sin kite: entreno en casa para seguir haciendo lo que te gusta. El puente perfecto.", "No hay viento… (12,2K)"),
    ("Mitos 35+", "Enseñar", ACENTO, "Grasa abdominal, flacidez, huesos, cambios hormonales. Tu formación como argumento.", "Adiós flacidez (33,3K)"),
    ("Dentro de Level Up", "Convertir", AZUL, "Un nivel por dentro, una sesión real, el progreso de una alumna, las dudas más comunes.", "Supérate con cada nivel (41,9K)"),
]
sh = ""
for i, (t, pil_, c, txt, prueba) in enumerate(series):
    col, fila = i % 3, i // 3
    x = 128 + col * 566
    y = 290 + fila * 330
    sh += (
        card(x, y, 530, 300, d=i)
        + f'<div class="abs a" style="left:{x + 36}px;top:{y + 34}px;padding:4px 12px;border-radius:999px;background:{c};color:{INK};font-size:16px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;--d:{i}">{pil_}</div>'
        + p(t, x + 36, y + 80, 460, size=32, d=i + 1, cls="", extra="font-weight:800;")
        + p(txt, x + 36, y + 134, 460, size=21, d=i + 2)
        + p(f"Ya probado: {prueba}", x + 36, y + 244, 460, size=18, d=i + 2, cls="muted")
    )
add("series", "Seis series fijas", sec(
    eyebrow("Formatos que se repiten")
    + titulo("Seis series fijas", size=56)
    + sh + foot(n),
))

# ── 16. Del humor viral al humor que vende ───────────────────────────────
n += 1
add("humor", "El humor que vende", sec(
    eyebrow("Tu superpoder, bien apuntado")
    + titulo("Del humor viral al humor que vende", size=56)
    + card(128, 300, 812, 600)
    + label("Antes", 168, 340, color=MUTED)
    + p("«En mi defensa diré que no recordaba que llevaba más forfaits en el bolsillo»", 168, 390, 740, size=30, d=2, cls="", extra="font-weight:800;line-height:1.25;font-style:italic;")
    + p("748.000 reproducciones. Se ríe todo el mundo, pero el chiste es de esquiadores. Nadie piensa en Level Up.", 168, 560, 740, size=24, d=3)
    + card(980, 300, 812, 600, d=1, cls="pm-card-r")
    + label("Después", 1020, 340, color=NAVY, d=2)
    + lista([
        "«Yo a las 7:00 planeando entrenar vs. yo a las 19:00 con el niño en brazos»",
        "«Cuando llevas 10 años sin entrenar y te dicen “haz una sentadilla”»",
        "«Mi cuerpo el día 1 del Nivel 0 vs. mi cuerpo el día 1 del Nivel 3»",
    ], 1020, 390, 730, size=26, d=3, color=INK, gap=20, mcolor=INK)
    + p("Mismo humor y misma Lucía. Pero el chiste lo entiende <b>tu</b> clienta, y el remate lleva a Level Up.", 1020, 760, 730, size=22, d=4, cls="", extra="color:#3A2F2F;")
    + foot(n),
))

# ── 17. Anatomía de un reel ──────────────────────────────────────────────
n += 1
pasos = [
    ("0–1 s", "Gancho visual", "Un sitio, un gesto o una frase que pare el dedo. La portada promete un resultado concreto."),
    ("1–3 s", "Gancho dicho", "«Si llevas años sin entrenar, empieza por aquí.» Hablas a una persona, no a todo el mundo."),
    ("3–25 s", "Valor", "La rutina, el truco o la situación. Corto, claro, sin relleno."),
    ("Final", "Puente", "«Esto es literalmente el Nivel 0 de Level Up.» Una frase que conecta con el método."),
    ("Final", "Siguiente paso", "«Comenta NIVEL0 y te mando 5 días gratis.» Dicho y en pantalla."),
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
    eyebrow("La fórmula")
    + titulo("Anatomía de un reel que atrae y convierte", size=56)
    + ah
    + card(128, 720, 1664, 180, d=5)
    + label("Ejemplo · serie Entrena donde estés", 168, 750)
    + p("Jardín de Cardedeu. Portada: «10 minutos, una silla y cero excusas». Rutina de 4 ejercicios del Pre-Entreno. Cierre: «Esto es el Nivel 0 de Level Up. Comenta NIVEL0 y empieza gratis».",
        168, 795, 1580, size=23, d=6)
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
    eyebrow("Convertir sin parecer pesada")
    + titulo("El camino de una desconocida a clienta", size=56)
    + ch
    + lista([
        "<b>Palabra clave + mensaje automático</b> (ManyChat o similar): contestas a cientos de personas sin estar pendiente.",
        "<b>Historias con enlace</b> 2-3 veces por semana: «hoy he hecho esta sesión del Nivel 2, puedes probarla gratis».",
        "<b>Bio y destacado «Empieza aquí»</b>: ya has puesto «Entrena online» el primero. ¡Bien!",
        "<b>Email antes del cobro y pregunta al irse:</b> menos bajas y sabremos por qué se van.",
    ], 128, 590, 1664, size=24, d=7, gap=16)
    + foot(n),
))

# ── 19. Referentes ───────────────────────────────────────────────────────
n += 1
refs = [
    ("@pau_inspirafit", "159K · fundadora de su método (Phi)", ["Su propio método en el centro: destacados por producto («Phi fuerza»).", "Enlace a una página propia para Instagram (phimetodo.com/instagram): sabe qué ventas vienen de ahí.", "Portadas elegantes, con un estilo que se reconoce."]),
    ("@holacuore", "314K · INEF y fundadora de una marca", ["Contenido de vida real primero: la marca se cuela sola.", "Destacados por capítulos de su vida (su hijo, viajes).", "Casi sin texto en portada: manda la imagen."]),
    ("@deliciousmartha", "2,4M · recetas fáciles", ["Una promesa en la bio: «Ser FIT nunca fue tan DELICIOUS».", "Un formato que se repite hasta el infinito y se reconoce al instante.", "Enlace a su app con su nombre: el producto vive en la bio."]),
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
    eyebrow("Las cuentas que te gustan")
    + titulo("Lo que podemos traer a tu terreno", size=56)
    + rh
    + p("El patrón común: <b style='color:#F4F4F4'>una persona real con un producto propio que se ve claro.</b> Ninguna esconde lo que vende, y ninguna suena a anuncio.",
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
    eyebrow("Con tus 2-3 horas · 3 reels y historias diarias")
    + titulo("Tu semana tipo", size=56)
    + dh
    + p("La edición, por las noches como ahora, con InShot o Edits. Grabar por lotes es lo que hace que quepa en tu semana.",
        128, 920, 1664, size=22, d=8, cls="muted")
    + foot(n),
))

# ── 21. Diez ideas listas para grabar ────────────────────────────────────
n += 1
ideas = [
    ("Nivel 0", "Si llevas años sin entrenar, empieza por estos 3 ejercicios"),
    ("Nivel 0", "Tu primera sentadilla bien hecha (con una silla)"),
    ("Entrena donde estés", "10 minutos en el jardín: cero material, cero excusas"),
    ("Entrena donde estés", "Rutina de hotel / de vacaciones de Navidad"),
    ("¿Te ha pasado?", "Yo planeando entrenar a las 7:00 vs. yo a las 19:00"),
    ("¿Te ha pasado?", "Cuando tu hijo decide que la esterilla es suya"),
    ("No hay viento", "Lo que entreno para aguantar una sesión de kite"),
    ("Mitos 35+", "¿Por qué la grasa abdominal cuesta más a partir de los 40?"),
    ("Dentro de Level Up", "Así es el Pre-Entreno por dentro: tu primera semana"),
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
    eyebrow("Para el lunes")
    + titulo("Diez ideas listas para grabar", size=56)
    + ih + foot(n),
))

# ── 22. Qué medimos ──────────────────────────────────────────────────────
n += 1
kp = [
    ("Seguidoras por cada 1.000 reproducciones", "Hoy: 4,3 de media", "Que lo que se ve, sume."),
    ("Guardados por reel", "Hoy: 105 de media", "Señal de contenido útil para tu público."),
    ("Comentarios con la palabra clave", "Hoy: 0", "Gente levantando la mano."),
    ("Clics en el enlace de la bio", "Hoy: sin medir", "Lo vemos en cuanto tengamos acceso a Meta."),
    ("Pruebas gratis al mes", "Hoy: 1,25", "El número que de verdad importa."),
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
    eyebrow("Cada semana")
    + titulo("Lo que medimos cada semana", size=56)
    + kh + foot(n),
))

# ── 23. Esta semana ──────────────────────────────────────────────────────
n += 1
acc = [
    ("Bio y enlace", "Nueva bio con la promesa y un único enlace a la prueba gratis."),
    ("Palabra clave", "Activar NIVEL0 con respuesta automática."),
    ("Primer lote", "Grabar el lunes 4 piezas de la lista de ideas."),
    ("Testimonios", "Pedir 3 valoraciones a clientas presenciales que hayan probado Level Up."),
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
    eyebrow("Empezamos ya")
    + titulo("Cinco cosas para esta semana", size=56)
    + ah + foot(n),
))

# ── 24. Cierre ───────────────────────────────────────────────────────────
n += 1
add("cierre", "Cierre", sec(
    '<div class="abs deco f" style="left:1260px;top:-160px;width:900px;height:1400px;'
    f'background:{ACENTO};transform:rotate(14deg);border-radius:60px;--d:0"></div>'
    + eyebrow("Para terminar")
    + titulo("Ya sabes hacerte ver.<br>Ahora, que te vean<br>las que te necesitan.", top=280, size=62, width=1100)
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
