"""Genera app/pitch/skin-laundry-briefing/diapos.ts: briefing de contenido de
Instagram para Skin Laundry, versión detallada.

Estructura:
  1. Punto de partida, ritmo y reparto.
  2. Los cinco pilares. Cada pilar abre con su diapositiva y sigue con una
     diapositiva por cada forma de contarlo: todas las de reel y todas las de
     post (carrusel o publicación única).
  3. Identidad (paleta y tipografía), cómo vamos a trabajar, rodaje, edición,
     copys, proceso, qué necesitamos de la clínica y medición.

Mismo lienzo, visor, fotos y tipografías que /pitch/skin-laundry. Paleta la del
briefing de Canva. Desde la raíz del repo:

    python3 scripts/build-skin-laundry-briefing.py
"""

import json
from pathlib import Path

A = "/pitch/skin-laundry"
INK = "#3D201D"      # Burdeos
TOPO = "#8B7165"     # Marrón topo
BEIGE = "#DCC6B5"    # Beige
CREAM = "#F7EFE4"    # Crema
LIME = "#D8EC83"     # Amarillo lima
SAND = "#EDE1D5"     # tarjetas sobre crema
SOFT = "#76594F"     # texto secundario sobre crema
SOFT_D = "rgba(247,239,228,.74)"  # texto secundario sobre burdeos
SERIF = "Newsreader, Georgia, serif"
SANS = "Figtree, Arial, sans-serif"
PIE = "All About Management × Skin Laundry · Briefing de contenido"


# ── Piezas ────────────────────────────────────────────────────────────────
def sec(body, bg=CREAM, color=INK):
    return f'<section style="background:{bg};color:{color};font-family:{SANS}">{body}</section>'


def pos(left, top, extra=""):
    return f"position:absolute;left:{left}px;top:{top}px;{extra}"


def logo(left=128, top=112, w=300, dark=True):
    f = "logo-negro.png" if dark else "logo-crema.png"
    return f'<img src="{A}/{f}" alt="Skin Laundry" style="{pos(left, top, f"width:{w}px;height:auto")}">'


def eyebrow(t, left=128, top=128, color=None, dot=LIME):
    c = color or "inherit"
    return (
        f'<p style="{pos(left, top)}display:flex;align-items:center;gap:16px;'
        f"font-family:{SANS};font-weight:600;font-size:20px;letter-spacing:3px;"
        f'text-transform:uppercase;white-space:nowrap;color:{c}">'
        f'<span style="width:14px;height:14px;border-radius:99px;background:{dot};display:inline-block"></span>{t}</p>'
    )


def titulo(t, left=128, top=190, width=1500, size=80, color="inherit", tag="h2"):
    return (
        f'<{tag} style="{pos(left, top)}width:{width}px;font-family:{SERIF};font-weight:300;'
        f'font-size:{size}px;line-height:1.06;letter-spacing:-1.5px;color:{color}">{t}</{tag}>'
    )


def texto(t, left, top, width, size=26, color="inherit", weight=400, extra=""):
    return (
        f'<p style="{pos(left, top)}width:{width}px;font-size:{size}px;line-height:1.42;'
        f'font-weight:{weight};color:{color};{extra}">{t}</p>'
    )


def foto(src, alt, left, top, w, h, opos="50% 50%", radius=0, extra=""):
    return (
        f'<img src="{A}/{src}" alt="{alt}" style="{pos(left, top)}width:{w}px;height:{h}px;'
        f'object-fit:cover;object-position:{opos};border-radius:{radius}px;{extra}">'
    )


def pie(dark=False):
    c = SOFT_D if dark else SOFT
    return (
        f'<p style="position:absolute;left:128px;right:128px;bottom:52px;display:flex;'
        f"justify-content:space-between;font-size:17px;letter-spacing:2px;text-transform:uppercase;"
        f'color:{c}"><span>{PIE}</span><span>§N§</span></p>'
    )


def caja(left, top, w, h, bg=SAND, radius=22, extra=""):
    return f'<div style="{pos(left, top)}width:{w}px;height:{h}px;border-radius:{radius}px;background:{bg};{extra}"></div>'


def etiqueta(t, left, top, color=TOPO, width=None):
    wd = f"width:{width}px;" if width else "white-space:nowrap;"
    return (
        f'<p style="{pos(left, top)}{wd}font-size:17px;font-weight:600;letter-spacing:2.5px;'
        f'text-transform:uppercase;color:{color}">{t}</p>'
    )


def pastilla(t, left, top, bg=LIME, color=INK, size=21):
    return (
        f'<p style="{pos(left, top)}padding:10px 22px;border-radius:999px;background:{bg};color:{color};'
        f'font-size:{size}px;font-weight:600;letter-spacing:.5px;white-space:nowrap">{t}</p>'
    )


def lista(items, left, top, width, size=23, color="inherit", gap=14, marca="—", marca_color=TOPO):
    """Lista en flujo dentro de un bloque posicionado: cada punto ocupa lo que necesite."""
    li = "".join(
        f'<p style="display:flex;gap:14px;margin-top:{0 if i == 0 else gap}px;font-size:{size}px;line-height:1.4;color:{color}">'
        f'<span style="flex:none;color:{marca_color}">{marca}</span><span>{t}</span></p>'
        for i, t in enumerate(items)
    )
    return f'<div style="{pos(left, top)}width:{width}px">{li}</div>'


def pasos(items, left, top, width, size=22, gap=16, acento=TOPO, color="inherit"):
    """Pasos numerados: (marca corta, texto)."""
    li = "".join(
        f'<div style="display:flex;gap:18px;margin-top:{0 if i == 0 else gap}px">'
        f'<p style="flex:none;width:112px;font-size:15px;font-weight:700;letter-spacing:1.5px;'
        f'text-transform:uppercase;color:{acento};padding-top:5px">{m}</p>'
        f'<p style="font-size:{size}px;line-height:1.38;color:{color}">{t}</p></div>'
        for i, (m, t) in enumerate(items)
    )
    return f'<div style="{pos(left, top)}width:{width}px">{li}</div>'


# ── Maqueta de pieza (reel 9:16 o post 4:5) ───────────────────────────────
def maqueta(kind, img=None, opos="50% 50%", tag="", tit="", cta="", fondo=None, split=None, nota=""):
    """Simula la pieza con el sistema visual: logo arriba, etiqueta, titular serif y CTA."""
    if kind == "reel":
        w, h, left, top = 372, 661, 220, 232
    else:
        w, h, left, top = 452, 565, 180, 268
    inner = ""
    if split:
        a, b = split
        hh = h // 2
        inner += (
            f'<img src="{A}/{a}" alt="Antes" style="{pos(0, 0)}width:{w}px;height:{hh}px;object-fit:cover">'
            f'<img src="{A}/{b}" alt="Después" style="{pos(0, hh)}width:{w}px;height:{h - hh}px;object-fit:cover">'
            f'<p style="{pos(16, hh - 40)}font-size:13px;font-weight:700;letter-spacing:2px;color:{CREAM}">ANTES</p>'
            f'<p style="{pos(16, h - 40)}font-size:13px;font-weight:700;letter-spacing:2px;color:{CREAM}">DESPUÉS</p>'
        )
        dark = True
    elif img == "doctora":
        inner += (
            f'<div style="{pos(0, 0)}width:{w}px;height:{h}px;background:linear-gradient(180deg,{BEIGE} 0%,#CDB4A2 100%)"></div>'
            f'<div style="{pos(w // 2 - 70, h // 2 - 170)}width:140px;height:140px;border-radius:99px;background:rgba(247,239,228,.55)"></div>'
            f'<div style="{pos(w // 2 - 120, h // 2 - 22)}width:240px;height:130px;border-radius:120px 120px 0 0;background:rgba(247,239,228,.55)"></div>'
            f'<p style="{pos(0, 78)}width:{w}px;text-align:center;font-size:13px;font-weight:700;letter-spacing:2px;color:{TOPO}">RETRATO DE LA DOCTORA<br>RODAJE EN CLÍNICA</p>'
            f'<div style="{pos(0, 0)}width:{w}px;height:{h}px;background:linear-gradient(180deg,rgba(61,32,29,0) 55%,rgba(61,32,29,.78) 100%)"></div>'
        )
        dark = True
    elif img and nota:
        # Pieza ya diseñada con el sistema (ofertas): se muestra tal cual, sin capas encima
        inner += f'<img src="{A}/{img}" alt="" style="{pos(0, 0)}width:{w}px;height:{h}px;object-fit:cover;object-position:{opos}">'
        marco = f'<div style="{pos(left, top)}width:{w}px;height:{h}px;border-radius:24px;overflow:hidden;box-shadow:0 26px 60px rgba(61,32,29,.22)">{inner}</div>'
        return marco + etiqueta(nota, left, top + h + 26, SOFT, width=w)
    elif img:
        inner += f'<img src="{A}/{img}" alt="" style="{pos(0, 0)}width:{w}px;height:{h}px;object-fit:cover;object-position:{opos}">'
        inner += f'<div style="{pos(0, 0)}width:{w}px;height:{h}px;background:linear-gradient(180deg,rgba(61,32,29,.28) 0%,rgba(61,32,29,0) 22%,rgba(61,32,29,0) 45%,rgba(61,32,29,.82) 100%)"></div>'
        dark = True
    else:
        dark = fondo == INK
        inner += f'<div style="{pos(0, 0)}width:{w}px;height:{h}px;background:{fondo or CREAM}"></div>'
    fg = CREAM if dark else INK
    inner += f'<img src="{A}/{"logo-crema.png" if dark else "logo-negro.png"}" alt="Skin Laundry" style="{pos(w // 2 - 62, 26)}width:124px;height:auto">'
    if not split:
        y = h - 205 if kind == "reel" else h - 195
        if not img:
            y = 120
            # Líneas de texto simuladas y contador, como en un interior de carrusel
            for r, ancho in enumerate([w - 56, w - 90, w - 130, w - 70, w - 150]):
                inner += f'<div style="{pos(28, 300 + r * 26)}width:{ancho}px;height:8px;border-radius:4px;background:{"rgba(247,239,228,.22)" if dark else "rgba(61,32,29,.12)"}"></div>'
            if kind != "reel":
                inner += f'<p style="position:absolute;right:28px;bottom:32px;font-size:13px;font-weight:700;letter-spacing:2px;color:{LIME if dark else TOPO}">01 / 05</p>'
        tag_c = LIME if dark else TOPO
        inner += (
            f'<p style="{pos(28, y)}font-size:13px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:{tag_c}">{tag}</p>'
            f'<p style="{pos(28, y + 28)}width:{w - 56}px;font-family:{SERIF};font-weight:300;font-size:{34 if kind == "reel" else 36}px;line-height:1.08;color:{fg}">{tit}</p>'
        )
        if cta:
            inner += (
                f'<p style="position:absolute;left:28px;bottom:26px;padding:7px 16px;border-radius:99px;'
                f'background:{LIME};color:{INK};font-size:14px;font-weight:700;white-space:nowrap">{cta}</p>'
            )
    else:
        inner += (
            f'<p style="position:absolute;right:20px;bottom:24px;padding:7px 16px;border-radius:99px;'
            f'background:{LIME};color:{INK};font-size:14px;font-weight:700;white-space:nowrap">{cta}</p>'
        )
    marco = (
        f'<div style="{pos(left, top)}width:{w}px;height:{h}px;border-radius:24px;overflow:hidden;'
        f'box-shadow:0 26px 60px rgba(61,32,29,.22)">{inner}</div>'
    )
    if kind == "reel":
        marco += f'<p style="{pos(left + w - 74, top + 18)}font-size:12px;font-weight:700;letter-spacing:1.5px;color:{CREAM};opacity:.85">REEL</p>'
    pie_m = nota or ("Reel · vertical 9:16" if kind == "reel" else "Post · 4:5")
    marco += etiqueta(pie_m, left, top + h + 26, SOFT, width=w)
    return marco


