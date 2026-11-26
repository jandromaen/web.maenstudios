"""Guiones estratégicos e identidad de Instagram para Lucía (Level Up Workout).

Genera app/pitch/level-up-propuestas/diapos.ts. Reutiliza los helpers y el
modo claro de build-level-up-contenido.py.

    python3 scripts/build-level-up-propuestas.py

Todo lo que se afirma sobre cómo funciona Instagram sale de lo que ha dicho
Instagram (Adam Mosseri, blog de Instagram, cuenta @creators); las fuentes
están en la diapositiva «De dónde sale todo esto».
"""
import json
from pathlib import Path

_src = Path("scripts/build-level-up-contenido.py").read_text(encoding="utf-8")
exec(_src.split("\n# ── 1. Portada")[0])

OMITIR = {"bio", "bios", "deidea", "destacados", "anatomia", "casa"}  # la bio antigua la sustituye la diapositiva «bios» del principio
NOCHE = "#151F30"      # azul noche de la web de Level Up
MELO = "#FFCB9A"       # melocotón de la web
ROTO = "#F7F3EE"       # blanco roto
PILAR = {"Atraer": "#3E6FA8", "Enseñar": ACENTO, "Conectar": "#2F8A6A", "Convertir": AZUL}

FUENTES = ("<style>@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap');</style>")
POP = "font-family:'Poppins',sans-serif;"


def img_url(k):
    """Foto de portada: fotograma de sus reels (gNN) o foto de su web."""
    if k == "pasta":  # foto de stock (Unsplash, Bruna Branco): solo para la portada de hidratos
        return "https://images.unsplash.com/photo-1546549032-9571cd6b27df?fm=jpg&q=70&w=900"
    return f"/pitch/level-up/portadas-src/{k}.jpg" if k.startswith("g") else f"{WEB}{FOTOS[k]}"


def portada(x, y, w, k, serie, titulo_txt, d=0, fondo=None, pos="center"):
    """Plantilla mínima de portada (9:16): foto en color de Lucía, serie pequeña y
    título blanco centrado en el centro exacto, para que se vea en el recorte 3:4 del perfil."""
    h = round(w * 16 / 9)
    fondo_css = (f"background:{fondo};" if fondo
                 else f"background:#ddd url({img_url(k)}) {pos}/cover no-repeat;")
    tinta = NOCHE if fondo == ROTO else "#fff"
    sombra = "" if fondo else "text-shadow:0 2px 16px rgba(0,0,0,.55);"
    return (
        f'<div class="abs pop" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:20px;overflow:hidden;'
        f'{fondo_css}box-shadow:0 16px 40px rgba(21,31,48,.18);--d:{d}">'
        + ("" if fondo else '<div style="position:absolute;inset:0;background:rgba(21,31,48,.18)"></div>')
        + f'<div style="position:absolute;left:{round(w*.08)}px;right:{round(w*.08)}px;top:50%;transform:translateY(-50%);text-align:center;{POP}{sombra}color:{tinta}">'
          f'<div style="font-size:{round(w*.034)}px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;opacity:.9">{serie}</div>'
          f'<div style="font-size:{round(w*.095)}px;font-weight:700;line-height:1.08;margin-top:{round(w*.03)}px">{titulo_txt}</div></div>'
        + "</div>"
    )


def pill(t, x, y, c, d=0):
    return (f'<div class="abs a" style="left:{x}px;top:{y}px;padding:4px 14px;border-radius:999px;background:{c};'
            f'color:{INK};font-size:16px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;--d:{d}">{t}</div>')


VERDE_HOOK = "#DDF1E4"
AZUL_CTA = "#DCE7F8"


def tabla(filas, x, y, w, d=0, cierre=None, hooks=None, ctas=None):
    """Guion escalonado: hook en verde (o dos versiones del hook, cada una como plano aparte) y cierre (CTA) en azul."""
    cab = ("<tr>" + "".join(
        f'<th style="text-align:left;padding:0 18px 10px 12px;font-size:15px;font-weight:800;letter-spacing:.12em;'
        f'text-transform:uppercase;color:{ACENTO_TXT};width:{a}">{t}</th>'
        for t, a in (("Plano", "11%"), ("Qué se ve", "27%"), ("Qué dices", "38%"), ("Texto en pantalla", "24%"))) + "</tr>")
    et = lambda txt, col: f"<br><span style='font-size:12px;letter-spacing:.1em;color:{col}'>{txt}</span>"
    # (nombre, etiqueta, fondo, se ve, dices, estilo extra de la fila)
    rows = []
    if hooks:
        for k, (ve, dice) in enumerate(hooks):
            rows.append((f"Plano {k + 1}", et(f"HOOK · VERSIÓN {k + 1}" if len(hooks) > 1 else "HOOK", "#2F7A50"), VERDE_HOOK, ve, dice,
                         "border-left:6px solid #3E9A66;" + ("border-bottom:14px solid #FFFFFF;" if k < len(hooks) - 1 else "")))
        resto = list(filas)[1:]
    else:
        rows.append(("Plano 1", et("HOOK", "#2F7A50"), VERDE_HOOK, filas[0][1], filas[0][2], ""))
        resto = list(filas)[1:]
    for (t, ve, dice, txt) in resto:
        rows.append((f"Plano {len(rows) + 1}", "", "transparent", ve, dice, ""))
    if ctas:
        for k, (ve, dice) in enumerate(ctas):
            rows.append(("Cierre", et(f"CTA · VERSIÓN {k + 1}" if len(ctas) > 1 else "CTA", "#2D5BA8"), AZUL_CTA, ve, dice,
                         "border-left:6px solid #4A78C2;" + ("border-bottom:14px solid #FFFFFF;" if k < len(ctas) - 1 else "")))
    elif cierre:
        rows.append(("Cierre", et("CTA", "#2D5BA8"), AZUL_CTA, "—", cierre, ""))
    cuerpo = ""
    for (t, etq, fondo, ve, dice, extra) in rows:
        cuerpo += (
            f'<tr style="background:{fondo};border-bottom:1px solid #EEEAE4;border-left:6px solid {fondo if fondo != "transparent" else "#FFFFFF"};{extra}">'
            f'<td style="padding:12px 18px 12px 12px;vertical-align:top;font-weight:800;white-space:nowrap">{t}{etq}</td>'
            f'<td style="padding:12px 18px 12px 12px;vertical-align:top">{ve}</td>'
            f'<td style="padding:12px 18px 12px 12px;vertical-align:top">{dice}</td>'
            f'<td style="padding:12px 12px 12px 12px;vertical-align:top;color:#8A8580;font-style:italic">Se encarga Jandro en edición</td></tr>'
        )
    return (f'<div class="abs a" style="left:{x}px;top:{y}px;width:{w}px;--d:{d}">'
            f'<table style="width:100%;border-collapse:collapse;font-size:19px;line-height:1.38;color:{INK}">'
            f'{cab}{cuerpo}</table></div>')


def video_ref(x, y, w, h, nombre, d=0):
    """Vídeo de referencia: solo se reproduce al pulsar play."""
    b = 72
    return (
        f'<div class="abs pop" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:18px;overflow:hidden;'
        f'background:#000;box-shadow:0 14px 40px rgba(0,0,0,.2);--d:{d}">'
        f'<video data-manual src="/pitch/level-up/refs/{nombre}.mp4" poster="/pitch/level-up/refs/{nombre}.jpg" '
        f'playsinline preload="none" style="width:100%;height:100%;object-fit:cover;display:block" '
        f'onclick="if(this.paused){{this.play()}}else{{this.pause()}}" '
        f'onplay="this.nextElementSibling.style.display=\'none\'" onpause="this.nextElementSibling.style.display=\'flex\'"></video>'
        f'<button type="button" aria-label="Reproducir" onclick="this.previousElementSibling.play()" '
        f'style="position:absolute;left:50%;top:50%;width:{b}px;height:{b}px;margin:-{b // 2}px 0 0 -{b // 2}px;border:0;border-radius:50%;cursor:pointer;'
        f'background:rgba(255,255,255,.85);box-shadow:0 6px 20px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;padding:0">'
        f'<span style="width:0;height:0;margin-left:6px;border-style:solid;border-width:14px 0 14px 23px;'
        f'border-color:transparent transparent transparent #151515"></span></button></div>'
    )


# ── Portada ──────────────────────────────────────────────────────────────
n += 1
add("portada", "Guiones e identidad", sec(
    FUENTES
    + f'<div class="abs" style="left:560px;top:0;width:1360px;height:1080px;background:#f3f3f4 url({WEB}{FOTOS["risa"]}) 55% center/cover no-repeat"></div>'
    + '<div class="abs" style="left:560px;top:0;width:260px;height:1080px;background:linear-gradient(90deg,#FFFFFF,rgba(255,255,255,0))"></div>'
    + f'<p class="abs a" style="left:140px;top:150px;{POP}font-size:20px;font-weight:500;letter-spacing:.3em;text-transform:uppercase;color:{ACENTO_TXT};--d:1">Level Up Workout</p>'
    + f'<h1 class="abs a" style="left:140px;top:700px;width:700px;{POP}font-size:92px;font-weight:600;line-height:1;letter-spacing:-.02em;color:{NOCHE};--d:2">Guiones<br>e identidad</h1>'
    + f'<p class="abs a" style="left:140px;top:910px;{POP}font-size:20px;font-weight:400;color:#8A8580;--d:3">Noviembre 2026</p>',
))

# ── 4 propuestas de biografía (inspiradas en @marthafit_healthymom) ──────
n += 1
BIOS = [
    ("Calcada a Marta", "Lucía García | Entrenadora personal para mujeres",
     "Consigo que mujeres sin tiempo entrenen en casa, desde cero y en 20-30' 🏡 +[X] años entrenando a mujeres reales<br>👇 Prueba 5 días gratis"),
    ("Mujeres +35", "Lucía García | Entrenamiento para mujeres +35",
     "Empieza a entrenar en casa a partir de los 35, aunque nunca lo hayas hecho 💪<br>🎓 Graduada en Ciencias del Deporte<br>👇 5 días gratis en Level Up"),
    ("Constancia", "Lucía García | Entrenadora personal online",
     "Para mujeres que siempre empiezan y lo dejan: un plan por niveles para entrenar en casa y no volver a parar<br>👇 Pruébalo 5 días gratis"),
    ("Madre y entrenadora", "Lucía García | Entrenamiento femenino en casa",
     "Madre, entrenadora y graduada en Ciencias del Deporte. Te enseño a entrenar en casa en 20-30'<br>👇 Empieza con 5 días gratis"),
]
bh = (
    label("Tu bio hoy", 128, 262, d=1, color="#8A8580")
    + f'<div class="abs pop" style="left:128px;top:296px;width:560px;height:239px;border-radius:14px;border:1px solid #E7E2DB;'
      f'background:#fff url(/pitch/level-up/marca/bio-actual.png) center/contain no-repeat;--d:1"></div>'
    + f'<div class="abs pop" style="left:728px;top:262px;width:1064px;height:273px;padding:20px 26px;box-sizing:border-box;border-radius:16px;background:{ROTO};--d:2">'
      f'<span style="font-size:14px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:{ACENTO_TXT}">La referencia · @marthafit_healthymom · 240K</span><br>'
      f'<span style="font-size:18px;color:{INK};line-height:1.45"><b>Marta Pérez | Entrenamiento de fuerza. Pérdida de grasa</b><br>'
      f'«Consigo que mujeres estresadas y sin tiempo entrenen fuerza de forma constante, antes de que empiece el caos del día 👩‍💻 +12 años +3000 mujeres 👇 Aquí»</span><br>'
      f'<span style="font-size:16px;color:#4A4744;line-height:1.4">Funciona por tres cosas: el nombre dice lo que hace (y se busca), una sola frase con a quién ayuda y qué consigue, y una prueba con números antes del enlace.</span>'
      f'<div style="margin-top:14px;padding-top:12px;border-top:1px solid #E2DDD6;font-size:17px;line-height:1.4;color:{INK}"><b>La tuya:</b> el nombre solo dice «Entrenadora Personal» y la bio son 5 etiquetas sueltas, sin decir a quién ayudas ni qué consiguen contigo.</div></div>'
)
for i, (tag, nombre, bio) in enumerate(BIOS):
    col_, fila = i % 2, i // 2
    x, y = 128 + col_ * 852, 566 + fila * 210
    bh += (
        f'<div class="abs pop" style="left:{x}px;top:{y}px;width:812px;height:196px;padding:18px 26px;box-sizing:border-box;border-radius:20px;'
        f'background:#fff;border:1px solid #E7E2DB;box-shadow:0 10px 30px rgba(0,0,0,.05);{POP}--d:{i + 2}">'
        f'<div style="font-size:14px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:{ACENTO_TXT}">0{i + 1} · {tag}</div>'
        f'<div style="font-size:18px;font-weight:600;color:{INK};margin-top:6px">{nombre}</div>'
        f'<div style="font-size:16.5px;line-height:1.4;color:{INK};margin-top:4px">{bio}</div>'
        f'</div>'
    )
