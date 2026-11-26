"""
Genera el calendario de publicaciones de Don Lay de un mes nuevo, con la
misma estructura, estilo y dinámica que el de noviembre (portada, calendario,
feed, una diapositiva por día y cierre): reel los jueves, carrusel los martes
y domingos y stories a diario. Sale sin contenido: sin copys, horas, pilares
ni enlaces a Drive, para rellenarlo después.

Uso:
    python3 scripts/build-donlay-calendario-vacio.py 2026 12 diciembre

Escribe app/pitch/donlay-calendario/<mes>/{diapos.ts,contenido.ts,page.tsx}.
Las fechas señaladas de cada mes van en SENALADAS.
"""

import calendar
import json
import pathlib
import re
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
BASE = RAIZ / "app/pitch/donlay-calendario"

INK, RED, CREAM, ROSE = "#1D1D1B", "#79242F", "#F6F0E8", "#E9D8D2"
SANS = "'Inter DL', Inter, Arial, sans-serif"
SERIF = "'Self Modern DL', Georgia, serif"

DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
ABR = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"]
MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
         "septiembre", "octubre", "noviembre", "diciembre"]

# Fechas señaladas por (año, mes): día -> (etiqueta corta, texto de la leyenda)
SENALADAS = {
    (2026, 12): {
        7: ("大雪 Dàxuě", "大雪 Dàxuě (gran nevada)"),
        22: ("冬至 Dōngzhì", "冬至 Dōngzhì (solsticio de invierno)"),
        24: ("Nochebuena", "Nochebuena"),
        25: ("Navidad", "Navidad"),
        31: ("Nochevieja", "Nochevieja"),
    },
}

STAR = ('<svg aria-label="Fecha señalada" width="30" height="30" viewBox="0 0 24 24" style="flex:none;display:block">'
        f'<circle cx="12" cy="12" r="11.5" fill="{RED}"/><path d="M12 4.2 13.7 10.3 19.8 12 13.7 13.7 12 19.8 10.3 13.7 4.2 12 10.3 10.3Z" fill="{CREAM}"/></svg>')


# Dinámica de publicación, como en noviembre: día de la semana (0 = lunes) -> tipo
TIPOS = {1: "carrusel", 3: "reel", 6: "carrusel"}


def tipo(anio, mes, d):
    return TIPOS.get(calendar.weekday(anio, mes, d), "stories")


def publicaciones(anio, mes):
    n = calendar.monthrange(anio, mes)[1]
    return [d for d in range(1, n + 1) if tipo(anio, mes, d) != "stories"]


def star(fondo_oscuro=False):
    if not fondo_oscuro:
        return STAR
    return STAR.replace(f'fill="{RED}"/>', f'fill="{CREAM}"/>', 1).replace(f'fill="{CREAM}"/></svg>', f'fill="{RED}"/></svg>')


def did(anio, mes, d):
    return f"{ABR[calendar.weekday(anio, mes, d)]}-{d:02d}"


def cabecera(mes_titulo):
    return (f'<p style="position:absolute;left:72px;top:40px;width:700px;font-family:{SANS};font-weight:400;font-size:22px;line-height:1.2;color:{INK}">Don Lay · Calendario de publicaciones</p>'
            '<img src="/pitch/donlay-calendario/icono-rojo.svg" alt="" style="position:absolute;left:921px;top:36px;width:78px;height:35px;object-fit:contain">'
            f'<p style="position:absolute;right:72px;top:40px;width:700px;text-align:right;font-family:{SANS};font-weight:400;font-size:22px;line-height:1.2;color:{INK}">{mes_titulo}</p>'
            '<div style="position:absolute;left:72px;right:72px;top:96px;height:1px;background:rgba(29,29,27,0.22)"></div>')


def seccion(sid, fondo, color, cuerpo):
    return (f'<section id="{sid}" style="background:{fondo};color:{color};font-family:{SANS};font-weight:400">\n'
            f'{cuerpo}\n</section>')


