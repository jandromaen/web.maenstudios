"""
Genera app/pitch/ultramarinos-briefing/noviembre/diapos.ts a partir de las
diapositivas del deck (un <section> de 1920×1080 por fichero, estilos en línea).

Uso: python3 scripts/build-ultramarinos-briefing.py <carpeta del deck>
     (la carpeta que contiene project/deck.json y project/slides/)

Lo que adapta para el visor de Barkita (.bk):
  - las imágenes subidas al deck (/_blob/<id>) pasan a /pitch/ultramarinos-briefing/<fichero>
  - <x-icon name="Play"> se dibuja como un triángulo en SVG
  - las notas del orador (<aside>) se quitan
"""

import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "app/pitch/ultramarinos-briefing/noviembre/diapos.ts"
PUBLICO = "/pitch/ultramarinos-briefing/"

BLOBS = {
    "8e2be652dc88121e69483999b1ca1d52": "head-navy.png",
    "310f59645ebc7de43e5802d8a400d942": "head-light.png",
    "2c60b1cb6e9b4128c4c8c958cf9fc42a": "wordmark.png",
    "dee5a013cdabaa97a6e3f155630ec409": "wordmark-light.png",
    "e6da2cbd98731730d3f1b74a4b188a95": "logo-maen.png",
    "3d0ac92518e718267247c40615b213f4": "vino-v1.jpg",
    "5b37dcf6dde35d57871b192c2cb28ce8": "vino-v2.jpg",
    "195a702b648f5cc079d74dc384229862": "vino-v3.jpg",
    "44cfe8fa27dec5ab39514de4afac19fc": "vino-v4.jpg",
    "fde16ec00a547d35ef8ca6be7762b540": "vino-f1.jpg",
    "f4afc1b01049261684710abe23a24525": "vino-f2.jpg",
    "2f714efb9b1031a11e7c1822e53d896f": "vino-f3.jpg",
    "8313e0e91384200b73f75aacb96c5d98": "vino-f4.jpg",
    "2e3b78162e783c4ab71196fd0f1bf66f": "vino-f5.jpg",
    "4d3c0754d510777554fa196e8c8433a9": "vino-f6.jpg",
    "3e0ee5536d6e23c739d73e18ec2c715c": "vino-f7.jpg",
    "eb2053e05783cf467da2914881405df7": "vino-f8.jpg",
    "028fecd5b306074549a0ebe56fd35794": "garum-v1.jpg",
    "333c084c3d31a03301ba6f1c8c7d2ab3": "garum-v2.jpg",
    "a4775fdea824de7cfa71706b1a2bca65": "garum-f1.jpg",
    "be2a736cb2864e1c39fb420c034ff223": "garum-f2.jpg",
    "8416382b79413a604aa9f95db383dd72": "garum-f3.jpg",
    "56c5fc39c8cdae7bac8d77db59ff60d6": "garum-f4.jpg",
    "97f2bb2cfd54b57bbb293dfef1df038c": "carne-v1.jpg",
    "6e9a2d36405b458f8362d2675de37083": "carne-v2.jpg",
    "6175c179e85ec92b3d52a9a99f10993f": "carne-v3.jpg",
    "5d27656f599064e4c954072b33b1710c": "carne-v4.jpg",
    "38f10f1bcfabbe43e449123285695d07": "carne-f1.jpg",
    "f878febf11e0609b33fd156d7ba55153": "carne-f2.jpg",
    "41875638a072c2d57af61e40e9157bfd": "carne-f3.jpg",
    "79aba14c0738f402f104c7177d014633": "carne-f4.jpg",
    "8abc3f01538267ec57ee56d800d93c10": "carne-f5.jpg",
    "14df5647d513fdd489cb6dc88cca69e6": "carne-f6.jpg",
    "888585ff45c9d5d50134c918293c4faa": "carne-f7.jpg",
    "db010dfda9fcee0fa409c0801e11588e": "carne-f8.jpg",
    "907d43da4072460ab44da470dff7b441": "carne-f9.jpg",
    "f2d3b938082b99c570f5f1b8cc24dde3": "gastro-a1.jpg",
    "9c93335415d9bb78e388befe53a4ee72": "gastro-a2.jpg",
    "802cc425ec29a001ef6b9b2bcc4ac2dd": "gastro-a3.jpg",
    "b5b6099ba2a224d251cc7f02743a667b": "gastro-a4.jpg",
    "85a4ce1fd8ce30b4817097462ff9e793": "gastro-b1.jpg",
    "777647d4a2ed651636da6ec4d300b0ef": "gastro-b2.jpg",
    "9bd31ec17cc71a16e811af1c6393f4b7": "gastro-b3.jpg",
    "a41d4fba1129563081b8c8ea226d674b": "gastro-b4.jpg",
    "137b4cf23703d9377d3cb781ded1d702": "gastro-b5.jpg",
    "afc3d1eaf5ea15e49b2ac7131b3c6c1b": "gastro-b6.jpg",
    "4e723bcf9301b83dffa0c5a4aab96851": "espacio-v1.jpg",
    "966820dd57d7543a771ad1c870d18227": "espacio-v2.jpg",
    "e34d199aa0788a9b3f81a78bc7105763": "espacio-f1.jpg",
    "cd0546c88d561ad5f5903555a524a571": "espacio-f2.jpg",
    "1c0e46af7f6d16f16e1b50d8f8e97e92": "espacio-f3.jpg",
    "ce4da412d43a28b3ddb9ecdcde018065": "espacio-f4.jpg",
    "a49d2632ca38c686643901a89ab7ab58": "story-fachada.jpg",
    "b0f2502787e7b7d491a80f6c25b06d31": "story-puerta.jpg",
    "24878f92c76675e0521ca2967c094ccd": "story-carta.jpg",
}