# ── Diapositivas ──────────────────────────────────────────────────────────
D = []


def add(id_, titulo_, html):
    # El número del pie sale del orden real: mover o quitar diapositivas no descuadra nada
    D.append({"id": id_, "titulo": titulo_, "html": html.replace("§N§", f"{len(D) + 1:02d}")})


# ── Contenido de los pilares ──────────────────────────────────────────────
# Cada formato: nombre, qué es, estructura [(marca, texto)], ejemplo, cómo se
# graba o diseña, duración/extensión, CTA, qué medimos, maqueta.
PILARES = [
    {
        "id": "equipo-medico",
        "nombre": "Equipo médico",
        "objetivo": "Dar una voz propia a la cuenta. En medicina estética se confía en personas: las doctoras como caras recurrentes.",
        "porque": "En el análisis, lo que más conversa tiene cara. El reel de neuromoduladores explicado por el equipo médico sumó 10 comentarios, cinco veces la media de la cuenta, y en la competencia un reel de una doctora de Toral sobre el mismo tema llegó a 35.500 reproducciones.",
        "foto": ("inyeccion.jpg", "72% 40%"),
        "mide": "Comentarios con preguntas y mensajes directos.",
        "mes": "2 reels + 1 post al mes",
        "reels": [
            dict(n="La doctora responde",
                 que="Una duda real de la gente, respondida a cámara por una doctora en menos de 30 segundos.",
                 est=[("0–2 s", "La pregunta escrita en pantalla y la doctora mirando a cámara."),
                      ("2–20 s", "La respuesta en tres ideas, frases cortas, sin tecnicismos."),
                      ("20–25 s", "Una frase de cierre y la invitación a preguntar.")],
                 ej="«¿Duele el láser facial?»",
                 como="Plano medio centrado, micrófono de solapa, cabina de fondo. Rótulo con nombre y especialidad en los primeros segundos.",
                 dur="20–30 s", cta="¿Qué le preguntarías a la doctora?",
                 m=dict(img="doctora", tag="La doctora responde", tit="¿Duele el <i>láser</i>?", cta="Pregúntanos")),
            dict(n="La doctora opina de una tendencia",
                 que="La doctora da su veredicto sobre algo que la gente ya está buscando en redes.",
                 est=[("0–2 s", "La tendencia en pantalla: «¿Funciona…?»."),
                      ("2–6 s", "El veredicto en una frase: sí, no o depende."),
                      ("6–25 s", "Por qué, y qué haría ella en su lugar."),
                      ("Cierre", "Qué tratamiento de la clínica responde a esa búsqueda.")],
                 ej="«¿Funciona el <i>glass skin</i> coreano?»",
                 como="Igual que «La doctora responde», con un recurso de la tendencia en pantalla partida o de fondo.",
                 dur="25–40 s", cta="Comenta GLOW y te contamos",
                 m=dict(img="inyeccion.jpg", opos="78% 40%", tag="Tendencias", tit="¿Funciona el <i>glass skin</i>?", cta="Comenta GLOW")),
            dict(n="Lo que más me piden",
                 que="La doctora cuenta qué tratamientos le piden más en cada época del año y por qué.",
                 est=[("Gancho", "«Lo que más me piden en otoño», con la doctora en cabina."),
                      ("1, 2, 3", "Tres tratamientos, cada uno con un plano de recurso."),
                      ("Cierre", "Para quién es cada uno y cómo empezar.")],
                 ej="«Lo que más me piden en otoño: manchas, textura y luminosidad»",
                 como="La doctora a cámara intercalada con planos de cada tratamiento grabados el mismo día.",
                 dur="30–40 s", cta="Reserva tu valoración desde la bio",
                 m=dict(img="laser-vertical.jpg", opos="50% 40%", tag="Temporada", tit="Lo que más me piden en <i>otoño</i>", cta="Reserva")),
            dict(n="Lo que yo nunca haría",
                 que="Consejo honesto en primera persona: lo que la doctora evita en su piel. Gancho alto y mucha credibilidad.",
                 est=[("0–2 s", "«Soy médica estética y nunca haría esto en mi piel»."),
                      ("2–25 s", "Tres errores habituales y la alternativa a cada uno."),
                      ("Cierre", "«Si tienes dudas, pregúntame»."),],
                 ej="«Tres cosas que nunca haría en mi piel»",
                 como="Ritmo rápido, cortes en cada punto y el número en pantalla. Contenido validado por el equipo médico.",
                 dur="20–30 s", cta="Guárdalo y compártelo",
                 m=dict(img="inyeccion.jpg", opos="85% 30%", tag="Consejo médico", tit="Lo que yo <i>nunca</i> haría", cta="Guárdalo")),
            dict(n="Un día con la doctora",
                 que="El lado humano: la jornada de una doctora en la clínica de Diagonal, de la llegada al último paciente.",
                 est=[("Llegada", "Entrada a la clínica y preparación de la cabina."),
                      ("Día", "Valoraciones, tratamientos y momentos con el equipo."),
                      ("Cierre", "Una frase suya sobre por qué hace lo que hace.")],
                 ej="«Un día en Skin Laundry con la Dra. Nataly Revelo»",
                 como="Planos cortos de 1–2 segundos con voz en off de la doctora. Sin mostrar a pacientes sin consentimiento.",
                 dur="30–45 s", cta="Ven a conocernos",
                 m=dict(img="dos-mujeres.jpg", opos="50% 20%", tag="Detrás de cámara", tit="Un día con la <i>doctora</i>", cta="Conócenos")),
        ],
        "posts": [
            dict(n="Presentación de la doctora",
                 que="Carrusel para conocer a cada doctora: quién es, en qué se especializa y cómo trabaja.",
                 est=[("01", "Retrato a sangre con su nombre."),
                      ("02", "Formación y especialidad, en dos líneas."),
                      ("03", "Su tratamiento favorito y por qué."),
                      ("04", "Una frase suya entre comillas."),
                      ("05", "Cómo reservar una valoración con ella.")],
                 ej="«Te presentamos a la Dra. Farah Anani»",
                 como="Retrato en clínica con luz cálida y fondo neutro. Los textos, con la plantilla del pilar.",
                 dur="Carrusel · 5 diapositivas", cta="Reserva tu valoración con ella",
                 m=dict(img="doctora", tag="Equipo médico", tit="Te presentamos a la <i>doctora</i>", cta="Desliza")),
            dict(n="El protocolo de la doctora",
                 que="La doctora explica y firma su protocolo para un problema concreto.",
                 est=[("Portada", "El problema y el nombre del protocolo."),
                      ("Interior", "Paso a paso: valoración, sesiones, cuidados."),
                      ("Resultado", "Qué esperar y en cuánto tiempo."),
                      ("Cierre", "Su firma y cómo empezar.")],
                 ej="«Mi protocolo para las manchas tras el verano»",
                 como="Tipográfico sobre crema, con una foto de la doctora en la portada y en el cierre.",
                 dur="Carrusel · 5–6 diapositivas", cta="Comenta MANCHAS",
                 m=dict(fondo=CREAM, tag="El protocolo de la doctora", tit="Mi protocolo para las <i>manchas</i>", cta="Comenta MANCHAS")),
            dict(n="Consejos de temporada",
                 que="Tres consejos breves de la doctora para el momento del año.",
                 est=[("Portada", "«Tres claves para esta temporada»."),
                      ("01–03", "Un consejo por diapositiva, con una línea de explicación."),
                      ("Cierre", "Firma de la doctora y llamada a guardar.")],
                 ej="«Tres claves para cuidar la piel en invierno»",
                 como="Portada con foto de la doctora, interiores tipográficos. Numeración grande.",
                 dur="Carrusel · 5 diapositivas", cta="Guárdalo para este invierno",
                 m=dict(img="inyeccion.jpg", opos="80% 40%", tag="Consejo de la doctora", tit="Tres claves para el <i>invierno</i>", cta="Guárdalo")),
            dict(n="Tu primera valoración",
                 que="Qué pasa en la primera visita, contado por la doctora para quitar el miedo a reservar.",
                 est=[("01", "Llegas y hablamos de lo que te preocupa."),
                      ("02", "Analizamos tu piel."),
                      ("03", "Te proponemos un plan y su precio."),
                      ("04", "Decides sin compromiso.")],
                 ej="«Así es tu primera valoración en Skin Laundry»",
                 como="Fotos reales de la valoración en clínica, una por paso.",
                 dur="Carrusel · 5–6 diapositivas", cta="Reserva desde la bio",
                 m=dict(img="laser-beige.jpg", opos="62% 50%", tag="Primera visita", tit="Así es tu <i>primera</i> valoración", cta="Reserva")),
            dict(n="La frase de la doctora",
                 que="Publicación única con un retrato y una frase suya. Sencilla, de marca y fácil de producir.",
                 est=[("Imagen", "Retrato de la doctora a sangre."),
                      ("Texto", "Una frase corta entre comillas, en serif."),
                      ("Firma", "Nombre y especialidad.")],
                 ej="«La mejor piel es la que se cuida con constancia»",
                 como="Sale del mismo rodaje que los reels: un retrato limpio por doctora y temporada.",
                 dur="Publicación única", cta="Copy con pregunta abierta",
                 m=dict(img="doctora", tag="Dra. Nataly Revelo", tit="«La piel se cuida con <i>constancia</i>»", cta="")),
        ],
    },
    {
        "id": "antes-despues",
        "nombre": "Antes y después",
        "objetivo": "Demostrar que funciona: la prueba que decide una reserva.",
        "porque": "Es de lo más presente en la cuenta, pero siempre en la misma plantilla y sin historia, así que pasa desapercibido. En la competencia, el antes y después de una paciente de InOut con nombre propio y «Comenta INFO» sumó 307 comentarios.",
        "foto": ("mujer-perfil.jpg", "76% 50%"),
        "mide": "Mensajes por palabra clave, guardados y consultas.",
        "mes": "2 reels + 2 posts al mes",
        "reels": [
            dict(n="El caso contado por la doctora",
                 que="La doctora explica un caso real mientras se ve el resultado: qué preocupaba, qué se hizo y por qué.",
                 est=[("0–2 s", "El resultado primero: antes y después en pantalla."),
                      ("2–8 s", "La doctora: «Venía por las manchas del verano»."),
                      ("8–15 s", "El tratamiento, en planos de la sesión."),
                      ("15–20 s", "El resultado y el número de sesiones."),
                      ("20–23 s", "«¿Es para ti? Comenta INFO».")],
                 ej="«Melasma: tres sesiones, un tono más uniforme»",
                 como="Fotos del caso con la misma luz y encuadre, más la doctora a cámara y planos de la sesión.",
                 dur="20–25 s", cta="Comenta INFO",
                 m=dict(split=("ba-melasma-antes.jpg", "ba-melasma-despues.jpg"), cta="Comenta INFO")),
            dict(n="La evolución, sesión a sesión",
                 que="La misma piel en la primera, la tercera y la quinta sesión. Enseña el proceso, no solo el final.",
                 est=[("Sesión 1", "Punto de partida, con fecha en pantalla."),
                      ("Sesión 3", "El cambio intermedio."),
                      ("Sesión 5", "El resultado."),
                      ("Cierre", "Cuántas semanas y qué tratamiento.")],
                 ej="«Cinco sesiones de láser facial en ocho semanas»",
                 como="Siempre el mismo ángulo, la misma distancia y la misma luz en cada sesión. Se marca la posición en el suelo.",
                 dur="10–15 s", cta="Comenta INFO",
                 m=dict(img="ba-manchas-despues.jpg", opos="50% 50%", tag="Sesión 1 · 3 · 5", tit="La piel, <i>sesión a sesión</i>", cta="Comenta INFO")),
            dict(n="La transición",
                 que="Un corte en el gesto pasa del antes al después. Pieza corta, muy visual y de mucho alcance.",
                 est=[("0–3 s", "El antes, con un gesto: girar la cara, pasar la mano."),
                      ("3–6 s", "Corte en el gesto y aparece el después."),
                      ("6–10 s", "Texto mínimo: problema y tratamiento.")],
                 ej="«Del acné a una piel más lisa»",
                 como="Se graban el antes y el después con el mismo encuadre y el mismo gesto para que el corte encaje.",
                 dur="8–12 s", cta="Comenta INFO",
                 m=dict(split=("ba-acne-antes.jpg", "ba-acne-despues.jpg"), cta="Comenta INFO")),
            dict(n="La clienta lo cuenta",
                 que="Una clienta real, con nombre y consentimiento, explica por qué vino y cómo se siente ahora.",
                 est=[("Gancho", "Su frase más potente, a cámara."),
                      ("Historia", "Qué le preocupaba y por qué eligió Skin Laundry."),
                      ("Resultado", "El antes y después de su piel."),
                      ("Cierre", "Qué le diría a alguien que duda.")],
                 ej="«Venía por las manchas y ahora no me maquillo»",
                 como="Entrevista corta en la clínica, plano medio y luz cálida. Consentimiento firmado antes de grabar.",
                 dur="30–45 s", cta="Comenta INFO",
                 m=dict(img="mujer-perfil.jpg", opos="74% 40%", tag="Su historia", tit="«Ahora <i>no me maquillo</i>»", cta="Comenta INFO")),
        ],
        "posts": [
            dict(n="El caso, en carrusel",
                 que="La comparativa en portada y el caso contado en el interior.",
                 est=[("01", "Antes y después, con el problema como etiqueta."),
                      ("02", "El caso: qué le preocupaba, en sus palabras."),
                      ("03", "El tratamiento y el número de sesiones."),
                      ("04", "Qué notó y en cuánto tiempo."),
                      ("05", "«¿Es para ti? Comenta INFO».")],
                 ej="«Antes y después · Melasma»",
                 como="Portada sobre crema con las dos fotos a la misma altura. Interiores tipográficos.",
                 dur="Carrusel · 5 diapositivas", cta="Comenta INFO",
                 m=dict(split=("ba-manchas-antes.jpg", "ba-manchas-despues.jpg"), cta="Comenta INFO")),
            dict(n="Por problema",
                 que="Varios casos de un mismo problema en un solo carrusel, para que cada persona se reconozca.",
                 est=[("Portada", "«Manchas: cuatro casos reales»."),
                      ("Casos", "Un antes y después por diapositiva, con una línea de contexto."),
                      ("Cierre", "Qué tratamiento se usó y cómo empezar.")],
                 ej="«Manchas tras el verano: cuatro casos reales»",
                 como="Todos los casos con la misma maquetación para que se lean como serie.",
                 dur="Carrusel · 6 diapositivas", cta="Comenta MANCHAS",
                 m=dict(fondo=CREAM, tag="Antes y después · Manchas", tit="Cuatro <i>casos reales</i>", cta="Comenta MANCHAS")),
            dict(n="Mismo tratamiento, distintas pieles",
                 que="Un tratamiento aplicado a pieles y edades diferentes. Rompe la idea de «esto no es para mí».",
                 est=[("Portada", "El tratamiento como protagonista."),
                      ("Casos", "Tres o cuatro pieles distintas, cada una con su resultado."),
                      ("Cierre", "Para quién es y para quién no.")],
                 ej="«Láser facial en cuatro tipos de piel»",
                 como="Elegir casos variados en tono, edad y problema. Mismas reglas de luz y encuadre.",
                 dur="Carrusel · 5–6 diapositivas", cta="Reserva tu valoración",
                 m=dict(split=("ba-acne-antes.jpg", "ba-acne-despues.jpg"), cta="Desliza")),
            dict(n="La comparativa única",
                 que="Publicación de una sola imagen: el antes y el después, sobrio, con el problema y el número de sesiones.",
                 est=[("Imagen", "Antes y después a la misma altura."),
                      ("Etiqueta", "Problema y tratamiento."),
                      ("Dato", "Número de sesiones y semanas.")],
                 ej="«Acné · 4 sesiones · 10 semanas»",
                 como="Útil para semanas con poco material. El caso, en el copy.",
                 dur="Publicación única", cta="Comenta INFO",
                 m=dict(split=("ba-melasma-antes.jpg", "ba-melasma-despues.jpg"), cta="4 sesiones")),
        ],
    },
    {
        "id": "informativo",
        "nombre": "Informativo",
        "objetivo": "Resolver dudas reales. Es el contenido que más se guarda y el que trae a quien todavía no conoce la clínica.",
        "porque": "La educación tiene buen fondo en la cuenta (mitos del láser, piel seca o deshidratada), pero casi siempre va en carrusel, y un reel recibe cuatro veces más comentarios que un carrusel. El reel «Korean Skin», que respondía a una curiosidad concreta, sumó 18 comentarios.",
        "foto": ("dos-mujeres.jpg", "60% 50%"),
        "mide": "Guardados, compartidos y alcance a no seguidores.",
        "mes": "1 reel + 3 posts al mes",
        "reels": [
            dict(n="Nos habéis preguntado",
                 que="Una pregunta real que ha llegado por comentarios, mensajes o WhatsApp, respondida en pantalla.",
                 est=[("0–2 s", "La captura del comentario o la pregunta en pantalla."),
                      ("2–20 s", "La respuesta, clara y en pocas frases."),
                      ("Cierre", "«Déjanos tu pregunta y la respondemos»." )],
                 ej="«¿Cada cuánto hay que repetir el láser?»",
                 como="Una persona del equipo a cámara o planos de clínica con texto en pantalla.",
                 dur="15–25 s", cta="Déjanos tu pregunta",
                 m=dict(img="laser-vertical.jpg", opos="50% 40%", tag="Nos habéis preguntado", tit="¿Cada cuánto <i>repetir</i>?", cta="Pregúntanos")),
            dict(n="Mitos en 30 segundos",
                 que="Tres creencias falsas, desmontadas una a una.",
                 est=[("Gancho", "«Tres mitos del láser que tienes que olvidar»."),
                      ("Mito 1–3", "El mito tachado en pantalla y la realidad en una frase."),
                      ("Cierre", "«¿Cuál te creías?».")],
                 ej="«Tres mitos del láser facial»",
                 como="Ritmo rápido: un corte por mito. Texto grande y legible sin sonido.",
                 dur="20–30 s", cta="¿Cuál te creías?",
                 m=dict(img="laser-beige.jpg", opos="70% 40%", tag="Mitos", tit="Tres mitos del <i>láser</i>", cta="Comenta")),
            dict(n="Esto sí, esto no",
                 que="Qué hacer y qué evitar en una situación concreta. Muy guardable.",
                 est=[("Gancho", "«Acabas de hacerte un láser: esto sí y esto no»."),
                      ("Sí / No", "Pares de consejos con un icono de sí o no en pantalla."),
                      ("Cierre", "«Guárdalo para tu próxima sesión».")],
                 ej="«Después del láser: esto sí, esto no»",
                 como="Planos de producto y de rutina en la clínica. Contenido validado por el equipo médico.",
                 dur="15–25 s", cta="Guárdalo",
                 m=dict(img="ig-mascarilla.jpg", opos="50% 40%", tag="Esto sí · esto no", tit="Después del <i>láser</i>", cta="Guárdalo")),
            dict(n="Explicado con un ejemplo",
                 que="Un concepto difícil explicado con algo visual y cotidiano.",
                 est=[("Gancho", "La pregunta: «¿Seca o deshidratada?»."),
                      ("Demo", "Un recurso visual que lo explique en segundos."),
                      ("Cierre", "Cómo saber cuál es la tuya.")],
                 ej="«¿Piel seca o deshidratada? Te lo explico con una esponja»",
                 como="Mesa de la clínica, planos cenitales y manos de la doctora.",
                 dur="20–30 s", cta="¿Cuál es la tuya?",
                 m=dict(fondo=BEIGE, tag="Dudas de piel", tit="¿Seca o <i>deshidratada</i>?", cta="Comenta")),
        ],
        "posts": [
            dict(n="Pregunta y respuesta",
                 que="Carrusel tipográfico que resuelve una sola duda, diapositiva a diapositiva.",
                 est=[("Portada", "La pregunta, en serif grande."),
                      ("Interior", "Una idea por diapositiva, numerada."),
                      ("Cierre", "Resumen en una frase y «guárdalo».")],
                 ej="«¿Piel seca o deshidratada?»",
                 como="Fondo crema o beige, sin fotos en el interior. Máximo 25 palabras por diapositiva.",
                 dur="Carrusel · 5–7 diapositivas", cta="Guárdalo",
                 m=dict(fondo=CREAM, tag="Dudas de piel", tit="¿Piel seca o <i>deshidratada</i>?", cta="Desliza →")),
            dict(n="Guía por problema",
                 que="Del problema al tratamiento: ayuda a elegir y conecta con el catálogo de la clínica.",
                 est=[("Portada", "«¿Qué tratamiento necesita mi piel?»."),
                      ("Problemas", "Manchas, textura, poros, flacidez: uno por diapositiva."),
                      ("Cierre", "«Si no lo tienes claro, te lo decimos en la valoración».")],
                 ej="«¿Qué tratamiento necesita tu piel este otoño?»",
                 como="Cada problema con una foto de detalle y el tratamiento recomendado.",
                 dur="Carrusel · 6–7 diapositivas", cta="Comenta MI PIEL",
                 m=dict(img="mujer-perfil.jpg", opos="76% 40%", tag="Guía", tit="¿Qué necesita <i>tu piel</i>?", cta="Comenta MI PIEL")),
            dict(n="A frente a B",
                 que="Comparativa entre dos tratamientos o conceptos que la gente confunde.",
                 est=[("Portada", "«Láser o Hydrafacial»."),
                      ("Interior", "Qué hace cada uno, para quién, duración y resultados."),
                      ("Cierre", "Cuándo elegir uno u otro.")],
                 ej="«Láser facial o Hydrafacial: ¿cuál necesitas?»",
                 como="Diseño en dos columnas, siempre con la misma estructura.",
                 dur="Carrusel · 5 diapositivas", cta="Guárdalo",
                 m=dict(fondo=INK, tag="Comparativa", tit="Láser <i>o</i> Hydrafacial", cta="Desliza →")),
            dict(n="Explicado fácil",
                 que="Un término o ingrediente que suena mucho, explicado en lenguaje de la calle.",
                 est=[("Portada", "«Exosomas, explicado fácil»."),
                      ("Interior", "Qué es, qué hace, para quién."),
                      ("Cierre", "Cómo se usa en la clínica.")],
                 ej="«Exosomas, explicado fácil»",
                 como="Tipográfico, con una foto del tratamiento en la última diapositiva.",
                 dur="Carrusel · 4–5 diapositivas", cta="Comenta EXOSOMAS",
                 m=dict(fondo=CREAM, tag="Explicado fácil", tit="<i>Exosomas</i>, sin tecnicismos", cta="Desliza →")),
            dict(n="Lista de comprobación",
                 que="Lo que hay que saber o hacer antes de algo. Pieza práctica para guardar.",
                 est=[("Portada", "«Antes de tu primera sesión»."),
                      ("Interior", "Cinco puntos con casilla de verificación."),
                      ("Cierre", "Reserva y WhatsApp.")],
                 ej="«Antes de tu primera sesión de láser»",
                 como="Diseño tipo lista, con casillas en lima como único acento.",
                 dur="Carrusel · 4–5 diapositivas", cta="Guárdalo",
                 m=dict(fondo=CREAM, tag="Antes de venir", tit="Tu <i>primera</i> sesión", cta="Guárdalo")),
        ],
    },
    {
        "id": "tratamientos",
        "nombre": "Tratamientos en vivo",
        "objetivo": "Quitar el miedo a la primera vez y enseñar la tecnología. Es la experiencia Skin Laundry contada desde dentro.",
        "porque": "Las novedades (Exion, GlowTox, exosomas, Regeneye) se han presentado como ficha de producto. Lo que funcionó fue la curiosidad: el reel que presentaba Exion con un gancho conocido sumó 23 comentarios, el máximo del semestre junto a la colaboración con una creadora.",
        "foto": ("laser-beige.jpg", "78% 40%"),
        "mide": "Retención del reel, reproducciones y clics a reserva.",
        "mes": "2 reels + 1 post al mes",
        "reels": [
            dict(n="La sesión completa",
                 que="Un tratamiento de principio a fin, acelerado, para que se vea lo fácil y rápido que es.",
                 est=[("0–2 s", "«15 minutos, de principio a fin»."),
                      ("Llegada", "Recepción y cabina."),
                      ("Sesión", "Los pasos del tratamiento, acelerados."),
                      ("Salida", "La clienta sale y sigue con su día.")],
                 ej="«Láser facial en 15 minutos»",
                 como="Una sesión real grabada entera con dos cámaras: general y detalle. Reloj en pantalla.",
                 dur="20–30 s", cta="Reserva tu primera sesión",
                 m=dict(img="laser-beige.jpg", opos="85% 35%", tag="En vivo", tit="15 minutos, <i>de principio a fin</i>", cta="Reserva")),
            dict(n="Ven conmigo",
                 que="Una creadora o clienta del público objetivo cuenta su visita en primera persona.",
                 est=[("Gancho", "«Ven conmigo a hacerme mi primer láser»."),
                      ("Visita", "Llegada, valoración y sesión, con su voz."),
                      ("Opinión", "Qué ha sentido y qué le ha parecido."),
                      ("Cierre", "Mención a la clínica y a la reserva.")],
                 ej="«Ven conmigo a Skin Laundry»",
                 como="Formato de creadora, más espontáneo, pero con la misma luz y los rótulos de la marca.",
                 dur="30–45 s", cta="Reserva desde la bio",
                 m=dict(img="ig-selfie.jpg", opos="50% 30%", tag="Ven conmigo", tit="Mi primer <i>láser facial</i>", cta="Reserva")),
            dict(n="La tecnología, de cerca",
                 que="Planos detalle de la máquina y del tratamiento con su sonido real. Hipnótico y muy visual.",
                 est=[("0–3 s", "Plano detalle de la tecnología en marcha."),
                      ("3–15 s", "Secuencia de detalles: luz, textura, manos."),
                      ("Cierre", "Qué hace en una frase.")],
                 ej="«Exion, de cerca»",
                 como="Macro y luz cálida, sonido ambiente real, sin música que lo tape.",
                 dur="10–20 s", cta="Comenta EXION",
                 m=dict(img="laser-vertical.jpg", opos="50% 30%", tag="De cerca", tit="La tecnología, <i>de cerca</i>", cta="Comenta EXION")),
            dict(n="Desde la camilla",
                 que="El punto de vista de la clienta: lo que ve y lo que siente durante la sesión.",
                 est=[("Gancho", "«Así se ve un láser desde la camilla»."),
                      ("Sesión", "Planos subjetivos y textos con sensaciones."),
                      ("Cierre", "«¿Te animas?».")],
                 ej="«Así se siente un láser facial»",
                 como="Cámara pequeña a la altura de la cara de la clienta. Texto de sensaciones en pantalla.",
                 dur="15–20 s", cta="¿Te animas?",
                 m=dict(img="ig-mascarilla.jpg", opos="50% 40%", tag="Desde la camilla", tit="Así se <i>siente</i>", cta="Comenta")),
            dict(n="La novedad, en uso",
                 que="Un tratamiento nuevo presentado en una sesión real, no como ficha de producto.",
                 est=[("Gancho", "La curiosidad: «El tratamiento que todo el mundo pregunta»."),
                      ("Sesión", "Cómo se aplica, con la doctora explicándolo."),
                      ("Cierre", "Para quién es y desde cuándo está en la clínica.")],
                 ej="«Regeneye: así es en la cabina»",
                 como="Doctora y clienta en sesión. El nombre del tratamiento, en la etiqueta del pilar.",
                 dur="25–35 s", cta="Comenta INFO",
                 m=dict(img="inyeccion.jpg", opos="78% 40%", tag="Novedad", tit="Así es en la <i>cabina</i>", cta="Comenta INFO")),
        ],
        "posts": [
            dict(n="Paso a paso",
                 que="La sesión contada en fotos, una por paso, para saber qué esperar.",
                 est=[("01", "Valoración de tu piel."),
                      ("02", "Limpieza y preparación."),
                      ("03", "El tratamiento."),
                      ("04", "Cuidados y resultado.")],
                 ej="«Qué pasa en tu sesión de láser»",
                 como="Fotos del mismo rodaje que la sesión completa. Texto mínimo sobre foto a sangre.",
                 dur="Carrusel · 5 diapositivas", cta="Reserva desde la bio",
                 m=dict(img="laser-beige.jpg", opos="62% 50%", tag="Paso a paso", tit="Qué pasa en <i>tu sesión</i>", cta="Desliza →")),
            dict(n="La tecnología explicada",
                 que="Qué hace la máquina, qué notarás y por qué es diferente.",
                 est=[("Portada", "Foto detalle y nombre de la tecnología."),
                      ("Interior", "Qué hace, qué notarás, cuántas sesiones."),
                      ("Cierre", "Para quién es.")],
                 ej="«Qué hace el láser de Skin Laundry»",
                 como="Fotos detalle de la tecnología y una ilustración simple si ayuda.",
                 dur="Carrusel · 4–5 diapositivas", cta="Comenta LÁSER",
                 m=dict(img="laser-vertical.jpg", opos="50% 35%", tag="Tecnología", tit="Qué hace <i>el láser</i>", cta="Comenta LÁSER")),
            dict(n="Antes, durante y después",
                 que="Qué esperar en cada momento: la preparación, la sesión y los días siguientes.",
                 est=[("Antes", "Qué hacer los días previos."),
                      ("Durante", "Qué se siente y cuánto dura."),
                      ("Después", "Qué es normal y cuándo se ve el resultado.")],
                 ej="«Tu sesión: antes, durante y después»",
                 como="Tres bloques con la misma estructura. Contenido validado por el equipo médico.",
                 dur="Carrusel · 4 diapositivas", cta="Guárdalo",
                 m=dict(fondo=CREAM, tag="Qué esperar", tit="Antes, durante y <i>después</i>", cta="Guárdalo")),
            dict(n="La ficha del tratamiento",
                 que="Lo esencial de un tratamiento en una pieza que también sirve para los destacados.",
                 est=[("01", "Qué es, en una frase."),
                      ("02", "Para quién."),
                      ("03", "Duración y sesiones."),
                      ("04", "Precio o «desde» y cómo reservar.")],
                 ej="«GlowTox, en una ficha»",
                 como="Foto real de la clínica y la plantilla del catálogo de destacados.",
                 dur="Carrusel · 4–5 diapositivas", cta="Reserva desde la bio",
                 m=dict(img="laser-vertical.jpg", opos="50% 40%", tag="Catálogo", tit="GlowTox, <i>en una ficha</i>", cta="Reserva")),
        ],
    },
    {
        "id": "ofertas",
        "nombre": "Ofertas y membresía",
        "objetivo": "Convertir. Es el pilar que lleva directamente a la reserva, con la estética de la marca y no con plantillas sueltas.",
        "porque": "Las promociones existen (primer láser por 75 €, Summer Glow, Halloween), pero cada una llega con su propia estética: tipografías de campaña, fondos azules y rótulos en negrita que restan aire premium. En la competencia, la mecánica que más convierte es «Comenta X y te lo enviamos por mensaje».",
        "foto": ("ofertas", ""),
        "mide": "Mensajes, clics a reserva y reservas atribuidas.",
        "mes": "1 reel + 1 post al mes, más en campaña",
        "reels": [
            dict(n="Primera visita, con la oferta al final",
                 que="Se cuenta la experiencia de la primera sesión y la oferta llega como cierre, no como gancho.",
                 est=[("Gancho", "«Si nunca te has hecho un láser, empieza así»."),
                      ("Visita", "Planos de la sesión y de la clienta."),
                      ("Oferta", "«Tu primer láser facial, 75 €»."),
                      ("Cierre", "Cómo reservar.")],
                 ej="«Tu primer láser facial por 75 €»",
                 como="Material de la sesión completa reutilizado. La oferta, en la plantilla burdeos.",
                 dur="15–25 s", cta="Reserva desde la bio",
                 m=dict(img="oferta-primer-laser-story.jpg", opos="50% 50%", nota="Reel · vertical 9:16")),
            dict(n="La membresía, contada por una clienta",
                 que="Una clienta explica qué incluye su membresía y por qué le compensa.",
                 est=[("Gancho", "«Por qué tengo la membresía de Skin Laundry»."),
                      ("Uso", "Cada cuánto viene y qué se hace."),
                      ("Valor", "Qué incluye y cuánto se ahorra."),
                      ("Cierre", "Cómo apuntarse.")],
                 ej="«Mi rutina de piel es mensual»",
                 como="Entrevista corta en la clínica, plano medio, con planos de su sesión.",
                 dur="25–40 s", cta="Comenta MEMBRESÍA",
                 m=dict(img="dos-mujeres.jpg", opos="50% 20%", tag="Membresía", tit="Mi piel, <i>cada mes</i>", cta="Comenta MEMBRESÍA")),
            dict(n="Cuenta atrás de campaña",
                 que="Una serie corta antes de una fecha clave, con el mismo diseño cada día.",
                 est=[("Días antes", "«Faltan 3 días»: qué tratamientos entran."),
                      ("Día D", "La oferta activa y sus condiciones."),
                      ("Último día", "«Últimas horas»." )],
                 ej="«Black Friday en Skin Laundry»",
                 como="Sin tipografías de campaña: Black Friday o Navidad se cuentan con la letra y los colores de siempre.",
                 dur="8–15 s por pieza", cta="Comenta BLACK",
                 m=dict(fondo=INK, tag="Black Friday", tit="Faltan <i>3 días</i>", cta="Comenta BLACK")),
            dict(n="Lo que incluye",
                 que="Un pack o una membresía mostrado pieza a pieza, rápido y visual.",
                 est=[("Gancho", "«Esto es lo que incluye tu pack de 3 láseres»."),
                      ("Contenido", "Cada tratamiento con un plano de un segundo."),
                      ("Precio", "El precio, protagonista al final.")],
                 ej="«Pack de 3 láseres: lo que incluye»",
                 como="Montaje rítmico con planos de detalle y el precio en serif grande.",
                 dur="10–15 s", cta="Escríbenos por WhatsApp",
                 m=dict(img="laser-beige.jpg", opos="80% 40%", tag="Pack", tit="Lo que <i>incluye</i>", cta="WhatsApp")),
        ],
        "posts": [
            dict(n="La promoción del mes",
                 que="Una sola oferta por pieza, con el precio como protagonista y la línea de la marca.",
                 est=[("Imagen", "Foto a sangre o fondo burdeos."),
                      ("Titular", "El tratamiento en serif, con cursiva."),
                      ("Precio", "Precio grande y precio anterior tachado."),
                      ("CTA", "Pastilla lima abajo.")],
                 ej="«Tu primer láser facial · 75 €»",
                 como="Plantilla fija de ofertas: siempre igual, cambia la foto y el texto.",
                 dur="Publicación única o carrusel corto", cta="Reserva desde la bio",
                 m=dict(img="oferta-primer-laser.jpg", opos="50% 50%", nota="Post · 4:5")),
            dict(n="La membresía, explicada",
                 que="Qué es, qué incluye y para quién tiene sentido, sin letra pequeña.",
                 est=[("Portada", "«Elige tu ciclo de piel»."),
                      ("Planes", "Una diapositiva por plan."),
                      ("Para quién", "Perfiles a los que les compensa."),
                      ("Cierre", "Cómo empezar.")],
                 ej="«Membresía Skin Laundry: elige tu ciclo de piel»",
                 como="Fotos de campaña con caras del público objetivo y la plantilla crema.",
                 dur="Carrusel · 5 diapositivas", cta="Comenta MEMBRESÍA",
                 m=dict(img="oferta-membresia.jpg", opos="50% 50%", nota="Carrusel · 4:5 · portada")),
            dict(n="Campaña con varios tratamientos",
                 que="Una campaña de temporada con varios precios, ordenada como una carta.",
                 est=[("Portada", "El nombre de la campaña y las fechas."),
                      ("Carta", "Tratamientos y precios, en lista."),
                      ("Cierre", "Condiciones y reserva.")],
                 ej="«No tricks, just treats»",
                 como="Fondo burdeos, lista con precio alineado a la derecha y un único acento lima.",
                 dur="Post o carrusel corto", cta="Reserva desde la bio",
                 m=dict(img="oferta-halloween.jpg", opos="50% 50%", nota="Post · 4:5")),
            dict(n="Tarjeta regalo",
                 que="La experiencia Skin Laundry como regalo en fechas clave: Navidad, San Valentín, Día de la Madre.",
                 est=[("Portada", "«Regala piel»."),
                      ("Opciones", "Importes o tratamientos."),
                      ("Cierre", "Cómo comprarla.")],
                 ej="«Esta Navidad, regala piel»",
                 como="Foto de la tarjeta en la clínica con luz cálida, mismo sistema que el resto.",
                 dur="Publicación única o carrusel corto", cta="Escríbenos por WhatsApp",
                 m=dict(fondo=INK, tag="Navidad", tit="Esta Navidad, <i>regala piel</i>", cta="WhatsApp")),
        ],
    },
]