def recuento(anio, mes):
    pubs = publicaciones(anio, mes)
    reels = sum(1 for d in pubs if tipo(anio, mes, d) == "reel")
    return len(pubs), reels, len(pubs) - reels


def portada(nov, anio, mes, mes_titulo):
    total, reels, carr = recuento(anio, mes)
    h = nov["portada"]["html"].replace("Noviembre 2026", mes_titulo)
    return re.sub(r'(<p style="position:absolute;left:1040px;bottom:110px[^>]*>).*?(</p>)',
                  rf'\g<1>{total} publicaciones · {reels} reels y {carr} carruseles · stories a diario\g<2>', h)


def celda_gris(n):
    return (f'<div style="display:flex;flex-direction:column;padding:12px 16px;border:1px solid rgba(29,29,27,0.16)">'
            f'<p style="font-family:{SERIF};font-weight:700;font-size:30px;line-height:1;color:rgba(29,29,27,0.25)">{n}</p></div>')


def celda(anio, mes, d, sen):
    t = tipo(anio, mes, d)
    oscuro = t != "stories"
    fondo = {"reel": f"background:{RED};color:{CREAM}", "carrusel": f"background:{INK};color:{CREAM}", "stories": f"background:{ROSE}"}[t]
    color = CREAM if oscuro else INK
    talla = 38 if oscuro else 30
    extra, icono, etiqueta = "", "", ""
    if d in sen:
        extra = f";outline:3px solid {RED if not oscuro else ROSE};outline-offset:-3px"
        icono = star(oscuro)
    elif oscuro:
        icono = f'<div style="width:16px;height:16px;background:{ROSE}"></div>'
    if oscuro:
        nombre = "Reel" if t == "reel" else "Carrusel"
        etiqueta = (f'<p style="font-family:{SANS};font-size:18px;letter-spacing:2px;text-transform:uppercase;line-height:1">{nombre}</p>')
        if d in sen:
            etiqueta = (f'<div style="display:flex;flex-direction:column;gap:6px"><p style="font-family:{SANS};font-size:15px;letter-spacing:1px;line-height:1;font-weight:600;color:{ROSE}">{sen[d][0]}</p>{etiqueta}</div>')
    elif d in sen:
        etiqueta = (f'<p style="font-family:{SANS};font-size:18px;letter-spacing:1px;line-height:1;color:{RED};font-weight:600">{sen[d][0]}</p>')
    return (f'<div data-ir="{did(anio, mes, d)}" title="Ir al día {d}" style="display:flex;flex-direction:column;justify-content:space-between;padding:12px 16px;{fondo};cursor:pointer{extra}">'
            f'<div style="display:flex;flex-direction:row;justify-content:space-between;align-items:flex-start">'
            f'<p style="font-family:{SERIF};font-weight:700;font-size:{talla}px;line-height:1;color:{color}">{d}</p>{icono}</div>{etiqueta}</div>')


