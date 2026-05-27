import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/sections/Hero";
import { IntroStrip } from "@/components/sections/IntroStrip";
import { Practice } from "@/components/sections/Practice";
import { Approach } from "@/components/sections/Approach";
import { Founder } from "@/components/sections/Founder";
import { Location } from "@/components/sections/Location";
import { ContactForm } from "@/components/sections/ContactForm";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main">
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