# ── 01 · Portada ──────────────────────────────────────────────────────────
add("portada", "Portada", sec(
    foto("laser-beige.jpg", "Facial láser de Skin Laundry", 900, 0, 1020, 1080, opos="62% 50%")
    + logo(128, 128, 340)
    + eyebrow("Briefing de contenido · Instagram", 128, 330)
    + titulo("Cinco pilares<br><i>y todas las formas<br>de contarlos</i>", 128, 400, 780, 100, tag="h1")
    + texto("Qué publicamos, en qué formatos y cómo se graba, se edita y se mide cada pieza, a partir del análisis de la cuenta y de la competencia.",
            128, 760, 680, 26, SOFT)
    + texto("All About Management × Skin Laundry · Versión 2 · Noviembre 2026", 128, 960, 820, 18, SOFT,
            extra="letter-spacing:2px;text-transform:uppercase"),
    bg=BEIGE,
))

# ── 02 · Índice ───────────────────────────────────────────────────────────
indice = [
    ("01", "Punto de partida", "Qué dice el análisis y qué queremos conseguir."),
    ("02", "Ritmo y reparto", "Cuatro piezas a la semana y cómo se reparten por pilar."),
    ("03", "Los cinco pilares", "Cada pilar y todas sus formas de contarlo, en reel y en post."),
    ("04", "Identidad", "Paleta y tipografía."),
    ("05", "Cómo vamos a trabajar", "Seis principios para ganar coherencia."),
    ("06", "Producción", "Rodaje, edición, copys y llamadas a la acción."),
    ("07", "Proceso y medición", "Calendario, validaciones, qué necesitamos y qué medimos."),
]
ix = ""
for i, (n, t, d) in enumerate(indice):
    col, row = i // 4, i % 4
    x, y = 128 + col * 840, 360 + row * 150
    ix += (linea_ := f'<div style="{pos(x, y)}width:760px;height:1px;background:{INK};opacity:.16"></div>')
    ix += f'<p style="{pos(x, y + 26)}font-size:20px;font-weight:700;letter-spacing:2px;color:{TOPO}">{n}</p>'
    ix += f'<p style="{pos(x + 80, y + 14)}font-family:{SERIF};font-weight:300;font-size:44px;line-height:1.1">{t}</p>'
    ix += texto(d, x + 80, y + 72, 660, 21, SOFT)
