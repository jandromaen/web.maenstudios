"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EMAIL_PROJECTS, PRESUPUESTOS } from "../site-data";
import { trackEvent } from "../lib/consent";
import SelectField from "./SelectField";

type Status = "idle" | "sending" | "error";

export default function ContactForm({ origen = "web" }: { origen?: string }) {
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
          comentarios: data.get("comentarios"),
          presupuesto: data.get("presupuesto"),
          empresa: data.get("empresa"), // honeypot
          origen,
        }),
      });

      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) {
        setStatus("error");
        setError(
          json.error ??
            `No hemos podido enviar el mensaje. Escríbenos a ${EMAIL_PROJECTS}.`,
        );
        return;
      }

      trackEvent("generate_lead", {
        origen,
        presupuesto: String(data.get("presupuesto") || "sin indicar"),
      });
      form.reset();
      router.push("/gracias");
    } catch {
      setStatus("error");
      setError(
        `No hemos podido enviar el mensaje. Escríbenos a ${EMAIL_PROJECTS}.`,
      );
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate={false}>
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
      <label>
        Cuéntanos tu proyecto
        <textarea
          name="comentarios"
          rows={4}
          placeholder="¿Qué contenido necesitas?"
        />
      </label>

      {/* Va después de contar el proyecto y no antes, a propósito: es la
          pregunta que más frena, y se responde mucho mejor cuando quien
          escribe ya se ha implicado explicando lo que necesita.

          Tampoco es obligatoria. Un presupuesto forzado en el primer contacto
          hace que la gente se invente una cifra o cierre la pestaña, y las dos
          cosas son peores que no saberlo. */}
      <SelectField
        name="presupuesto"
        label="Presupuesto estimado"
        placeholder="Prefiero no decirlo"
        options={PRESUPUESTOS}
      />

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
        {status === "sending" ? "Enviando…" : "Enviar"}
      </button>

      {status === "error" ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <p className="form-note">
        Te respondemos en menos de 24 horas. También puedes escribirnos a{" "}
        <a href={`mailto:${EMAIL_PROJECTS}`}>{EMAIL_PROJECTS}</a>. Al enviar
        aceptas nuestra <a href="/privacidad">política de privacidad</a>.
      </p>
    </form>
  );
}
