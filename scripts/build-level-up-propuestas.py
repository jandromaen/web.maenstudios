"""Guiones desarrollados e identidad visual para Lucía (Level Up Workout).

Genera app/pitch/level-up-propuestas/diapos.ts. Reutiliza los helpers y el
modo claro de build-level-up-contenido.py.

    python3 scripts/build-level-up-propuestas.py
"""
import json
from pathlib import Path

_src = Path("scripts/build-level-up-contenido.py").read_text(encoding="utf-8")
exec(_src.split("\n# ── 1. Portada")[0])

OMITIR = set()  # aquí no se omite ninguna diapositiva
NOCHE = "#151F30"      # azul noche de la web de Level Up
MELO = "#FFCB9A"       # melocotón de la web
ROTO = "#F7F3EE"       # blanco roto
SALVIA = "#6E7552"     # verde de su esterilla
PILAR = {"Atraer": "#3E6FA8", "Enseñar": ACENTO, "Conectar": "#2F8A6A", "Convertir": AZUL}

FUENTES = (
    "<style>@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;800"
    "&family=Playfair+Display:ital,wght@1,600&display=swap');</style>"
)
POP = "font-family:'Poppins',sans-serif;"
PLAY = "font-family:'Playfair Display',serif;font-style:italic;"


def movil(x, y, w, k, pos, serie, linea1, linea2, d=0, fondo=None):
    """Portada de reel con la plantilla propuesta (9:16)."""
    h = round(w * 16 / 9)
    fondo_css = (f"background:{fondo};" if fondo
                 else f"background:#ddd url({WEB}{FOTOS[k]}) {pos}/cover no-repeat;")
    f1 = round(w * 0.088)
    return (
        f'<div class="abs pop" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:22px;overflow:hidden;'
        f'{fondo_css}box-shadow:0 18px 44px rgba(21,31,48,.22);--d:{d}">'
        + ("" if fondo else
           '<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(21,31,48,0) 38%,rgba(21,31,48,.78) 82%)"></div>')
        + f'<div style="position:absolute;left:{round(w*.07)}px;top:{round(h*.2)}px;padding:{round(w*.012)}px {round(w*.03)}px;'
          f'border-radius:999px;background:{MELO};color:{NOCHE};{POP}font-weight:800;font-size:{round(w*.036)}px;'
          f'letter-spacing:.08em;text-transform:uppercase">{serie}</div>'
        + f'<div style="position:absolute;left:{round(w*.07)}px;right:{round(w*.07)}px;top:{round(h*.56)}px;{POP}'
          f'font-weight:800;font-size:{f1}px;line-height:1.02;color:#fff;text-transform:uppercase;letter-spacing:-.01em">'
          f'{linea1}<br><span style="color:{MELO}">{linea2}</span></div>'
        + "</div>"
    )


def pill(t, x, y, c, d=0):
    return (f'<div class="abs a" style="left:{x}px;top:{y}px;padding:4px 14px;border-radius:999px;background:{c};'
            f'color:{INK};font-size:16px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;--d:{d}">{t}</div>')


# ── Portada ──────────────────────────────────────────────────────────────
n += 1
add("portada", "Guiones e identidad", sec(
    FUENTES
    + foto(1060, 0, 860, 1080, "mat", d=0, pos="center", radius=0)
    + '<div class="abs" style="left:1060px;top:0;width:260px;height:1080px;background:linear-gradient(90deg,#FFFFFF,rgba(255,255,255,0))"></div>'
    + eyebrow("Level Up Workout · Contenido", top=200)
    + '<h1 class="abs a disp" style="left:128px;top:250px;font-size:96px;line-height:1;--d:1">19 guiones</h1>'
    '<h1 class="abs a disp outline" style="left:128px;top:362px;font-size:60px;line-height:1.12;--d:2">y tu nueva<br>identidad</h1>'
    + p("Tus ideas de reels, desarrolladas para que enganchen en los primeros segundos, y la propuesta de bio, foto de perfil, colores, tipografías, subtítulos y portadas.",
        128, 560, 860, size=30, d=3, cls="", extra="font-weight:800;line-height:1.3;")
    + p("Jandro Martín · noviembre de 2026", 128, 820, 700, size=22, d=4, cls="muted")
    + foot(n),
))

# ── Cómo he trabajado tus ideas ──────────────────────────────────────────
n += 1
cambios = [
    ("La primera frase es el gancho", "Lo que se dice y se lee en los 2 primeros segundos decide si se quedan. Por eso cada guion empieza por ahí."),
    ("Cada vídeo tiene un objetivo", "Enseñanza → que lo guarden. Humor → que lo compartan. Conexión → que comenten. Level Up → que escriban NIVEL0."),
    ("Mini serie «Si notas…, es esto»", "Las ideas 4, 5 y 6 comparten estructura y portada. Tres vídeos seguidos crean costumbre y se ven entre ellos."),
    ("Tu duda: ¿expectativa vs. realidad está muy visto?", "La versión genérica, sí. Funciona cuando la realidad es la tuya: hijos, kite, viajes. Por eso lo planteo como serie propia."),
]
ch = ""
for i, (t, txt) in enumerate(cambios):
    col, fila = i % 2, i // 2
    x, y = 128 + col * 852, 300 + fila * 300
    ch += (
        card(x, y, 812, 270, d=i)
        + f'<p class="abs a disp rosa" style="left:{x + 36}px;top:{y + 32}px;font-size:40px;--d:{i + 1}">0{i + 1}</p>'
        + p(t, x + 120, y + 36, 650, size=28, d=i + 1, cls="", extra="font-weight:800;line-height:1.2;")
        + p(txt, x + 120, y + 100, 650, size=22, d=i + 2)
    )