def calendario_diapo(anio, mes, nombre, mes_titulo, sen):
    semanas = calendar.Calendar().monthdayscalendar(anio, mes)
    py, pm = (anio, mes - 1) if mes > 1 else (anio - 1, 12)
    ultimo_prev = calendar.monthrange(py, pm)[1]
    celdas = []
    for w, semana in enumerate(semanas):
        for i, d in enumerate(semana):
            if d:
                celdas.append(celda(anio, mes, d, sen))
            elif w == 0:
                lead = semana.count(0)
                celdas.append(celda_gris(ultimo_prev - lead + 1 + i))
            else:
                celdas.append(celda_gris(i - semana.index(0) + 1))
    cab = "".join(f'<p style="font-family:{SANS};font-weight:400;font-size:22px;letter-spacing:3px;text-align:center;color:rgba(29,29,27,0.6)">{l}</p>' for l in "LMXJVSD")
    rejilla = (f'<div style="position:absolute;left:72px;top:140px;width:1180px;height:840px;display:flex;flex-direction:column;gap:22px">'
               f'<div style="display:flex;flex-direction:row;align-items:baseline;gap:24px"><h2 style="font-family:{SERIF};font-weight:700;font-size:72px;line-height:1">Calendario</h2>'
               f'<p style="font-family:{SERIF};font-style:italic;font-size:52px;line-height:1;color:{RED}">{nombre}</p></div>'
               f'<div style="flex:1;display:grid;grid-template-columns:repeat(7, 1fr);grid-template-rows:34px repeat({len(semanas)}, 1fr);gap:8px">{cab}{"".join(celdas)}</div></div>')
    tipos = "".join(
        f'<div style="display:flex;flex-direction:row;gap:14px;align-items:center"><div style="width:28px;height:28px;flex:none;background:{c}"></div>'
        f'<p style="font-size:23px;line-height:1.3;white-space:nowrap"><b>{t}</b> · {cuando}</p></div>'
        for c, t, cuando in [(RED, "Reel", "jueves"), (INK, "Carrusel", "martes y domingos"), (ROSE, "Stories", "a diario")])
    total, reels, carr = recuento(anio, mes)
    fechas = " · ".join(f"<b>{d}</b> {v[1]}" for d, v in sorted(sen.items()))
    leyenda = (f'<div style="position:absolute;left:1290px;top:140px;width:558px;height:800px;box-sizing:border-box;background:{INK};color:{CREAM};padding:48px 52px;display:flex;flex-direction:column;gap:20px">'
               '<p style="font-size:22px;letter-spacing:4px;text-transform:uppercase;color:rgba(246,240,232,0.7)">Instagram</p>'
               f'<div style="display:flex;flex-direction:column;gap:14px;background:{CREAM};color:{INK};padding:22px 22px">{tipos}</div>'
               f'<div style="display:flex;flex-direction:row;gap:14px;align-items:center">{STAR}<p style="font-size:23px;line-height:1.3"><b>Fecha señalada</b> · contenido especial</p></div>'
               + (f'<p style="font-size:24px;line-height:1.5;color:rgba(246,240,232,0.85)">Fechas: {fechas}</p>' if sen else "")
               + '<div style="flex:1"></div>'
               f'<p style="font-family:{SERIF};font-weight:700;font-size:80px;line-height:1">{total}</p>'
               f'<p style="font-family:{SERIF};font-style:italic;font-size:40px;line-height:1.1">publicaciones</p>'
               f'<p style="font-size:24px;line-height:1.5;color:rgba(246,240,232,0.75)">{reels} reels y {carr} carruseles, del 1 al {calendar.monthrange(anio, mes)[1]} de {nombre}, y stories a diario.</p></div>')
    pie = (f'<p style="position:absolute;left:72px;bottom:44px;width:900px;font-family:{SANS};font-weight:400;font-size:22px;line-height:1.2;color:rgba(29,29,27,0.65)">@donlayrestaurante</p>'
           f'<p style="position:absolute;right:72px;bottom:44px;width:200px;text-align:right;font-family:{SANS};font-weight:400;font-size:22px;line-height:1.2;color:rgba(29,29,27,0.65)">02</p>')
    return seccion("calendario", CREAM, INK, cabecera(mes_titulo) + rejilla + leyenda + pie)


