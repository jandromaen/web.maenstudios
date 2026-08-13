import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityLanding from "../components/CityLanding";
import { getLocalLanding } from "../local-data";
import { createPageMetadata } from "../seo-config";

const landing = getLocalLanding("Madrid");

export const metadata: Metadata = landing
  ? createPageMetadata({
      title: landing.metaTitle,
      description: landing.metaDescription,
      path: landing.path,
      keywords: landing.keywords,
    })
  : {};

export default function MadridPage() {
  if (!landing) notFound();
  return <CityLanding landing={landing} />;
}
