import { ImageResponse } from "next/og";
import { clients, getClient } from "../../clients";

export const alt = "Caso de cliente de Maen Studios";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return clients.map((c) => ({ slug: c.slug }));
}

/** Imagen social propia por cliente. */
export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = getClient(slug);
  const name = client?.name ?? "Maen Studios";
  const tagline = client?.tagline ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#151515",
          color: "#f4f4f4",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#f9cdcd",
          }}
        >
          Caso de cliente
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 700 }}>
            {name}
          </div>
          {tagline ? (
            <div style={{ display: "flex", fontSize: 36, color: "#9a9894" }}>
              {tagline}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 28,
            color: "#9a9894",
          }}
        >
          <span style={{ color: "#f4f4f4", fontWeight: 700 }}>
            MAEN STUDIOS®
          </span>
          <span>Barcelona · Madrid</span>
        </div>
      </div>
    ),
    size,
  );
}