add("bios", "4 propuestas de biografía", sec(
    FUENTES
    + eyebrow("Biografía")
    + titulo("Tu bio: 4 propuestas", size=56)
    + bh
    + foot(n),
))

# ── Destacados ───────────────────────────────────────────────────────────
n += 1
DEST = [
    ("empieza", "Empieza aquí", "Qué es Level Up, cómo funciona y la prueba de 5 días con el enlace."),
    ("opiniones", "Opiniones", "Tus «Mensajitos»: capturas de clientas y sus resultados."),
    ("nivel0", "Entrenos", "Tus entrenos con clientas: profesionalidad y trabajo real."),
    ("sobremi", "Sobre mí", "Quién eres, tu formación y por qué creaste Level Up."),
    ("dudas", "Dudas", "Precio, tiempo, material, cancelación: lo que más te preguntan."),
    ("mivida", "Mi vida", "Viajes y día a día. Une Lifestyle 2025 y 2026; fuera la de KF."),
]
dh = ""
for i, (k, nom, txt) in enumerate(DEST):
    x = 128 + i * 282
    dh += (
        f'<div class="abs pop" style="left:{x + 41}px;top:560px;width:170px;height:170px;border-radius:50%;'
        f'background:#151F30 url(/pitch/level-up/destacados/{k}.png) center/cover no-repeat;'
        f'box-shadow:0 0 0 5px #fff,0 0 0 7px #E2DDD6;--d:{i + 2}"></div>'
        + p(nom, x, 752, 252, size=22, d=i + 2, cls="", extra=f"text-align:center;font-weight:700;{POP}")
        + p(txt, x + 6, 792, 240, size=17, d=i + 3, extra="text-align:center;line-height:1.4;")
    )
add("destacados", "Destacados", sec(
    FUENTES
    + eyebrow("Destacados")
    + titulo("Seis destacados, siempre iguales", size=56)
    + label("Hoy", 128, 270, d=1, color="#8A8580")
    + f'<div class="abs pop" style="left:128px;top:306px;width:930px;height:171px;border-radius:14px;border:1px solid #E7E2DB;'
      f'background:#fff url(/pitch/level-up/marca/destacados-actual.png) center/contain no-repeat;--d:1"></div>'
    + p("Cada portada con un estilo, años repetidos (2025, 2026) y lo que más vende, las opiniones, en el quinto puesto.",
        1100, 330, 690, size=21, d=2, extra="line-height:1.45;")
    + label("Propuesta · en este orden", 128, 516, d=2)
    + dh
    + p("Fondo azul noche e icono melocotón, los colores de Level Up. Primero lo que convierte, al final lo personal. Las portadas ya están listas para subir.",
        128, 950, 1664, size=19, d=8, cls="muted")
    + foot(n),
))

# ── De tu idea al guion ──────────────────────────────────────────────────
n += 1
add("deidea", "De tu idea al guion", sec(
    eyebrow("Tus ideas")
    + titulo("De tu idea al guion", size=56)
    + label("Lo que me pasaste", 128, 290, d=1, color="#8A8580")
    + card(128, 330, 700, 470, d=1)
    + p("<b>4. ¿Haces sentadillas y no notas que trabajen los glúteos?</b>", 168, 368, 620, size=22, d=1, cls="", extra="line-height:1.35;")
    + p("«Me grabo haciendo una sentadilla con mayor profundidad y explico cómo puede influir en el estímulo del glúteo. Después enseño una alternativa con sentadilla a cajón para quienes tienen limitaciones de movilidad.»",
        168, 440, 620, size=21, d=2, extra="line-height:1.45;font-style:italic;")
    + p("Una buena idea: un problema real de tu público y una solución. Falta decidir cómo empieza, qué dices exactamente y qué le pides al final a quien lo ve.",
        168, 650, 620, size=19, d=3, cls="muted")
    + label("Lo que te devuelvo", 908, 290, d=2)
    + lista([
        "<b>El gancho de los 2 primeros segundos</b>: lo que se ve, lo que dices y el texto en pantalla.",
        "<b>El guion por tiempos</b>: qué se ve, qué dices palabra por palabra y qué texto aparece.",
        "<b>El cierre</b>: qué le pides a quien lo ve (guardarlo, enviarlo, comentar o escribir NIVEL0).",
        "<b>La descripción</b>, con las palabras que la gente busca en Instagram.",
        "<b>El objetivo de cada vídeo</b> y la métrica en la que tienes que fijarte.",
        "<b>La portada</b>, con la misma plantilla para todos.",
    ], 908, 336, 884, size=23, d=3, gap=16)
    + p("Son tus ideas y tu forma de hablar: cambia las palabras que quieras, pero mantén el orden, el gancho y el cierre.",
        128, 880, 1664, size=22, d=5, cls="muted")
    + foot(n),
))

# ── Anatomía de un guion ─────────────────────────────────────────────────
n += 1
an = [
    ("Gancho", "0-2 s", "Que no pasen de largo. Instagram dice que los primeros segundos «lo deciden todo».", "Tiempo de visionado"),
    ("Valor", "El cuerpo", "Algo que se aprende o se siente en menos de 30 s: un error corregido, una rutina, una risa.", "Me gusta y guardados"),
    ("Enviable", "Todo el vídeo", "Que dé ganas de mandárselo a una amiga. Es lo que más pesa para llegar a gente que no te sigue.", "Envíos por alcance"),
    ("Cierre", "Últimos 3 s", "Una sola petición: guárdalo, mándaselo a…, cuéntame… o comenta NIVEL0.", "Comentarios y NIVEL0"),
    ("Descripción", "Debajo del vídeo", "La primera frase repite el gancho y usa palabras que la gente busca.", "Búsquedas"),
]
ah = ""
for i, (t, cuando, txt, metr) in enumerate(an):
    x = 128 + i * 336
    ah += (
        card(x, 300, 316, 520, d=i)
        + p(cuando, x + 28, 330, 270, size=17, d=i + 1, cls="rosa", extra="font-weight:700;letter-spacing:.1em;text-transform:uppercase;")
        + p(t, x + 28, 362, 270, size=32, d=i + 1, cls="", extra="font-weight:800;")
        + p(txt, x + 28, 420, 262, size=20, d=i + 2, extra="line-height:1.4;")
        + f'<div class="abs a" style="left:{x + 28}px;top:720px;width:262px;border-top:2px solid {ACENTO};padding-top:14px;font-size:17px;'
          f'font-weight:700;color:{INK};--d:{i + 2}">Se mide en:<br><span style="color:{ACENTO_TXT}">{metr}</span></div>'
    )
add("anatomia", "Anatomía de un guion", sec(
    eyebrow("Estructura")
    + titulo("Cada guion tiene estas 5 partes", size=56)
    + ah
    + p("Según Instagram, las tres señales que más pesan son el tiempo de visionado, los me gusta por alcance y los envíos por alcance. Fuentes al final.",
        128, 870, 1664, size=22, d=6, cls="muted")
    + foot(n),
))

# ── Tu casa como plató ───────────────────────────────────────────────────
CASA = {
    "piscina": "Terraza de la piscina",
    "ladrillo": "Porche de ladrillo",
    "porche": "Porche cubierto",
    "salon": "Salón de la chimenea",
    "bar": "Salón del bar y comedor",
    "recibidor": "Recibidor y escalera",
    "entrada": "Entrada principal",
    "fachada": "Fachada con el tobogán",
}


def foto_casa(x, y, w, h, k, d=0, r=16):
    return (f'<div class="abs pop" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:{r}px;'
            f'background:#ddd url(/pitch/level-up/casa/{k}.jpg) center/cover no-repeat;--d:{d}"></div>')


n += 1
esp = [
    ("piscina", "Enseñanza", "Suelo limpio, luz de día y fondo verde. Tu plató fijo para la mini serie «Si notas…»: siempre el mismo encuadre."),
    ("ladrillo", "Hablar a cámara", "Fondo cálido y sin distracciones. Para Mitos 35+ y Level Up."),
    ("porche", "Circuitos", "Espacio amplio y a cubierto: entrenos completos aunque llueva."),
    ("salon", "Humor e hijos", "La alfombra con juguetes ya es la «realidad» de tus vídeos de madre."),
    ("bar", "Sofá y cena", "Luz cálida de tarde-noche. Para el sofá y la cena con hidratos."),
    ("recibidor", "Puerta y escalera", "Para salir a correr, las agujetas y subir escaleras."),
]
ch = ""
for i, (k, uso, txt) in enumerate(esp):
    col_, fila = i % 3, i // 3
    x, y = 128 + col_ * 564, 270 + fila * 340
    ch += (
        foto_casa(x, y, 240, 300, k, d=i)
        + p(CASA[k], x + 262, y + 4, 280, size=24, d=i + 1, cls="", extra="font-weight:800;line-height:1.2;")
        + p(uso, x + 262, y + 72, 280, size=17, d=i + 1, cls="rosa", extra="font-weight:700;letter-spacing:.1em;text-transform:uppercase;")
        + p(txt, x + 262, y + 104, 280, size=19, d=i + 2, extra="line-height:1.4;")
    )
add("casa", "Tu casa como plató", sec(
    eyebrow("Cardedeu")
    + titulo("Tu casa como plató", size=56)
    + ch
    + p("Evita de fondo las estanterías de cerámica (distraen) y graba de espaldas al sol: en los porches, por la mañana, la luz entra de lado.",
        128, 950, 1664, size=19, d=8, cls="muted")
    + foot(n),
))

