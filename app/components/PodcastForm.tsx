"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EMAIL_PROJECTS } from "../site-data";
import { trackEvent } from "../lib/consent";

type Status = "idle" | "sending" | "error";

/**
 * Candidatura para salir en The After Podcast.
 *
 * Es un formulario aparte y no el de contacto con otro `origen`: las preguntas
 * que hay que hacerle a alguien que quiere que le entrevisten no son las de
 * alguien que pide presupuesto. Preguntarle el presupuesto a un invitado sería
 * raro, y no preguntarle de qué quiere hablar deja el correo sin lo único que
 * sirve para decidir.
 *
 * Comparte la ruta /api/contacto, que ya resuelve el envío, el antispam y los
 * destinatarios. Lo que cambia es qué se le pregunta y cómo llega el aviso.
 */
export default function PodcastForm() {
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
          proyecto: data.get("proyecto"),
          enlace: data.get("enlace"),
          comentarios: data.get("comentarios"),
          empresa: data.get("empresa"), // honeypot
          origen: "podcast-invitado",
        }),
      });

      const json = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setStatus("error");
        setError(
          json.error ??
            `No hemos podido enviar tu propuesta. Escríbenos a ${EMAIL_PROJECTS}.`,
        );
        return;
      }

      trackEvent("generate_lead", { origen: "podcast-invitado" });
      form.reset();
      router.push("/gracias");
    } catch {
      setStatus("error");
      setError(
        `No hemos podido enviar tu propuesta. Escríbenos a ${EMAIL_PROJECTS}.`,
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
          A qué te dedicas
          <input
            name="proyecto"
            type="text"
            placeholder="Tu proyecto, marca o empresa"
          />
        </label>
        <label>
          Instagram o web
          <input
            name="enlace"
            type="text"
            placeholder="@tucuenta o tuweb.com"
            autoComplete="url"
          />
        </label>
      </div>

      {/* La pregunta que de verdad decide. Un nombre y un enlace no dicen si
          hay episodio; de qué quiere hablar, sí. */}
      <label>
        ¿De qué te gustaría hablar? *
        <textarea
          name="comentarios"
          rows={4}
          placeholder="La historia que quieres contar, y por qué crees que encaja"
          required
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
        {status === "sending" ? "Enviando…" : "Proponerme como invitado"}
      </button>

      {status === "error" ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <p className="form-note">
        Leemos todas las propuestas, pero no podemos grabar con todo el mundo:
        solo contestamos si encaja. Al enviar aceptas nuestra{" "}
        <a href="/privacidad">política de privacidad</a>.
      </p>
    </form>
  );
}