add("enfoque", "Cómo he trabajado tus ideas", sec(
    eyebrow("Tus 19 ideas")
    + titulo("Lo que he cambiado y por qué", size=56)
    + ch
    + p("Son una base: cuando los grabes, dilo con tus palabras. Lo importante es mantener el gancho, el orden y el cierre.",
        128, 920, 1664, size=22, d=6, cls="muted")
    + foot(n),
))

# ── Los 19 guiones ───────────────────────────────────────────────────────
G = [
    # (bloque, serie, pilar, foto, pos, portada1, portada2, gancho, plano, desarrollo[], cierre, porque, duración)
    ("Atracción", "Nivel 0", "Atraer", "pared", "center",
     "¿Espalda cargada?", "3 movimientos",
     "«Si acabas el día con la espalda así… dame 3 minutos»",
     "Llegas a casa, sueltas la mochila del trabajo y te llevas la mano a la lumbar. Ese gesto lo reconoce cualquiera.",
     ["<b>Gato-camello</b>: 8 repeticiones lentas, con el nombre en pantalla.",
      "<b>Libro abierto</b> (rotación torácica tumbada de lado): 6 por lado.",
      "<b>Postura del niño con alcance lateral</b>: 20 segundos por lado.",
      "Un corte por repetición: el vídeo no se para nunca."],
     "«Guárdalo para esta noche.» Y en el texto: «Si quieres la rutina completa, comenta NIVEL0».",
     "Un dolor que tu público tiene hoy y la solución en menos de 30 segundos: es lo que más se guarda y se comparte.",
     "25-30 s"),
    ("Atracción", "¿Te ha pasado?", "Atraer", "minibanda", "center",
     "15 minutos", "son suficientes",
     "«Cuando tienes 15 minutos libres y piensas que no te da tiempo a entrenar»",
     "En el sofá, miras el móvil: 15:00. Cara de «para qué». Aparece una cuenta atrás en la esquina.",
     ["Te levantas y el cronómetro empieza en <b>15:00</b>, visible todo el vídeo.",
      "3 vueltas de <b>sentadilla, flexión inclinada en el sofá y puente de glúteo</b>.",
      "Acelera el ritmo de los cortes: el reloj baja a la vista."],
     "Terminas con el reloj en 04:00: «Y aún te sobra para la ducha». Texto: «Mándaselo a quien siempre dice que no tiene tiempo».",
     "El cronómetro en pantalla hace que la gente se quede hasta el final para ver si llegas. Y pedir que lo compartan te lleva fuera de tus seguidoras.",
     "20-25 s"),
    ("Atracción", "Nivel 0", "Atraer", "mancuernas", "center",
     "Tu entreno de 20'", "no funciona por esto",
     "«Si entrenas 20 minutos y no ves cambios, es por una de estas 3 cosas»",
     "A cámara, con tres dedos levantados. Sin introducción: la primera palabra ya es la promesa.",
     ["<b>1. Ejercicios que trabajen mucho músculo a la vez</b> (sentadilla, peso muerto, flexión), no aislados.",
      "<b>2. Descansos cortos y medidos</b>: 30-45 segundos, no mirar el móvil.",
      "<b>3. Subir la dificultad cada semana</b>: más peso, más repeticiones o menos descanso.",
      "Cada clave con un plano tuyo haciéndolo."],
     "«¿Quieres un entreno de 20 minutos con estas 3 claves? Comenta NIVEL0 y te lo mando.»",
     "Decir «no funciona por esto» da más curiosidad que «3 claves». Y la pregunta final de tu idea la convertimos en la palabra clave que lleva a Level Up.",
     "25-35 s"),
    ("Enseñanza", "Nivel 0", "Enseñar", "pared", "center",
     "Sentadilla", "sin notar el glúteo?",
     "«Si haces sentadillas y solo notas las piernas, es esto»",
     "Pantalla dividida: a la izquierda tu sentadilla corta con una ✗; a la derecha la buena con un ✓.",
     ["<b>El error</b>: bajar poco y con la cadera debajo. Lo señalas en el vídeo.",
      "<b>La corrección</b>: cadera atrás, bajar más y empujar con todo el pie.",
      "<b>Si te cuesta la movilidad</b>: sentadilla a cajón o a silla, mismo gesto."],
     "«Pruébalo en tu próximo entreno y dime si lo notas.» Texto: «Guárdalo».",
     "El ✗/✓ en pantalla dividida es el formato de enseñanza que más se guarda. Primero de la mini serie «Si notas…, es esto».",
     "20-25 s"),
    ("Enseñanza", "Nivel 0", "Enseñar", "mat", "center",
     "Abdominales", "sin dolor de cuello",
     "«Si haces abdominales y te duele el cuello, para»",
     "Haces un crunch tirando de la cabeza con las manos. Te frenas en seco y miras a cámara.",
     ["<b>Por qué pasa</b>: tiras del cuello en lugar de usar el abdomen.",
      "<b>Cómo corregirlo</b>: mirada al techo, espacio entre mentón y pecho, soltar el aire al subir.",
      "<b>La alternativa</b>: dead bug, paso a paso, con la lumbar pegada al suelo."],
     "«Cámbialo hoy y verás la diferencia.» Texto: «Guárdalo».",
     "«Para» es una orden, y una orden frena el scroll. Segundo de la mini serie, misma portada que el anterior.",
     "20-30 s"),
    ("Enseñanza", "Nivel 0", "Enseñar", "puente", "center",
     "Puente de glúteo", "sin lumbares",
     "«Si en el puente de glúteo notas las lumbares, es esto»",
     "Puente con la espalda arqueada y una flecha roja señalando la lumbar.",
     ["<b>El error</b>: subir arqueando la espalda en lugar de empujar con la cadera.",
      "<b>La corrección</b>: costillas abajo, pelvis hacia ti y subir menos.",
      "<b>El truco</b>: aguantar 2 segundos arriba apretando el glúteo."],
     "«Comenta NIVEL0 y te paso el entreno de glúteo para empezar desde cero.»",
     "Cierra la mini serie con la palabra clave: quien ha visto los tres ya confía en ti.",
     "20-25 s"),
    ("Enseñanza", "Nivel 0", "Enseñar", "clienta", "center",
     "Tu primera", "flexión",
     "«Si todavía no puedes hacer una flexión, empieza aquí»",
     "Intentas una flexión en el suelo y te quedas abajo (de verdad). Risa a cámara.",
     ["<b>Nivel 1</b>: flexión en la pared.",
      "<b>Nivel 2</b>: manos en una silla o un banco estable.",
      "<b>Nivel 3</b>: en el suelo con las rodillas apoyadas.",
      "<b>Cuándo subir</b>: cuando hagas 12 seguidas bien hechas."],
     "«¿En qué nivel estás tú? Dímelo en comentarios.»",
     "Progresar por niveles es exactamente lo que es Level Up. Sin vender nada, ya estás explicando tu método.",
     "20-30 s"),
    ("Conexión", "¿Te ha pasado?", "Conectar", "salto", "center",
     "Día 1", "vs. día 4",
     "Texto: «Día 1 en el gimnasio»",
     "Día 1: lo das todo, exagerado, tres máquinas a la vez y cara de motivación máxima.",
     ["<b>Día 2</b>: bajas las escaleras de lado por las agujetas.",
      "<b>Día 4</b>: en el sofá, con la bolsa del gimnasio al lado sin abrir.",
      "<b>Corte a cámara</b>: «No necesitas matarte el primer día. Necesitas 3 entrenos de 30 minutos que puedas mantener»."],
     "«¿Te ha pasado? Cuéntamelo y te ayudo.»",
     "Primero la risa, luego el mensaje. La situación es tan común que se comenta y se envía a amigas.",
     "20-25 s"),
    ("Conexión", "Mitos 35+", "Conectar", "zancada", "center",
     "Más fuertes,", "no más pequeñas",
     "«Nos han enseñado a querer ser más pequeñas, no más fuertes»",
     "Plano cerrado a cámara, frase dicha con calma. Sin música encima.",
     ["Lo que nos preocupa: barriga, cartucheras, kilos.",
      "Lo que nadie nos cuenta: a partir de los 35-40 perdemos músculo cada año si no hacemos nada.",
      "La fuerza es lo que te mantiene ágil, autónoma y con el cuerpo que buscas."],
     "«¿Deberíamos hablar más de ganar fuerza y menos de perder kilos? Te leo.»",
     "Una opinión clara divide y hace que la gente comente y comparta. Es tu posicionamiento en una frase.",
     "30-40 s"),
    ("Conexión", "Mitos 35+", "Conectar", "libros", "center",
     "Lo que me habría", "gustado saber",
     "«5 cosas que me habría gustado saber cuando empecé a entrenar»",
     "Número grande en pantalla mientras entrenas, cocinas o sales de casa. Una frase cada 3 segundos.",
     ["1. No entrenas para compensar lo que comes.",
      "2. Descansar también es entrenar.",
      "3. No hace falta machacarse para mejorar.",
      "4. Poco tiempo varios días es mejor que 2 horas un día.",
      "5. La clave no es comer menos, es comer de todo."],
     "«¿Cuál te habría gustado saber a ti?»",
     "Una lista numerada hace que la gente se quede hasta el 5. Cabe en 25 segundos con texto en pantalla, sin hablar.",
     "20-25 s"),
    ("Conexión", "¿Te ha pasado?", "Atraer", "banda", "center",
     "1 hora", "vs. 20 minutos",
     "Texto: «Si tienes una amiga que dice que no tiene tiempo para entrenar, mándale esto»",
     "Pantalla dividida con dos cronómetros: «1 hora sin plan» y «20 minutos con plan».",
     ["<b>Izquierda</b>: móvil, descansos largos, de máquina en máquina, cronómetro hasta 60:00.",
      "<b>Derecha</b>: 3 ejercicios en circuito, sin pausas largas, hasta 20:00.",
      "<b>Final</b>: la de la derecha ya está duchada mientras la otra sigue mirando el móvil."],
     "Texto: «Etiqueta a esa amiga».",
     "Sin hablar, solo imagen y texto, para que no se parezca al de los 15 minutos. Pedir que la etiqueten es la forma más directa de llegar a gente nueva.",
     "15-20 s"),
    ("Educación", "Mitos 35+", "Enseñar", "mancuernas", "center",
     "Fuerza", "a partir de los 35",
     "«A partir de los 35 pierdes músculo cada año. Si no haces nada»",
     "A cámara con unas mancuernas en la mano. Corte a tus libros y apuntes de la carrera.",
     ["<b>Músculo</b>: lo que te da fuerza y forma.",
      "<b>Huesos</b>: el entrenamiento de fuerza los protege, sobre todo al llegar a la menopausia.",
      "<b>Autonomía</b>: subir escaleras, cargar la compra o levantarte del suelo a los 70.",
      "<b>La solución</b>: 2-3 días de fuerza a la semana."],
     "«Si nunca has hecho fuerza, comenta NIVEL0 y te enseño a empezar.»",
     "Un dato que preocupa y una solución sencilla. Te posiciona como la que sabe, con tu formación como respaldo.",
     "30-40 s"),
    ("Educación", "Mitos 35+", "Conectar", "risa", "center",
     "Entrenar", "embarazada",
     "«Entrené durante todo mi embarazo. Esto es lo que aprendí»",
     "Tus vídeos entrenando embarazada, con voz en off.",
     ["Mantener la condición física y la fuerza para el parto y el posparto.",
      "Adaptar el entreno a cada trimestre: lo que cambia y lo que no.",
      "Siempre con el visto bueno de tu ginecóloga y en un embarazo sin complicaciones."],
     "«¿Entrenaste durante tu embarazo? ¿Qué te dijeron?»",
     "Tus propios vídeos embarazada son lo más íntimo que puedes enseñar: mucha conexión y te abre a madres jóvenes.",
     "30-40 s"),
    ("Educación", "Mitos 35+", "Enseñar", "risa", "center",
     "¿Cenar hidratos", "engorda?",
     "«Cenar hidratos no te hace engordar»",
     "Comiéndote un plato de pasta por la noche, mirando a cámara.",
     ["Lo que importa es el total del día, no la hora.",
      "Cantidades, calidad y lo que haces cada día pesan mucho más.",
      "Ejemplo en pantalla: dos días iguales, uno con hidratos en la cena."],
     "«¿Qué mito te has creído durante años? Dímelo y hago vídeo.»",
     "Llevar la contraria en la primera frase genera comentarios. Y la pregunta final te da ideas para los siguientes vídeos.",
     "20-30 s"),
    ("Educación", "Nivel 0", "Enseñar", "puente", "center",
     "Tu glúteo:", "más que estética",
     "«Tu glúteo no es solo estética: es lo que te levanta de la silla»",
     "Te levantas de una silla y subes unas escaleras, con el glúteo marcado en pantalla.",
     ["<b>Levantarte de la silla</b> → sentadilla a silla.",
      "<b>Subir escaleras</b> → subida a escalón.",
      "<b>Caminar sin dolor</b> → puente de glúteo.",
      "Un ejercicio por situación, 5 segundos cada uno."],
     "Texto: «Guárdalo para tu próximo entreno».",
     "Une lo que buscan (estética) con lo que necesitan (salud), y cada situación es una escena cotidiana.",
     "20-25 s"),
    ("Lifestyle + humor", "Expectativa vs. realidad", "Atraer", "salto", "center",
     "Expectativa", "vs. realidad",
     "Texto: «Expectativa: entrenar teniendo hijos»",
     "La expectativa, perfecta y con música bonita. Corte seco a tu realidad.",
     ["Serie de 4: <b>entrenar teniendo hijos, organizar un viaje, ir a hacer kite e intentar grabar contenido</b>.",
      "Cada uno, 8-10 segundos, con el giro al final.",
      "Misma música, mismo texto y misma portada: se reconoce al instante."],
     "Texto: «¿Cuál hago la próxima?»",
     "El formato genérico está muy visto; tu vida no. Ahí está la diferencia, y te deja usar las tonterías que ya tienes grabadas.",
     "8-10 s cada uno"),
    ("Lifestyle + humor", "¿Te ha pasado?", "Atraer", "mancuernas", "center",
     "Mis 20 minutos", "para entrenar",
     "Texto: «Cuando por fin tengo 20 minutos para entrenar»",
     "Te preparas con música épica: cascos, esterilla, mancuernas.",
     ["De fondo: «¡MAMIIII!».",
      "Dejas las mancuernas, miras a cámara con resignación…",
      "…y gritas «¡PAPIIII!». Sigues entrenando."],
     "Texto: «Organización familiar nivel experta». Pide que lo compartan.",
     "Menos de 10 segundos con un giro al final: se ve dos y tres veces, y eso es lo que más empuja el algoritmo.",
     "7-9 s"),
    ("Lifestyle + humor", "¿Te ha pasado?", "Atraer", "zancada", "center",
     "Mi mayor", "motivación",
     "Texto: «Mi mayor motivación cuando salgo a correr»",
     "En la puerta con las zapatillas puestas, dudando. Miras el sofá.",
     ["De fondo: «¡MAMÁÁÁÁ!».",
      "Coges la puerta y te vas corriendo.",
      "Texto final: «30 minutos de silencio garantizados»."],
     "Que lo compartan madres que se identifican.",
     "Misma estructura que el anterior: publícalos con al menos 2 semanas de diferencia para que no se pisen.",
     "6-8 s"),
    ("Level Up", "Dentro de Level Up", "Convertir", "clienta", "center",
     "¿Por qué no", "una más barata?",
     "«Me escribió una chica: “He pagado otra plataforma más barata”»",
     "Captura del mensaje, sin nombre ni foto. Tú leyéndolo a cámara.",
     ["Una cosa es tener cientos de entrenos sueltos.",
      "Otra es una planificación por niveles pensada por mí, que llevo años trabajando con mujeres reales.",
      "Enseñas 3 segundos de Level Up por dentro: niveles, sesiones y seguimiento.",
      "«No pagas por mil entrenos. Pagas para que te guíe.»"],
     "«Pruébalo 5 días gratis: comenta NIVEL0 y te mando el enlace.»",
     "Responde a la duda del precio sin bajarlo. No nombres la otra plataforma: el mensaje es lo que tú das.",
     "30-40 s"),
]

