import { EMAIL_ADMIN, EMAIL_PROJECTS } from "../site-data";

export default function ContactEmails() {
  return (
    <div className="contact-emails">
      <div className="contact-email-row">
        <span className="contact-email-label">Proyectos</span>
        <a href={`mailto:${EMAIL_PROJECTS}`}>{EMAIL_PROJECTS}</a>
      </div>
      <div className="contact-email-row">
        <span className="contact-email-label">Administración</span>
        <a href={`mailto:${EMAIL_ADMIN}`}>{EMAIL_ADMIN}</a>
      </div>
    </div>
  );
}
