import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceLanding from "../components/ServiceLanding";
import { getServiceLanding } from "../service-landings";
import { createPageMetadata } from "../seo-config";

const landing = getServiceLanding("community-manager-madrid");

export const metadata: Metadata = landing
  ? createPageMetadata({
      title: landing.metaTitle,
      description: landing.metaDescription,
      path: `/${landing.slug}`,
      keywords: landing.keywords,
    })
  : {};

export default function CommunityManagerMadridPage() {
  if (!landing) notFound();
  return <ServiceLanding landing={landing} />;
}