add("indice", "Índice", sec(eyebrow("Índice") + titulo("Qué encontrarás.", 128, 190) + ix + pie()))

# ── 03 · Punto de partida ─────────────────────────────────────────────────
cifras = [("9.540", "seguidores en Instagram"), ("3,4", "publicaciones por semana entre mayo y octubre"),
          ("59 %", "de las publicaciones, sin un solo comentario"), ("×4", "comentarios en un reel frente a un carrusel")]
cf = ""
for i, (v, l) in enumerate(cifras):
    x, y = 128 + (i % 2) * 400, 380 + (i // 2) * 270
    cf += f'<p style="{pos(x, y)}font-family:{SERIF};font-weight:300;font-size:104px;line-height:1;letter-spacing:-3px">{v}</p>'
    cf += texto(l, x, y + 122, 340, 22, SOFT)
objetivos = [
    ("Conversación", "Que la gente pregunte, comente y escriba. Hoy la media es de 2 comentarios por publicación."),
    ("Confianza", "Doctoras con nombre y casos reales como prueba, en lugar de fichas de producto."),
    ("Una sola marca", "Que cada pieza, también las ofertas, se reconozca como Skin Laundry al primer vistazo."),
    ("Reservas", "Cada pieza con un camino claro a la consulta: palabra clave, WhatsApp o enlace de la bio."),
]
ob = caja(1000, 330, 792, 640, INK)
ob += etiqueta("Qué queremos conseguir", 1056, 380, LIME)
for i, (t, d) in enumerate(objetivos):
    y = 440 + i * 128
    ob += f'<p style="{pos(1056, y)}font-family:{SERIF};font-weight:300;font-size:38px;color:{CREAM}">{t}</p>'
    ob += texto(d, 1056, y + 50, 690, 20, SOFT_D)
add("partida", "Punto de partida", sec(
    eyebrow("01 · Punto de partida") + titulo("Se publica mucho, <i>se conecta poco</i>.", 128, 190, 1600)
    + cf + ob + pie()))

# ── 04 · Ritmo ────────────────────────────────────────────────────────────
dias = [("Lun", ""), ("Mar", "Reel"), ("Mié", ""), ("Jue", "Post"), ("Vie", "Reel"), ("Sáb", ""), ("Dom", "Post")]
rt = ""
for i, (d, f) in enumerate(dias):
    x = 128 + i * 236
    on = bool(f)
    bg = INK if f == "Reel" else (BEIGE if f == "Post" else SAND)
    fg = CREAM if f == "Reel" else INK
    rt += caja(x, 380, 216, 250, bg if on else "transparent", extra="" if on else f"border:1.5px dashed {BEIGE}")
    rt += f'<p style="{pos(x + 28, 408)}font-size:19px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:{fg if on else SOFT}">{d}</p>'
    if on:
        rt += f'<p style="{pos(x + 28, 540)}font-family:{SERIF};font-weight:300;font-size:46px;color:{fg}">{f}</p>'
info = [
    ("En Instagram", "2 reels y 2 carruseles o posts cada semana: unas 16 piezas al mes. Los días son orientativos y se ajustan con los datos de los primeros meses."),
    ("En TikTok", "Los mismos reels de Instagram, adaptados: portada, texto en pantalla y sonido nativo. Sin producción aparte por ahora."),
    ("Hora", "Se fija con las estadísticas de la cuenta. Las fechas señaladas (campañas, novedades) salen a primera hora."),
]
for i, (t, d) in enumerate(info):
    x = 128 + i * 568
    rt += etiqueta(t, x, 700)
    rt += texto(d, x, 740, 520, 23)
add("ritmo", "El ritmo", sec(
    eyebrow("02 · Ritmo y reparto") + titulo("Cuatro piezas <i>a la semana</i>.", 128, 190) + rt + pie()))

# ── 05 · Reparto por pilar ────────────────────────────────────────────────
reparto = [("Equipo médico", 2, 1), ("Antes y después", 2, 2), ("Informativo", 1, 3),
           ("Tratamientos en vivo", 2, 1), ("Ofertas y membresía", 1, 1)]
rp = ""
unit = 150
for i, (n, r, p) in enumerate(reparto):
    y = 380 + i * 104
    rp += f'<p style="{pos(128, y + 12)}width:440px;font-family:{SERIF};font-weight:300;font-size:38px">{n}</p>'
    x = 600
    for k in range(r):
        rp += f'<div style="{pos(x, y)}width:{unit - 10}px;height:70px;border-radius:12px;background:{INK};color:{CREAM};display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:600;letter-spacing:1px">REEL</div>'
        x += unit
    for k in range(p):
        rp += f'<div style="{pos(x, y)}width:{unit - 10}px;height:70px;border-radius:12px;background:{BEIGE};display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:600;letter-spacing:1px">POST</div>'
        x += unit
    rp += f'<p style="{pos(1340, y + 18)}font-size:24px;font-weight:600">{r + p} piezas</p>'
rp += texto("8 reels + 8 posts = 16 piezas al mes.", 128, 920, 900, 24, weight=600)
rp += caja(1500, 380, 292, 500, SAND)
rp += etiqueta("Se mueve", 1532, 412)
rp += texto("Es el reparto base. En campañas (Black Friday, Navidad) ganan peso las ofertas y, en meses de novedades, los tratamientos en vivo. Lo revisamos cada mes con los datos.", 1532, 452, 232, 20, SOFT)
add("reparto", "Reparto por pilar", sec(
    eyebrow("02 · Ritmo y reparto") + titulo("Un mes tipo, <i>pilar a pilar</i>.", 128, 190) + rp + pie()))

# ── 06 · Los cinco pilares ────────────────────────────────────────────────
cards = ""
cw, gap = 312, 26
for i, p in enumerate(PILARES):
    x = 128 + i * (cw + gap)
    cards += caja(x, 360, cw, 560)
    cards += f'<div style="{pos(x + 32, 400)}width:40px;height:4px;border-radius:2px;background:{TOPO}"></div>'
    cards += f'<p style="{pos(x + 32, 432)}width:{cw - 64}px;font-family:{SERIF};font-size:40px;font-weight:300;line-height:1.05">{p["nombre"]}</p>'
    cards += texto(p["objetivo"], x + 32, 560, cw - 60, 20, SOFT)
    cards += etiqueta(f'{len(p["reels"])} reels · {len(p["posts"])} posts', x + 32, 860, TOPO)
add("pilares", "Los cinco pilares", sec(
    eyebrow("03 · Los cinco pilares") + titulo("Qué contamos.", 128, 190)
    + texto("Y debajo de cada pilar, cuántas formas distintas tenemos de contarlo.", 128, 290, 1200, 26, SOFT)
    + cards + pie()))


# ── Pilares: portada del pilar + una diapositiva por formato ─────────────
def portada_pilar(i, p):
    img, op = p["foto"]
    r_list = [f["n"] for f in p["reels"]]
    p_list = [f["n"] for f in p["posts"]]
    if img == "ofertas":
        h = f'<div style="{pos(0, 0)}width:700px;height:1080px;background:{INK}"></div>'
        h += foto("oferta-primer-laser.jpg", "Oferta del primer láser facial", 110, 110, 384, 480, radius=16, extra="box-shadow:0 24px 50px rgba(0,0,0,.35)")
        h += foto("oferta-membresia.jpg", "Membresía Skin Laundry", 230, 500, 384, 480, radius=16, extra="box-shadow:0 24px 50px rgba(0,0,0,.35)")
    else:
        h = foto(img, p["nombre"], 0, 0, 700, 1080, opos=op)
    h += eyebrow(f"Pilar {i + 1} de 5", 800, 128)
    h += titulo(p["nombre"], 800, 186, 1000, 88)
    h += texto(p["objetivo"], 800, 300, 980, 28)
    h += caja(800, 430, 992, 170, SAND)
    h += etiqueta("Por qué, según el análisis", 832, 456)
    h += texto(p["porque"], 832, 490, 930, 19, SOFT)
    h += etiqueta(f"En reel · {len(r_list)} formas", 800, 640)
    h += lista([f"{k + 1:02d} · {n}" for k, n in enumerate(r_list)], 800, 680, 470, 22, gap=8, marca="")
    h += etiqueta(f"En post · {len(p_list)} formas", 1310, 640)
    h += lista([f"{k + 1:02d} · {n}" for k, n in enumerate(p_list)], 1310, 680, 480, 22, gap=8, marca="")
    h += pastilla(p["mes"], 800, 930, INK, CREAM, 19)
    h += texto(f'<b>Qué medimos:</b> {p["mide"]}', 1310, 936, 480, 19, SOFT)
    return sec(h)


def diapo_formato(p, tipo, k, n_total, f):
    es_reel = tipo == "reel"
    m = f["m"]
    kind = "reel" if es_reel else "post"
    h = maqueta(kind, img=m.get("img"), opos=m.get("opos", "50% 50%"), tag=m.get("tag", ""),
                tit=m.get("tit", ""), cta=m.get("cta", ""), fondo=m.get("fondo"), split=m.get("split"),
                nota=m.get("nota", ""))
    X = 760
    h += eyebrow(f'{p["nombre"]} · {"Reel" if es_reel else "Post"} {k + 1} de {n_total}', X, 128)
    h += titulo(f["n"], X, 182, 1040, 64)
    h += texto(f["que"], X, 268, 1030, 25, SOFT)
    # Estructura
    h += etiqueta("Estructura" if es_reel else "Diapositiva a diapositiva", X, 400)
    h += pasos(f["est"], X, 440, 500, 21)
    # Ejemplo + cómo
    h += caja(1300, 392, 492, 448, SAND)
    h += etiqueta("Ejemplo para Skin Laundry", 1336, 424)
    h += f'<p style="{pos(1336, 462)}width:420px;font-family:{SERIF};font-weight:300;font-size:34px;line-height:1.12">{f["ej"]}</p>'
    h += etiqueta("Cómo se graba" if es_reel else "Cómo se diseña", 1336, 640)
    h += texto(f["como"], 1336, 676, 424, 19, SOFT)
    # Datos
    datos = [("Duración" if es_reel else "Formato", f["dur"]), ("Llamada a la acción", f["cta"]), ("Qué medimos", p["mide"])]
    for j, (l, v) in enumerate(datos):
        x = X + j * 352
        h += f'<div style="{pos(x, 872)}width:330px;height:1px;background:{INK};opacity:.16"></div>'
        h += etiqueta(l, x, 892)
        h += texto(v, x, 924, 330, 20)
    h += pie()
    return sec(h)


for i, p in enumerate(PILARES):
    add(f'{p["id"]}', p["nombre"], portada_pilar(i, p))
    for k, f in enumerate(p["reels"]):
        add(f'{p["id"]}-reel-{k + 1}', f'{p["nombre"]} · Reel · {f["n"]}', diapo_formato(p, "reel", k, len(p["reels"]), f))
    for k, f in enumerate(p["posts"]):
        add(f'{p["id"]}-post-{k + 1}', f'{p["nombre"]} · Post · {f["n"]}', diapo_formato(p, "post", k, len(p["posts"]), f))

# ── Identidad · Paleta ────────────────────────────────────────────────────
paleta = [
    ("Burdeos", INK, "Textos, fondos de contraste y ofertas.", True),
    ("Marrón topo", TOPO, "Etiquetas, textos secundarios y detalles.", True),
    ("Beige", BEIGE, "Fondos de foto, tarjetas y portadas suaves.", False),
    ("Crema", CREAM, "Fondo principal: aire y calma.", False),
    ("Amarillo lima", LIME, "Solo acento: una palabra, un CTA, un punto. Nunca de fondo.", False),
]
pl = ""
for i, (n, c, uso, dark) in enumerate(paleta):
    x = 128 + i * 338
    borde = f"border:1.5px solid {BEIGE};" if c == CREAM else ""
    pl += caja(x, 360, 312, 340, c, extra=borde)
    pl += f'<p style="{pos(x, 730)}font-size:24px;font-weight:700">{n}</p>'
    pl += f'<p style="{pos(x, 764)}font-size:22px;color:{SOFT}">{c}</p>'
    pl += texto(uso, x, 810, 300, 20, SOFT)
add("paleta", "Paleta cromática", sec(
    eyebrow("04 · Identidad") + titulo("Paleta cromática.", 128, 190)
    + texto("La misma en reels, posts, ofertas y portadas. Crema y beige dan el aire; burdeos, el contraste; la lima, solo para señalar.", 128, 290, 1500, 25, SOFT)
    + pl + pie()))

# ── Identidad · Tipografía ────────────────────────────────────────────────
tp = caja(128, 360, 820, 560, SAND)
tp += etiqueta("Titulares · serif fina", 168, 400)
tp += f'<p style="{pos(168, 450)}width:740px;font-family:{SERIF};font-weight:300;font-size:92px;line-height:1.02;letter-spacing:-2px">Your skin.<br><i>Our expertise.</i></p>'
tp += texto("Apris en la marca (Newsreader Light como equivalente libre). Una palabra en cursiva para marcar la idea.", 168, 680, 740, 21, SOFT)
tp += etiqueta("Textos · sans", 168, 790)
tp += texto("Articulat en la marca (Figtree como equivalente libre). Frases cortas, tono cercano y médico a la vez.", 168, 826, 740, 23)
reglas = [
    "Nunca más de dos líneas de titular por pieza.",
    "Etiquetas en sans mayúscula con interletrado: «ANTES Y DESPUÉS · MELASMA».",
    "Subtítulos de reels siempre en sans, centrados y dentro de la zona segura.",
    "Las mismas letras en reels, posts, ofertas y portadas de reel.",
    "Sin tipografías de campaña: Halloween, Black Friday o Navidad se cuentan con la misma letra.",
    "Sin negritas en titulares ni textos en mayúscula larga.",
]
tp += etiqueta("Reglas", 1010, 368)
tp += lista(reglas, 1010, 410, 780, 23, gap=18)
add("tipografia", "Tipografía", sec(
    eyebrow("04 · Identidad") + titulo("Dos letras, <i>tres niveles</i>.", 128, 190) + tp + pie()))

# ── Cómo vamos a trabajar (6 principios, en dos diapositivas) ─────────────
PRINCIPIOS = [
    ("Planos más simétricos",
     "Encuadres limpios y centrados, con la persona o el tratamiento como protagonista y aire alrededor.",
     ["Cámara a la altura de los ojos y sujeto centrado.", "Fondo neutro de cabina, sin objetos que distraigan.",
      "Antes y después siempre con el mismo encuadre."],
     "Planos torcidos, fondos cargados y caras cortadas."),
    ("La misma luz, más cálida",
     "Siempre la misma iluminación, en tonos cálidos, para que todo el feed parezca una sola sesión.",
     ["Mismo esquema de luz en cada rodaje.", "Temperatura de color fija y cálida.",
      "Corrección de color común para todas las piezas."],
     "Luz fría de fluorescente, mezcla de luces y filtros."),
    ("Más unidad cromática",
     "Burdeos, crema y lima como paleta común en fondos, textos y detalles.",
     ["Fondos de plantilla solo en crema, beige o burdeos.", "La lima, como único acento por pieza.",
      "Vestuario y atrezo en tonos neutros."],
     "Fondos azules o de colores de campaña."),
    ("Una sola tipografía",
     "La misma letra en reels y en posts: serif fina para titulares y sans para textos.",
     ["Plantillas cerradas para portadas y rótulos.", "Subtítulos con el mismo estilo en todos los reels.",
      "Una cursiva por titular, como máximo."],
     "Letras de temporada y rótulos en negrita."),
    ("Reel y post, coherentes",
     "Los dos formatos siguen el mismo sistema y el mismo ritmo, para que la cuenta se lea como un todo.",
     ["Portadas de reel con la plantilla de los posts.", "Alternar reel y post en la cuadrícula.",
      "Cada pilar con su etiqueta, igual en ambos formatos."],
     "Portadas de reel con un fotograma al azar."),
    ("Una edición más creativa",
     "Transiciones, ritmo y detalles de montaje que hagan el contenido más atractivo sin perder la línea premium.",
     ["Gancho en los dos primeros segundos.", "Cortes al ritmo de la música y del gesto.",
      "Sonido real de la clínica mezclado con música suave."],
     "Efectos de plantilla, emojis y transiciones gratuitas."),
]
for parte in range(2):
    pr = ""
    for j in range(3):
        idx = parte * 3 + j
        t, d, como, evitar = PRINCIPIOS[idx]
        x = 128 + j * 568
        dark = idx == 5
        bg, fg, sub, ac = (INK, CREAM, SOFT_D, LIME) if dark else (SAND, INK, SOFT, TOPO)
        pr += caja(x, 340, 536, 620, bg)
        pr += f'<p style="{pos(x + 40, 376)}font-size:20px;font-weight:700;letter-spacing:2px;color:{ac}">0{idx + 1}</p>'
        pr += f'<p style="{pos(x + 40, 412)}width:456px;font-family:{SERIF};font-size:42px;font-weight:300;line-height:1.05;color:{fg}">{t}</p>'
        pr += texto(d, x + 40, 520, 456, 21, sub)
        pr += etiqueta("Cómo", x + 40, 640, ac)
        pr += lista(como, x + 40, 674, 456, 19, color=fg, gap=6, marca_color=ac)
        pr += etiqueta("Evitamos", x + 40, 876, ac)
        pr += texto(evitar, x + 40, 906, 456, 18, sub)
    add(f"como-{parte + 1}", f"Cómo vamos a trabajar ({parte + 1}/2)", sec(
        eyebrow(f"05 · Cómo vamos a trabajar · {parte + 1} de 2")
        + titulo("Más coherencia, <i>plano a plano</i>." if parte == 0 else "Un solo sistema, <i>más atractivo</i>.", 128, 190)
        + pr + pie()))

# ── Producción · Rodaje ───────────────────────────────────────────────────
plan = [
    ("Doctoras a cámara", "Varias dudas, consejos y opiniones grabadas seguidas, con cambio de plano entre una y otra."),
    ("Sesiones en vivo", "Uno o dos tratamientos reales de principio a fin, con plano general y de detalle."),
    ("Casos", "Fotos de antes y después con el protocolo de luz y encuadre fijo."),
    ("Recursos de clínica", "Fachada, recepción, cabinas, tecnología, manos y producto: el banco de planos del mes."),
    ("Retratos", "Un retrato limpio de cada doctora y de las clientas que participen."),
]
rd = etiqueta("Qué grabamos en cada rodaje", 128, 360)
rd += pasos([(f"0{k + 1}", f"<b>{t}.</b> {d}") for k, (t, d) in enumerate(plan)], 128, 400, 900, 23, 22)
tecnica = [
    "Vertical 9:16 nativo para reels; foto 4:5 para posts.",
    "Clínica de Diagonal 610, en la franja con menos pacientes.",
    "Rodajes agrupados para cubrir varias semanas de contenido.",
    "Guion de cada pieza cerrado antes del rodaje.",
    "Consentimiento firmado de toda persona que salga en cámara.",
]
rd += caja(1110, 340, 682, 620, INK)
rd += etiqueta("En la práctica", 1150, 380, LIME)
rd += lista(tecnica, 1150, 424, 600, 23, color=CREAM, gap=20, marca_color=LIME)
add("rodaje", "Rodaje", sec(
    eyebrow("06 · Producción") + titulo("El rodaje en <i>la clínica</i>.", 128, 190) + rd + pie()))

# ── Producción · Edición ──────────────────────────────────────────────────
tl = [("0–2 s", "Gancho", "La imagen o la frase que frena el scroll."), ("2–8 s", "Contexto", "Quién habla y de qué."),
      ("8–20 s", "Desarrollo", "El valor: la respuesta, la sesión, el caso."), ("Final", "Acción", "Una sola llamada a la acción.")]
ed = etiqueta("Un reel", 128, 360)
tw = 1664 // 4
for k, (t, n, d) in enumerate(tl):
    x = 128 + k * tw
    ed += f'<div style="{pos(x, 400)}width:{tw - 12}px;height:10px;border-radius:5px;background:{INK if k else LIME}"></div>'
    ed += f'<p style="{pos(x, 428)}font-size:18px;font-weight:700;letter-spacing:2px;color:{TOPO}">{t}</p>'
    ed += f'<p style="{pos(x, 458)}font-family:{SERIF};font-weight:300;font-size:38px">{n}</p>'
    ed += texto(d, x, 510, tw - 40, 20, SOFT)
reel_r = ["Entre 15 y 40 segundos según el formato.", "Subtítulos siempre: la mayoría lo ve sin sonido.",
          "Portada con la plantilla del feed.", "Sonido real de la clínica más música suave."]
post_r = ["Portada con gancho y etiqueta del pilar.", "Una idea por diapositiva, 25 palabras como máximo.",
          "Última diapositiva con la llamada a la acción.", "4:5 y márgenes fijos en todas las piezas."]
ed += caja(128, 640, 816, 320, SAND)
ed += etiqueta("Reglas del reel", 168, 672)
ed += lista(reel_r, 168, 712, 740, 22, gap=10)
ed += caja(976, 640, 816, 320, SAND)
ed += etiqueta("Reglas del carrusel", 1016, 672)
ed += lista(post_r, 1016, 712, 740, 22, gap=10)
add("edicion", "Edición", sec(
    eyebrow("06 · Producción") + titulo("La edición, <i>segundo a segundo</i>.", 128, 190) + ed + pie()))

# ── Producción · Copys y CTA ──────────────────────────────────────────────
cp = etiqueta("Tono", 128, 360)
cp += lista(["Cercano y médico a la vez: de tú, frases cortas.", "Sin promesas absolutas ni «resultados garantizados».",
             "Términos médicos correctos, explicados cuando hace falta.", "Textos sobre tratamientos validados por el equipo médico."],
            128, 400, 760, 23, gap=12)
cp += etiqueta("Estructura del copy", 128, 650)
cp += pasos([("Línea 1", "El gancho: lo que se lee antes del «más»."), ("Cuerpo", "El valor en dos o tres frases."),
             ("Cierre", "Una sola llamada a la acción.")], 128, 690, 760, 22)
cp += caja(1000, 340, 792, 620, INK)
cp += etiqueta("Comenta y te escribimos", 1040, 380, LIME)
cp += texto("La mecánica que más convierte en la competencia: una palabra clave en el post y respuesta por mensaje directo con la información y el enlace de reserva.",
            1040, 420, 712, 22, CREAM)
mec = [("Pieza", "«Comenta INFO y te contamos si es para ti»."), ("Comentario", "La persona escribe la palabra clave."),
       ("Mensaje", "Le enviamos precio, sesiones y reserva."), ("Seguimiento", "Si no reserva, WhatsApp de la clínica.")]
cp += pasos(mec, 1040, 560, 712, 21, acento=LIME, color=CREAM)
cp += texto("Y responder a cada comentario. Recomendamos volver a mostrar los «me gusta», hoy ocultos en 83 de 87 publicaciones.",
            1040, 860, 712, 19, SOFT_D)
add("copys", "Copys y llamadas a la acción", sec(
    eyebrow("06 · Producción") + titulo("Copys que <i>abren conversación</i>.", 128, 190) + cp + pie()))

# ── Proceso ───────────────────────────────────────────────────────────────
fases = [
    ("Planificación", "Calendario del mes con pilar, formato y fecha de cada pieza."),
    ("Validación", "All About Management y la clínica aprueban el calendario."),
    ("Rodaje", "En la clínica, con guiones cerrados."),
    ("Edición y diseño", "Reels, carruseles y copys con el sistema visual."),
    ("Revisión", "Validación médica de los textos y visto bueno final."),
    ("Publicación", "Instagram y TikTok, y respuesta a comentarios."),
    ("Informe", "Resultados del mes y ajustes para el siguiente."),
]
fp = ""
fw = 1664 // 7
for k, (t, d) in enumerate(fases):
    x = 128 + k * fw
    fp += f'<div style="{pos(x, 420)}width:44px;height:44px;border-radius:99px;background:{INK if k < 6 else LIME};color:{CREAM if k < 6 else INK};display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700">{k + 1}</div>'
    if k < 6:
        fp += f'<div style="{pos(x + 54, 441)}width:{fw - 64}px;height:2px;background:{BEIGE}"></div>'
    fp += f'<p style="{pos(x, 490)}width:{fw - 20}px;font-family:{SERIF};font-weight:300;font-size:32px;line-height:1.08">{t}</p>'
    fp += texto(d, x, 580, fw - 26, 20, SOFT)
fp += caja(128, 780, 1664, 160, SAND)
fp += texto("<b>Cada mes:</b> el calendario se presenta antes de empezar el mes, el material se envía para validar con antelación a su publicación y el informe se comparte al cerrar el mes. Las fechas exactas las fijamos juntos.",
            168, 816, 1580, 24)
add("proceso", "Proceso", sec(
    eyebrow("07 · Proceso y medición") + titulo("De la idea <i>a la publicación</i>.", 128, 190) + fp + pie()))

# ── Qué necesitamos de la clínica ─────────────────────────────────────────
nec = [
    ("Doctoras", "Disponibilidad en cada rodaje y una persona de referencia para validar los textos médicos."),
    ("Casos reales", "Pacientes dispuestas a participar, con consentimiento, y fotos de antes y después con el protocolo."),
    ("Dudas frecuentes", "Las preguntas que llegan por WhatsApp, teléfono y recepción: son la materia prima del pilar informativo."),
    ("Ofertas y precios", "Promociones, membresías y condiciones de cada mes, con antelación."),
    ("Novedades", "Tratamientos y tecnologías nuevas antes de su lanzamiento."),
    ("Acceso", "Horarios con menos pacientes para grabar y acceso a las estadísticas de la cuenta."),
]
nc = ""
for i, (t, d) in enumerate(nec):
    col, row = i % 3, i // 3
    x, y = 128 + col * 568, 350 + row * 300
    nc += caja(x, y, 536, 270)
    nc += f'<p style="{pos(x + 40, y + 34)}font-size:20px;font-weight:700;letter-spacing:2px;color:{TOPO}">0{i + 1}</p>'
    nc += f'<p style="{pos(x + 40, y + 70)}font-family:{SERIF};font-weight:300;font-size:40px">{t}</p>'
    nc += texto(d, x + 40, y + 132, 456, 21, SOFT)
add("necesitamos", "Qué necesitamos", sec(
    eyebrow("07 · Proceso y medición") + titulo("Qué necesitamos <i>de la clínica</i>.", 128, 190) + nc + pie()))

# ── Medición ──────────────────────────────────────────────────────────────
md = ""
for i, p in enumerate(PILARES):
    y = 360 + i * 98
    md += f'<div style="{pos(128, y)}width:1664px;height:1px;background:{INK};opacity:.16"></div>'
    md += f'<p style="{pos(128, y + 24)}width:520px;font-family:{SERIF};font-weight:300;font-size:36px">{p["nombre"]}</p>'
    md += texto(p["mide"], 700, y + 30, 1090, 24)
md += caja(128, 870, 1664, 100, INK)
md += texto("Punto de partida: 2 comentarios por publicación y el 59 % sin ninguno. Los objetivos numéricos los fijamos tras el primer mes, con las estadísticas internas de la cuenta.",
            168, 892, 1580, 22, CREAM)
add("medicion", "Qué medimos", sec(
    eyebrow("07 · Proceso y medición") + titulo("Qué medimos, <i>pilar a pilar</i>.", 128, 190) + md + pie()))

# ── Cierre ────────────────────────────────────────────────────────────────
add("cierre", "Cierre", sec(
    foto("inyeccion.jpg", "Tratamiento de medicina estética en Skin Laundry", 0, 0, 1920, 1080, opos="70% 40%")
    + f'<div style="{pos(0, 0)}width:1920px;height:1080px;background:linear-gradient(90deg,rgba(61,32,29,.85) 0%,rgba(61,32,29,.35) 60%,rgba(61,32,29,0) 100%)"></div>'
    + logo(128, 128, 300, dark=False)
    + titulo("Your skin.<br><i>Our expertise.</i>", 128, 640, 1000, 110, CREAM)
    + texto("All About Management × Skin Laundry · Barcelona", 128, 960, 900, 19, SOFT_D,
            extra="letter-spacing:2px;text-transform:uppercase"),
    bg=INK, color=CREAM))

out = Path(__file__).resolve().parent.parent / "app/pitch/skin-laundry-briefing/diapos.ts"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(
    "/**\n * Briefing de contenido de Instagram para Skin Laundry, versión detallada: cada pilar\n"
    " * con todas sus formas de contarlo en reel y en post, identidad, producción, proceso\n"
    " * y medición. Generado con scripts/build-skin-laundry-briefing.py: si cambia el\n"
    " * contenido, se edita el script y se vuelve a ejecutar.\n */\n\n"
    'import type { DiapoHtml } from "../skin-laundry/diapos";\n\n'
    f"export const DIAPOS: DiapoHtml[] = {json.dumps(D, ensure_ascii=False, indent=2)};\n"
)
print(f"{len(D)} diapositivas → {out}")
