import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { verificar, darDeBaja } from "../../lib/newsletter";

export const metadata: Metadata = {
  title: "Baja de la newsletter",
  robots: { index: false, follow: false },
};

/**
 * Baja con un solo clic desde el enlace del pie de cualquier correo.
 *
 * No pide confirmar ni preguntar por qué te vas: la ley exige que darse de baja
 * sea al menos tan fácil como darse de alta, y poner un formulario por delante
 * para retener a alguien es justo lo que la gente marca como spam.
 *
 * El enlace de baja no caduca, al contrario que el de alta: estará al pie de
 * correos que se seguirán leyendo dentro de un año.
 */
export default async function Baja({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const email = verificar(t ?? "", "baja");

  let estado: "ok" | "invalido" | "error" = "invalido";
  if (email) {
    try {
      await darDeBaja(email);
      estado = "ok";
    } catch (err) {
      console.error("[newsletter] No se pudo dar de baja:", err);
      estado = "error";
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="page-section">
        <div className="container container-narrow">
          <div className="section-head">
            <span className="eyebrow">Newsletter</span>
            {estado === "ok" ? (
              <>
                <h2>Listo, no te escribimos más</h2>
                <p>
                  Te hemos dado de baja. Si algún día te apetece volver, el
                  formulario sigue en el blog.
                </p>
              </>
            ) : estado === "error" ? (
              <>
                <h2>No hemos podido darte de baja</h2>
                <p>
                  Ha fallado algo por nuestra parte. Escríbenos y lo hacemos a
                  mano en cuanto lo leamos.
                </p>
              </>
            ) : (
              <>
                <h2>Este enlace no es válido</h2>
                <p>
                  Puede que esté incompleto al copiarlo. Escríbenos y te damos de
                  baja a mano, sin más trámite.
                </p>
              </>
            )}
          </div>
          <div className="hero-actions">
            <Link className="btn btn-ghost" href="/contacto">
              Escríbenos
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
