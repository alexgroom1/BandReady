"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MODULE_DEFINITIONS } from "@/lib/data";

/**
 * Prefetches all app routes on mount so that navigation is instant.
 * Aligns with the design principle: responsiveness — all pages are ready when needed.
 */
export function RoutePrefetcher() {
  const router = useRouter();

  useEffect(() => {
    const staticRoutes = ["/", "/home", "/profiles"];

    const allRoutes: string[] = [...staticRoutes];

    for (const module of MODULE_DEFINITIONS) {
      const id = module.id;
      allRoutes.push(
        `/module/${id}`,
        `/module/${id}/challenge`,
        `/module/${id}/practice`,
        `/module/${id}/results`
      );
    }

    for (const href of allRoutes) {
      router.prefetch(href);
    }
  }, [router]);

  return null;
}
