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
    "1cbca70ef06f3b1761414c34f4b24eb5": "dimsum-video.jpg",
    "04c79407a3a1a2a5ad3d9c12972dfbd7": "wok-ref.jpg",
    "c5f485762135e06e9c63c97a95815fa6": "pato-ref.jpg",
    "227a1b2f819a93eb218a4a7ce44b7e2b": "dimsum-ref.jpg",
    "2418178f5dcdeb65fae63a44f1c1aa94": "pieza-1.jpg",
    "50d920291511b149871f2a420eea4d6f": "pieza-2.jpg",
    "b4de30eb5834d46acfcbf7163cc13878": "dossier-pescado.jpg",
    "1038ae184ff15de3ff3af7a276553c51": "dossier-dimsum.jpg",
    "fe6cc725d7342b318dbeb84ca780d442": "dossier-marisco.jpg",
    "f967b442a6264ac91568b00c12f9dde3": "compartir-1.jpg",
    "1bec1005d153e8d99b5df4fe016f83ed": "compartir-2.jpg",
    "4c12db0a1694795b27c1184bc191d4c6": "compartir-3.jpg",
    "6c80cc0f73603d855135a16fe0c082f2": "compartir-4.jpg",
    "23e5fcad60fd3acd083867db518c281f": "mimi-antes.jpg",
    "43991ad628d214fa392b08d09b1e9dba": "mimi-durante.jpg",
    "45478ae2833e7bedf92ab66574e24cfb": "navidad-video.jpg",
    "4a55d2d56214706c4f743f2263d03946": "individual-1.jpg",
    "480a9747b2790594d973d4c25f6fbd92": "individual-2.jpg",
    "3f3fed0034dcbe3eb939226d35f30288": "wok-paso-1.jpg",
    "bcb85c915c34518d9af87efb50f20847": "wok-paso-2.jpg",
    "8b9a4956cf21e9b6ac376243fc9bfa3a": "retrato-1.jpg",
    "2becb7d37dcbffedba23de7c07896e1e": "retrato-2.jpg",
    "b71fcf0af414f15ef50d1e918f31449d": "retrato-3.jpg",
    "12a33f19f30391299ca3b70c06a780ae": "wok-paso-3.jpg",
    "c56082d056dd05fc8f247367444916a4": "wok-paso-4.jpg",
    "4bb5b104483d3c4f5614912972ea11e4": "wok-paso-5.jpg",
    "9e5e8cf1153d692e936265868bd1c415": "wok-paso-6.jpg",
    "37d75efbe7fbb5d77eb2bf8f79446f78": "donlay-arbol-rojo.jpg",
    "384303a3b42989f3788469f0e1181b92": "donlay-bar-arbol.jpg",
    "9e6a60fc04bddfec4c5bffd582931ff2": "donlay-dimsum-cesta.jpg",
    "5ba4974b0c6f3c9408580f06ec03e728": "donlay-sala-reservado.jpg",
    "9d1ca64a5b6ac8359ab711125ee09406": "donlay-sala-lamparas.jpg",
    "cc398e4520f20ba5b56e371509fd9f72": "donlay-wok-fuego.jpg",
    "d37457bef66faa69e7e2136f63e74e78": "icono-dong.png",
    "d3cadbea42b8e4123f8ac87a22613b83": "icono-lai.png",
    "afb7ed891013a845a3498469416e76aa": "icono-chuan.png",
    "f84ef4623acc8d4dcc4a0d95a62de823": "icono-jia.png",
    "ee151cd695dec47b9d35fa38222f3fa9": "icono-yi.png",
    "ab37247166386f1f6605285d846a70a1": "icono-yue.png",
    "286149eef8eba680f309adc678281d80": "eci-pack-1.jpg",
    "e26caa53985a2b8167406db2781613d6": "eci-pack-2.jpg",
    "df300a5cb17e20c7b38f6776eed202cd": "eci-pack-3.jpg",
    "0ada2368d6cffa982dcc013eaf11de8d": "eci-pack-4.jpg",
    "36ae4b9aa3e5490ad39b71ef01169ea6": "eci-bodegon-1.jpg",
    "93971f73883811e7c1e249266cbaf464": "eci-bodegon-2.jpg",
    "851c0179a91dec0d0413c37433407323": "eci-bodegon-3.jpg",
    "2c18e9e851b32e0a11321c7f6c9bffca": "eci-bodegon-4.jpg",
    "6b87c756a4e8362d48ee1e8464ab625b": "navidad-centro.jpg",
    "df8e72c074c9d4f3e190c6f635dcf800": "navidad-velas.jpg",
    "92f23131f83763d8bce2d154251c9a5d": "navidad-camino.jpg",
    "ad8cee54403e3057aa2f142ca131020b": "navidad-plato.jpg",
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