def feed(nov, anio, mes, nombre, mes_titulo):
    h = nov["feed"]["html"].replace("Noviembre 2026", mes_titulo)
    h = h.replace('Feed de <span style="color:#79242F">noviembre</span>', f'Feed de <span style="color:#79242F">{nombre}</span>')
    total = len(publicaciones(anio, mes))
    h = re.sub(r'las 12 publicaciones del mes', f'las {total} publicaciones del mes', h)
    patron = re.compile(r'<div data-feed="[^"]*"[^>]*>(?:(?!<div).)*?</div>', re.S)
    plantillas = {}
    for m in patron.finditer(h):
        t = "reel" if ">Reel<" in m.group(0) else "carrusel"
        plantillas.setdefault(t, m.group(0))
    abrev = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"]

    def celda_feed(d):
        t = tipo(anio, mes, d)
        c = plantillas[t]
        c = re.sub(r'data-feed="[^"]*"', f'data-feed="{did(anio, mes, d)}"', c)
        c = re.sub(r' data-ir="[^"]*"', "", c).replace('data-feed=', f'data-ir="{did(anio, mes, d)}" data-feed=', 1)
        c = re.sub(r'(font-size:24px;line-height:1">)[^<]*(</p>)', rf'\g<1>{abrev[calendar.weekday(anio, mes, d)]} {d}\g<2>', c)
        return c

    nuevas = [celda_feed(d) for d in reversed(publicaciones(anio, mes))]
    viejas = list(patron.finditer(h))
    # El primer móvil tiene 6 huecos (se ven 3) y el segundo, al deslizar, sigue
    # desde la cuarta: van todas las que quedan y las antiguas bajan.
    primero, segundo = viejas[:6], viejas[6:]
    trozos = [(m.start(), m.end(), nuevas[i]) for i, m in enumerate(primero)]
    trozos.append((segundo[0].start(), segundo[-1].end(), "".join(nuevas[3:])))
    for ini, fin, txt in reversed(trozos):
        h = h[:ini] + txt + h[fin:]
    return h