# ── Los 19 guiones ───────────────────────────────────────────────────────
# Cada guion: bloque, serie, pilar, objetivo (métrica), portada (foto, título),
# gancho (lo que dices), filas (tiempo, se ve, dices, texto), cierre, descripción.
G = [
    dict(bloque="Atracción", serie="Nivel 0", pilar="Atraer", obj="Que lo guarden y lo envíen", foto="pared",
         port="¿Espalda cargada?",
         gancho="«Si acabas el día con la espalda así, dame tres minutos»",
         filas=[
             ("0-3 s", "Entras en casa, sueltas la mochila del trabajo y te llevas la mano a la lumbar.", "«Si acabas el día con la espalda así, dame tres minutos.»", "¿Espalda cargada al final del día?"),
             ("3-11 s", "En cuadrupedia: gato-camello, lento.", "«Uno: gato-camello. Redondea y arquea despacio, siguiendo la respiración. Ocho veces.»", "1 · Gato-camello · 8 lentas"),
             ("11-19 s", "Tumbada de lado, rodillas juntas: libro abierto.", "«Dos: libro abierto. Abre el brazo y sigue la mano con la mirada. Seis por lado.»", "2 · Libro abierto · 6 por lado"),
             ("19-26 s", "Postura del niño llevando las manos hacia un lado.", "«Tres: postura del niño con las manos a un lado. Respira hacia las costillas, veinte segundos por lado.»", "3 · Niño con alcance · 20 s por lado"),
         ],
         cierre="«Guárdalo para esta noche y mándaselo a quien se pasa el día sentada.»",
         desc="Espalda cargada después de trabajar: 3 ejercicios de movilidad en casa, en 3 minutos. Si el dolor es fuerte o no se va, consulta con un profesional."),
    dict(bloque="Atracción", serie="¿Te ha pasado?", pilar="Atraer", obj="Que lo envíen", foto="minibanda",
         port="12 minutos bastan",
         gancho="«Tengo quince minutos… no me da tiempo a entrenar. ¿Seguro?»",
         filas=[
             ("0-3 s", "En el sofá, miras el reloj. Cara de «para qué».", "«Tengo quince minutos… no me da tiempo a entrenar.» (Pausa.) «¿Seguro?»", "Cuando crees que 15 minutos no dan para entrenar"),
             ("3-6 s", "Te levantas y pones un cronómetro de 12:00, visible en la esquina todo el vídeo.", "«Doce minutos: tres ejercicios, cuarenta segundos de trabajo y veinte de descanso.»", "40 s trabajo · 20 s descanso · 4 vueltas"),
             ("6-20 s", "Cortes rápidos de sentadilla, flexión con manos en el sofá y puente de glúteo. El reloj baja.", "(Voz en off) «Sentadilla. Flexión inclinada. Puente de glúteo.»", "Sentadilla · Flexión en el sofá · Puente"),
             ("20-24 s", "El cronómetro llega a 00:00. Te secas la cara y señalas el reloj del móvil.", "«Y aún te quedan tres minutos para la ducha.»", "Hecho. Y sobran 3 minutos."),
         ],
         cierre="«Mándaselo a esa amiga que siempre dice que no tiene tiempo.»",
         desc="Entreno en casa de 12 minutos sin material: 3 ejercicios, 4 vueltas. Para las que creen que no tienen tiempo para entrenar."),
    dict(bloque="Atracción", serie="Nivel 0", pilar="Atraer", obj="Comentarios con NIVEL0", foto="mancuernas",
         port="Tu entreno de 20'",
         gancho="«Si entrenas veinte minutos y no ves cambios, casi siempre es por una de estas tres cosas»",
         filas=[
             ("0-3 s", "A cámara, con tres dedos levantados. Sin saludo.", "«Si entrenas veinte minutos y no ves cambios, casi siempre es por una de estas tres cosas.»", "Tu entreno de 20' no funciona por esto"),
             ("3-11 s", "Sentadilla con mancuerna y remo.", "«Uno: haces ejercicios que mueven poco músculo. Prioriza los que trabajan mucho a la vez: sentadilla, peso muerto, remo, flexión.»", "1 · Ejercicios que trabajen mucho músculo"),
             ("11-18 s", "Mirando el móvil entre series ✗. Corte a un cronómetro ✓.", "«Dos: descansas sin control. Ponte un cronómetro: entre treinta segundos y un minuto.»", "2 · Descansos medidos"),
             ("18-27 s", "Coges una mancuerna más pesada.", "«Y tres: haces siempre lo mismo. Si cada semana no subes un poco el peso, las repeticiones o la dificultad, tu cuerpo no tiene motivo para cambiar.»", "3 · Un poco más cada semana"),
         ],
         cierre="«Si quieres un entreno de veinte minutos con estas tres claves, comenta NIVEL0 y te lo mando.»",
         desc="Entreno de 20 minutos que no da resultados: los 3 errores más comunes. Entrenamiento para mujeres que empiezan desde cero."),
    dict(bloque="Enseñanza", serie="Si notas… · 1/3", pilar="Enseñar", obj="Que lo guarden", foto="pared",
         port="Sentadilla sin glúteo",
         gancho="«Si haces sentadillas y solo las notas en los cuádriceps, mira esto»",
         filas=[
             ("0-3 s", "Pantalla dividida: tu sentadilla corta (✗) y la buena (✓), de perfil.", "«Si haces sentadillas y solo las notas en los cuádriceps, mira esto.»", "¿Sentadillas y no notas el glúteo?"),
             ("3-10 s", "La sentadilla corta, dos repeticiones.", "«El error más común: bajar poco. Con media sentadilla el glúteo apenas entra.»", "✗ Media sentadilla"),
             ("10-18 s", "La buena: cadera atrás, bajas más.", "«Lleva la cadera atrás y baja hasta que el muslo quede paralelo al suelo o un poco más, con el peso en todo el pie.»", "✓ Cadera atrás · bajar más"),
             ("18-24 s", "Sentadilla a una silla.", "«¿Te cuesta bajar? Usa una silla: siéntate sin dejarte caer y levántate empujando el suelo.»", "Si te cuesta: sentadilla a silla"),
         ],
         cierre="«Guárdalo y pruébalo en tu próximo entreno.»",
         desc="Sentadillas y no notas el glúteo: el error más común y cómo corregirlo. Ejercicios de glúteo para mujeres que empiezan."),
    dict(bloque="Enseñanza", serie="Si notas… · 2/3", pilar="Enseñar", obj="Que lo guarden", foto="mat",
         port="Abdominales sin cuello",
         gancho="«Si al hacer abdominales te duele el cuello, para»",
         filas=[
             ("0-3 s", "Haces un crunch tirando de la cabeza. Te frenas en seco y miras a cámara.", "«Si al hacer abdominales te duele el cuello, para.»", "¿Abdominales y te duele el cuello?"),
             ("3-10 s", "Repites el gesto con una flecha en las manos.", "«No es que tengas el cuello débil: estás tirando de la cabeza con las manos.»", "✗ Tirar del cuello"),
             ("10-17 s", "Crunch bien hecho.", "«Manos a los lados de la cabeza sin entrelazar, mirada al techo y suelta el aire al subir.»", "✓ Mirada al techo · soltar el aire"),
             ("17-26 s", "Dead bug, de lado y despacio.", "«Y si aun así lo notas, cámbialo por el dead bug: lumbar pegada al suelo y estira brazo y pierna contrarios.»", "Alternativa: dead bug"),
         ],
         cierre="«Guárdalo.»",
         desc="Abdominales con dolor de cuello: por qué pasa y cómo hacerlos bien. Y una alternativa para trabajar el abdomen sin molestias."),
    dict(bloque="Enseñanza", serie="Si notas… · 3/3", pilar="Enseñar", obj="Comentarios con NIVEL0", foto="puente",
         port="Puente sin lumbares",
         gancho="«Si en el puente de glúteo notas las lumbares, es por esto»",
         filas=[
             ("0-3 s", "Puente con la espalda arqueada y una flecha roja en la lumbar.", "«Si en el puente de glúteo notas las lumbares, es por esto.»", "¿Puente de glúteo y te cargan las lumbares?"),
             ("3-9 s", "Repites el puente arqueado.", "«Estás subiendo arqueando la espalda, no empujando con la cadera.»", "✗ Arquear la espalda"),
             ("9-17 s", "Antes de subir, bajas las costillas y metes la pelvis.", "«Antes de subir, baja las costillas y lleva el pubis hacia el ombligo.»", "✓ Costillas abajo · pelvis hacia ti"),
             ("17-25 s", "Puente bien hecho, pausa arriba.", "«Sube solo hasta que hombros, cadera y rodillas queden en línea, y aguanta dos segundos apretando el glúteo.»", "Sube menos · aguanta 2 s"),
         ],
         cierre="«Si quieres un entreno de glúteo para empezar desde cero, comenta NIVEL0 y te lo mando.»",
         desc="Puente de glúteo y dolor lumbar: el error y la corrección. Entrenamiento de glúteo en casa para principiantes."),
    dict(bloque="Enseñanza", serie="Nivel 0", pilar="Enseñar", obj="Comentarios", foto="clienta",
         port="Tu primera flexión",
         gancho="«Si todavía no puedes hacer una flexión, no empieces en el suelo»",
         filas=[
             ("0-3 s", "Intentas una flexión en el suelo y te quedas abajo. Risa a cámara.", "«Si todavía no puedes hacer una flexión, no empieces en el suelo.»", "¿Aún no te sale una flexión?"),
             ("3-10 s", "Flexión en la pared, cuerpo recto.", "«Empieza en la pared, con el cuerpo recto como una tabla. Cuanto más vertical, más fácil.»", "Nivel 1 · Pared"),
             ("10-17 s", "Manos en una mesa o silla estable.", "«Cuando hagas doce seguidas bien hechas, baja las manos a una mesa o una silla que no se mueva.»", "Nivel 2 · Mesa o silla"),
             ("17-24 s", "En el suelo con rodillas, luego completa.", "«Después al suelo con las rodillas apoyadas. Y cuando hagas doce… la primera completa.»", "Nivel 3 · Suelo"),
         ],
         cierre="«¿En qué nivel estás? Dímelo en comentarios y te digo cuándo subir.»",
         desc="Cómo hacer tu primera flexión si ahora no te sale ninguna: 3 niveles para progresar en casa."),
    dict(bloque="Conexión", serie="¿Te ha pasado?", pilar="Conectar", obj="Comentarios y envíos", foto="salto",
         port="Día 1 vs. día 4",
         gancho="Texto: «Día 1 en el gimnasio» (sin hablar)",
         filas=[
             ("0-4 s", "Lo das todo, exagerado: tres máquinas, cara de motivación máxima.", "—", "Día 1 en el gimnasio"),
             ("4-7 s", "Bajas las escaleras de lado por las agujetas.", "«Ay. Ay. Ay.»", "Día 2"),
             ("7-10 s", "En el sofá, con la bolsa del gimnasio sin abrir.", "—", "Día 4"),
             ("10-20 s", "Corte a cámara, plano cerrado.", "«No necesitas matarte el primer día. Necesitas tres entrenos de treinta minutos que puedas repetir cada semana.»", "La constancia gana a la intensidad"),
         ],
         cierre="«¿Te ha pasado? Cuéntamelo y te digo por dónde empezar.»",
         desc="¿Empiezas a entrenar con muchas ganas y lo dejas a la semana? No es falta de fuerza de voluntad: es empezar demasiado fuerte."),
    dict(bloque="Conexión", serie="Mitos 35+", pilar="Conectar", obj="Comentarios y envíos", foto="zancada",
         port="Más fuertes",
         gancho="«Nos han enseñado a querer ser más pequeñas, no más fuertes»",
         filas=[
             ("0-3 s", "Plano cerrado a cámara. Sin música encima.", "«Nos han enseñado a querer ser más pequeñas, no más fuertes.»", "Más fuertes, no más pequeñas"),
             ("3-10 s", "Sigues a cámara.", "«Barriga, cartucheras, kilos… y casi nadie nos habla de fuerza.»", "—"),
             ("10-20 s", "Planos tuyos entrenando con peso.", "«A partir de los treinta perdemos músculo poco a poco, y con la menopausia el proceso se acelera.»", "Desde los 30: −3 a 5 % de músculo cada 10 años"),
             ("20-30 s", "Planos cotidianos: escaleras, niño en brazos, la compra.", "«La fuerza es lo que te deja subir escaleras, coger a tus hijos o cargar la compra. Y también lo que da forma al cuerpo.»", "Fuerza = autonomía"),
         ],
         cierre="«¿Deberíamos hablar más de ganar fuerza y menos de perder kilos? Te leo.»",
         desc="Por qué las mujeres deberíamos hablar más de ganar fuerza y menos de perder peso. Entrenamiento para mujeres."),
    dict(bloque="Conexión", serie="Mitos 35+", pilar="Conectar", obj="Me gusta y comentarios", foto="libros",
         port="Lo que ojalá hubiera sabido",
         gancho="Texto: «5 cosas que me habría gustado saber cuando empecé a entrenar»",
         filas=[
             ("0-3 s", "Te atas las zapatillas. Número grande en pantalla.", "— (solo música y texto)", "5 cosas que me habría gustado saber cuando empecé a entrenar"),
             ("3-9 s", "Comiendo con calma / descansando en el sofá.", "—", "1 · No entrenas para compensar lo que comes · 2 · Descansar también es entrenar"),
             ("9-15 s", "Entreno corto en casa.", "—", "3 · No hace falta machacarse · 4 · Mejor 30 min tres días que 2 horas un día"),
             ("15-20 s", "Plato variado: proteína, legumbre, verdura.", "—", "5 · La clave no es comer menos: es comer de todo"),
         ],
         cierre="Texto: «¿Cuál te habría gustado saber a ti?»",
         desc="5 cosas que me habría gustado saber cuando empecé a entrenar. Graduada en Ciencias del Deporte y entrenadora de mujeres."),
    dict(bloque="Conexión", serie="¿Te ha pasado?", pilar="Atraer", obj="Envíos", foto="banda",
         port="1 hora vs. 20 minutos",
         gancho="Texto: «Si tienes una amiga que dice que no tiene tiempo para entrenar, mándale esto»",
         filas=[
             ("0-3 s", "Pantalla dividida con dos cronómetros.", "—", "Mándale esto a tu amiga que «no tiene tiempo»"),
             ("3-10 s", "Izquierda: móvil, descansos largos, de máquina en máquina. Derecha: circuito de 3 ejercicios.", "—", "1 hora sin plan · 20 minutos con plan"),
             ("10-15 s", "Derecha llega a 20:00 y se va a la ducha. Izquierda sigue en 47:00 mirando el móvil.", "—", "Menos tiempo, mejor aprovechado"),
         ],
         cierre="Texto: «Etiqueta a esa amiga».",
         desc="No necesitas una hora para entrenar: 20 minutos con un plan cunden más que una hora sin él."),
    dict(bloque="Educación", serie="Mitos 35+", pilar="Enseñar", obj="Comentarios con NIVEL0", foto="mancuernas",
         port="Fuerza después de los 35",
         gancho="«A partir de los treinta empiezas a perder músculo. Y si no haces nada, no para»",
         filas=[
             ("0-3 s", "A cámara, con una mancuerna en la mano.", "«A partir de los treinta empiezas a perder músculo. Y si no haces nada, no para.»", "Fuerza a partir de los 35"),
             ("3-12 s", "Corte a tus libros y apuntes de la carrera.", "«Hablamos de entre un tres y un cinco por ciento cada diez años. Y en la menopausia, los cambios hormonales lo aceleran.»", "−3 a 5 % de músculo por década"),
             ("12-22 s", "Entrenando con peso.", "«El entrenamiento de fuerza es lo que lo frena: protege tus músculos, tus huesos y tu autonomía.»", "Músculo · Huesos · Autonomía"),
             ("22-30 s", "A cámara.", "«La OMS recomienda trabajar la fuerza al menos dos días a la semana. No hace falta más para empezar.»", "Mínimo 2 días a la semana"),
         ],
         cierre="«Si nunca has hecho fuerza, comenta NIVEL0 y te enseño a empezar.»",
         desc="Por qué las mujeres deberíamos entrenar fuerza a partir de los 35: músculo, huesos y menopausia. Empieza desde cero."),
    dict(bloque="Educación", serie="Mitos 35+", pilar="Conectar", obj="Comentarios", foto="risa",
         port="Entrenar embarazada",
         gancho="«Entrené durante todo mi embarazo. Esto es lo que aprendí»",
         filas=[
             ("0-3 s", "Un vídeo tuyo entrenando embarazada.", "(Voz en off) «Entrené durante todo mi embarazo. Esto es lo que aprendí.»", "Entrené durante todo mi embarazo"),
             ("3-12 s", "Más vídeos tuyos embarazada.", "«La OMS recomienda moverse durante el embarazo, si no hay complicaciones: al menos ciento cincuenta minutos a la semana.»", "OMS: 150 min a la semana"),
             ("12-22 s", "Ejercicios adaptados según el trimestre.", "«No se trata de seguir igual: se adapta según el trimestre y según cómo te sientes cada día.»", "Adaptar, no parar"),
             ("22-30 s", "A cámara, hoy.", "«Y siempre con el visto bueno de tu ginecóloga o tu matrona.»", "Consulta siempre con tu profesional"),
         ],
         cierre="«¿Entrenaste durante tu embarazo? Cuéntame cómo te fue.»",
         desc="Entrenar durante el embarazo: lo que aprendí y lo que recomienda la OMS. Siempre con el visto bueno de tu ginecóloga o matrona."),
    dict(bloque="Educación", serie="Mitos 35+", pilar="Enseñar", obj="Comentarios", foto="risa",
         port="¿Hidratos en la cena?",
         gancho="«Cenar hidratos no te hace engordar»",
         filas=[
             ("0-3 s", "Comiendo un plato de pasta por la noche, mirando a cámara.", "«Cenar hidratos no te hace engordar.»", "¿Cenar hidratos engorda?"),
             ("3-12 s", "A cámara.", "«Lo que cuenta es lo que comes en todo el día, no la hora a la que lo comes.»", "Cuenta el total del día"),
             ("12-20 s", "Dos platos del día comparados en pantalla.", "«Las cantidades, la calidad y lo que haces cada día pesan mucho más que si la pasta es a las dos o a las nueve.»", "Cantidad · Calidad · Hábito"),
         ],
         cierre="«¿Qué mito te has creído durante años? Dímelo y hago un vídeo.»",
         desc="¿Cenar hidratos engorda? Lo que de verdad importa en tu alimentación si entrenas."),
    dict(bloque="Educación", serie="Nivel 0", pilar="Enseñar", obj="Que lo guarden", foto="puente",
         port="Glúteo: más que estética",
         gancho="«Tu glúteo no es solo estética: es lo que te levanta de la silla»",
         filas=[
             ("0-3 s", "Te levantas de una silla con esfuerzo.", "«Tu glúteo no es solo estética: es lo que te levanta de la silla.»", "Tu glúteo es más que estética"),
             ("3-10 s", "Subes escaleras con el glúteo marcado en pantalla.", "«Extiende la cadera para subir escaleras y estabiliza la pelvis cuando caminas.»", "Escaleras · Caminar · Levantarte"),
             ("10-22 s", "Tres ejercicios, 4 segundos cada uno.", "«Por eso estos tres: sentadilla a silla, subida a escalón y puente de glúteo.»", "Sentadilla a silla · Subida a escalón · Puente"),
         ],
         cierre="«Guárdalo para tu próximo entreno.»",
         desc="Para qué sirve el glúteo más allá de la estética, y 3 ejercicios para fortalecerlo en casa."),
    dict(bloque="Lifestyle + humor", serie="Expectativa vs. realidad", pilar="Atraer", obj="Envíos", foto="salto",
         port="Expectativa vs. realidad",
         gancho="Texto: «Expectativa: entrenar teniendo hijos»",
         filas=[
             ("0-4 s", "Expectativa: entreno perfecto, luz bonita, música tranquila.", "—", "Expectativa: entrenar teniendo hijos"),
             ("4-9 s", "Corte seco a la realidad: niño encima, esterilla ocupada, juguetes.", "—", "Realidad"),
             ("Serie", "Mismo formato con: organizar un viaje, ir a hacer kite e intentar grabar contenido.", "—", "Misma música y mismo texto en todos"),
         ],
         cierre="Texto: «¿Cuál hago la próxima?»",
         desc="Expectativa vs. realidad de entrenar teniendo hijos. Entrenadora y madre."),
    dict(bloque="Lifestyle + humor", serie="¿Te ha pasado?", pilar="Atraer", obj="Envíos", foto="mancuernas",
         port="Mis 20 minutos",
         gancho="Texto: «Cuando por fin tengo 20 minutos para entrenar»",
         filas=[
             ("0-4 s", "Te preparas con música épica: cascos, esterilla, mancuernas.", "—", "Cuando por fin tengo 20 minutos para entrenar"),
             ("4-6 s", "De fondo, una voz de niño.", "(Fuera de plano) «¡MAMIIII!»", "—"),
             ("6-9 s", "Dejas las mancuernas, miras a cámara con resignación… y gritas.", "«¡PAPIIII!» Y sigues entrenando.", "Organización familiar nivel experta"),
         ],
         cierre="Sin petición: el chiste se envía solo. Si acaso, texto final «Etiqueta a otra madre».",
         desc="Cuando por fin tienes 20 minutos para entrenar… Madres que entrenan, esto va por vosotras."),
    dict(bloque="Lifestyle + humor", serie="¿Te ha pasado?", pilar="Atraer", obj="Envíos", foto="zancada",
         port="Mi mayor motivación",
         gancho="Texto: «Mi mayor motivación cuando salgo a correr»",
         filas=[
             ("0-4 s", "En la puerta con las zapatillas puestas, dudando. Miras el sofá.", "—", "Mi mayor motivación cuando salgo a correr"),
             ("4-6 s", "De fondo, una voz de niño.", "(Fuera de plano) «¡MAMÁÁÁÁ!»", "—"),
             ("6-8 s", "Coges la puerta y sales corriendo.", "—", "30 minutos de silencio garantizados"),
         ],
         cierre="Texto final: «¿Te suena?». Publícalo al menos 2 semanas después del anterior: tienen la misma estructura.",
         desc="Mi mayor motivación para salir a correr. Si eres madre, lo entiendes."),
    dict(bloque="Level Up", serie="Dentro de Level Up", pilar="Convertir", obj="Comentarios con NIVEL0", foto="clienta",
         port="¿Una más barata?",
         gancho="«Me escribió una chica: “He pagado otra plataforma más barata”»",
         filas=[
             ("0-3 s", "Captura del mensaje, sin nombre ni foto. Tú leyéndolo.", "«Me escribió una chica: “He pagado otra plataforma más barata”.»", "«He pagado otra plataforma más barata»"),
             ("3-12 s", "A cámara.", "«Y lo entiendo. Pero una cosa es tener cientos de entrenos sueltos, y otra una planificación por niveles pensada para ti.»", "Entrenos sueltos ≠ un plan"),
             ("12-22 s", "3 segundos de Level Up por dentro: niveles, sesiones, seguimiento.", "«Llevo años entrenando a mujeres reales. Sé por dónde empezar y cuándo subir.»", "Niveles · Progresión · Seguimiento"),
             ("22-28 s", "A cámara.", "«No pagas por mil entrenos. Pagas para que te guíe.»", "No pagas por mil entrenos"),
         ],
         cierre="«Pruébalo cinco días gratis: comenta NIVEL0 y te mando el enlace.»",
         desc="Plataforma de entrenamiento online para mujeres: por qué no es lo mismo tener mil entrenos que un plan por niveles. 5 días gratis."),
]

