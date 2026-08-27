"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CIUDADES_CREADOR, EMAIL_PROJECTS } from "../site-data";
import { trackEvent } from "../lib/consent";
import SelectField from "./SelectField";

type Status = "idle" | "sending" | "error";

/**
 * Candidatura para entrar en la red de creadores UGC.
 *
 * Lo que NO se pregunta importa tanto como lo que sí: no se pide el número de
 * seguidores. El UGC no es marketing de influencers —la pieza la publica la
 * marca en su propio perfil, no el creador en el suyo—, así que la audiencia
 * de quien graba es irrelevante. Preguntarla filtraría fuera a gente que graba
 * de maravilla y tiene trescientos seguidores, que es justo el perfil que se
 * busca, y le diría a todos los demás que aquí se mira eso.
 *
 * Lo que sí decide es el trabajo: por eso el enlace a piezas es obligatorio.
 */
export default function TalentForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.get("nombre"),
          apellido: data.get("apellido"),
          email: data.get("email"),
          telefono: data.get("telefono"),
          ciudad: data.get("ciudad"),
          redes: data.get("redes"),
          enlace: data.get("enlace"),
          comentarios: data.get("comentarios"),
          empresa: data.get("empresa"), // honeypot
          origen: "talents-ugc",
        }),
      });

      const json = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setStatus("error");
        setError(
          json.error ??
            `No hemos podido enviar tu candidatura. Escríbenos a ${EMAIL_PROJECTS}.`,
        );
        return;
      }

      trackEvent("generate_lead", { origen: "talents-ugc" });
      form.reset();
      router.push("/gracias");
    } catch {
      setStatus("error");
      setError(
        `No hemos podido enviar tu candidatura. Escríbenos a ${EMAIL_PROJECTS}.`,
      );
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Nombre *
          <input
            name="nombre"
            type="text"
            placeholder="Tu nombre"
            autoComplete="given-name"
            required
          />
        </label>
        <label>
          Apellido
          <input
            name="apellido"
            type="text"
            placeholder="Tu apellido"
            autoComplete="family-name"
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Correo electrónico *
          <input
            name="email"
            type="email"
            placeholder="tu@email.com"
            autoComplete="email"
            required
          />
        </label>
        <label>
          Teléfono
          <input
            name="telefono"
            type="tel"
            placeholder="+34 600 000 000"
            autoComplete="tel"
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Instagram o TikTok
          <input name="redes" type="text" placeholder="@tucuenta" />
        </label>
        <SelectField
          name="ciudad"
          label="Dónde puedes grabar"
          placeholder="Selecciona una zona"
          options={CIUDADES_CREADOR}
        />
      </div>

      {/* Obligatorio: es lo único que dice si sabe grabar. Un perfil de redes
          puede ser privado o estar vacío; un enlace a piezas, no. */}
      <label>
        Enlace a tu trabajo *
        <input
          name="enlace"
          type="text"
          placeholder="Carpeta de Drive, portfolio o un par de reels"
          required
        />
      </label>

      <label>
        Qué tipo de contenido haces
        <textarea
          name="comentarios"
          rows={4}
          placeholder="Con qué te sientes cómodo/a delante de cámara, qué sectores, con qué equipo grabas"
        />
      </label>

      {/* Honeypot antispam: invisible para personas, tentador para bots */}
      <div className="hp-field" aria-hidden="true">
        <label>
          Empresa
          <input name="empresa" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Enviando…" : "Entrar en la red"}
      </button>

      {status === "error" ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <p className="form-note">
        No hace falta tener una comunidad grande: el contenido lo publica la
        marca, no tú. Lo que miramos es cómo grabas. Al enviar aceptas nuestra{" "}
        <a href="/privacidad">política de privacidad</a>.
      </p>
    </form>
  );
}
