"use client";
import { useEffect } from "react";

/** Reserve the measured bar height, including translated text and device safe area. */
export function StickyBarSizing() {
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".mbar");
    if (!bar) return;
    const measure = () => document.documentElement.style.setProperty("--contact-bar-height", `${bar.getBoundingClientRect().height}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    measure();
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--contact-bar-height");
    };
  }, []);
  return null;
}