for i, (bloque, serie, pilar, fk, fpos, c1, c2, gancho, plano, dev, cierre, porque, dur) in enumerate(G):
    n += 1
    num = i + 1
    add(f"guion-{num:02d}", f"Guion {num:02d}", sec(
        FUENTES
        + eyebrow(f"Guion {num:02d} de {len(G)} · {bloque}")
        + pill(pilar, 128, 166, PILAR[pilar], d=0)
        + p(f"Serie: {serie}", 300, 168, 600, size=20, d=0, cls="muted", extra="font-weight:700;")
        + p(gancho, 128, 214, 1180, size=40, d=1, cls="", extra="font-weight:800;line-height:1.15;")
        + label("0-2 s · Lo que se ve", 128, 360, d=2)
        + p(plano, 128, 394, 1180, size=22, d=2)
        + label("Desarrollo", 128, 480, d=3)
        + lista(dev, 128, 516, 1180, size=21, d=3, gap=8)
        + label("Cierre", 128, 760, d=4)
        + p(cierre, 128, 794, 1180, size=22, d=4, cls="", extra="font-weight:700;")
        + f'<div class="abs pop" style="left:128px;top:880px;width:1180px;padding:18px 26px;border-radius:18px;background:{ROTO};'
          f'border-left:6px solid {ACENTO};--d:5"><span style="font-size:15px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;'
          f'color:{ACENTO_TXT}">Por qué funciona</span><br><span style="font-size:20px;line-height:1.35;color:#3A3836">{porque}</span></div>'
        + movil(1440, 120, 352, fk, fpos, serie, c1, c2, d=2)
        + p(f"Portada · {dur}", 1440, 760, 352, size=18, d=3, cls="muted", extra="text-align:center;")
        + foot(n),
    ))