# ── Contenido técnico: el de Lucía, tal cual lo describió ─────────────────
# Lo técnico (ejercicios, explicaciones, datos) no se toca: sale de su
# documento «PLAN DE CONTENIDOS». Donde ella no concretó, se deja a su elección.
T = "<i>(tú eliges)</i>"
G[0]["filas"][1:] = [
    ("3-11 s", "Movimiento 1 de movilidad torácica.", f"«Uno: …» Explicas el primer movimiento {T}.", "1 · Nombre del movimiento"),
    ("11-19 s", "Movimiento 2 de movilidad torácica o lumbar.", f"«Dos: …» {T}", "2 · Nombre del movimiento"),
    ("19-26 s", "Movimiento 3 de movilidad lumbar.", f"«Tres: …» Para aliviar la sensación de rigidez. {T}", "3 · Nombre del movimiento"),
]
G[1]["port"] = "15 minutos bastan"
G[1]["filas"][1:] = [
    ("3-6 s", "Te levantas y pones un cronómetro visible en la esquina todo el vídeo.", "«Tres ejercicios, entre diez y quince minutos.»", "3 ejercicios · 10-15 minutos"),
    ("6-20 s", f"Cortes rápidos del circuito {T}. El reloj baja.", "(Voz en off) El nombre de cada ejercicio.", "Ejercicio 1 · 2 · 3"),
    ("20-24 s", "El cronómetro llega a cero. Te secas la cara y señalas el reloj del móvil.", "«Y aún te sobra tiempo para la ducha.»", "Hecho."),
]
G[1]["desc"] = "Entreno en casa de 10-15 minutos: un circuito de 3 ejercicios. Para las que creen que no tienen tiempo para entrenar."
G[2]["filas"][1:] = [
    ("3-11 s", "Plano tuyo entrenando que ilustre la clave.", f"«Uno: …» La primera de tus 3 claves {T}.", "1 · Tu primera clave"),
    ("11-18 s", "Plano que ilustre la segunda.", f"«Dos: …» {T}", "2 · Tu segunda clave"),
    ("18-27 s", "Plano que ilustre la tercera.", f"«Y tres: …» {T}", "3 · Tu tercera clave"),
]
G[2]["cierre"] = "«¿Quieres un ejemplo de entreno así? Comenta NIVEL0 y te lo mando.»"
G[2]["desc"] = "Las 3 claves para que tu entreno de 20 minutos sea efectivo. Entrenamiento para mujeres que empiezan desde cero."
G[3]["filas"][1:] = [
    ("3-14 s", "Sentadilla con mayor profundidad, de perfil.", "«Baja más.» Explicas cómo la profundidad puede influir en el estímulo del glúteo.", "✓ Más profundidad"),
    ("14-24 s", "Sentadilla a cajón.", "«Si tienes limitaciones de movilidad, prueba la sentadilla a cajón.»", "Alternativa: sentadilla a cajón"),
]
G[3]["desc"] = "Sentadillas y no notas el glúteo: cómo influye la profundidad, y una alternativa si tienes limitaciones de movilidad."
G[4]["filas"][1:] = [
    ("3-10 s", "Repites el error.", "«Este es el error que podemos cometer al hacer abdominales.»", "✗ El error"),
    ("10-17 s", "Abdominal con la posición corregida.", "Explicas cómo corregir la posición.", "✓ Así sí"),
    ("17-26 s", "Dead bug.", "«Y como alternativa: el dead bug.»", "Alternativa: dead bug"),
]
G[4]["desc"] = "Abdominales y solo notas el cuello: el error, cómo corregir la posición y el dead bug como alternativa."
G[5]["filas"][1:] = [
    ("3-9 s", "Repites el puente arqueando demasiado.", "«El error: arquear demasiado la espalda.»", "✗ Arquear demasiado"),
    ("9-17 s", "Puente controlando pelvis y costillas.", "Explicas cómo controlar la pelvis y las costillas.", "✓ Controla pelvis y costillas"),
    ("17-25 s", "Puente con un recorrido más corto.", "«Y si aun así lo notas: recorrido más corto.»", "Alternativa: recorrido más corto"),
]
G[5]["desc"] = "Puente de glúteo y notas las lumbares: el error, cómo controlar pelvis y costillas y una alternativa con recorrido más corto."
G[6]["gancho"] = "«¿Todavía no puedes hacer una flexión? Empieza por aquí»"
G[6]["filas"] = [
    ("0-3 s", "Intentas una flexión y te quedas abajo. Risa a cámara.", "«¿Todavía no puedes hacer una flexión? Empieza por aquí.»", "¿Aún no te sale una flexión?"),
    ("3-10 s", "Una flexión convencional bien hecha.", "«Esta es una flexión convencional.»", "La flexión convencional"),
    ("10-17 s", "Planos de la musculatura implicada.", "Explicas qué musculatura necesitas trabajar.", "Qué tienes que trabajar"),
    ("17-25 s", "Flexión inclinada con las manos en una silla o un banco estable.", "«Para empezar: flexiones inclinadas, con las manos en una silla o un banco estable.»", "Empieza inclinada"),
]
G[6]["cierre"] = "«¿Ya te sale una flexión o aún no? Dímelo en comentarios.»"
G[6]["desc"] = "¿Todavía no puedes hacer una flexión? Qué tienes que trabajar y cómo empezar con flexiones inclinadas."
G[7]["filas"][3] = ("10-20 s", "Corte a cámara, plano cerrado.", "«¿No sería mejor tener tres entrenos adaptados, realmente efectivos, de treinta minutos?»", "3 entrenos de 30' que puedas mantener")
G[8]["filas"][1:] = [
    ("3-12 s", "Sigues a cámara.", "«Nos obsesiona perder barriga, cartucheras o peso…»", "Barriga · Cartucheras · Kilos"),
    ("12-22 s", "Planos tuyos entrenando con peso.", "«…y se nos olvida lo importante que es ganar fuerza.»", "¿Y la fuerza?"),
    ("22-32 s", "Planos cotidianos: escaleras, niño en brazos, la compra.", "«Mantener nuestras capacidades físicas mejora nuestro físico y nuestra salud.»", "Más fuerza = más salud"),
]
G[9]["filas"][3] = ("15-20 s", "Plato variado: proteína, legumbre, verdura y fruta.", "—", "5 · La clave no es comer menos: es comer de todo (y dejar menos sitio a la comida basura)")
G[11]["gancho"] = "«¿Por qué es tan importante que las mujeres entrenemos fuerza?»"
G[11]["filas"] = [
    ("0-3 s", "A cámara, con una mancuerna en la mano.", "«¿Por qué es tan importante que las mujeres entrenemos fuerza?»", "Fuerza a partir de los 35"),
    ("3-12 s", "Corte a tus libros y apuntes de la carrera.", "«Para mantener la masa muscular…»", "1 · Masa muscular"),
    ("12-20 s", "Entrenando con peso.", "«…mejorar la salud ósea…»", "2 · Salud ósea"),
    ("20-30 s", "A cámara.", "«…y conservar nuestra autonomía. Sobre todo a partir de los 35-40 y en la transición a la menopausia.»", "3 · Autonomía"),
]
G[12]["filas"][1:] = [
    ("3-12 s", "Más vídeos tuyos embarazada.", "«En un embarazo sin complicaciones, el ejercicio ayuda a mantener la condición física, trabajar la fuerza y sentirte mejor.»", "Condición física · Fuerza · Bienestar"),
    ("12-22 s", "Ejercicios adaptados.", "«Lo importante es adaptar el entrenamiento a cada etapa y a cada situación.»", "Adaptar a cada etapa"),
]
G[12]["desc"] = "¿Por qué entrenar durante el embarazo? Lo que aprendí entrenando en el mío. Siempre con el visto bueno de tu ginecóloga o matrona."
G[13]["filas"][1:] = [
    ("3-12 s", "A cámara.", "«Importa mucho más el conjunto de tu alimentación.»", "Importa el conjunto"),
    ("12-20 s", "Dos platos del día comparados en pantalla.", "«Las cantidades, la calidad nutricional y los hábitos que mantienes.»", "Cantidad · Calidad · Hábitos"),
]
G[14]["filas"][1:] = [
    ("3-12 s", "Subes escaleras, caminas, te levantas de una silla.", "«El glúteo extiende la cadera, estabiliza la pelvis y te ayuda a moverte.»", "Extensión de cadera · Pelvis · Movimiento"),
    ("12-22 s", "Las tres situaciones, una tras otra.", "«Por eso lo usas para subir escaleras, caminar o levantarte de una silla.»", "Escaleras · Caminar · Levantarte"),
]
G[18]["filas"][1:] = [
    ("3-12 s", "A cámara.", "«El problema es que estaba comparando dos plataformas que no tienen nada que ver.»", "No es lo mismo"),
    ("12-22 s", "3 segundos de Level Up por dentro.", "«Una cosa es tener acceso a cientos de entrenamientos sueltos, y otra muy distinta tener una planificación bien ordenadita pensada por mí, que llevo años formándome y trabajando con mujeres reales.»", "Entrenos sueltos ≠ un plan"),
    ("22-28 s", "A cámara.", "«Esa es la diferencia: no pagas por mil entrenos, pagas para que yo te guíe en tu proceso.»", "No pagas por mil entrenos"),
]

