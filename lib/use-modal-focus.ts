"use client";

import { useEffect, type RefObject } from "react";

let locks = 0;
let previousOverflow = "";

/** Native dialog provides background inertness, focus containment and restoration. */
export function useModalFocus(
  ref: RefObject<HTMLDialogElement | null>,
  open: boolean,
) {
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const trigger = document.activeElement;
    if (locks++ === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    dialog.showModal();
    const initial = dialog.querySelector<HTMLElement>('[data-initial-focus]');
    initial?.focus();
    return () => {
      dialog.close();
      if (--locks === 0) document.body.style.overflow = previousOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    };
  }, [open, ref]);
}