# ── Laponia ──────────────────────────────────────────────────────────────
n += 1
lap = [
    ("Entrena donde estés: Laponia", "Rutina de 10 minutos en la nieve (o en la puerta de la cabaña) con el paisaje detrás. Tu serie de escenarios inesperados en su mejor versión."),
    ("Expectativa vs. realidad: viajar con niños a Laponia", "El primer capítulo de la serie nueva, grabado allí."),
    ("Entrenar de viaje en 15 minutos", "3 ejercicios en la habitación, sin material. Útil y guardable para quien viaja en Navidad."),
    ("Aquí sí hay viento", "Si hay snowkite, un giro a tu serie de los días sin kite: esta vez el viento sobra."),
]
lh = ""
for i, (t, txt) in enumerate(lap):
    y = 300 + i * 150
    lh += (
        f'<p class="abs a disp outline" style="left:128px;top:{y}px;font-size:44px;line-height:1;--d:{i + 1}">0{i + 1}</p>'
        + p(t, 240, y - 4, 1000, size=28, d=i + 1, cls="", extra="font-weight:800;")
        + p(txt, 240, y + 44, 1000, size=21, d=i + 2)
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
    ("Esta semana", "24-29 nov", [("Jue 26", "04 · Sentadilla sin glúteo"), ("Sáb 28", "17 · Mis 20 minutos (¡MAMIIII!)")]),
    ("Semana de Laponia", "1-6 dic · programada", [("Mar 1", "05 · Abdominales sin dolor de cuello"), ("Jue 3", "12 · Fuerza a partir de los 35"), ("Sáb 5", "02 · 15 minutos son suficientes")]),
    ("Vuelta", "8-13 dic", [("Mar 8", "06 · Puente sin lumbares"), ("Jue 10", "Laponia · Entrena donde estés"), ("Sáb 12", "08 · Día 1 vs. día 4")]),
    ("Antes de Navidad", "15-20 dic", [("Mar 15", "09 · Más fuertes, no más pequeñas"), ("Jue 17", "19 · ¿Por qué no una más barata?"), ("Sáb 19", "18 · Mi mayor motivación")]),
]
oh = ""
for i, (t, f, items) in enumerate(sem):
    x = 128 + i * 424
    oh += (
        card(x, 290, 396, 560, d=i)
        + p(t, x + 30, 320, 340, size=26, d=i + 1, cls="", extra="font-weight:800;")
        + p(f, x + 30, 360, 340, size=18, d=i + 1, cls="rosa", extra="font-weight:700;letter-spacing:.08em;text-transform:uppercase;")
    )
    for k, (dia, g) in enumerate(items):
        y = 430 + k * 130
        oh += (p(dia, x + 30, y, 340, size=18, d=i + 2, cls="muted", extra="font-weight:700;")
               + p(g, x + 30, y + 28, 336, size=22, d=i + 2, cls="", extra="font-weight:700;line-height:1.25;"))
