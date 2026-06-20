import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/sections/Hero";
import { IntroStrip } from "@/components/sections/IntroStrip";
import { Practice } from "@/components/sections/Practice";
import { Approach } from "@/components/sections/Approach";
import { Founder } from "@/components/sections/Founder";
import { Location } from "@/components/sections/Location";
import { ContactForm } from "@/components/sections/ContactForm";

import { JsonLd } from "@/components/seo/JsonLd";
import {
  graphSchema,
  legalServiceSchema,
  personSchema,
  websiteSchema,
} from "@/lib/jsonld";
import { localizedPageMetadata } from "@/lib/localized-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata("home", locale);
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const ld = graphSchema([
    legalServiceSchema(),
    personSchema(),
    websiteSchema(),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <Hero />
      <IntroStrip />
      <Practice />
      <Approach />
      <Founder />
      <Location />
      <ContactForm />
    </main>
  );
}
