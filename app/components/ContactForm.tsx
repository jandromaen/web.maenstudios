"use client";

import { useState } from "react";
import { EMAIL_PROJECTS } from "../site-data";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const nombre = `${data.get("nombre") ?? ""} ${data.get("apellido") ?? ""}`.trim();
    const email = data.get("email") ?? "";
    const telefono = data.get("telefono") ?? "";
    const comentarios = data.get("comentarios") ?? "";

    const subject = `Nuevo proyecto — ${nombre || "Contacto web"}`;
    const body = [
      `Nombre: ${nombre}`,
      `Email: ${email}`,
      `Teléfono: ${telefono}`,
      "",
      `${comentarios}`,
    ].join("\n");

    window.location.href = `mailto:${EMAIL_PROJECTS}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Nombre *
          <input name="nombre" type="text" placeholder="Tu nombre" required />
        </label>
        <label>
          Apellido
          <input name="apellido" type="text" placeholder="Tu apellido" />
        </label>
      </div>
      <div className="form-row">
        <label>
          Correo electrónico *
          <input name="email" type="email" placeholder="tu@email.com" required />
        </label>
        <label>
          Teléfono
          <input name="telefono" type="tel" placeholder="+34 600 000 000" />
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
      <button className="btn btn-primary" type="submit">
        {sent ? "Abriendo tu email…" : "Enviar"}
      </button>
      <p className="form-note">
        Al enviar se abrirá tu programa de correo con el mensaje listo para{" "}
        <a href={`mailto:${EMAIL_PROJECTS}`}>{EMAIL_PROJECTS}</a>.
      </p>
    </form>
  );
}