# ── Propuestas técnicas en gris (Lucía las valida o cambia) ─────────────
def gr(t):
    return f'<span class="prop" style="color:#A19C96;font-weight:500">{t}</span>'


SIN_VOZ = '<span style="color:#8A8580;font-weight:400">Sin voz: música + texto en pantalla</span>'
G[0]["filas"][1:] = [
    ("3-11 s", "Movimiento 1 de movilidad torácica.", "«Uno: " + gr("gato-camello. Redondea y arquea despacio, ocho veces.") + "»", gr("1 · Gato-camello")),
    ("11-19 s", "Movimiento 2 de movilidad torácica.", "«Dos: " + gr("libro abierto. Abre el brazo y síguelo con la mirada, seis por lado.") + "»", gr("2 · Libro abierto")),
    ("19-26 s", "Movimiento 3 de movilidad lumbar.", "«Tres: " + gr("postura del niño con las manos a un lado, veinte segundos por lado.") + "» Para aliviar la sensación de rigidez.", gr("3 · Postura del niño")),
]
G[1]["filas"][2] = ("6-20 s", "Cortes rápidos del circuito. El reloj baja.", "(Voz en off) " + gr("«Sentadilla. Flexión inclinada en el sofá. Puente de glúteo.»"), gr("Sentadilla · Flexión inclinada · Puente"))
G[2]["filas"][1:] = [
    ("3-11 s", "Plano tuyo entrenando que ilustre la clave.", "«Uno: " + gr("ejercicios que trabajen mucho músculo a la vez: sentadilla, remo, flexión.") + "»", gr("1 · Ejercicios completos")),
    ("11-18 s", "Plano que ilustre la segunda.", "«Dos: " + gr("descansos medidos, entre treinta segundos y un minuto.") + "»", gr("2 · Descansos medidos")),
    ("18-27 s", "Plano que ilustre la tercera.", "«Y tres: " + gr("subir un poco cada semana: peso, repeticiones o dificultad.") + "»", gr("3 · Un poco más cada semana")),
]
G[4]["filas"][2] = ("10-17 s", "Abdominal con la posición corregida.", "«" + gr("Manos a los lados de la cabeza, mirada al techo y suelta el aire al subir.") + "»", "✓ Así sí")
G[5]["filas"][2] = ("9-17 s", "Puente controlando pelvis y costillas.", "«" + gr("Antes de subir, baja las costillas y lleva la pelvis hacia ti.") + "»", "✓ Controla pelvis y costillas")
G[6]["filas"][2] = ("10-17 s", "Planos de la musculatura implicada.", "«" + gr("Para hacerla necesitas pecho, tríceps y un core que mantenga el cuerpo recto.") + "»", gr("Pecho · Tríceps · Core"))
for g in G:
    g["filas"] = [(a, b, (SIN_VOZ if c.startswith("—") else c), d) for a, b, c, d in g["filas"]]

LUG = [
    ("salon", "Todo en el salón: la llegada con la mochila y los movimientos en la alfombra."),
    ("bar", "Sofá del salón del bar. El circuito, ahí mismo: la flexión, con las manos en el sofá."),
    ("porche", "Porche cubierto: espacio para enseñar cada clave entrenando."),
    ("piscina", "Terraza de la piscina. Mismo encuadre en los 3 de la mini serie."),
    ("piscina", "Terraza de la piscina, mismo encuadre que el anterior."),
    ("piscina", "Terraza de la piscina, mismo encuadre que los anteriores."),
    ("ladrillo", "Porche de ladrillo: la silla y la mesa para la flexión inclinada."),
    ("salon", "Día 1: salón. Día 2: la escalera del recibidor. Día 4: el sofá."),
    ("ladrillo", "Porche de ladrillo, plano cerrado. Los planos cotidianos, en la escalera del recibidor."),
    ("bar", "Planos de ti por la casa: zapatillas en el recibidor, comida en el comedor, entreno en la terraza."),
    ("salon", "Salón de la chimenea, las dos mitades en el mismo sitio."),
    ("ladrillo", "Porche de ladrillo, a cámara. Los libros, en el salón."),
    ("salon", "Montaje con tus vídeos de embarazada del Drive y voz en off."),
    ("bar", "Mesa del comedor junto al bar, por la noche y con las lámparas encendidas."),
    ("recibidor", "La escalera del recibidor para subir escaleras. Los ejercicios, en la terraza de la piscina."),
    ("salon", "Realidad: la alfombra del salón con los juguetes. Otra opción: el tobogán de la fachada."),
    ("salon", "Alfombra del salón de la chimenea, con los juguetes alrededor."),
    ("recibidor", "Puerta del recibidor, en selfie."),
    ("ladrillo", "Porche de ladrillo, el mismo fondo que en Mitos 35+."),
]
# ── Cambios acordados con Lucía en la reunión del 25 nov ────────────────
SIN_VOZ_ = SIN_VOZ
# 01 · Espalda
G[0]["gancho"] = "«¿Te duele aquí cuando acabas el día?»"
G[0]["hooks"] = [
    ("En el salón: sueltas la mochila de trabajar, te llevas la mano a la lumbar y haces una mueca.",
     "«¿Te duele aquí cuando acabas el día?» Y sin pausa: «Haz esto antes de cenar.»"),
    ("El mismo plano, grabado aparte: sueltas la mochila, mano a la lumbar y mueca.",
     "«¿Terminas el día con dolor de espalda?» Y sin pausa: «Haz esto antes de cenar.»"),
]
G[0]["desc"] = "Dolor de espalda después de trabajar o de un día con niños: 3 movimientos de movilidad para hacer en casa antes de cenar. Si el dolor es fuerte o no se va, consulta con un profesional."
G[0]["port"] = "¿Te duele aquí?"
# 02 · 15 minutos: hora de inicio y de fin en vez de cronómetro fijo
G[1]["filas"][1] = ("3-6 s", "Te levantas. En pantalla, la hora a la que empiezas.", "«Tres ejercicios, entre diez y quince minutos.»", "Empiezo: 18:00")
G[1]["filas"][3] = ("20-24 s", "Cortes rápidos hasta el final. En pantalla, la hora a la que terminas.", "«Y aún te sobra tiempo para la ducha.»", "Termino: 18:15")
G[1]["hooks"] = [
    ("En el sofá, miras el reloj. Cara de «para qué».",
     "«Tengo quince minutos… no me da tiempo a entrenar.» (Pausa.) «¿Seguro?»"),
    ("El mismo plano, grabado aparte: en el sofá, miras el reloj.",
     "«¿Tienes quince minutos libres y piensas que no te da tiempo a entrenar?» Y sin pausa: «Haz esto todas las noches.»"),
]
G[1]["cierre"] = "«Mándaselo a esa persona que siempre dice que no tiene tiempo.»"
# 03 · 20': el cierre invita a comentar para corregir
G[2]["obj"] = "Comentarios"
G[2]["gancho"] = "«Las tres claves para que tu entreno de veinte minutos sea efectivo.»"
G[2]["filas"][0] = ("0-3 s", "A cámara, con tres dedos levantados. Sin saludo.",
                    "«Las tres claves para que tu entreno de veinte minutos sea efectivo.»", "3 claves para tu entreno de 20'")
