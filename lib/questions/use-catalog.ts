"use client";

import { useEffect, useState } from "react";
import { fetchCatalog } from "@/lib/questions/client";
import type { QuestionCatalogItem } from "@/lib/questions/session-types";
import type { Track } from "@/lib/types";

export function useQuestionCatalog(track: Track) {
  const [catalog, setCatalog] = useState<QuestionCatalogItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    void fetchCatalog(track).then((items) => {
      if (!cancelled) setCatalog(items);
    });
    return () => {
      cancelled = true;
    };
  }, [track]);

  return { catalog };
}
