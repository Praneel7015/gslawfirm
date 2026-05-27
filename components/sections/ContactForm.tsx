"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { leadSchema, type LeadInput } from "@/lib/lead-schema";

/**
 * Contact form (M3 — UI + validation only). Backend wiring to
 * /api/lead → Supabase + Resend lands in M6; for now we surface a
 * UX-correct success state.
 */
export function ContactForm() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState<LeadInput | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", phone: "", email: "", message: "", website: "" },
    mode: "onTouched",
  });

  const onSubmit = async (data: LeadInput) => {
    setSubmitError(null);
    // M6 will replace this with: await fetch("/api/lead", { ... })
    try {
      await new Promise((r) => setTimeout(r, 400));
      setSubmitted(data);
    } catch {
      setSubmitError(t("errors.generic"));
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-intro">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h2>{t("heading")}</h2>
        <p>{t("lede")}</p>
      </div>
      <div>
        {submitted ? (
          <div className="form-success" role="status">
            <span className="ok" aria-hidden="true">
              ✓
            </span>
            <div>
              <h4>{t("success.title")}</h4>
              <p>{t("success.body")}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Honeypot — invisible to humans, dropped by the API. */}
            <div className="honeypot" aria-hidden="true">
              <label>
                Website
                <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
              </label>
            </div>

            <div className="field-row">
              <div className={"field" + (errors.name ? " has-error" : "")}>
                <label htmlFor="f-name">{t("fields.name")}</label>
                <input
                  id="f-name"
                  type="text"
                  placeholder={t("fields.namePh")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "f-name-err" : undefined}
                  {...register("name")}
                />
                {errors.name && (
                  <p id="f-name-err" className="field-err">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className={"field" + (errors.phone ? " has-error" : "")}>
                <label htmlFor="f-phone">{t("fields.phone")}</label>
                <input
                  id="f-phone"
                  type="tel"
                  placeholder={t("fields.phonePh")}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "f-phone-err" : undefined}
                  {...register("phone")}
                />
                {errors.phone && (
                  <p id="f-phone-err" className="field-err">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className={"field" + (errors.email ? " has-error" : "")}>
              <label htmlFor="f-email">{t("fields.email")}</label>
              <input
                id="f-email"
                type="email"
                placeholder={t("fields.emailPh")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "f-email-err" : undefined}
                {...register("email")}
              />
              {errors.email && (
                <p id="f-email-err" className="field-err">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className={"field" + (errors.message ? " has-error" : "")}>
              <label htmlFor="f-message">{t("fields.message")}</label>
              <textarea
                id="f-message"
                rows={3}
                placeholder={t("fields.messagePh")}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "f-message-err" : undefined}
                {...register("message")}
              />
              {errors.message && (
                <p id="f-message-err" className="field-err">
                  {errors.message.message}
                </p>
              )}
            </div>

            <div className="form-foot">
              <button className="btn-submit" type="submit" disabled={isSubmitting}>
                {t("submit")} <span aria-hidden="true">→</span>
              </button>
              <div className="form-disclaim">{t("disclaim")}</div>
            </div>

            {submitError && (
              <p className="field-err" role="alert" style={{ marginTop: 16 }}>
                {submitError}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