def icono_play(m: re.Match) -> str:
    estilo = m.group(1)
    color = re.search(r"color:([^;\"]+)", estilo)
    ancho = re.search(r"width:(\d+)px", estilo)
    alto = re.search(r"height:(\d+)px", estilo)
    c = color.group(1) if color else "#F3EDE1"
    w = ancho.group(1) if ancho else "36"
    h = alto.group(1) if alto else w
    return (
        f'<svg viewBox="0 0 24 24" width="{w}" height="{h}" aria-hidden="true" '
        f'style="display:block;margin-left:4px"><path d="M6 4l14 8-14 8z" fill="{c}"/></svg>'
    )


def video(m: re.Match) -> str:
    """La portada de un reel de referencia pasa a ser el reel, si ya está en /public.

    Mientras no haya vídeo se queda la portada con el botón de play encima."""
    nombre, alt, estilo = m.groups()
    if not (RAIZ / "public" / PUBLICO.strip("/") / f"{nombre}.mp4").exists():
        return m.group(0)
    return (
        f'<video src="{PUBLICO}{nombre}.mp4" poster="{PUBLICO}{nombre}.jpg" '
        f'aria-label="{alt}" autoplay muted loop playsinline preload="metadata" '
        f'style="{estilo}"></video>'
    )


def adaptar(html: str) -> str:
    def blob(m: re.Match) -> str:
        nombre = BLOBS.get(m.group(1))
        if not nombre:
            sys.exit(f"Imagen sin fichero: {m.group(1)}")
        return PUBLICO + nombre

    html = re.sub(r"/_blob/([0-9a-f]{32})", blob, html)
    html = re.sub(r'<x-icon name="Play" style="([^"]*)"></x-icon>', icono_play, html)
    html = re.sub(r"\s*<aside>.*?</aside>", "", html, flags=re.S)
    html = html.replace(
        '<hr style="width:120px;border-top:2px solid #175F51">',
        '<hr style="width:120px;border:none;border-top:2px solid #175F51;margin:0">',
    )
    html = re.sub(
        r'<img src="' + PUBLICO + r'([a-z]+-[a-z]+\d)\.jpg" alt="([^"]*)" style="([^"]*)">\s*'
        r'<div style="position:absolute;left:calc\(50% - \d+px\)[^"]*">.*?</div>',
        video,
        html,
        flags=re.S,
    )
    if "<x-" in html:
        sys.exit("Queda un elemento del formato de diapositivas sin traducir")
    return html.strip()


def titulo(html: str, id_: str) -> str:
    m = re.search(r"<h[12][^>]*>(.*?)</h[12]>", html, flags=re.S)
    return re.sub(r"<[^>]+>", "", m.group(1)).strip() if m else id_


def main() -> None:
    deck = Path(sys.argv[1]) / "project"
    indice = json.loads((deck / "deck.json").read_text(encoding="utf-8"))
    diapos = []
    for id_ in indice["order"]:
        html = adaptar((deck / "slides" / f"{id_}.html").read_text(encoding="utf-8"))
        diapos.append({"id": id_, "titulo": titulo(html, id_) if id_ != "cover" else "Portada", "html": html})

    cabecera = (
        "/**\n"
        " * Diapositivas del briefing de producción de noviembre de Ultramarinos Marín\n"
        " * Madrid (lienzo de 1920×1080): azul marino y verde del logotipo, fondo\n"
        " * crema, Barlow Condensed para titulares y Newsreader para el texto.\n"
        " *\n"
        " * Generadas con scripts/build-ultramarinos-briefing.py; no se editan a mano.\n"
        " */\n\n"
        'import type { DiapoHtml } from "../../barkita/diapos";\n\n'
    )
    cuerpo = "export const DIAPOS: DiapoHtml[] = " + json.dumps(diapos, ensure_ascii=False, indent=2) + ";\n"
    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    DESTINO.write_text(cabecera + cuerpo, encoding="utf-8")
    print(f"{len(diapos)} diapositivas → {DESTINO.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
