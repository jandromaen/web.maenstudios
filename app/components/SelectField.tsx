"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Desplegable propio, no un <select> nativo.
 *
 * El motivo es concreto: la lista abierta de un <select> la dibuja el sistema
 * operativo, no la página. El CSS puede darle estilo al campo cerrado, pero la
 * lista sale siempre con el aspecto del sistema —en macOS, un panel plateado y
 * redondeado— y no hay forma de tocarlo. En una web de fondos negros y esquinas
 * rectas, eso canta.
 *
 * A cambio de poder darle estilo, hay que reponer todo lo que el nativo traía
 * gratis: teclado, foco, roles y el valor dentro del formulario. Eso es lo que
 * hace este componente.
 *
 * El valor viaja en un <input type="hidden">, así que para el formulario y para
 * la API esto sigue siendo un campo normal: no hubo que tocar nada de lo que ya
 * funcionaba.
 */
export default function SelectField({
  name,
  label,
  placeholder,
  options,
}: {
  name: string;
  label: string;
  placeholder: string;
  options: readonly string[];
}) {
  const [abierto, setAbierto] = useState(false);
  const [valor, setValor] = useState("");
  /* Cuál está resaltada con el teclado. Es distinto de la seleccionada: se
     puede recorrer la lista sin elegir nada todavía. */
  const [activa, setActiva] = useState(-1);
  /* La misma posición, en una referencia. Al pulsar Enter hay que leerla en
     ese instante, y el estado que ve el manejador es el del último renderizado:
     si alguien baja con la flecha y confirma dentro del mismo fotograma, se
     elegiría la opción anterior. Con la referencia el valor siempre es el
     vigente. */
  const activaRef = useRef(-1);

  const contenedor = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const id = useId();
  const idLista = `${id}-lista`;

  /* Todas las opciones incluyen la de no responder, que es la primera y
     equivale a dejar el campo vacío. */
  const todas = [placeholder, ...options];
  const indiceDeValor = valor ? todas.indexOf(valor) : 0;

  useEffect(() => {
    if (!abierto) return;

    const fuera = (e: PointerEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false);
    };
    /* Al hacer scroll con la lista abierta, el panel se quedaría flotando
       lejos del campo. Se cierra, que es lo que hace el nativo. */
    const alScroll = () => setAbierto(false);

    document.addEventListener("pointerdown", fuera);
    window.addEventListener("scroll", alScroll, true);
    return () => {
      document.removeEventListener("pointerdown", fuera);
      window.removeEventListener("scroll", alScroll, true);
    };
  }, [abierto]);

  /* Único punto por el que se mueve el resalte: mantiene sincronizados el
     estado (para pintar) y la referencia (para decidir). */
  const situar = (i: number) => {
    const limitado = Math.max(0, Math.min(i, todas.length - 1));
    activaRef.current = limitado;
    setActiva(limitado);
  };

  const abrir = (desde = indiceDeValor) => {
    situar(desde);
    setAbierto(true);
  };

  const elegir = (indice: number = activaRef.current) => {
    /* El marcador de posición no es una opción: elegirlo es vaciar el campo. */
    setValor(indice === 0 ? "" : todas[indice]);
    setAbierto(false);
    boton.current?.focus();
  };

  const alPulsarTecla = (e: React.KeyboardEvent) => {
    if (!abierto) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        abrir();
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setAbierto(false);
      boton.current?.focus();
      return;
    }
    if (e.key === "Tab") {
      setAbierto(false);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      elegir();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      situar(activaRef.current + 1);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      situar(activaRef.current - 1);
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      situar(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      situar(todas.length - 1);
    }
  };

  return (
    <div className="campo-select" ref={contenedor}>
      <span className="campo-select-label" id={`${id}-label`}>
        {label}
      </span>

      {/* El valor real para el formulario. Sin esto, un desplegable propio no
          existe para FormData y el dato no llegaría a la API. */}
      <input type="hidden" name={name} value={valor} readOnly />

      <button
        type="button"
        ref={boton}
        className={`campo-select-boton${abierto ? " abierto" : ""}`}
        onClick={() => (abierto ? setAbierto(false) : abrir())}
        onKeyDown={alPulsarTecla}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-controls={idLista}
        aria-labelledby={`${id}-label`}
        aria-activedescendant={abierto && activa >= 0 ? `${id}-op-${activa}` : undefined}
      >
        <span className={valor ? "campo-select-valor" : "campo-select-vacio"}>
          {valor || placeholder}
        </span>
        <span className="campo-select-flecha" aria-hidden="true" />
      </button>

      {abierto ? (
        <ul className="campo-select-lista" id={idLista} role="listbox" aria-labelledby={`${id}-label`}>
          {todas.map((opcion, i) => (
            <li
              key={opcion}
              id={`${id}-op-${i}`}
              role="option"
              aria-selected={i === indiceDeValor}
              className={`campo-select-opcion${i === activa ? " activa" : ""}${
                i === indiceDeValor ? " elegida" : ""
              }`}
              /* pointerdown y no click: el pointerdown de fuera cierra el panel,
                 y con click el cierre se adelantaba a la selección. */
              onPointerDown={(e) => {
                e.preventDefault();
                elegir(i);
              }}
              onPointerEnter={() => situar(i)}
            >
              {opcion}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
