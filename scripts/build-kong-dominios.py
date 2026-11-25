"""Genera app/pitch/kong-dominios/diapos.ts: propuesta de dominio web y
nombre de Instagram para KONG (Grupo Ikibana, El Born).

Mismo visor, estilos y acento que /pitch/kong. Disponibilidad comprobada
el 25/11/2026 (dominios en whois.com, Instagram entrando al perfil). Si se
vuelve a comprobar, se cambian DOMINIOS / HANDLES y se ejecuta desde la raíz:

    python3 scripts/build-kong-dominios.py
"""

import json
from pathlib import Path

INK = "#151515"
ACENTO = "#E2552E"
MARCA = "Maen Studios × KONG"
OK = "#7FC08F"
NO = "#8A8885"
FECHA = "25 de noviembre de 2026"


def sec(body):
    return f'<section style="background:{INK};color:#F4F4F4;--rosa:{ACENTO}">{body}</section>'


def foot(n):
    return f'<div class="foot" style="left:128px;"><span>{MARCA}</span><span class="n">{n:02d}</span></div>'


def eyebrow(t, top=128, left=128, d=0):
    return f'<p class="abs a pm-eyebrow" style="left:{left}px;top:{top}px;--d:{d}">{t}</p>'


def titulo(t, top=190, left=128, width=1660, size=64, d=1):
    return (f'<h2 class="abs a disp" style="left:{left}px;top:{top}px;width:{width}px;'
            f'font-size:{size}px;line-height:1.05;--d:{d}">{t}</h2>')


def p(t, left, top, width, size=26, d=2, cls="soft", extra=""):
    return (f'<p class="abs a {cls}" style="left:{left}px;top:{top}px;width:{width}px;'
            f'font-size:{size}px;line-height:1.4;{extra}--d:{d}">{t}</p>')


def estado(libre):
    c, t = (OK, "Disponible") if libre else (NO, "Ocupado")
    return (f'<span style="display:inline-flex;align-items:center;gap:10px;font-size:20px;font-weight:700;'
            f'letter-spacing:.06em;text-transform:uppercase;color:{c}">'
            f'<span style="width:12px;height:12px;border-radius:50%;background:{c}"></span>{t}</span>')


def filas(items, top, d0=2):
    """Lista nombre · estado · nota, una fila por opción."""
    h = ""
    for i, (nombre, libre, nota, reco) in enumerate(items):
        y = top + i * 118
        borde = "border:2px solid var(--rosa);" if reco else ""
        h += (
            f'<div class="abs pm-card a" style="left:128px;top:{y}px;width:1664px;height:100px;{borde}--d:{d0 + i * .3:.1f}"></div>'
            f'<p class="abs a" style="left:168px;top:{y + 28}px;font-size:36px;font-weight:800;'
            f'letter-spacing:-.01em;--d:{d0 + i * .3:.1f}">{nombre}</p>'
            f'<div class="abs a" style="left:760px;top:{y + 36}px;--d:{d0 + i * .3:.1f}">{estado(libre)}</div>'
            f'<p class="abs a soft" style="left:1010px;top:{y + 32}px;width:740px;font-size:23px;line-height:1.35;'
            f'--d:{d0 + i * .3:.1f}">{nota}</p>'
        )
    return h


DOMINIOS = [
    ("kongbarcelona.com", True, "Claro y fácil de recordar. Incluir Barcelona ayuda en Google.", True),
    ("kong.barcelona", True, "La extensión de la ciudad: corto y con carácter.", False),
    ("kongborn.com", True, "Muy local, ancla el barrio. Se entiende peor fuera de Barcelona.", False),
    ("kongbcn.com", True, "Corto, pero «bcn» se entiende peor que «barcelona».", False),
]
HANDLES = [
    ("@kongbarcelona", True, "Coincide con el dominio recomendado.", True),
    ("@kong.barcelona", True, "Variante con punto. Útil para reservarla y evitar confusiones.", False),
    ("@kong.bcn", True, "Corto, pero no coincide con ningún dominio .com.", False),
    ("@kong.born", True, "Muy local, como kongborn.com.", False),
    ("@kongbcn", False, "Ya existe una cuenta con este nombre, sin publicaciones.", False),
]

slides = []
n = 0


def add(id_, tit, html):
    slides.append({"id": id_, "titulo": tit, "html": html})