G[2]["cierre"] = "«¿Quieres un ejemplo de entreno de veinte minutos con estas tres claves? Coméntamelo y te lo preparo.»"
G[2]["filas"] = [(a, (b + " En edición, planos de apoyo." if i else b), c, d) for i, (a, b, c, d) in enumerate(G[2]["filas"])]
# 04 · Sentadilla: voz en off y pantalla partida
G[3]["filas"][0] = ("0-3 s", "Plano tuyo tocándote el cuádriceps, con cara de molestia.", "(Voz en off) «Si haces sentadillas y solo las notas en los cuádriceps, mira esto.»", "¿Sentadillas y no notas el glúteo?")
G[3]["hooks"] = [
    ("Plano tuyo tocándote el cuádriceps, con cara de molestia.",
     "(Voz en off) «Si haces sentadillas y solo las notas en los cuádriceps, mira esto.»"),
    ("El mismo plano, grabado aparte: te tocas el cuádriceps, con cara de molestia.",
     "(Voz en off) «¿Haces sentadillas y no notas que trabajen los glúteos?»"),
]
G[3]["filas"][1:] = [
    ("3-14 s", "Te grabas haciendo una sentadilla con mayor profundidad, de perfil.",
     "Explicas cómo la profundidad puede influir en el estímulo del glúteo.", "Más profundidad"),
    ("14-24 s", "Te grabas haciendo la alternativa: sentadilla a cajón.",
     "«Si tienes limitaciones de movilidad, prueba la sentadilla a cajón.»", "Alternativa: sentadilla a cajón"),
]
# 05 · Abdominales: la alternativa, por palabra clave
G[4]["filas"] = G[4]["filas"][:3]
G[4]["obj"] = "Comentarios con palabra clave"
G[4]["cierre"] = "«¿Quieres una alternativa para no notarlo nada? Comenta ABDOMEN y te la mando.» (Con las respuestas, sale otro vídeo.)"
G[4]["desc"] = "Abdominales y solo notas el cuello: el error y cómo corregir la posición. Comenta ABDOMEN y te mando el dead bug."
G[4]["hooks"] = [
    ("Haces un crunch tirando de la cabeza. Te frenas en seco y miras a cámara.",
     "«Si al hacer abdominales te duele el cuello, para.»"),
    ("El mismo plano, grabado aparte: crunch tirando de la cabeza, te frenas y miras a cámara.",
     "«¿Haces abdominales y solo notas el cuello?»"),
]
G[4]["filas"].insert(1, ("", "A cámara.", "«Quédate hasta el final del vídeo para saber cómo solucionarlo.»", ""))
G[4]["cierre"] = "«Comenta ABDOMEN y te envío un vídeo del dead bug, mi ejercicio de abdominales favorito.»"
# 08 · Día 1 vs. día 4, en casa
G[7]["gancho"] = "Texto: «Día 1 entrenando en casa» (sin hablar)"
G[7]["filas"] = [
    ("0-4 s", "En el salón, con todo el material fuera (esterilla, mancuernas, banda), dándolo todo, exagerado.", SIN_VOZ_, "Día 1 entrenando en casa"),
    ("4-7 s", "Bajas la escalera del recibidor de lado, por las agujetas.", "«Ay. Ay. Ay.»", "Día 2"),
    ("7-10 s", "En el sofá, con la esterilla enrollada en un rincón.", SIN_VOZ_, "Día 4"),
    ("10-20 s", "Corte a cámara, plano cerrado.", "«¿No sería mejor tener tres entrenos adaptados, realmente efectivos, de treinta minutos?»", "3 entrenos de 30' que puedas mantener"),
]
G[7]["desc"] = "¿Empiezas a entrenar en casa con muchas ganas y lo dejas a la semana? No es falta de fuerza de voluntad: es empezar demasiado fuerte."
G[7]["hooks"] = [
    ("En el salón, con todo el material fuera (esterilla, mancuernas, banda), dándolo todo, exagerado.",
     "<b>(Voz en off)</b> «Día uno: lo das todo.»"),
    ("El mismo plano, grabado aparte: en el salón con todo el material fuera, dándolo todo.",
     "<b>(Voz en off)</b> «¿Cuántas veces has empezado a entrenar con muchas ganas y lo has acabado dejando?»"),
]
G[7]["filas"][1] = ("4-7 s", "Bajas la escalera del recibidor de lado, por las agujetas.",
                    "<b>(En directo, mientras bajas)</b> «Ay. Ay. Ay.»", "Día 2")
G[7]["filas"][2] = ("7-10 s", "En el sofá, con la esterilla enrollada en un rincón.",
                    "<b>(Voz en off)</b> «Y al cuarto día, ni te acuerdas de la esterilla.»", "Día 4")
G[7]["filas"][3] = ("10-20 s", "Corte a cámara, plano cerrado.",
                    "<b>(A cámara)</b> «¿No sería mejor tener tres entrenos adaptados, realmente efectivos, de treinta minutos?»", "")
G[7]["cierre"] = "<b>(A cámara)</b> «¿Te ha pasado? Cuéntamelo y te ayudo.»"
# 09 · Más directo
G[8]["gancho"] = "«Deja de intentar ser más pequeña. Empieza a ser más fuerte»"
G[8]["gancho"] = "«¿Por qué nos preocupa tanto adelgazar y tan poco ganar fuerza?»"
G[8]["filas"] = [
    ("0-3 s", "Plano cerrado a cámara. Sin música encima.", "", ""),
    ("3-30 s", "A cámara.", "Desarrollas tu reflexión a cámara, con tus palabras. No hace falta guionizarla: tiene que salir de ti de forma natural.", ""),
]
G[8]["cierre"] = "<b>(A cámara)</b> «¿Deberíamos hablar más de ganar fuerza y menos de perder kilos? Te leo.»"
G[8]["hooks"] = [
    ("Plano cerrado a cámara. Sin música encima.", "<b>(A cámara)</b> «¿Por qué nos preocupa tanto adelgazar y tan poco ganar fuerza?»"),
    ("El mismo plano, grabado aparte.", "<b>(A cámara)</b> «Deja de intentar perder kilos. Empieza a ser más fuerte.»"),
]
G[8]["ref"] = "guion09"
# 10 · 5 cosas: «la última es la mejor» y voz en off
G[9]["gancho"] = "Texto: «5 cosas que me habría gustado saber cuando empecé a entrenar (la última es la mejor)»"
G[9]["filas"] = [(a, b, ("(Voz en off) Lees cada punto." if i else "(Voz en off) «Cinco cosas que me habría gustado saber cuando empecé a entrenar. La última es la mejor.»"), (d + " (la última es la mejor)" if i == 0 else d)) for i, (a, b, c, d) in enumerate(G[9]["filas"])]
G[9]["filas"] = [(t, (ve + " <b>Todo el vídeo va en voz en off: no hablas a cámara.</b>" if i == 0 else ve), dice.replace("(Voz en off)", "<b>(Voz en off)</b>"), txt) for i, (t, ve, dice, txt) in enumerate(G[9]["filas"])]
G[9]["cierre"] = "<b>(Sin hablar)</b> Texto en pantalla: «¿Cuál te habría gustado saber a ti?»"
# 11 · Replanteado en casa
G[10]["port"] = "Sin plan vs. con plan"
G[10]["filas"] = [
    ("0-3 s", "Pantalla partida, las dos en el salón.", SIN_VOZ_, "Mándale esto a tu amiga que «no tiene tiempo»"),
    ("3-10 s", "Izquierda: buscas un vídeo en el móvil, cambias de idea, recoges, vuelves a buscar. Derecha: abres Level Up y empiezas el circuito.", SIN_VOZ_, "20 minutos sin plan · 20 minutos con plan"),
    ("10-15 s", "Derecha: entreno terminado, te vas a la ducha. Izquierda: sigues eligiendo vídeo.", SIN_VOZ_, "El tiempo lo tenías. Te faltaba el plan."),
]
G[10]["desc"] = "No te falta tiempo para entrenar en casa: te falta un plan. 20 minutos con plan cunden más que una hora buscando qué hacer."
G[10]["filas"] = [
    ("0-3 s", "En el salón, a cámara. Plano fijo con el móvil apoyado.",
     "<b>(A cámara)</b> «Si tienes una amiga que siempre dice que no tiene tiempo para entrenar, mándale esto.»", ""),
    ("3-10 s", "Sentada en el sofá, pasando vídeos en el móvil. Plano fijo.",
     "<b>(Voz en off)</b> «Una hora buscando qué entreno hacer, cambiando de idea a cada vídeo…»", ""),
    ("10-18 s", "Entrenando en la esterilla del salón. Plano fijo, el mismo encuadre.",
     "<b>(Voz en off)</b> «…o veinte minutos con un plan: sabes lo que toca y lo haces.»", ""),
    ("18-22 s", "A cámara, plano cerrado.", "<b>(A cámara)</b> «No te falta tiempo. Te falta un plan.»", ""),
]
G[10]["cierre"] = "<b>(A cámara)</b> «Mándaselo y que empiece hoy.»"
# 13 · Embarazo: montaje con tu material del Drive
G[12]["filas"] = [(a, b.replace("Un vídeo tuyo", "Vídeo tuyo del Drive").replace("Más vídeos tuyos", "Más vídeos tuyos del Drive").replace("Ejercicios adaptados.", "Planos del Drive, entrenando embarazada."), c, d) for a, b, c, d in G[12]["filas"]]
G[12]["filas"] = [(a, b, ("(Voz en off) " + c if not c.startswith("(Voz") else c), d) for a, b, c, d in G[12]["filas"]]
PLANOS_EMB = "Tus vídeos entrenando embarazada. <b>Los necesitamos para montar el vídeo: súbelos al Drive.</b>"
G[12]["hooks"] = [
    (PLANOS_EMB, "<b>(Voz en off)</b> «¿Por qué deberíamos entrenar durante el embarazo?»"),
    ("Otro plano tuyo entrenando embarazada, para la segunda versión.", "<b>(Voz en off)</b> «Entrené durante todo mi embarazo. Esto es lo que aprendí.»"),
]
G[12]["filas"] = [G[12]["filas"][0]] + [
    (t, "Más vídeos tuyos entrenando embarazada.", dice.replace("(Voz en off)", "<b>(Voz en off)</b>"), txt)
    for (t, ve, dice, txt) in G[12]["filas"][1:]
]
G[12]["ctas"] = [
    ("<b>Lo único que grabas en vídeo:</b> tú a cámara, en el salón. La voz en off, solo el audio con el móvil.",
     "<b>(A cámara)</b> «¿Entrenaste durante tu embarazo? Cuéntame cómo te fue.»"),
]
# 14 · Hidratos: balance calórico del día
G[13]["filas"][1] = ("3-12 s", "A cámara, en la mesa del comedor.", "«Lo que cuenta es el balance calórico de todo el día, no la hora a la que comes.»", "Cuenta el balance del día")
# 16 · Expectativa vs. realidad con tu hijo
G[15]["filas"][1] = ("4-9 s", "Corte seco a la realidad: haces un ejercicio en el suelo y tu hijo aparece y se te sube encima, sin preparar.", SIN_VOZ_, "Realidad")
# 17 · Música épica en edición
G[16]["filas"][0] = ("0-4 s", "Te preparas: cascos, esterilla, mancuernas. Música épica en edición.", SIN_VOZ_, "Cuando por fin tengo 20 minutos para entrenar")
# 18 · Selfie con tu hijo
G[17]["filas"] = [
    ("0-4 s", "Selfie con la cámara frontal, como un vídeo casual: zapatillas puestas, dudando en la puerta.", SIN_VOZ_, "Mi mayor motivación cuando salgo a correr"),
    ("4-6 s", "Tu hijo aparece o te llama de fondo, sin preparar.", "(Él) «¡MAMÁÁÁÁ!»", "—"),
    ("6-8 s", "Sales corriendo, cámara movida.", SIN_VOZ_, "30 minutos de silencio garantizados"),
]
G[17]["cierre"] = "Texto final: «¿Te suena?». El final puede salir sobre la marcha: si sale mejor otra cosa, se usa."

for g, im in zip(G, ["g01","g02","g03","pared","g05","g06","g07","g08","g09","g10","g11","g12","mat","pasta","g15","g16","g17","g18","clienta"]):
    g["foto"] = im
for g, (k, t) in zip(G, LUG):
    g["lugar"], g["lugar_txt"] = k, t
G[8]["lugar_txt"] = "Porche de ladrillo, plano cerrado a cámara."
G[10]["lugar_txt"] = "Todo en el salón, con el móvil fijo. Planos sencillos: sofá, esterilla y a cámara."
G[11]["filas"] = [
    ("0-3 s", "A cámara, plano cerrado.", "<b>(A cámara)</b> «¿Por qué es tan importante que las mujeres entrenemos fuerza?»", ""),
    ("3-30 s", "A cámara.", "Desarrollas tu reflexión a cámara, improvisando con tus palabras. No hace falta guionizarla: tiene que salir de ti de forma natural.", ""),
]
G[11]["cierre"] = "<b>(A cámara)</b> «Si nunca has hecho fuerza, comenta NIVEL0 y te enseño a empezar.»"
G[11]["ref"] = "guion09"
G[11]["lugar_txt"] = "Porche de ladrillo, plano cerrado a cámara."
G[12]["lugar_txt"] = "Montaje con tus vídeos de embarazada. Solo grabas el cierre a cámara, en el salón."
G[13]["hooks"] = [
    ("A cámara, en la mesa del comedor.", "<b>(A cámara)</b> «¿Por qué lo que cenamos no es tan importante como creemos?»"),
    ("Grabado aparte: comiendo un plato de pasta por la noche, mirando a cámara.", "<b>(A cámara)</b> «Cenar hidratos no te hace engordar.»"),
]
G[13]["filas"] = [G[13]["filas"][0], (
    "3-40 s", "A cámara, en la mesa del comedor.",
    "Lo explicas tú, con tus palabras. Expláyate lo que necesites, pero de forma ordenada: primero el mito, "
    "después lo que importa de verdad y, al final, una conclusión clara.", "")]