def dia(anio, mes, d, nombre, mes_titulo, sen):
    wd = calendar.weekday(anio, mes, d)
    sid = did(anio, mes, d)
    t = tipo(anio, mes, d)
    chip_txt, chip_bg = {"reel": ("Reel de Instagram", RED), "carrusel": ("Carrusel de Instagram", INK), "stories": ("Stories de Instagram", INK)}[t]
    chip = (f'<div style="display:flex;flex-direction:row;gap:12px;flex-wrap:wrap"><p style="font-size:22px;letter-spacing:2px;text-transform:uppercase;background:{chip_bg};color:{CREAM};padding:12px 22px">{chip_txt}</p></div>')
    marca = ""
    if d in sen:
        marca = (f'<div style="display:flex;flex-direction:row;gap:12px;align-items:center">{STAR}'
                 f'<p style="font-size:22px;letter-spacing:1px;color:{RED};font-weight:600">{sen[d][1]}</p></div>')
    if t == "stories":
        cuerpo = ('<div style="height:40px"></div><p style="font-size:24px;line-height:1.4;color:rgba(29,29,27,0.7)">Las stories del día, listas para descargar.</p>')
    else:
        cuerpo = ('<div style="display:flex;flex-direction:column;gap:10px;background:#FFFFFF;padding:22px 28px;width:700px;box-sizing:border-box;min-height:320px">'
                  f'<p style="font-family:{SANS};font-size:16px;letter-spacing:3px;text-transform:uppercase;color:{RED}">Copy</p></div>')
    izq = (f'<div style="position:absolute;left:72px;top:150px;width:720px;display:flex;flex-direction:column;gap:26px">'
           '<p style="font-size:22px;letter-spacing:4px;text-transform:uppercase;color:rgba(29,29,27,0.65)">@donlayrestaurante</p>'
           f'<h2 style="font-family:{SERIF};font-weight:700;font-size:88px;line-height:0.95">{DIAS[wd]} {d}</h2>'
           f'<p style="font-family:{SERIF};font-style:italic;font-size:32px;line-height:1.2;color:{RED}">{DIAS[wd].lower()} {d} de {nombre} de {anio}</p>'
           f'{chip}{marca}{cuerpo}</div>')
    logo = '<img src="/pitch/donlay-calendario/logo-beige.svg" alt="Don Lay" style="width:{w}px;height:{h}px;object-fit:contain">'
    etiqueta = '<p style="font-family:' + SANS + ';font-size:{s}px;letter-spacing:3px;text-transform:uppercase">{t}</p>'
    titulo_col = '<p style="position:absolute;left:{x}px;top:128px;width:480px;font-family:' + SANS + ';font-size:18px;letter-spacing:3px;text-transform:uppercase;color:rgba(29,29,27,0.6)">{t}</p>'
    stories_col = (titulo_col.format(x=1420, t="Stories del día") +
                   f'<div data-slot="{sid}-stories" data-tipo="story" style="position:absolute;overflow:hidden;left:1420px;top:170px;width:340px;height:604px;border-radius:24px;background:{INK};color:{CREAM};display:flex;flex-direction:column;justify-content:center;align-items:center;gap:24px;box-shadow:0 24px 60px rgba(29,29,27,0.25)">'
                   + logo.format(w=200, h=64) + etiqueta.format(s=18, t="Stories") + '</div>')
    if t == "carrusel":
        centro = (titulo_col.format(x=840, t="Carrusel") +
                  '<div style="position:absolute;left:840px;top:170px;width:480px;background:#FFFFFF;box-shadow:0 24px 60px rgba(29,29,27,0.18);display:flex;flex-direction:column">'
                  '<div style="height:60px;display:flex;flex-direction:row;align-items:center;gap:12px;padding:0 16px"><img src="/pitch/donlay-calendario/ig-avatar.png" alt="" style="width:36px;height:36px;border-radius:256px">'
                  f'<p style="font-family:{SANS};font-weight:600;font-size:17px;color:{INK}">donlayrestaurante</p></div>'
                  f'<div data-slot="{sid}" data-tipo="carrusel" style="position:relative;overflow:hidden;width:480px;height:600px;background:{INK};color:{CREAM};display:flex;flex-direction:column;justify-content:center;align-items:center;gap:24px">'
                  + logo.format(w=280, h=90) + etiqueta.format(s=20, t="Carrusel") + '</div><div style="height:54px"></div></div>' + stories_col)
        horas_txt = ["Carrusel"]
    elif t == "reel":
        centro = (titulo_col.format(x=860, t="Reel") +
                  f'<div data-slot="{sid}" data-tipo="reel" style="position:absolute;overflow:hidden;left:860px;top:170px;width:400px;height:712px;border-radius:24px;background:{RED};color:{CREAM};display:flex;flex-direction:column;justify-content:center;align-items:center;gap:30px;box-shadow:0 24px 60px rgba(29,29,27,0.25)">'
                  + logo.format(w=240, h=77) + f'<svg viewBox="0 0 24 24" style="width:64px;height:64px;color:{CREAM}" aria-hidden="true"><path d="M7 4v16l13-8z" fill="currentColor"/></svg>'
                  + etiqueta.format(s=20, t="Reel") + '</div>' + stories_col)
        horas_txt = ["Reel"]
    else:
        centro = "".join(
            f'<div data-slot="{slot}" data-tipo="story" style="position:absolute;overflow:hidden;left:{x}px;top:170px;width:400px;height:712px;background:{INK};color:{CREAM};display:flex;flex-direction:column;justify-content:center;align-items:center;gap:30px;box-shadow:0 24px 60px rgba(29,29,27,0.25)">'
            + logo.format(w=240, h=77) + '<p style="font-size:20px;letter-spacing:3px;text-transform:uppercase">Story</p></div>'
            for slot, x in [(sid, 920), (f"{sid}-2", 1368)])
        horas_txt = ["Story"]
    pills = "".join(f'<p style="font-family:{SANS};font-size:20px;letter-spacing:2px;text-transform:uppercase;white-space:nowrap;padding:10px 18px;background:#FFFFFF;color:{INK}">{x} · <b style="font-weight:600;color:rgba(29,29,27,0.4)">—</b></p>' for x in horas_txt)
    horas = (f'<div data-horas="{sid}" style="position:absolute;left:840px;top:924px;display:flex;flex-direction:row;align-items:center;gap:12px">'
             f'<p style="font-family:{SANS};font-size:18px;letter-spacing:3px;text-transform:uppercase;color:rgba(29,29,27,0.6);white-space:nowrap;margin-right:6px">Hora de publicación</p>{pills}</div>')
    num = f'<p style="position:absolute;right:72px;bottom:44px;width:200px;text-align:right;font-size:22px;line-height:1.2;color:rgba(29,29,27,0.65)">{d}</p>'
    return {"id": sid, "titulo": f"{DIAS[wd]} {d}",
            "html": seccion(sid, CREAM, INK, cabecera(mes_titulo) + izq + centro + horas + num)}