# 1. Portada
n += 1
add("portada", "KONG · Dominios y perfiles", sec(
    eyebrow("Fase 1 · Captación de dominios", top=170)
    + '<img class="abs a" src="/pitch/kong/logo-kong.png" alt="KONG Japanese Restaurant" '
    'style="left:128px;top:330px;width:760px;--d:1">'
    + p("Dominio web y perfil de Instagram", 128, 640, 1100, size=40, d=2, cls="", extra="font-weight:800;")
    + p(f"Propuesta de nombre · {FECHA}", 128, 710, 1100, size=28, d=3)
))

# 2. Por qué
n += 1
razones = [
    ("Un solo nombre", "El mismo en la web, en Instagram y en Google. Quien ve uno encuentra los otros."),
    ("Antes de que lo cojan", "KONG es un nombre muy usado. Cuanto antes se registre, más opciones quedan libres."),
    ("A nombre de KONG", "Dominios y perfiles quedan a nombre de KONG. Maen los gestiona como administrador."),
]
rh = ""
for i, (k, t) in enumerate(razones):
    x = 128 + i * 560
    rh += (
        f'<div class="abs pm-card pop" style="left:{x}px;top:360px;width:528px;height:400px;--d:{i}"></div>'
        f'<p class="abs a disp rosa" style="left:{x + 40}px;top:400px;font-size:72px;line-height:1;--d:{i + 1}">0{i + 1}</p>'
        f'<p class="abs a" style="left:{x + 40}px;top:500px;width:450px;font-size:34px;font-weight:800;--d:{i + 1}">{k}</p>'
        f'<p class="abs a soft" style="left:{x + 40}px;top:560px;width:450px;font-size:25px;line-height:1.4;--d:{i + 2}">{t}</p>'
    )
add("por-que", "Por qué empezamos por aquí", sec(
    eyebrow("Por qué empezamos por aquí")
    + titulo("Primero, asegurar el nombre")
    + rh + foot(n)
))

# 3. Dominios
n += 1
add("dominios", "Dominios web", sec(
    eyebrow("Web · dominios")
    + titulo("Los cuatro dominios están libres")
    + filas(DOMINIOS, 330)
    + p(f"Comprobado el {FECHA}. Los .es y .cat se confirman en el momento del registro.",
        128, 820, 1600, size=21, d=4, cls="muted")
    + foot(n)
))

# 4. Instagram
n += 1
add("instagram", "Instagram", sec(
    eyebrow("Instagram · nombre de usuario")
    + titulo("@kongbarcelona está libre")
    + filas(HANDLES, 300)
    + p(f"Comprobado el {FECHA}. «Disponible» significa que no hay ningún perfil con ese nombre; "
        "se confirma del todo al crear la cuenta.", 128, 900, 1600, size=21, d=4, cls="muted")
    + foot(n)
))

# 5. Recomendación (maqueta navegador + perfil)
n += 1
navegador = (
    '<div class="abs pm-card a" style="left:128px;top:330px;width:820px;height:560px;padding:0;overflow:hidden;--d:1">'
    '<div style="display:flex;align-items:center;gap:12px;padding:22px 28px;background:#232323">'
    '<span style="width:14px;height:14px;border-radius:50%;background:#555"></span>'
    '<span style="width:14px;height:14px;border-radius:50%;background:#555"></span>'
    '<span style="width:14px;height:14px;border-radius:50%;background:#555"></span>'
    '<span style="margin-left:18px;flex:1;background:#151515;border-radius:30px;padding:12px 24px;'
    'font-size:24px;color:#F4F4F4">🔒 kongbarcelona.com</span></div>'
    '<div style="height:470px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px">'
    '<img src="/pitch/kong/logo-kong.png" alt="" style="width:420px">'
    '<span style="font-size:22px;letter-spacing:.2em;text-transform:uppercase;color:#B9B6B1">Record Bar · Omakase · El Born</span>'
    '</div></div>'
)
perfil = (
    '<div class="abs pm-card a" style="left:996px;top:330px;width:796px;height:560px;--d:2"></div>'
    '<div class="abs a" style="left:1046px;top:380px;width:150px;height:150px;border-radius:50%;'
    'background:#0B0B0B;border:3px solid var(--rosa);display:flex;align-items:center;justify-content:center;--d:2">'
    '<img src="/pitch/kong/logo-kong.png" alt="" style="width:112px"></div>'
    '<p class="abs a" style="left:1230px;top:400px;font-size:36px;font-weight:800;--d:2">kongbarcelona</p>'
    '<p class="abs a soft" style="left:1230px;top:458px;font-size:23px;--d:3">0 publicaciones · próximamente</p>'
    '<p class="abs a" style="left:1046px;top:580px;width:700px;font-size:25px;line-height:1.5;--d:3">'
    '<b>KONG</b><br>Japanese Restaurant · Record Bar<br>El Born, Barcelona<br>'
    '<span class="rosa">kongbarcelona.com</span></p>'
)
add("recomendacion", "Nuestra recomendación", sec(
    eyebrow("Nuestra recomendación")
    + titulo("kongbarcelona.com y @kongbarcelona", size=56)
    + navegador + perfil
    + p("Ejemplo orientativo: el diseño final de la web y del perfil llega en las siguientes fases.",
        128, 920, 1600, size=21, d=4, cls="muted")
    + foot(n)
))

