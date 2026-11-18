"""
Genera app/pitch/donlay-briefing/noviembre/diapos.ts a partir de las
diapositivas del deck (un <section> de 1920×1080 por fichero).

Uso: python3 scripts/build-donlay-briefing.py <carpeta del deck>
     (la carpeta que contiene project/deck.json y project/slides/)

Las diapositivas usan clases (eyebrow, card, firma…). Sus estilos viven en
app/pitch/donlay-briefing/donlay-briefing.css, con el tema .bk--donlay-briefing.

Lo que adapta para el visor de Barkita (.bk):
  - las imágenes subidas al deck (/_blob/<id>) pasan a /pitch/donlay-briefing/<fichero>
  - las notas del orador (<aside>) se quitan
  - la portada de un clip (<nombre>-video.jpg) pasa a ser el vídeo, si su .mp4 está en /public
"""

import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "app/pitch/donlay-briefing/noviembre/diapos.ts"
PUBLICO = "/pitch/donlay-briefing/"

BLOBS = {
    "8e1fb5546df4f654edac73b5d8a82c20": "wordmark.png",
    "3e93a4eafcba84ed2eef09fd428ee1e5": "wordmark-red.png",
    "4d43e70ed0d0b32d535ca971420854b9": "icon.png",
    "d2e06217bdad5307640d721eec800b08": "icon-red.png",
    "80c10a1df49c8ef3731819c5007f1a43": "ref-detalle.jpg",
    "b2fb307564b51720c36bc0708a62dba0": "ref-palillos.jpg",
    "eb0464adaf7e0e3d1cf911f9c178e6f9": "ref-manos.jpg",
    "28666b2b9d1b2137b7c2b9a08c9f33a1": "ref-coctel.jpg",
    "3fc461bac5db4c8d60fbfb67d8077f21": "ref-cenital.jpg",
    "a02dc5d2f7be3b455a82d575b1f68c25": "ref-mesa.jpg",
    "9504ccb2c9ae1748d95bb5356f3b461a": "ref-fuego.jpg",
    "df94d9887b7b0a356e72e7921ebdb980": "ref-corte.jpg",
    "7de3c33b379da29870ea36f812036572": "ref-pliegue.jpg",
    "b6124f0d9574660f771487790de2314c": "ref-sala.jpg",
    "76b0128e11fa425945f1cb2747a422b0": "ref-servicio.jpg",
    "7508e8cc375623e22f557e29052a9f87": "carrusel-1.jpg",
    "a54dacd8c2bd82d0c223a5ef785557e7": "carrusel-2.jpg",
    "8312c32fe45d24aa5f9ce75b52a06a82": "carrusel-3.jpg",
    "79b8dfb4dccc2efa2e84c98a6ccb4a21": "carrusel-4.jpg",
    "4b1ce6e2f8ca54e26d63bc971e3bfb47": "carrusel-video.jpg",
    "b28b8fe0670f4d6a6e29783b4a8c746e": "pato-maestro.jpg",
    "99314c4615aa12c92e4a08d0f4d1cd70": "pato-mesa.jpg",
    "a9072b55ad8c3d82ec8380a16d4dfcd6": "pato-video.jpg",
}


def video(m: re.Match) -> str:
    """La portada del clip de referencia pasa a ser el clip, si ya está en /public."""
    nombre, alt, estilo = m.groups()
    if not (RAIZ / "public" / PUBLICO.strip("/") / f"{nombre}.mp4").exists():
        return m.group(0)
    return (
        f'<video src="{PUBLICO}{nombre}.mp4" poster="{PUBLICO}{nombre}.jpg" '
        f'aria-label="{alt}" autoplay muted loop playsinline preload="metadata" '
        f'style="{estilo};object-fit:cover"></video>'
    )


def adaptar(html: str) -> str:
    def blob(m: re.Match) -> str:
        nombre = BLOBS.get(m.group(1))
        if not nombre:
            sys.exit(f"Imagen sin fichero: {m.group(1)}")
        return PUBLICO + nombre

    html = re.sub(r"/_blob/([0-9a-f]{32})", blob, html)
    html = re.sub(r"\s*<aside>.*?</aside>", "", html, flags=re.S)
    html = re.sub(
        r'<img class="photo" src="' + PUBLICO + r'([a-z-]+-video)\.jpg" alt="([^"]*)" style="([^"]*)">',
        video,
        html,
    )
    if "<x-" in html:
        sys.exit("Queda un elemento del formato de diapositivas sin traducir")
    return html.strip()


def titulo(html: str, id_: str) -> str:
    m = re.search(r"<h[12][^>]*>(.*?)</h[12]>", html, flags=re.S)
    if not m:
        return id_
    texto = re.sub(r"<br\s*/?>", " ", m.group(1))
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", texto)).strip()


def main() -> None:
    deck = Path(sys.argv[1]) / "project"
    indice = json.loads((deck / "deck.json").read_text(encoding="utf-8"))
    diapos = []
    for id_ in indice["order"]:
        html = adaptar((deck / "slides" / f"{id_}.html").read_text(encoding="utf-8"))
        diapos.append({"id": id_, "titulo": {"cover": "Portada", "cierre": "Un honor al camino"}.get(id_) or titulo(html, id_), "html": html})

    cabecera = (
        "/**\n"
        " * Diapositivas del briefing de rodaje de noviembre de Don Lay (lienzo de\n"
        " * 1920×1080), con la identidad del Brand Manual 2026: negro #1D1D1B, rojo\n"
        " * #79242F y beige; Self Modern para titulares e Inter para el texto.\n"
        " *\n"
        " * Generadas con scripts/build-donlay-briefing.py; no se editan a mano.\n"
        " */\n\n"
        'import type { DiapoHtml } from "../../barkita/diapos";\n\n'
    )
    cuerpo = "export const DIAPOS: DiapoHtml[] = " + json.dumps(diapos, ensure_ascii=False, indent=2) + ";\n"
    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    DESTINO.write_text(cabecera + cuerpo, encoding="utf-8")
    print(f"{len(diapos)} diapositivas → {DESTINO.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
