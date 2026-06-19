"use client";

import type { ReactNode } from "react";

import { Link, usePathname } from "@/i18n/routing";
import { cleanSitePath, isContactPath } from "@/lib/lead-source";

type SourceAwareContactLinkProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export function SourceAwareContactLink({
  children,
  className,
  onClick,
}: SourceAwareContactLinkProps) {
  const pathname = usePathname();
  const sourcePath = cleanSitePath(pathname);
  const href =
    sourcePath && !isContactPath(sourcePath)
      ? `/contact?source=${encodeURIComponent(sourcePath)}`
      : "/contact";

  return (
    <Link href={href as never} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
