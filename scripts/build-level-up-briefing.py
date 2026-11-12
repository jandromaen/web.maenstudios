"""Genera app/pitch/level-up-workout-briefing/diapos.ts: briefing INTERNO para
Jandro con la situación actual de Lucía / Level Up Workout y el inventario de
todo lo que nos ha pasado (correo del 9 nov 2026 + Excel del 2 nov).

Reutiliza los helpers y estilos de scripts/build-level-up-workout.py (se
ejecuta su bloque de helpers, sin las diapositivas).

    python3 scripts/build-level-up-briefing.py
"""

import json
from pathlib import Path

_src = Path("scripts/build-level-up-workout.py").read_text(encoding="utf-8")
exec(_src.split("# ── 1. Portada")[0])  # INK, ACENTO, NAVY, sec, foot, p, kpi, card, lista...

MARCA = "Uso interno · Briefing Level Up"
OK, PEND, NO = "#7FD49B", ACENTO, "#E86A5C"

slides = []
n = 0


def add(id_, tit, html):
    slides.append({"id": id_, "titulo": tit, "html": html})


def etiqueta(texto, color, x, y, d=2):
    return (
        f'<p class="abs a" style="left:{x}px;top:{y}px;padding:6px 14px;border-radius:999px;'
        f'border:2px solid {color};color:{color};font-size:17px;font-weight:800;letter-spacing:.08em;'
        f'text-transform:uppercase;white-space:nowrap;--d:{d}">{texto}</p>'
    )


def tabla(filas, y0, alto, cols, d0=2, size=22):
    """filas: lista de tuplas de celdas; cols: [(x, ancho, estilo)] por columna."""
    h = ""
    for r, fila in enumerate(filas):
        y = y0 + r * alto
        for c, (cel, (x, w, est)) in enumerate(zip(fila, cols)):
            if isinstance(cel, tuple):  # (texto, color) -> etiqueta de estado
                h += etiqueta(cel[0], cel[1], x, y - 2, d=d0 + r)
            else:
                h += p(cel, x, y, w, size=size, d=d0 + r, cls="", extra=est + "line-height:1.3;")
        h += f'<div class="abs line-h" style="left:128px;top:{y + alto - 16}px;width:1664px;background:#2E3130"></div>'
    return h


def cabecera(cols, nombres, y):
    return "".join(
        f'<p class="abs a muted" style="left:{x}px;top:{y}px;width:{w}px;font-size:18px;letter-spacing:.1em;text-transform:uppercase;--d:1">{t}</p>'
        for (x, w, _), t in zip(cols, nombres)
    )


# ── 1. Portada ───────────────────────────────────────────────────────────
n += 1
add("portada", "Briefing Level Up", sec(
    '<div class="abs deco f" style="left:1180px;top:-120px;width:900px;height:1320px;'
    f'background:{ACENTO};transform:rotate(14deg);border-radius:60px;--d:0"></div>'
    f'<p class="abs a disp" style="left:1290px;top:300px;font-size:220px;line-height:.9;color:{NAVY};--d:2">LV<br>UP</p>'
    + eyebrow("Uso interno · Solo Jandro · 12 nov 2026", top=150)
    + '<h1 class="abs a disp" style="left:128px;top:290px;font-size:104px;line-height:1;--d:1">Briefing</h1>'
    '<h1 class="abs a disp outline" style="left:128px;top:404px;font-size:104px;line-height:1;--d:2">Level Up</h1>'
    + p("Todo lo que sabemos de Lucía y de su negocio, qué datos nos ha dado, a qué tenemos acceso y qué falta antes de la estrategia.",
        128, 580, 940, size=32, d=3, cls="", extra="font-weight:800;line-height:1.3;")
    + p("Fuentes: correo de Lucía del 9 nov, Excel de Instagram y WooCommerce del 2 nov, perfil de Instagram y sus dos webs.",
        128, 800, 900, size=22, d=4)
    + foot(n),
))