add("orden", "Orden de publicación", sec(
    eyebrow("Calendario · martes, jueves y sábado")
    + titulo("Por dónde empezar", size=56)
    + oh
    + p("Mezcla siempre enseñanza, humor y conexión en la misma semana. El resto de guiones, a partir de enero.",
        128, 890, 1664, size=22, d=6, cls="muted")
    + foot(n),
))

# ── Separador identidad ──────────────────────────────────────────────────
n += 1
add("identidad", "Tu identidad", sec(
    FUENTES
    + eyebrow("Segunda parte", k=True)
    + titulo("Tu identidad en Instagram", top=380, size=80, width=1100)
    + p("Bio, foto de perfil, colores, tipografías, subtítulos y portadas. Todo sale de Level Up: así tu Instagram y tu web parecen lo mismo.",
        128, 560, 1000, size=30, d=2, cls="", extra="color:#3A2F2F;line-height:1.35;")
    + foot(n),
    bg=ACENTO, color=INK,
))


def perfil(x, y, w, foto_html, nombre, bio_html, d=0):
    return (
        f'<div class="abs pop" style="left:{x}px;top:{y}px;width:{w}px;padding:34px;border-radius:26px;background:#fff;'
        f'border:1px solid #E7E2DB;box-shadow:0 14px 40px rgba(0,0,0,.06);{POP}--d:{d}">'
        f'<div style="display:flex;gap:26px;align-items:center">{foto_html}'
        f'<div><div style="font-size:24px;font-weight:600;color:{INK}">lucia_entrenadorapersonal</div>'
        f'<div style="font-size:17px;color:#555;margin-top:6px">517 publicaciones · 26,3 mil seguidores</div></div></div>'
        f'<div style="font-size:19px;font-weight:600;color:{INK};margin-top:22px">{nombre}</div>'
        f'<div style="font-size:19px;line-height:1.5;color:{INK};margin-top:6px">{bio_html}</div>'
        f'<div style="font-size:18px;font-weight:600;color:#1E3A8A;margin-top:10px">🔗 levelup.luciaentrenadorapersonal.com</div></div>'
    )