def main():
    anio, mes, nombre = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
    mes_titulo = f"{nombre.capitalize()} {anio}"
    s = (BASE / "noviembre/diapos.ts").read_text()
    nov = {d["id"]: d for d in json.loads(s[s.index("= [") + 2:s.rindex("]") + 1])}
    sen = SENALADAS.get((anio, mes), {})
    diapos = [
        {"id": "portada", "titulo": "Calendario de publicaciones", "html": portada(nov, anio, mes, mes_titulo)},
        {"id": "calendario", "titulo": "Calendario", "html": calendario_diapo(anio, mes, nombre, mes_titulo, sen)},
        {"id": "feed", "titulo": f"Feed de {nombre}", "html": feed(nov, anio, mes, nombre, mes_titulo)},
    ]
    diapos += [dia(anio, mes, d, nombre, mes_titulo, sen) for d in range(1, calendar.monthrange(anio, mes)[1] + 1)]
    diapos.append({"id": "cierre", "titulo": "Cierre", "html": nov["cierre"]["html"].replace("Noviembre 2026", mes_titulo)})

    out = BASE / nombre
    out.mkdir(exist_ok=True)
    (out / "diapos.ts").write_text(
        "/**\n"
        f" * Diapositivas del calendario de {nombre} de Don Lay (lienzo de 1920×1080): misma\n"
        " * estructura y dinámica que noviembre, con los días de publicación y sin contenido.\n"
        " *\n"
        " * Generadas con scripts/build-donlay-calendario-vacio.py; no se editan a mano.\n"
        " */\n\n"
        'import type { DiapoHtml } from "../../barkita/diapos";\n\n'
        "export const DIAPOS: DiapoHtml[] = " + json.dumps(diapos, ensure_ascii=False, indent=2) + ";\n")
    (out / "contenido.ts").write_text(
        'import type { Contenido } from "../../medios/Medios";\n\n'
        f"/** Fotos de cada día de publicación de {nombre}: vacío hasta que se haga el calendario. */\n"
        "export const CONTENIDO: Contenido = {};\n")
    comp = "Calendario" + nombre.capitalize()
    (out / "page.tsx").write_text(
        'import type { Metadata } from "next";\n'
        'import BarkitaDeck from "../../barkita/BarkitaDeck";\n'
        'import "../../barkita/barkita.css";\n'
        'import "../donlay-calendario.css";\n'
        'import { DIAPOS } from "./diapos";\n'
        'import { CONTENIDO } from "./contenido";\n\n'
        "/**\n"
        f" * Calendario de publicaciones de Don Lay · {nombre} {anio}, vacío para rellenar.\n"
        " * Misma estructura que el de noviembre. Oculto como el resto de /pitch\n"
        " * (noindex y bloqueado en robots.ts).\n"
        " */\n"
        "export const metadata: Metadata = {\n"
        f'  title: "Calendario {nombre} · Don Lay",\n'
        "  robots: { index: false, follow: false },\n"
        "};\n\n"
        f"export default function {comp}() {{\n"
        f'  return <BarkitaDeck diapos={{DIAPOS}} marca="Don Lay · Calendario {nombre}" tema="bk--donlay" contenido={{CONTENIDO}} />;\n'
        "}\n")
    print(len(diapos), "diapositivas →", out)


if __name__ == "__main__":
    main()