# ── 2. En 30 segundos ────────────────────────────────────────────────────
n += 1
add("resumen", "En 30 segundos", sec(
    eyebrow("En 30 segundos")
    + titulo("La situación, de un vistazo", size=56)
    + kpi(128, 300, 380, "4", "suscriptoras de pago activas (estimado)", 2, size=80, color=ACENTO)
    + kpi(552, 300, 380, "≈ 72 €", "al mes con IVA que ingresa hoy Level Up", 3, size=80)
    + kpi(976, 300, 380, "200", "suscriptoras: su objetivo en 6 meses (máx. 12)", 4, size=80, color=ACENTO)
    + kpi(1400, 300, 380, "26,4K", "seguidoras en Instagram, su único canal real", 5, size=80)
    + lista([
        "<b>Qué es:</b> un programa de entrenamiento online, grabado y 100 % autoguiado, para mujeres que empiezan desde cero. Lo vende una sola entrenadora: Lucía.",
        "<b>El problema:</b> tiene audiencia y el producto convierte (3 de cada 5 pruebas pagan), pero casi nadie llega a la prueba: 5 pruebas reales en 4 meses.",
        "<b>Lo que no tiene:</b> ni analítica web, ni emails automáticos, ni testimonios de Level Up, ni banco de ideas. Todo eso es palanca.",
    ], 128, 620, 1664, size=26, d=6, gap=20)
    + foot(n),
))