def circulo(dia, src_css, d=0):
    return (f'<div style="width:{dia}px;height:{dia}px;border-radius:50%;flex:none;{src_css}"></div>')


FOTO_HOY = "background:url(/pitch/level-up/marca/perfil-actual.png) center/cover no-repeat;"
FOTO_NUEVA = f"background:#eee url({WEB}{FOTOS['risa']}) -{round(1800*.46) - 60}px -{round(1092*.30) - 74}px/1800px 1092px no-repeat;"
FOTO_NUEVA_GRANDE = f"background:#eee url({WEB}{FOTOS['risa']}) -{round(2600*.46) - 210}px -{round(1577*.30) - 190}px/2600px 1577px no-repeat;"

# ── Biografía ────────────────────────────────────────────────────────────
n += 1
bio_hoy = ("🎓 Graduada en Ciencias del Deporte<br>💪 Especializada en entrenamiento femenino<br>"
           "✨ Founder of LEVELUPWORKOUT<br>🏡 Empieza desde cero<br>👇 PRUEBA 5 DÍAS GRATIS 🎁")
bio_nueva = ("🎓 Graduada en Ciencias del Deporte<br>Te enseño a entrenar fuerza desde cero, en casa y en 20-30'<br>"
             "✨ Founder de Level Up Workout<br>👇 Prueba 5 días gratis")
