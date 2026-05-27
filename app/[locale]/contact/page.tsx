import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { firm } from "@/content/firm";
import { ContactForm } from "@/components/sections/ContactForm";
import { Location } from "@/components/sections/Location";

export const metadata: Metadata = {
  title: `Contact · ${firm.name}`,
  description: "Three ways to reach us. Phone, email, or in person — Sri Ramnagar Block C, Kondapur.",
};

/** Stub — full "three ways" grid + extras lands in M5. */
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="main">
      <section className="page-hero">
        <span className="eyebrow">Contact · {firm.name}</span>
        <h1>Three ways to reach us.</h1>
        <p className="lede">We answer the phone between 10 and 18 IST, Monday through Saturday. Outside those hours, the form and WhatsApp are read first thing the next working day.</p>
      </section>
      <ContactForm />
      <Location />
    </main>
  );
}