# ── 3. Quién es Lucía ────────────────────────────────────────────────────
n += 1
add("lucia", "Quién es Lucía", sec(
    eyebrow("La persona")
    + titulo("Quién es Lucía", size=56)
    + card(128, 300, 812, 600)
    + p("Perfil profesional", 168, 336, 740, size=20, d=1, cls="rosa", extra="font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
    + lista([
        "Graduada en Ciencias de la Actividad Física y el Deporte (INEF).",
        "Años como entrenadora personal a domicilio en Barcelona, especializada en mujeres: posparto, espalda, embarazo, pérdida de peso.",
        "<b>Unas 18 clientas presenciales</b> hoy. Llegan por su trayectoria, su web y el boca a boca.",
        "Cuenta de Instagram verificada: @lucia_entrenadorapersonal, 26,4K seguidoras y 515 publicaciones.",
    ], 168, 390, 740, size=24, d=2, gap=16)
    + card(980, 300, 812, 600, d=1)
    + p("Lo personal que usa en redes", 1020, 336, 740, size=20, d=2, cls="rosa", extra="font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
    + lista([
        "Kitesurf: su contenido con más personalidad (Dakhla, viajes, sesiones).",
        "Maternidad: ha publicado contenido de posparto con su bebé.",
        "Se ha casado hace poco y tiene fotos de la boda sin publicar.",
        "Fines de semana en una casa de campo cerca de Cardedeu, con jardín.",
        "Humor y espontaneidad: ella misma ve que funcionan mejor que los tutoriales.",
    ], 1020, 390, 740, size=24, d=3, gap=16)
    + foot(n),
))

# ── 4. El producto: estructura ───────────────────────────────────────────
n += 1
etapas = [
    ("Pre-Entreno", "8", "2", "≈ 20 min (las 3 primeras ≈ 30)", "Técnica: circuitos sencillos de cuerpo completo con muchas explicaciones."),
    ("Nivel 1", "8", "2", "15–20 min", "Dos circuitos cortos: tren superior y tren inferior. Explicación técnica al final."),
    ("Nivel 2", "12", "3", "15–20 min", "Circuitos encadenados: superior, inferior y Fityoga. Resistencia y flexibilidad."),
    ("Nivel 3", "12", "3", "20–25 min", "Más fuerza y cardio. Entran las bandas elásticas."),
    ("Nivel 4", "12", "3", "20–25 min", "Entran las pesas (mancuerna de 2,5–3,5 kg)."),
    ("Niveles 5 y 6", "12 c/u", "3", "25–30 min", "Más exigencia y complejidad."),
]
cols = [(128, 260, "font-weight:800;"), (400, 130, f"color:{ACENTO};font-weight:800;"), (540, 130, ""), (680, 330, ""), (1030, 760, "color:#C9C7C3;")]
add("producto", "El producto", sec(
    eyebrow("El producto")
    + titulo("Level Up por dentro", size=56)
    + p("Programa grabado de 28 semanas (≈ 7 meses), organizado en 7 etapas. Recomendación general: 3 días por semana.", 128, 262, 1600, size=24, d=1)
    + cabecera(cols, ["Etapa", "Sesiones", "Por sem.", "Duración", "Qué se trabaja"], 340)
    + tabla(etapas, 390, 92, cols, size=23)
    + foot(n),
))

# ── 5. El producto: experiencia ──────────────────────────────────────────
n += 1
add("experiencia", "La experiencia de la clienta", sec(
    eyebrow("El producto")
    + titulo("Qué recibe la clienta", size=56)
    + card(128, 300, 520, 600)
    + p("Material", 168, 336, 440, size=20, d=1, cls="rosa", extra="font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
    + lista(["Para empezar: esterilla y silla.", "Más adelante: minibanda, banda elástica larga y una mancuerna de 2,5–3,5 kg."], 168, 390, 440, size=25, d=2, gap=18)
    + card(700, 300, 520, 600, d=1)
    + p("Área privada", 740, 336, 440, size=20, d=2, cls="rosa", extra="font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
    + lista(["Planificación completa.", "Recetas de una nutricionista.", "Movilidad y activación.", "Seguimiento del progreso con medidas y fotos."], 740, 390, 440, size=25, d=3, gap=18)
    + card(1272, 300, 520, 600, d=2, cls="pm-card-r")
    + p("Acompañamiento", 1312, 336, 440, size=20, d=3, cls="", extra=f"color:{NAVY};font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
    + p("Ninguno.", 1312, 390, 440, size=44, d=3, cls="", extra=f"color:{INK};font-weight:800;")
    + p("Es 100 % autónomo: sin seguimiento individual ni corrección de ejercicios. Pueden escribirle por correo, pero casi nadie lo hace.",
        1312, 470, 440, size=24, d=4, cls="", extra=f"color:{INK};")
    + p("Sin comunidad ni contacto, la clienta entrena sola. Hay riesgo de bajas y una oportunidad clara de diferenciarse.",
        1312, 700, 440, size=22, d=5, cls="", extra="color:#3A2F2F;font-weight:700;")
    + foot(n),
))

# ── 6. Precios y economía ────────────────────────────────────────────────
n += 1
add("modelo", "Precios y números", sec(
    eyebrow("Modelo de negocio")
    + titulo("Precios y números", size=56)
    + kpi(128, 300, 380, "17,99 €", "al mes (cuota mensual)", 2, size=64, color=ACENTO)
    + kpi(552, 300, 380, "179,88 €", "al año en un pago (≈ 14,99 €/mes)", 3, size=64)
    + kpi(976, 300, 380, "5 días", "de prueba gratis, con cobro automático si no cancela", 4, size=64)
    + kpi(1400, 300, 380, "≈ 100 €", "al mes de costes (hosting, técnica, pasarela). Estimación suya", 5, size=64)
    + lista([
        "<b>Punto de equilibrio: unas 7 suscriptoras.</b> 17,99 € con IVA son 14,87 € netos; menos la comisión de pago, quedan unos 14 € por clienta.",
        "<b>Cupón testing99:</b> 0,99 € por periodo para clientas presenciales que prueban la plataforma. No es captación y no cuenta como venta.",
        "<b>La prueba pasa a cobro sin avisar.</b> No hay ningún correo antes de que termine. Es una fuente de bajas y de cobros que molestan.",
    ], 128, 620, 1664, size=25, d=6, gap=20)
    + foot(n),
))

# ── 7. Objetivo vs realidad ──────────────────────────────────────────────
n += 1
add("objetivo", "Objetivo y realidad", sec(
    eyebrow("Su objetivo", k=True)
    + titulo("200 suscriptoras en 6 meses", size=64, extra="color:#151515;")
    + kpi(128, 330, 380, "≈ 3.600 €", "al mes con IVA si llega a 200 (≈ 2.970 € netos)", 2, size=60, sub_color="#3A2F2F")
    + kpi(552, 330, 380, "≈ 33", "altas netas al mes durante 6 meses (sin contar bajas)", 3, size=60, sub_color="#3A2F2F")
    + kpi(976, 330, 380, "≈ 55", "pruebas al mes necesarias con la conversión actual (60 %)", 4, size=60, sub_color="#3A2F2F")
    + kpi(1400, 330, 380, "1,25", "pruebas reales al mes hoy (5 en 4 meses)", 5, size=60, sub_color="#3A2F2F")
    + p("Hay que multiplicar por 44 las pruebas de hoy. Muy ambicioso a 6 meses y más realista a 12, con hitos intermedios.",
        128, 640, 1664, size=32, d=6, cls="", extra="color:#151515;font-weight:800;line-height:1.25;")
    + p("Para enmarcarlo bien con ella: 200 suscriptoras son el 0,8 % de sus seguidoras de Instagram. El público existe; falta el sistema que lo lleve hasta la prueba.",
        128, 790, 1664, size=26, d=7, cls="", extra="color:#3A2F2F;")
    + foot(n, k=True),
    bg=ACENTO, color=INK,
))

# ── 8. Instagram hoy ─────────────────────────────────────────────────────
n += 1
add("instagram", "Instagram hoy", sec(
    eyebrow("Instagram · mayo – octubre 2026")
    + titulo("Lo que ya sabemos de Instagram", size=56)
    + kpi(128, 290, 380, "377.030", "visualizaciones en 27 publicaciones", 2, size=56, color=ACENTO)
    + kpi(552, 290, 380, "1.637", "seguidoras nuevas atribuidas", 3, size=56)
    + kpi(976, 290, 380, "4,5", "publicaciones al mes (de 2 a 6)", 4, size=56)
    + kpi(1400, 290, 380, "−92 %", "visualizaciones de octubre frente a agosto", 5, size=56, color=NO)
    + lista([
        "<b>Entreno práctico</b> (48 % de los posts): el 83 % de los guardados y la mitad de las seguidoras nuevas. El mejor reel: piernas en la piscina (105K visualizaciones, 511 seguidoras).",
        "<b>Humor y vida personal:</b> lo que más se comparte (66 %), pero atrae pocas seguidoras.",
        "<b>Kitesurf:</b> 331 de sus 359 seguidoras vinieron de un único reel con «comenta KITE».",
        "<b>Llamadas a la acción:</b> solo 1 de 27 copies menciona la prueba gratis. Ninguno usa palabra clave para Level Up.",
    ], 128, 560, 1664, size=24, d=6, gap=16)
    + foot(n),
))

# ── 9. Ventas hoy ────────────────────────────────────────────────────────
n += 1
add("ventas", "Ventas hoy", sec(
    eyebrow("WooCommerce · julio – octubre 2026")
    + titulo("Lo que ya sabemos de las ventas", size=56)
    + kpi(128, 290, 380, "38", "pedidos completados", 2, size=64, color=ACENTO)
    + kpi(552, 290, 380, "251,69 €", "con IVA (208 € netos). Coincide con su cifra", 3, size=64)
    + kpi(976, 290, 380, "5", "pruebas reales (3 Instagram + 2 Google)", 4, size=64)
    + kpi(1400, 290, 380, "3 de 5", "pruebas pasan a pago (60 %)", 5, size=64, color=ACENTO)
    + lista([
        "18 pedidos de 0,99 € y casi todos los «directos» son conocidas (cupón testing99). Solo 13 cobros reales de 17,99 €.",
        "Desde el 30 de septiembre no ha entrado ninguna prueba real.",
        "Las 4 activas son una reconstrucción por fechas. Ella confirma que su informe <b>no recoge bajas ni el estado de las suscripciones</b>. Lo veremos con el acceso a WooCommerce.",
        "Google trajo 2 de las 5 pruebas sin hacer nada (no tiene analítica ni Search Console).",
    ], 128, 560, 1664, size=24, d=6, gap=16)
    + foot(n),
))

# ── 10. Embudo y fugas ───────────────────────────────────────────────────
n += 1
fugas = [
    ("Sin analítica web", "No tiene Google Analytics ni Search Console. No sabemos cuántas visitas llegan ni de dónde. Hay que instalarlo con su cuñado."),
    ("Promociones que no venden", "Promocionó publicaciones en Meta: trajeron visitas a la web, pero ni una compra. El problema está en la landing y la oferta, no en el tráfico."),
    ("Sin emails", "Ni bienvenida, ni aviso antes de que acabe la prueba, ni seguimiento. Tampoco tiene herramienta de email."),
    ("Sin feedback", "Sabe que algunas terminan la prueba y no siguen, pero nunca les ha preguntado por qué."),
    ("Sin prueba social", "Testimonios solo en su web personal. Ninguno en Level Up, porque casi no tiene suscriptoras."),
]
fh = ""
for i, (t, s_) in enumerate(fugas):
    y = 290 + i * 128
    fh += (
        f'<p class="abs a disp outline" style="left:128px;top:{y}px;font-size:48px;line-height:1;--d:{i + 1}">{i + 1:02d}</p>'
        + p(t, 260, y + 4, 520, size=30, d=i + 1, cls="", extra="font-weight:800;")
        + p(s_, 800, y + 4, 990, size=23, d=i + 2)
        + f'<div class="abs line-h" style="left:128px;top:{y + 104}px;width:1664px;background:#2E3130"></div>'
    )
add("fugas", "Dónde se pierde la venta", sec(
    eyebrow("El embudo")
    + titulo("Dónde se pierde la venta", size=56)
    + fh + foot(n),
))

# ── 11. Capacidad de contenido ───────────────────────────────────────────
n += 1
add("capacidad", "Capacidad de contenido", sec(
    eyebrow("Con qué contamos para el contenido")
    + titulo("Su capacidad real", size=56)
    + kpi(128, 290, 500, "2–3 h", "a la semana para grabar", 2, size=72, color=ACENTO)
    + kpi(700, 290, 500, "Lun · Vie", "por la mañana, sus días de grabación", 3, size=72)
    + kpi(1272, 290, 520, "Noches", "edita en ratos libres con InShot y Edits", 4, size=72)
    + card(128, 560, 812, 360, d=4)
    + p("Dónde puede grabar", 168, 596, 740, size=20, d=5, cls="rosa", extra="font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
    + lista([
        "En casa y por Barcelona.",
        "Casa de campo cerca de Cardedeu (fines de semana): jardín y entorno de campo. Ideal para entreno al aire libre y estilo de vida, pero <b>dice que no sabe qué grabar</b>.",
    ], 168, 648, 740, size=24, d=5, gap=16)
    + card(980, 560, 812, 360, d=5)
    + p("Cómo trabaja hoy", 1020, 596, 740, size=20, d=6, cls="rosa", extra="font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
    + lista([
        "Sin calendario ni banco de ideas: le salen sobre la marcha.",
        "Piensa en tutoriales y circuitos, aunque ve que lo espontáneo y el humor funcionan mejor.",
        "Programa con Meta Business Suite. Sin plantillas de diseño.",
    ], 1020, 648, 740, size=24, d=6, gap=16)
    + foot(n),
))

# ── 12. Referencias ──────────────────────────────────────────────────────
n += 1
gusta = [
    ("@holacuore", "autenticidad y forma de comunicar, aunque su estilo no es el suyo"),
    ("@pau_inspirafit", "le transmite confianza"),
    ("@deliciousmartha", "cómo hace las cosas y cómo comunica"),
    ("@drablancal", "sin motivo indicado"),
    ("@isabelvina", "sin motivo indicado"),
    ("@cescescola", "su manera de comunicar"),
]
no_gusta = [
    ("@soficalzetti", "encantadora, pero no se la cree: «muy guionizado»"),
    ("@cristinatamborero", "lo mismo, no conecta. ⚠️ Ojo: es la clienta que le hizo el vestido de novia y va a publicar sus fotos. No mencionarlo nunca."),
    ("@elenarorun", "sentimientos encontrados: cosas que le encantan y otras que le generan rechazo"),
]
gh = ""
for i, (cta, por) in enumerate(gusta):
    y = 340 + i * 88
    gh += p(f"<b style='color:#F4F4F4'>{cta}</b> · {por}", 128, y, 800, size=23, d=i + 2)
for i, (cta, por) in enumerate(no_gusta):
    y = 340 + i * 150
    gh += p(f"<b style='color:#F4F4F4'>{cta}</b> · {por}", 1012, y, 780, size=23, d=i + 2)
add("referencias", "Referencias", sec(
    eyebrow("Referencias que nos ha dado")
    + titulo("Con quién conecta y con quién no", size=56)
    + p("Le gustan (6)", 128, 290, 700, size=20, d=1, cls="", extra=f"color:{OK};font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
    + p("No conecta (3)", 1012, 290, 700, size=20, d=1, cls="", extra=f"color:{NO};font-weight:700;letter-spacing:.14em;text-transform:uppercase;")
    + '<div class="abs line-v" style="left:960px;top:290px;height:560px"></div>'
    + gh
    + p("El patrón: valora la autenticidad y la naturalidad por encima de la producción. Lo que huele a guion le aleja. La estrategia tiene que sonar a ella, no a plantilla.",
        128, 880, 1664, size=25, d=9, cls="", extra="font-weight:800;")
    + foot(n),
))

# ── 13. Material disponible ──────────────────────────────────────────────
n += 1
material = [
    ("Logo de Level Up (PNG y PDF)", "Adjunto en su correo", ("Pendiente", PEND), "No puedo descargar adjuntos de Gmail: súbelos al chat."),
    ("Colores de marca", "Los de la web", ("Tenemos", OK), "Azul marino y melocotón, los de la auditoría."),
    ("Plantillas de diseño", "—", ("No existen", NO), "Habrá que crearlas (portadas de reels, historias)."),
    ("Vídeo de kite y fotos de la boda", "Te los manda por Instagram", ("Pendiente", PEND), "No está en @maen.studios; seguramente en tu cuenta personal."),
    ("Testimonios", "Su web personal (10)", ("Tenemos", OK), "Puede pedir más a sus 18 clientas presenciales."),
    ("Contactos del prelanzamiento", "Google Forms", ("Pedir", PEND), "Base para un primer envío de email."),
    ("TikTok @lucia_pt", "Público", ("Tenemos", OK), "Abandonado; solo reposta algún vídeo de Instagram."),
]
cols = [(128, 520, "font-weight:800;"), (670, 380, "color:#C9C7C3;"), (1070, 200, ""), (1290, 500, "color:#C9C7C3;")]
add("material", "Material disponible", sec(
    eyebrow("Inventario")
    + titulo("Material de marca y contenido", size=56)
    + cabecera(cols, ["Qué", "Dónde está", "Estado", "Nota"], 290)
    + tabla(material, 340, 86, cols, size=22)
    + foot(n),
))

# ── 14. Inventario de datos ──────────────────────────────────────────────
n += 1
datos = [
    ("Informe de Instagram (27 posts)", "Excel del 2 nov", ("Tenemos", OK), "Analizado en la auditoría."),
    ("Informe de WooCommerce (38 pedidos)", "Excel del 2 nov", ("Tenemos", OK), "Pedidos completados, sin bajas."),
    ("Estado real de suscripciones y bajas", "WooCommerce", ("Con acceso", PEND), "Necesita la contraseña de WordPress."),
    ("Audiencia, visitas al perfil, clics", "Meta Business Suite", ("Con acceso", PEND), "Necesita aceptar la invitación."),
    ("Resultados de las promociones", "Administrador de anuncios", ("Con acceso", PEND), "Viene con la misma invitación."),
    ("Visitas y origen del tráfico web", "Google Analytics", ("No existe", NO), "Instalar con su cuñado."),
    ("Motivos de baja", "—", ("No existe", NO), "Montar pregunta de salida."),
    ("Detalle de costes", "—", ("Aproximado", PEND), "≈ 100 €/mes, sin desglose."),
]
cols = [(128, 520, "font-weight:800;"), (670, 380, "color:#C9C7C3;"), (1070, 200, ""), (1290, 500, "color:#C9C7C3;")]
add("datos", "Inventario de datos", sec(
    eyebrow("Inventario")
    + titulo("Qué datos tenemos y cuáles faltan", size=56)
    + cabecera(cols, ["Dato", "Fuente", "Estado", "Nota"], 290)
    + tabla(datos, 340, 80, cols, size=22)
    + foot(n),
))

# ── 15. Accesos ──────────────────────────────────────────────────────────
n += 1
accesos = [
    ("Meta Business Suite · portfolio de Lucía", ("Por aceptar", PEND), "Aceptar el correo «Te invitaron a unirte al portfolio comercial de Lucía» y dejar la sesión iniciada en Chrome."),
    ("Administrador de anuncios (solo lectura)", ("Por aceptar", PEND), "Incluido en la misma invitación."),
    ("WordPress / WooCommerce · usuario jandro_maen", ("Sin contraseña", PEND), "Crearla con el enlace del correo «[Level Up] Datos de acceso». El acceso no está en /wp-admin."),
    ("Google Analytics / Search Console", ("No existen", NO), "Pedir el contacto de su cuñado para instalarlos."),
    ("Herramienta de email", ("No existe", NO), "Elegir una (p. ej. MailerLite) en la estrategia."),
    ("Instagram, webs, TikTok y referencias", ("Tenemos", OK), "Públicos; los reviso desde Chrome."),
]
cols = [(128, 600, "font-weight:800;"), (760, 230, ""), (1010, 780, "color:#C9C7C3;")]
add("accesos", "Accesos", sec(
    eyebrow("Accesos")
    + titulo("Estado de los accesos", size=56)
    + cabecera(cols, ["Acceso", "Estado", "Qué hay que hacer"], 290)
    + tabla(accesos, 340, 96, cols, size=22)
    + foot(n),
))

# ── 16. Lo que aún no sabemos ────────────────────────────────────────────
n += 1
add("incognitas", "Lo que aún no sabemos", sec(
    eyebrow("Incógnitas")
    + titulo("Lo que aún no sabemos", size=56)
    + lista([
        "<b>Si su audiencia es de verdad la de Level Up</b>: mujeres de 35 a 55 años. Lo dirá la demografía de Business Suite.",
        "<b>Cuántas suscriptoras activas tiene exactamente</b> y cuántas se han ido. Lo dirá WooCommerce.",
        "<b>Cuánta gente pasa de Instagram a la web</b>: visitas al perfil y clics en el enlace.",
        "<b>Qué promocionó, con cuánto dinero y qué resultados tuvo.</b>",
        "<b>Cómo es la experiencia por dentro</b>: el área privada vista como clienta.",
        "<b>Cuántos contactos tiene en el Google Forms</b> del prelanzamiento.",
        "<b>Qué tiempo y qué ganas tiene su cuñado</b> para instalar analítica, píxel y emails.",
    ], 128, 300, 1664, size=27, d=2, gap=22)
    + foot(n),
))

# ── 17. Implicaciones ────────────────────────────────────────────────────
n += 1
imp = [
    ("Arreglar el embudo antes de buscar más tráfico", "Emails de bienvenida, aviso antes del cobro y pregunta de baja. Landing con testimonios. Analítica y píxel. Si no, cada promoción se pierde igual."),
    ("Contenido que quepa en 2-3 horas", "Grabación por lotes los lunes o viernes, con guiones cortos y formatos repetibles. Cardedeu como serie fija al aire libre."),
    ("Que suene a ella", "Autenticidad y humor, nada guionizado. El kite y la vida personal como puente hacia Level Up."),
    ("Usar lo que ya tiene", "18 clientas presenciales para testimonios y recomendaciones. 26,4K seguidoras: 200 son el 0,8 %."),
    ("Recalibrar el objetivo", "200 en 12 meses con hitos mensuales. Revisar la conversión de prueba a pago cada mes."),
]
ih = ""
for i, (t, s_) in enumerate(imp):
    y = 290 + i * 128
    ih += (
        f'<div class="abs a" style="left:128px;top:{y + 10}px;width:16px;height:16px;border-radius:50%;background:{ACENTO};--d:{i + 1}"></div>'
        + p(t, 176, y, 640, size=28, d=i + 1, cls="", extra="font-weight:800;line-height:1.2;")
        + p(s_, 860, y + 2, 930, size=23, d=i + 2)
    )
add("implicaciones", "Implicaciones para la estrategia", sec(
    eyebrow("Lo que esto implica")
    + titulo("Cinco ideas para la estrategia", size=56)
    + ih + foot(n),
))

# ── 18. Próximos pasos ───────────────────────────────────────────────────
n += 1
pasos = [
    ("Tú · hoy", "Activar accesos", "Aceptar la invitación de Meta y crear la contraseña de WordPress."),
    ("Tú · hoy", "Pasarme material", "Subir al chat el logo, el vídeo de kite y las fotos de la boda."),
    ("Lucía", "Pedirle", "Contacto de su cuñado y los contactos del Google Forms."),
    ("Maen", "Estrategia", "Con los datos reales de Meta y WooCommerce, presentación de estrategia."),
]
ph = f'<div class="abs line-h gx" style="left:128px;top:480px;width:1664px;background:{ACENTO};--d:0"></div>'
for i, (cuando, t, s_) in enumerate(pasos):
    x = 128 + i * 424
    ph += (
        f'<div class="abs pop" style="left:{x}px;top:464px;width:34px;height:34px;border-radius:50%;background:{ACENTO};--d:{i}"></div>'
        + p(cuando, x, 400, 380, size=22, d=i + 1, cls="rosa", extra="font-weight:700;letter-spacing:.1em;text-transform:uppercase;")
        + p(t, x, 540, 380, size=36, d=i + 2, cls="", extra="font-weight:800;line-height:1.15;")
        + p(s_, x, 610, 380, size=25, d=i + 3)
    )
add("pasos", "Próximos pasos", sec(
    eyebrow("Próximos pasos")
    + titulo("Antes de la estrategia", size=56)
    + ph + foot(n),
))

out = Path("app/pitch/level-up-workout-briefing/diapos.ts")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(
    "/**\n * Briefing INTERNO de Level Up Workout para Jandro (nov 2026).\n"
    " * Generado con scripts/build-level-up-briefing.py: si cambia el contenido,\n"
    " * se edita el script y se vuelve a ejecutar.\n */\n\n"
    'import type { DiapoHtml } from "../maen-plan-100k/diapos";\n\n'
    "export const DIAPOS: DiapoHtml[] = "
    + json.dumps(slides, ensure_ascii=False, indent=2)
    + ";\n",
    encoding="utf-8",
)
print(len(slides), "diapositivas")
