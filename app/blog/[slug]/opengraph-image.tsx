import { ImageResponse } from "next/og";
import { getPost, posts } from "../../blog-data";

export const alt = "Artículo de Maen Studios";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

/** Imagen social propia por artículo: sube el CTR al compartir en redes. */
export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? "Maen Studios";
  const category = post?.category ?? "Blog";

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
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#f9cdcd",
          }}
        >
          {category}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 70 ? 58 : 70,
            lineHeight: 1.1,
            fontWeight: 700,
            maxWidth: 1000,
          }}
        >
          {title}
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
