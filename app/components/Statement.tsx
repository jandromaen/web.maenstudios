import type { ReactNode } from "react";

/**
 * Bloque tipográfico grande con el punto de acento, el recurso con el que
 * Basic separa secciones ("We turn cultural value● into company value").
 */
export default function Statement({
  before,
  after,
  sub,
  invert = false,
}: {
  before: string;
  after?: string;
  sub?: ReactNode;
  invert?: boolean;
}) {
  return (
    <section className={`statement${invert ? " statement--invert" : ""}`}>
      <div className="container">
        <p className="statement-text">
          {before}
          <span className="dot" aria-hidden="true">
            ●
          </span>
          {after ? ` ${after}` : null}
        </p>
        {sub ? <div className="statement-sub">{sub}</div> : null}
      </div>
    </section>
  );
}
