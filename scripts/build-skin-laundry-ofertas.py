"""Genera las piezas de ofertas y membresía de Skin Laundry como páginas HTML a
tamaño de Instagram (1080 × 1350 y 1080 × 1920), con la línea visual del brief
visual: espresso, crema y lima como acento; serif fina y sans; logotipo arriba
y centrado. Rehacen promociones reales de la cuenta y de la web.

Escribe public/__ofertas/*.html; luego se exportan a imagen con Playwright
(scripts de vista previa) y se guardan en public/pitch/skin-laundry/oferta-*.jpg.

    python3 scripts/build-skin-laundry-ofertas.py
"""

from pathlib import Path

A = "/pitch/skin-laundry"
INK = "#3C201D"
CREAM = "#F6EDE4"
LIME = "#CDF765"
CARAMEL = "#88583A"
SAND = "#EADFD3"
SOFT = "#7A5C55"
SOFT_D = "rgba(246,237,228,.72)"
SERIF = "Newsreader, Georgia, serif"
SANS = "Figtree, Arial, sans-serif"
M = 88

FONTS = "".join(
    f'@font-face{{font-family:"{fam}";font-weight:{w};font-style:{st};src:url("{A}/fonts/{f}") format("woff2")}}'
    for fam, w, st, f in [
        ("Newsreader", 300, "normal", "newsreader-latin-300-normal.woff2"),
        ("Newsreader", 300, "italic", "newsreader-latin-300-italic.woff2"),
        ("Newsreader", 400, "normal", "newsreader-latin-400-normal.woff2"),
        ("Figtree", 400, "normal", "figtree-latin-400-normal.woff2"),
        ("Figtree", 500, "normal", "figtree-latin-500-normal.woff2"),
        ("Figtree", 600, "normal", "figtree-latin-600-normal.woff2"),
    ]
)


def pagina(w, h, body):
    return (
        f'<!doctype html><html><head><meta charset="utf-8"><style>{FONTS}'
        f"*{{margin:0;padding:0;box-sizing:border-box}}"
        f"body{{width:{w}px;height:{h}px;overflow:hidden;position:relative;font-family:{SANS}}}"
        f".a{{position:absolute}}"
        f"</style></head><body>{body}</body></html>"
    )


def logo(dark_bg, top=72):
    f = "logo-crema.png" if dark_bg else "logo-negro.png"
    return f'<img class="a" src="{A}/{f}" style="left:{(1080 - 260) // 2}px;top:{top}px;width:260px">'


def eyebrow(t, x, y, c):
    return (f'<p class="a" style="left:{x}px;top:{y}px;font-size:26px;font-weight:600;letter-spacing:5px;'
            f'text-transform:uppercase;color:{c}">{t}</p>')


def head(t, x, y, c, size, w=1080 - 2 * M):
    return (f'<p class="a" style="left:{x}px;top:{y}px;width:{w}px;font-family:{SERIF};font-weight:300;'
            f'font-size:{size}px;line-height:1.02;letter-spacing:-2px;color:{c}">{t}</p>')


def cta(t, x, y, bg, c):
    return (f'<p class="a" style="left:{x}px;top:{y}px;padding:18px 34px;border-radius:999px;background:{bg};'
            f'font-size:28px;font-weight:600;color:{c};white-space:nowrap">{t}</p>')


def precio(nuevo, antes, x, y, c, sub, size=170):
    return (f'<p class="a" style="left:{x}px;top:{y}px;font-family:{SERIF};font-weight:300;font-size:{size}px;'
            f'line-height:1;letter-spacing:-4px;color:{c}">{nuevo}'
            f'<span style="font-size:{size // 3}px;letter-spacing:0;color:{sub};text-decoration:line-through;'
            f'margin-left:28px">{antes}</span></p>')


PIEZAS = {}

# 1 · Primer láser facial: la oferta de entrada, siempre activa
PIEZAS["primer-laser"] = pagina(1080, 1350, (
    f'<div class="a" style="inset:0;background:{INK}"></div>'
    f'<img class="a" src="{A}/laser-vertical.jpg" style="left:0;top:0;width:1080px;height:760px;object-fit:cover;object-position:60% 30%">'
    f'<div class="a" style="left:0;top:0;width:1080px;height:220px;background:linear-gradient(180deg,rgba(60,32,29,.55),rgba(60,32,29,0))"></div>'
    f'<div class="a" style="left:0;top:560px;width:1080px;height:200px;background:linear-gradient(180deg,rgba(60,32,29,0),{INK})"></div>'
    + logo(True)
    + eyebrow("Tu primera vez", M, 800, LIME)
    + head("Tu primer<br><i>láser facial</i>", M, 850, CREAM, 96)
    + precio("75 €", "250 €", M, 1062, CREAM, SOFT_D, 150)
    + f'<p class="a" style="right:{M}px;top:1110px;width:330px;text-align:right;font-size:26px;line-height:1.35;color:{SOFT_D}">Un tratamiento<br>de 15 minutos</p>'
    + cta("Reserva desde la bio", M, 1236, LIME, INK)
))