G[13]["ctas"] = [
    ("A cámara.", "<b>(A cámara)</b> «¿Qué mito te has creído durante años? Dímelo y hago un vídeo.»"),
    ("El mismo cierre, grabado aparte, a cámara.", "<b>(A cámara)</b> «Hay muchos mitos sobre la alimentación. ¿Cuál te gustaría que comentase?»"),
]
G[14]["hooks"] = [
    ("Te levantas de una silla con esfuerzo.", "«Tu glúteo no es solo estética: es lo que te levanta de la silla.»"),
    ("Grabado aparte: a cámara, plano cerrado.", "<b>(A cámara)</b> «¿Por qué entrenar los glúteos es importante más allá de lo estético?»"),
]
G[14]["cierre"] = "«Guarda este vídeo para tu próximo entreno.»"

# 06 y 07 · dos versiones del hook
G[5]["hooks"] = [
    ("Puente con la espalda arqueada y una flecha roja en la lumbar.",
     "«Si en el puente de glúteo notas las lumbares, es por esto.»"),
    ("El mismo plano, grabado aparte: puente con la espalda arqueada.",
     "«¿Haces puentes de glúteo y notas más las lumbares?»"),
]
G[6]["hooks"] = [
    ("Intentas una flexión y te quedas abajo. Risa a cámara.",
     "«¿Todavía no puedes hacer una flexión? Empieza por aquí.»"),
    ("El mismo plano, grabado aparte: intentas una flexión y te quedas abajo.",
     "«¿No eres capaz de hacer bien una flexión?»"),
]
G[6]["filas"][3] = ("17-25 s", "Flexión inclinada con las manos en una silla o un banco estable.",
                    "«Y como verás, la solución son las flexiones inclinadas: con las manos en una silla o un banco estable.»", "Empieza inclinada")
G[6]["ctas"] = [
    ("A cámara.", G[6]["cierre"]),
    ("El mismo cierre, grabado aparte, a cámara.", "«Prueba este ejercicio y escríbeme si sigues teniendo problemas para hacer flexiones.»"),
]

for i, g in enumerate(G):
    n += 1
    num = i + 1
    add(f"guion-{num:02d}", f"Guion {num:02d}", sec(
        FUENTES
        + eyebrow(f"Guion {num:02d} de {len(G)} · {g['bloque']}")
        + pill(g["pilar"], 128, 166, PILAR[g["pilar"]], d=0)
        + p(f"Serie: {g['serie']} · Objetivo: <b>{g['obj']}</b> · Dónde: <b>{CASA[g['lugar']]}</b>", 300, 168, 1250, size=20, d=0, cls="muted")
        + tabla(g["filas"], 128, 230, 1150 if g.get("ref") else 1400, d=1, cierre=g["cierre"], hooks=g.get("hooks"), ctas=g.get("ctas"))
        + (video_ref(1318, 230, 222, 395, g["ref"], d=2) + p("Referencia · dale al play", 1318, 637, 222, size=15, d=2, cls="muted", extra="text-align:center;") if g.get("ref") else "")
        + portada(1592, 128, 200, g["foto"], g["serie"].split(" · ")[0], g["port"], d=1)
        + p("Portada", 1592, 492, 200, size=15, d=1, cls="muted", extra="text-align:center;")
        + foto_casa(1592, 540, 200, 130, g["lugar"], d=2, r=12)
        + (p("<span style='color:#A19C96'>■</span> En gris: propuesta técnica. Cámbiala si quieres.", 1592, 790, 200, size=14, d=2, extra="line-height:1.35;color:#8A8580;") if 'class="prop"' in "".join(c for f in g["filas"] for c in f) else "")
        + p(g['lugar_txt'], 1592, 682, 200, size=15, d=2, extra="line-height:1.35;")
        + p(f"<b style='color:{ACENTO_TXT};letter-spacing:.1em;font-size:14px'>DESCRIPCIÓN</b>&nbsp;&nbsp;{g['desc']}", 128, 930, 1400, size=17, d=3, cls="muted", extra="line-height:1.4;")
        + foot(n),
    ))

# ── Laponia ──────────────────────────────────────────────────────────────
n += 1
lap = [
    ("1 entreno en Laponia (1 reel) + stories",
     "Un entreno grabado allí para un reel. En stories, el mensaje: no hay excusas para no entrenar, aunque estés de viaje."),
    ("Expectativa vs. realidad: el gimnasio",
     "Lo que esperas del gimnasio del hotel y lo que te encuentras, y por qué prefieres entrenar en la habitación antes que en ese gimnasio rancio. Grábalo tú y luego vemos si el montaje va para stories o para reel."),
]
lh = ""
for i, (t, txt) in enumerate(lap):
    y = 320 + i * 230
    lh += (
        f'<p class="abs a disp outline" style="left:128px;top:{y}px;font-size:44px;line-height:1;--d:{i + 1}">0{i + 1}</p>'
        + p(t, 240, y - 4, 1000, size=28, d=i + 1, cls="", extra="font-weight:800;")
        + p(txt, 240, y + 48, 980, size=23, d=i + 2, extra="line-height:1.45;")
    )
add("laponia", "Laponia", sec(
    eyebrow("Del 3 al 7 de diciembre")
    + titulo("Qué grabar en Laponia", size=56)
    + lh
    + f'<div class="abs pop" style="left:1340px;top:300px;width:452px;padding:36px;border-radius:24px;background:{ACENTO};--d:5">'
      f'<div style="font-size:18px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#3A2F2F">Antes de irte</div>'
      f'<div style="font-size:26px;font-weight:800;color:{INK};margin-top:10px;line-height:1.3">Deja programados los 3 reels de esa semana.</div>'
      f'<div style="font-size:20px;color:#3A2F2F;margin-top:16px;line-height:1.4">Allí grabas para las semanas siguientes y para historias, sin la presión de publicar en el momento.</div></div>'
    + foot(n),
))

# ── Orden de publicación ─────────────────────────────────────────────────
n += 1
sem = [
    ("Este domingo", "29 nov", [("Dom 29", "04 · Sentadilla sin glúteo (1/3)")]),
    ("Semana de Laponia", "1-6 dic · programada", [("Mar 1", "05 · Abdominales sin cuello (2/3)"), ("Jue 3", "06 · Puente sin lumbares (3/3)"), ("Dom 6", "17 · Mis 20 minutos (¡MAMIIII!)")]),
    ("Vuelta", "8-13 dic", [("Mar 8", "12 · Fuerza después de los 35"), ("Jue 10", "Laponia · Entreno a −25 °C"), ("Dom 13", "02 · 15 minutos bastan")]),
    ("Antes de Navidad", "15-20 dic", [("Mar 15", "09 · Más fuertes"), ("Jue 17", "19 · ¿Una más barata?"), ("Dom 20", "18 · Mi mayor motivación")]),
]
oh = ""
for i, (t, f, items) in enumerate(sem):
    x = 128 + i * 424
    oh += (
        card(x, 290, 396, 520, d=i)
        + p(t, x + 30, 320, 340, size=26, d=i + 1, cls="", extra="font-weight:800;")
        + p(f, x + 30, 360, 340, size=18, d=i + 1, cls="rosa", extra="font-weight:700;letter-spacing:.08em;text-transform:uppercase;")
    )
    for k, (dia, g) in enumerate(items):
        y = 430 + k * 120
        oh += (p(dia, x + 30, y, 340, size=18, d=i + 2, cls="muted", extra="font-weight:700;")
               + p(g, x + 30, y + 28, 336, size=22, d=i + 2, cls="", extra="font-weight:700;line-height:1.25;"))
add("orden", "Orden de publicación", sec(
    eyebrow("Calendario · martes, jueves y domingo")
    + titulo("Por dónde empezar", size=56)
    + oh
    + p("La mini serie «Si notas…» va seguida para que quien vea una busque las otras. Humor, enseñanza y conexión, mezclados cada semana. El resto de guiones, en enero.",
        128, 850, 1664, size=22, d=6, cls="muted")
    + foot(n),
))

# ── Separador identidad ──────────────────────────────────────────────────
n += 1
add("identidad", "Tu identidad", sec(
    eyebrow("Segunda parte", k=True)
    + titulo("Tu identidad en Instagram", top=380, size=80, width=1100)
    + p("Una bio pensada para que te encuentren y una estética mínima que se repite en todas las portadas y subtítulos. Todo sale de los colores y la tipografía de tu web.",
        128, 560, 1000, size=30, d=2, cls="", extra="color:#3A2F2F;line-height:1.35;")
    + foot(n),
    bg=ACENTO, color=INK,
))


def perfil(x, y, w, foto_css, nombre, bio_html, d=0):
    return (
        f'<div class="abs pop" style="left:{x}px;top:{y}px;width:{w}px;padding:34px;border-radius:26px;background:#fff;'
        f'border:1px solid #E7E2DB;box-shadow:0 14px 40px rgba(0,0,0,.06);{POP}--d:{d}">'
        f'<div style="display:flex;gap:26px;align-items:center"><div style="width:120px;height:120px;border-radius:50%;flex:none;{foto_css}"></div>'
        f'<div><div style="font-size:24px;font-weight:600;color:{INK}">lucia_entrenadorapersonal</div>'
        f'<div style="font-size:17px;color:#555;margin-top:6px">517 publicaciones · 26,3 mil seguidores</div></div></div>'
        f'<div style="font-size:19px;font-weight:600;color:{INK};margin-top:22px">{nombre}</div>'
        f'<div style="font-size:15px;color:#8A8580;margin-top:2px">Entrenador</div>'
        f'<div style="font-size:19px;line-height:1.5;color:{INK};margin-top:6px">{bio_html}</div>'
        f'<div style="font-size:18px;font-weight:600;color:#1E3A8A;margin-top:10px">🔗 levelup.luciaentrenadorapersonal.com</div></div>'
    )


FOTO_HOY = "background:url(/pitch/level-up/marca/perfil-actual.png) center/cover no-repeat;"
FOTO_NUEVA = f"background:#eee url({WEB}{FOTOS['risa']}) -{round(1800*.46) - 60}px -{round(1092*.30) - 74}px/1800px 1092px no-repeat;"
FOTO_NUEVA_GRANDE = f"background:#eee url({WEB}{FOTOS['risa']}) -{round(2600*.46) - 210}px -{round(1577*.30) - 190}px/2600px 1577px no-repeat;"

# ── Biografía (SEO) ──────────────────────────────────────────────────────
n += 1
bio_hoy = ("🎓 Graduada en Ciencias del Deporte<br>💪 Especializada en entrenamiento femenino<br>"
           "✨ Founder of LEVELUPWORKOUT<br>🏡 Empieza desde cero<br>👇 PRUEBA 5 DÍAS GRATIS 🎁")
bio_nueva = ("🎓 Graduada en Ciencias del Deporte<br>Entrenamiento para mujeres online, en casa y desde cero<br>"
             "✨ Founder de Level Up Workout<br>👇 Prueba 5 días gratis")
add("bio", "Biografía", sec(
    FUENTES
    + eyebrow("Identidad · Biografía y búsqueda")
    + titulo("Una bio para que te encuentren", size=56)
    + label("Hoy", 128, 280, d=1, color="#8A8580")
    + perfil(128, 320, 780, FOTO_HOY, "Lucía | Entrenadora Personal", bio_hoy, d=1)
    + label("Propuesta", 1012, 280, d=2)
    + perfil(1012, 320, 780, FOTO_NUEVA, "Lucía | Entrenadora personal para mujeres", bio_nueva, d=2)
    + lista([
        "<b>El nombre es lo que más se busca</b>: Instagram empareja la búsqueda con el texto del nombre de usuario y del nombre. «Entrenadora personal para mujeres» es lo que escribe tu clienta (41 de 64 caracteres).",
        "<b>La bio con palabras clave</b>: mujeres, online, en casa, desde cero. Es lo que Instagram recomienda para salir en búsquedas (140 de 150 caracteres).",
        "<b>Un solo enlace</b>, directo a la prueba gratis. Y las mismas palabras clave en la descripción de cada reel.",
    ], 128, 790, 1664, size=20, d=4, gap=8)
    + foot(n),
))

