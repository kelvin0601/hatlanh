"use client";

import { ViewTransition, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <ViewTransition
      key={pathname}
      name="page-content"
      share="page-crossfade"
      enter="page-crossfade"
      default="none"
    >
      <div className="page-transition-content">{children}</div>
    </ViewTransition>
  );
}
