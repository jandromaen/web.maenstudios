import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { verificar, darDeAlta } from "../../lib/newsletter";

export const metadata: Metadata = {
  title: "Suscripción confirmada",
  robots: { index: false, follow: false },
};

/**
 * Segundo paso del alta. El enlace del correo trae dentro la dirección y una
 * firma; si cuadra, se apunta a la lista. No hay nada guardado antes de esto,
 * así que un enlace que no verifica simplemente no hace nada.
 */
export default async function Confirmar({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const email = verificar(t ?? "", "alta");

  let estado: "ok" | "invalido" | "error" = "invalido";
  if (email) {
    try {
      await darDeAlta(email);
      estado = "ok";
    } catch (err) {
      console.error("[newsletter] No se pudo dar de alta:", err);
      estado = "error";
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="page-section">
        <div className="container container-narrow">
          <div className="section-head">
            {estado === "ok" ? (
              <>
                <span className="eyebrow">Newsletter</span>
                <h2>Ya estás dentro</h2>
                <p>
                  Te escribiremos con lo que vamos aprendiendo sobre contenido
                  para redes. Puedes darte de baja desde cualquier correo, con un
                  clic y sin explicaciones.
                </p>
              </>
            ) : estado === "error" ? (
              <>
                <span className="eyebrow">Newsletter</span>
                <h2>Algo ha fallado por nuestra parte</h2>
                <p>
                  El enlace era correcto pero no hemos podido apuntarte.
                  Inténtalo otra vez en un rato.
                </p>
              </>
            ) : (
              <>
                <span className="eyebrow">Newsletter</span>
                <h2>Este enlace ya no vale</h2>
                <p>
                  Puede que haya caducado —duran una semana— o que esté
                  incompleto al copiarlo. Vuelve a suscribirte desde el blog y te
                  mandamos uno nuevo.
                </p>
              </>
            )}
          </div>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/blog">
              Ir al blog
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
