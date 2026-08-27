"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Alta en la newsletter del blog.
 *
 * La casilla de consentimiento va sin marcar y es obligatoria. Premarcarla es
 * la infracción más común y la más fácil de demostrar: el consentimiento tiene
 * que ser un acto, no una omisión.
 */
export default function NewsletterForm() {
  const [estado, setEstado] = useState<"quieto" | "enviando" | "hecho">("quieto");
  const [error, setError] = useState("");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    setEstado("enviando");
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: datos.get("email"),
          empresa: datos.get("empresa"), // señuelo
        }),
      });
      const cuerpo = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(cuerpo.error ?? "No hemos podido suscribirte.");
      setEstado("hecho");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No hemos podido suscribirte.");
      setEstado("quieto");
    }
  }

  if (estado === "hecho") {
    return (
      <div className="news-box">
        <h3>Mira tu correo</h3>
        <p>
          Te hemos mandado un enlace para confirmar. Hasta que lo pulses no te
          apuntamos a nada — así nos aseguramos de que esa dirección es tuya.
        </p>
      </div>
    );
  }

  return (
    <div className="news-box">
      <h3>Lo que aprendemos, cada semana</h3>
      <p>
        Un correo con lo que funciona en redes y lo que no, sacado de lo que
        rodamos. Sin relleno y sin vender nada.
      </p>

      <form className="news-form" onSubmit={enviar} noValidate>
        <label className="sr-only" htmlFor="news-email">
          Tu email
        </label>
        <div className="news-row">
          <input
            id="news-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@email.com"
            disabled={estado === "enviando"}
          />
          <button className="btn btn-primary" type="submit" disabled={estado === "enviando"}>
            {estado === "enviando" ? "Enviando…" : "Suscribirme"}
          </button>
        </div>

        {/* Señuelo: invisible para una persona, irresistible para un bot */}
        <input
          className="sr-only"
          type="text"
          name="empresa"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <label className="news-consent">
          <input type="checkbox" name="consentimiento" required />
          <span>
            Acepto recibir estos correos y he leído la{" "}
            <Link href="/privacidad">política de privacidad</Link>. Puedo darme
            de baja con un clic en cualquier momento.
          </span>
        </label>

        {error ? <p className="news-error">{error}</p> : null}
      </form>
    </div>
  );
}
