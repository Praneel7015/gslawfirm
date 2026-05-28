"use client";

import { DisclaimerModal } from "@/components/legal/DisclaimerModal";
import { WhatsAppFab } from "@/components/legal/WhatsAppFab";
import { MobileStickyBar } from "@/components/legal/MobileStickyBar";

/** Client-only chrome (modal, FAB, mobile bar) — lazy-loaded from layout. */
export function ClientChrome() {
  return (
    <>
      <WhatsAppFab />
      <MobileStickyBar />
      <DisclaimerModal />
    </>
  );
}
