"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Mark } from "@/components/brand/Mark";

const STORAGE_KEY = "gs-bci-ack-v1";

/**
 * BCI compliance: first-visit overlay that blocks the site until the user
 * clicks "I Agree". Choice is persisted in localStorage under
 * `gs-bci-ack-v1` (build-prompt §7).
 *
 * Click-outside and Escape do NOT dismiss the modal — the user must choose.
 */
export function DisclaimerModal() {
  const t = useTranslations("disclaimer");
  const [open, setOpen] = useState(false);
  const lastFocus = useRef<Element | null>(null);
  const agreeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let acked = false;
    try {
      acked = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // localStorage unavailable — show the modal (fail closed).
      acked = false;
    }
    if (!acked) {
      lastFocus.current = document.activeElement;
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    agreeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onAgree = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Persistence failed; still close the modal for this session.
    }
    setOpen(false);
    if (lastFocus.current instanceof HTMLElement) lastFocus.current.focus();
  };

  const onExit = () => {
    window.location.href = "https://www.google.com";
  };

  if (!open) return null;

  return (
    <div
      className="modal-scrim open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disc-title"
      aria-describedby="disc-body"
    >
      <div className="modal">
        <Mark className="modal-mark" />
        <span className="eyebrow">{t("noticeEyebrow")}</span>
        <h2 id="disc-title">{t("heading")}</h2>
        <div id="disc-body">
          <p>{t("body1")}</p>
          <p>{t("body2")}</p>
        </div>
        <div className="modal-foot">
          <button type="button" className="modal-btn secondary" onClick={onExit}>
            {t("exit")}
          </button>
          <button
            type="button"
            ref={agreeRef}
            className="modal-btn primary"
            onClick={onAgree}
          >
            {t("agree")}
          </button>
        </div>
      </div>
    </div>
  );
}