# 2 · Pack de 3 láseres con un 20 %: campaña de vuelta a la rutina
PIEZAS["pack-3"] = pagina(1080, 1350, (
    f'<div class="a" style="inset:0;background:{CREAM}"></div>'
    + logo(False)
    + eyebrow("Vuelta a la rutina", M, 300, CARAMEL)
    + f'<p class="a" style="left:{M - 8}px;top:350px;font-family:{SERIF};font-weight:300;font-size:340px;line-height:1;letter-spacing:-14px;color:{INK}">−20<span style="font-size:200px">%</span></p>'
    + f'<div class="a" style="left:{M}px;top:720px;width:120px;height:6px;border-radius:3px;background:{LIME}"></div>'
    + head("en tu pack<br><i>de 3 láseres</i>", M, 770, INK, 96)
    + f'<p class="a" style="left:{M}px;top:1030px;width:820px;font-size:32px;line-height:1.4;color:{SOFT}">Recupera tu piel después del verano: manchas, textura y luminosidad.</p>'
    + cta("Activa tu descuento", M, 1222, INK, CREAM)
))

# 3 · Campaña con varios tratamientos: «No Tricks, Just Treats» con la nueva línea
lista = [("Skin Reset", "Renueva, hidrata y revitaliza tu piel", "350 €", "600 €"),
         ("Skin Regen", "Potencia la regeneración de tu piel", "350 €", "440 €"),
         ("Neuromoduladores", "Suaviza tus líneas de expresión", "300 €", "390 €")]
filas = ""
for i, (n, d, p, a) in enumerate(lista):
    y = 650 + i * 170
    filas += (
        f'<div class="a" style="left:{M}px;top:{y}px;width:{1080 - 2 * M}px;height:1px;background:rgba(246,237,228,.25)"></div>'
        f'<p class="a" style="left:{M}px;top:{y + 30}px;font-family:{SERIF};font-weight:300;font-size:56px;line-height:1;color:{CREAM}">{n}</p>'
        f'<p class="a" style="left:{M}px;top:{y + 100}px;font-size:24px;color:{SOFT_D}">{d}</p>'
        f'<p class="a" style="right:{M}px;top:{y + 28}px;text-align:right;font-family:{SERIF};font-weight:300;font-size:64px;line-height:1;color:{CREAM}">{p}</p>'
        f'<p class="a" style="right:{M}px;top:{y + 102}px;text-align:right;font-size:24px;color:{SOFT_D};text-decoration:line-through">{a}</p>'
    )
PIEZAS["halloween"] = pagina(1080, 1350, (
    f'<div class="a" style="inset:0;background:{INK}"></div>'
    + logo(True)
    + eyebrow("Halloween · Del 26 al 31 de octubre", M, 280, LIME)
    + head("No tricks,<br><i>just treats.</i>", M, 330, CREAM, 120)
    + filas
    + f'<div class="a" style="left:{M}px;top:1160px;width:{1080 - 2 * M}px;height:1px;background:rgba(246,237,228,.25)"></div>'
    + cta("Reserva desde la bio", M, 1210, LIME, INK)
))

# 4 · Membresía, con el mensaje de la web
PIEZAS["membresia"] = pagina(1080, 1350, (
    f'<div class="a" style="inset:0;background:{CREAM}"></div>'
    + logo(False)
    + f'<img class="a" src="{A}/dos-mujeres.jpg" style="left:{M}px;top:190px;width:{1080 - 2 * M}px;height:520px;object-fit:cover;object-position:74% 30%;border-radius:16px">'
    + eyebrow("Membresía Skin Laundry", M, 780, CARAMEL)
    + head("Elige tu<br><i>ciclo de piel</i>", M, 830, INK, 104)
    + f'<p class="a" style="left:{M}px;top:1068px;width:820px;font-size:32px;line-height:1.4;color:{SOFT}">Consigue la piel que buscas con nuestras suscripciones.</p>'
    + cta("Descubre qué incluye", M, 1222, INK, CREAM)
))

# 5 · Story del primer láser, con el enlace a la reserva
PIEZAS["primer-laser-story"] = pagina(1080, 1920, (
    f'<div class="a" style="inset:0;background:{INK}"></div>'
    f'<img class="a" src="{A}/laser-vertical.jpg" style="left:0;top:0;width:1080px;height:1920px;object-fit:cover;object-position:62% 40%">'
    f'<div class="a" style="left:0;top:0;width:1080px;height:300px;background:linear-gradient(180deg,rgba(60,32,29,.55),rgba(60,32,29,0))"></div>'
    f'<div class="a" style="left:0;bottom:0;width:1080px;height:1100px;background:linear-gradient(180deg,rgba(60,32,29,0),rgba(60,32,29,.95) 55%)"></div>'
    + logo(True, 150)
    + eyebrow("Tu primera vez", M, 1130, LIME)
    + head("Tu primer<br><i>láser facial</i>", M, 1180, CREAM, 112)
    + precio("75 €", "250 €", M, 1430, CREAM, SOFT_D, 170)
    + f'<p class="a" style="left:50%;transform:translateX(-50%);top:1690px;padding:24px 48px;border-radius:999px;background:{LIME};font-size:32px;font-weight:600;color:{INK};white-space:nowrap">↗ Reservar cita</p>'
))

out = Path(__file__).resolve().parent.parent / "public/__ofertas"
out.mkdir(exist_ok=True)
for k, html in PIEZAS.items():
    (out / f"{k}.html").write_text(html)
print(", ".join(PIEZAS))