# ── Foto de perfil ───────────────────────────────────────────────────────
n += 1
add("fotoperfil", "Foto de perfil", sec(
    eyebrow("Identidad · Foto de perfil")
    + titulo("Que se te vea la cara", size=56)
    + f'<div class="abs pop" style="left:128px;top:320px;width:300px;height:300px;border-radius:50%;{FOTO_HOY}--d:1"></div>'
    + p("Hoy", 128, 640, 300, size=22, d=1, cls="muted", extra="text-align:center;font-weight:700;")
    + f'<div class="abs pop" style="left:128px;top:720px;width:60px;height:60px;border-radius:50%;{FOTO_HOY}--d:2"></div>'
    + p("Así se ve en comentarios e historias: no se distingue quién eres.", 210, 724, 330, size=18, d=2, cls="muted")
    + f'<div class="abs pop" style="left:640px;top:280px;width:380px;height:380px;border-radius:50%;{FOTO_NUEVA_GRANDE}--d:2"></div>'
    + p("Ejemplo con una foto de tu web", 640, 680, 380, size=22, d=2, cls="rosa", extra="text-align:center;font-weight:700;")
    + f'<div class="abs pop" style="left:640px;top:720px;width:60px;height:60px;border-radius:50%;{FOTO_NUEVA}background-size:300px 182px;background-position:-{round(300*.46) - 30}px -{round(182*.30) - 32}px;--d:3"></div>'
    + p("En pequeño se te sigue reconociendo.", 722, 734, 330, size=18, d=3, cls="muted")
    + label("Cómo hacerla", 1180, 290, d=3)
    + lista([
        "<b>Cara y hombros</b>: el círculo mide menos de 1 cm en el móvil.",
        "<b>Sonriendo y mirando a cámara</b>: transmite cercanía, que es lo que vendes.",
        "<b>Fondo claro y liso</b>, sin mar ni paisaje que distraiga.",
        "<b>Ropa melocotón o azul noche</b>, los colores de Level Up.",
        "<b>La misma foto</b> en Instagram, en la web y en WhatsApp.",
    ], 1180, 336, 612, size=22, d=4, gap=14)
    + foot(n),
))

# ── Estética: colores y tipografía ───────────────────────────────────────
n += 1
col = [
    (NOCHE, "Azul noche", "#151F30", "Texto y fondos sin foto. Es el azul de tu web.", "#fff"),
    (MELO, "Melocotón", "#FFCB9A", "Solo para destacar: una palabra, un detalle.", NOCHE),
    (ROTO, "Blanco roto", "#F7F3EE", "Texto sobre fotos y fondos limpios.", NOCHE),
]
cc = ""
for i, (c, nom, hx, uso, tinta) in enumerate(col):
    x = 128 + i * 300
    cc += (
        f'<div class="abs pop" style="left:{x}px;top:300px;width:272px;height:300px;border-radius:24px;background:{c};border:1px solid #E7E2DB;--d:{i}"></div>'
        + p(nom, x + 26, 500, 230, size=26, d=i + 1, cls="", extra=f"font-weight:800;color:{tinta};")
        + p(hx, x + 26, 542, 230, size=18, d=i + 1, cls="", extra=f"color:{tinta};opacity:.8;letter-spacing:.06em;")
        + p(uso, x + 4, 620, 264, size=19, d=i + 2)
    )
add("estetica", "Colores y tipografía", sec(
    FUENTES
    + eyebrow("Identidad · Estética")
    + titulo("Tres colores y una tipografía", size=56)
    + cc
    + card(1060, 300, 732, 460, d=2)
    + p("Tipografía única", 1100, 334, 660, size=18, d=3, cls="rosa", extra="font-weight:700;letter-spacing:.12em;text-transform:uppercase;")
    + f'<p class="abs a" style="left:1100px;top:376px;width:660px;{POP}font-weight:700;font-size:96px;line-height:1;color:{NOCHE};--d:3">Poppins</p>'
    + f'<p class="abs a" style="left:1100px;top:500px;width:660px;{POP}font-size:24px;line-height:1.5;color:{NOCHE};--d:4">'
      f'<b style="font-weight:700">Bold</b> para títulos de portada<br><span style="font-weight:600">Semibold</span> para subtítulos<br>'
      f'<span style="font-weight:500">Medium</span> para la etiqueta de la serie</p>'
    + p("Es la misma de tu web, así Instagram y Level Up se ven como una sola marca. Gratuita (Google Fonts).",
        1100, 660, 660, size=19, d=4, cls="muted")
    + p("Fuera: contornos de colores, azules eléctricos, tipografías condensadas y mayúsculas en todo. Menos elementos, más reconocible.",
        128, 860, 1664, size=22, d=6, cls="", extra="font-weight:700;")
    + foot(n),
))

# ── Portadas ─────────────────────────────────────────────────────────────
n += 1
add("plantillas", "Portadas", sec(
    FUENTES
    + eyebrow("Identidad · Portadas")
    + titulo("Una sola plantilla de portada", size=56)
    + portada(128, 280, 290, "pared", "Si notas…", "Sentadilla sin glúteo", d=1)
    + portada(448, 280, 290, "g12", "Mitos 35+", "Fuerza después de los 35", d=2)
    + portada(768, 280, 290, "clienta", "Dentro de Level Up", "¿Una más barata?", d=3)
    + portada(1088, 280, 290, "g17", "¿Te ha pasado?", "Mis 20 minutos", d=4)
    + lista([
        "<b>Siempre igual</b>: foto tuya, el nombre de la serie en pequeño y un título de 2-4 palabras.",
        "<b>Título en el centro exacto</b>: así se ve entero en el recorte 3:4 de tu perfil.",
        "<b>Poppins Bold en blanco</b>, sin cajas ni contornos.",
        "<b>Siempre una persona</b>: tú, tu cuerpo o una clienta. Fotos en color y nada de imágenes de stock.",
    ], 1420, 290, 372, size=20, d=5, gap=14)
    + foot(n),
))

# ── Subtítulos ───────────────────────────────────────────────────────────
n += 1
sub_mock = (
    f'<div class="abs pop" style="left:1300px;top:150px;width:380px;height:676px;border-radius:26px;overflow:hidden;'
    f'background:#ddd url({WEB}{FOTOS["pared"]}) center/cover no-repeat;box-shadow:0 18px 44px rgba(21,31,48,.22);--d:2">'
    f'<div style="position:absolute;left:30px;right:30px;top:430px;text-align:center;{POP}font-weight:600;font-size:27px;line-height:1.25;'
    f'color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.55)">lleva la cadera atrás<br>y <span style="color:{MELO}">baja un poco más</span></div>'
    f'<div style="position:absolute;left:0;right:0;bottom:0;height:120px;background:repeating-linear-gradient(45deg,rgba(255,255,255,.18) 0 10px,rgba(255,255,255,0) 10px 20px)"></div>'
    f'<div style="position:absolute;left:0;right:0;bottom:126px;text-align:center;font-size:13px;color:#fff;opacity:.85;{POP}">zona que tapan los botones</div></div>'
)
add("subtitulos", "Subtítulos", sec(
    FUENTES
    + eyebrow("Identidad · Subtítulos")
    + titulo("Tus subtítulos", size=56)
    + lista([
        "<b>Poppins Semibold, blanco</b>, con una sombra suave para que se lea sobre cualquier fondo.",
        "<b>Las palabras clave en melocotón</b>, sin cajas de fondo.",
        "<b>Máximo 2 líneas y 5-6 palabras por línea</b>, en minúscula.",
        "<b>Centrados, un poco por debajo de la mitad</b>: ni encima de tu cara ni en la zona que tapan los botones de Instagram.",
        "<b>Siempre puestos</b>: así se entiende el vídeo aunque se vea sin sonido.",
    ], 128, 300, 960, size=25, d=2, gap=22)
    + sub_mock
    + foot(n),
))

# ── Fuentes ──────────────────────────────────────────────────────────────
n += 1
fts = [
    ("Qué mide Instagram", "Adam Mosseri, responsable de Instagram (2025): las tres señales que más pesan son tiempo de visionado, me gusta por alcance y envíos por alcance. Los envíos, sobre todo para llegar a gente que no te sigue.",
     "<a href=\"https://www.socialmediatoday.com/news/instagram-shares-algorithm-2025/738034/\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit\">socialmediatoday.com</a> · <a href=\"https://www.searchenginejournal.com/instagram-algorithm-shift-why-sends-matter-more-than-ever/521389/\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit\">searchenginejournal.com</a>"),
    ("Los primeros segundos", "Guías de Instagram para creadores: los primeros segundos de un vídeo «lo deciden todo». Tutoriales y rutinas, entre 15 y 60 segundos.",
     "<a href=\"https://socialmediatoday.com/news/instagram-shares-tips-on-video-creation/827172\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit\">socialmediatoday.com (guía de Instagram)</a> · <a href=\"https://www.socialmediatoday.com/news/instagram-shares-reels-creation-tips-in-new-guide/\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit\">guía de reels</a>"),
    ("Cuánto publicar", "Investigación interna de Instagram (cuenta @creators): los creadores que más crecen publican más de 10 reels al mes.",
     "<a href=\"https://buffer.com/resources/instagram-reels-instructions-and-ideas-for-small-businesses/\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit\">buffer.com</a>"),
    ("Búsqueda", "Blog oficial de Instagram: la búsqueda empareja texto. Recomienda un nombre adecuado y palabras clave en la bio y en las descripciones.",
     "<a href=\"https://about.instagram.com/blog/announcements/break-down-how-instagram-search-works/\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit\">about.instagram.com · «Breaking Down How Instagram Search Works»</a>"),
    ("Contenido original", "Instagram premia el contenido original en recomendaciones: el 75 % de lo que recomienda en EE. UU. ya es original (abril de 2026).",
     "<a href=\"https://creators.instagram.com/blog/rewarding-original-creators-on-instagram\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit\">creators.instagram.com</a>"),
    ("Perfil en 3:4", "Desde 2025 el perfil muestra las portadas en vertical 3:4: el título tiene que caber en ese recorte.",
     "<a href=\"https://petapixel.com/2025/01/23/instagram-swaps-square-profile-grids-for-rectangles/\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit\">petapixel.com</a> · <a href=\"https://www.kapwing.com/resources/instagrams-new-grid-layout-size-and-dimensions-2025/\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit\">kapwing.com</a>"),
    ("Tus propios datos", "Tu informe de mayo a octubre: el reel de la piscina (104K) es el que más seguidoras trajo (511) y más se guardó (1.690).",
     "Informe de Instagram que nos pasaste"),
]
fh = ""
for i, (t, txt, src) in enumerate(fts):
    col_, fila = i % 2, i // 2
    x, y = 128 + col_ * 852, 270 + fila * 176
    fh += (
        p(t, x, y, 790, size=22, d=fila + 1, cls="", extra="font-weight:800;")
        + p(txt, x, y + 34, 790, size=18, d=fila + 1, extra="line-height:1.4;")
        + p(src, x, y + 116, 790, size=15, d=fila + 1, cls="rosa", extra="font-weight:700;")
    )
add("fuentes", "De dónde sale todo esto", sec(
    eyebrow("Fuentes")
    + titulo("De dónde sale todo esto", size=56)
    + fh
    + foot(n),
))

# ── Cierre ───────────────────────────────────────────────────────────────
n += 1
add("cierre", "Cierre", sec(
    f'<div class="abs" style="left:1180px;top:0;width:740px;height:1080px;background:url(/pitch/level-up/portadas-src/g16.jpg) center/cover no-repeat"></div>'
    + '<div class="abs" style="left:1180px;top:0;width:220px;height:1080px;background:linear-gradient(90deg,#FFFFFF,rgba(255,255,255,0))"></div>'
    + titulo("Ahora, a grabar", top=330, size=80, width=1040)
    + p("Primero la bio, la foto y la plantilla de portada. Con eso listo, los guiones de esta semana.",
        128, 540, 960, size=30, d=2, cls="rosa", extra="line-height:1.35;font-weight:700;")
    + '<div class="abs a" style="left:128px;top:760px;font-size:28px;line-height:1.5;--d:3">'
    '<p style="font-weight:800">Jandro Martín · Maen Studios</p>'
    '<p><a href="mailto:jandro@maenstudios.com" style="color:inherit">jandro@maenstudios.com</a> · +34 688 629 688</p>'
    "</div>"
    + foot(n),
))

out = Path("app/pitch/level-up-propuestas/diapos.ts")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(
    "/**\n * Guiones estratégicos e identidad de Instagram para Level Up Workout (nov 2026).\n"
    " * Generado con scripts/build-level-up-propuestas.py: si cambia el contenido,\n"
    " * se edita el script y se vuelve a ejecutar.\n */\n\n"
    'import type { DiapoHtml } from "../maen-plan-100k/diapos";\n\n'
    "export const DIAPOS: DiapoHtml[] = "
    + json.dumps(slides, ensure_ascii=False, indent=2)
    + ";\n",
    encoding="utf-8",
)
print(len(slides), "diapositivas")