add("bio", "Biografía", sec(
    FUENTES
    + eyebrow("Identidad · Biografía")
    + titulo("Tu bio, más clara", size=56)
    + label("Hoy", 128, 280, d=1, color="#8A8580")
    + perfil(128, 320, 780, circulo(120, FOTO_HOY), "Lucía | Entrenadora Personal", bio_hoy, d=1)
    + label("Propuesta", 1012, 280, d=2)
    + perfil(1012, 320, 780, circulo(120, FOTO_NUEVA), "Lucía | Entrenadora de fuerza para mujeres", bio_nueva, d=2)
    + lista([
        "<b>El nombre también se busca</b>: «entrenadora de fuerza para mujeres» te hace aparecer en esas búsquedas.",
        "<b>Una frase que dice qué consigues</b> en vez de tres etiquetas sueltas. Sin mayúsculas gritando.",
        "<b>Un solo enlace</b>, directo a la prueba gratis (147 de 150 caracteres).",
    ], 128, 790, 1664, size=21, d=4, gap=8)
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
    + p("Así se ve en los comentarios y en historias: no se distingue quién eres.", 210, 724, 330, size=18, d=2, cls="muted")
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

# ── Colores ──────────────────────────────────────────────────────────────
n += 1
col = [
    (NOCHE, "Azul noche", "#151F30", "Títulos, fondos de portada y texto. Es el azul de tu web.", "#fff"),
    (MELO, "Melocotón", "#FFCB9A", "El acento: la palabra clave del título, etiquetas y detalles.", NOCHE),
    (ROTO, "Blanco roto", "#F7F3EE", "Fondos limpios y texto sobre fotos oscuras.", NOCHE),
    (SALVIA, "Salvia", "#6E7552", "El verde de tu esterilla. Para series de calma: movilidad, embarazo.", "#fff"),
]
cc = ""
for i, (c, nom, hx, uso, tinta) in enumerate(col):
    x = 128 + i * 424
    cc += (
        f'<div class="abs pop" style="left:{x}px;top:290px;width:396px;height:380px;border-radius:26px;background:{c};'
        f'border:1px solid #E7E2DB;--d:{i}"></div>'
        + p(nom, x + 32, 560, 340, size=30, d=i + 1, cls="", extra=f"font-weight:800;color:{tinta};")
        + p(hx, x + 32, 608, 340, size=20, d=i + 1, cls="", extra=f"color:{tinta};opacity:.8;letter-spacing:.06em;")
        + p(uso, x + 4, 700, 380, size=21, d=i + 2)
    )
add("colores", "Colores", sec(
    eyebrow("Identidad · Colores")
    + titulo("Cuatro colores, los de Level Up", size=56)
    + cc
    + p("Regla sencilla: azul noche y blanco roto de base, melocotón solo para destacar. Nada de azules eléctricos ni contornos de colores en las portadas.",
        128, 880, 1664, size=22, d=6, cls="muted")
    + foot(n),
))

# ── Tipografías ──────────────────────────────────────────────────────────
n += 1
add("tipografias", "Tipografías", sec(
    FUENTES
    + eyebrow("Identidad · Tipografías")
    + titulo("Dos tipografías y ninguna más", size=56)
    + card(128, 290, 812, 560, d=0)
    + p("Títulos y subtítulos", 168, 326, 700, size=20, d=1, cls="rosa", extra="font-weight:700;letter-spacing:.12em;text-transform:uppercase;")
    + f'<p class="abs a" style="left:168px;top:380px;width:740px;{POP}font-weight:800;font-size:92px;line-height:1;color:{NOCHE};--d:1">Poppins</p>'
    + f'<p class="abs a" style="left:168px;top:500px;width:740px;{POP}font-weight:800;font-size:40px;line-height:1.1;color:{NOCHE};text-transform:uppercase;--d:2">Si no notas el glúteo, es esto</p>'
    + f'<p class="abs a" style="left:168px;top:610px;width:740px;{POP}font-weight:500;font-size:26px;line-height:1.4;color:#3A3836;--d:2">Extra Bold en mayúsculas para portadas. Medium o Semibold para subtítulos. Es la misma de tu web.</p>'
    + card(980, 290, 812, 560, d=1)
    + p("Acento (una palabra como mucho)", 1020, 326, 700, size=20, d=2, cls="rosa", extra="font-weight:700;letter-spacing:.12em;text-transform:uppercase;")
    + f'<p class="abs a" style="left:1020px;top:372px;width:740px;{PLAY}font-size:92px;line-height:1.05;color:{NOCHE};--d:2">Playfair</p>'
    + f'<p class="abs a" style="left:1020px;top:500px;width:740px;{POP}font-weight:800;font-size:40px;line-height:1.1;color:{NOCHE};text-transform:uppercase;--d:3">3 cosas <span style="{PLAY}text-transform:none;font-weight:600;color:{ACENTO_TXT}">para</span> empezar</p>'
    + f'<p class="abs a" style="left:1020px;top:610px;width:740px;{POP}font-weight:500;font-size:26px;line-height:1.4;color:#3A3836;--d:3">Cursiva elegante para una palabra suelta, como hacen @pau_inspirafit o @cescescola. Le quita lo «de gimnasio».</p>'
    + p("Las dos son gratuitas (Google Fonts). Si tu editor no las tiene, se instalan en el móvil o se usan desde CapCut.",
        128, 890, 1664, size=22, d=5, cls="muted")
    + foot(n),
))

# ── Subtítulos ───────────────────────────────────────────────────────────
n += 1
sub_mock = (
    f'<div class="abs pop" style="left:1300px;top:150px;width:380px;height:676px;border-radius:26px;overflow:hidden;'
    f'background:#ddd url({WEB}{FOTOS["pared"]}) center/cover no-repeat;box-shadow:0 18px 44px rgba(21,31,48,.22);--d:2">'
    f'<div style="position:absolute;left:30px;right:30px;top:430px;text-align:center;{POP}font-weight:600;font-size:27px;line-height:1.25;'
    f'color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.55)">cadera atrás y <span style="background:{MELO};color:{NOCHE};padding:0 8px;border-radius:6px;text-shadow:none">baja más</span></div>'
    f'<div style="position:absolute;left:0;right:0;bottom:0;height:120px;background:repeating-linear-gradient(45deg,rgba(255,255,255,.18) 0 10px,rgba(255,255,255,0) 10px 20px)"></div>'
    f'<div style="position:absolute;left:0;right:0;bottom:126px;text-align:center;font-size:13px;color:#fff;opacity:.85;{POP}">zona que tapa Instagram</div></div>'
)
add("subtitulos", "Subtítulos", sec(
    FUENTES
    + eyebrow("Identidad · Subtítulos")
    + titulo("Tus subtítulos", size=56)
    + lista([
        "<b>Poppins Semibold, blanco</b>, con una sombra suave para que se lea sobre cualquier fondo.",
        "<b>Una palabra clave por frase en melocotón</b>, con fondo, no en color suelto.",
        "<b>Máximo 2 líneas y 5-6 palabras por línea</b>, en minúscula.",
        "<b>Centrados, un poco por debajo de la mitad</b>: ni encima de tu cara ni en la zona que tapan los botones de Instagram.",
        "<b>Siempre</b>: el 80 % ve los reels sin sonido.",
    ], 128, 300, 960, size=25, d=2, gap=22)
    + sub_mock
    + foot(n),
))

# ── Portadas ─────────────────────────────────────────────────────────────
n += 1
add("plantillas", "Portadas", sec(
    FUENTES
    + eyebrow("Identidad · Portadas")
    + titulo("Una portada por serie", size=56)
    + movil(128, 290, 300, "pared", "center", "Nivel 0", "Sentadilla", "sin glúteo?", d=1)
    + movil(478, 290, 300, "risa", "center", "Mitos 35+", "¿Cenar hidratos", "engorda?", d=2)
    + movil(828, 290, 300, "clienta", "center", "Dentro de Level Up", "¿Por qué no", "una más barata?", d=3)
    + movil(1178, 290, 300, None, "center", "¿Te ha pasado?", "Mis 20 minutos", "para entrenar", d=4, fondo=NOCHE)
    + lista([
        "<b>Etiqueta de la serie</b> arriba, siempre en el mismo sitio.",
        "<b>Título en 2 líneas</b>: la segunda en melocotón.",
        "<b>Dentro del recuadro central</b>: el perfil recorta la portada a 3:4.",
        "<b>Foto tuya mirando a cámara</b>, o fondo azul noche si no hay foto buena.",
    ], 1520, 300, 300, size=20, d=5, gap=14)
    + foot(n),
))

# ── Cierre ───────────────────────────────────────────────────────────────
n += 1
add("cierre", "Cierre", sec(
    foto(1180, 0, 740, 1080, "salto", d=0, pos="center", radius=0)
    + '<div class="abs" style="left:1180px;top:0;width:220px;height:1080px;background:linear-gradient(90deg,#FFFFFF,rgba(255,255,255,0))"></div>'
    + titulo("Ahora, a grabar", top=330, size=80, width=1040)
    + p("Empieza por la bio, la foto y la plantilla de portada. Con eso listo, los guiones de esta semana.",
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
    "/**\n * Guiones desarrollados e identidad visual para Level Up Workout (nov 2026).\n"
    " * Generado con scripts/build-level-up-propuestas.py: si cambia el contenido,\n"
    " * se edita el script y se vuelve a ejecutar.\n */\n\n"
    'import type { DiapoHtml } from "../maen-plan-100k/diapos";\n\n'
    "export const DIAPOS: DiapoHtml[] = "
    + json.dumps(slides, ensure_ascii=False, indent=2)
    + ";\n",
    encoding="utf-8",
)
print(len(slides), "diapositivas")