# 6. Protección
n += 1
prot = [
    ("Dominio principal", "kongbarcelona.com", "Donde vivirá la web."),
    ("Redirecciones", "kong.barcelona · kongbarcelona.es", "Llevan al principal y evitan que otro los use. El .es, si está libre."),
    ("Redes", "@kongbarcelona", "Mismo nombre en Instagram, TikTok y Facebook."),
]
ph = ""
for i, (k, v, t) in enumerate(prot):
    x = 128 + i * 560
    ph += (
        f'<div class="abs pm-card pop" style="left:{x}px;top:360px;width:528px;height:400px;--d:{i}"></div>'
        f'<p class="abs a rosa" style="left:{x + 40}px;top:400px;font-size:20px;font-weight:700;'
        f'letter-spacing:.08em;text-transform:uppercase;--d:{i + 1}">{k}</p>'
        f'<p class="abs a" style="left:{x + 40}px;top:450px;width:450px;font-size:32px;font-weight:800;'
        f'line-height:1.25;--d:{i + 1}">{v}</p>'
        f'<p class="abs a soft" style="left:{x + 40}px;top:620px;width:450px;font-size:25px;line-height:1.4;--d:{i + 2}">{t}</p>'
    )
add("que-registramos", "Qué registramos", sec(
    eyebrow("Qué registramos")
    + titulo("Un principal y sus variantes")
    + ph + foot(n)
))

# 7. Próximos pasos
n += 1
pasos = [
    ("Vuestro OK al nombre", "kongbarcelona.com y @kongbarcelona, o la alternativa que prefiráis."),
    ("Datos del titular", "Razón social, CIF y un email de contacto de la empresa."),
    ("Registro de dominios", "Lo hacemos nosotros en cuanto tengamos los datos."),
    ("Creación de perfiles", "Instagram, TikTok y Facebook, sin publicar hasta el teasing."),
]
sh = ""
for i, (k, t) in enumerate(pasos):
    y = 330 + i * 150
    sh += (
        f'<p class="abs a disp rosa" style="left:128px;top:{y}px;font-size:56px;line-height:1;--d:{1 + i * .4:.1f}">{i + 1}</p>'
        f'<p class="abs a" style="left:230px;top:{y - 2}px;font-size:34px;font-weight:800;--d:{1 + i * .4:.1f}">{k}</p>'
        f'<p class="abs a soft" style="left:230px;top:{y + 48}px;width:1400px;font-size:25px;--d:{1.2 + i * .4:.1f}">{t}</p>'
    )
add("proximos-pasos", "Próximos pasos", sec(
    eyebrow("Próximos pasos")
    + titulo("Con vuestro OK, lo registramos", size=56)
    + sh + foot(n)
))

out = Path("app/pitch/kong-dominios/diapos.ts")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(
    "/**\n * KONG · propuesta de dominio web y perfil de Instagram.\n"
    " * Generado con scripts/build-kong-dominios.py.\n */\n\n"
    'import type { DiapoHtml } from "../maen-plan-100k/diapos";\n\n'
    "export const DIAPOS: DiapoHtml[] = "
    + json.dumps(slides, ensure_ascii=False, indent=2)
    + ";\n"
)
print(f"{len(slides)} diapositivas → {out}")
