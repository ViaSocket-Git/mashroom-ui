"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { fetchClusters } from "@/lib/features/clustersSlice";
import { fetchAiClients } from "@/lib/features/aiClientsSlice";

const EMBED_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiI1NTkzIiwicHJvamVjdF9pZCI6InByb2o5TGZRdjRUNyIsInVzZXJfaWQiOiI2MTg5MCIsImlhdCI6MTc3NDAxMDI3M30.rhl0-Hfq5k9SAH3Zali9qdNl7s-EWKvxkVsL3Xaq5Qs";
const EMBED_PARENT_ID = "viasocketParentId";

export default function ClusterLayout({ children }) {
  const dispatch = useAppDispatch();
  const scriptLoaded = useRef(false);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchClusters());
    dispatch(fetchAiClients());
  }, [dispatch]);

  // Load viasocket embed script
  useEffect(() => {
    if (scriptLoaded.current) return;
    const existing = document.getElementById(process.env.NEXT_PUBLIC_EMBED_SCRIPT_ID);
    if (existing) existing.parentNode?.removeChild(existing);
    const existingContainer = document.getElementById("iframe-viasocket-embed-parent-container");
    if (existingContainer) existingContainer.parentNode?.removeChild(existingContainer);
    const script = document.createElement("script");
    script.id = process.env.NEXT_PUBLIC_EMBED_SCRIPT_ID;
    script.src = process.env.NEXT_PUBLIC_EMBED_SCRIPT_SRC;
    script.setAttribute("embedToken", EMBED_TOKEN);
    script.setAttribute("parentId", EMBED_PARENT_ID);
    document.body.appendChild(script);
    scriptLoaded.current = true;
    return () => {
      try {
        const s = document.getElementById(process.env.NEXT_PUBLIC_EMBED_SCRIPT_ID);
        if (s?.parentNode === document.body) document.body.removeChild(s);
        const container = document.getElementById("iframe-viasocket-embed-parent-container");
        if (container) container.parentNode?.removeChild(container);
      } catch (e) {
        console.warn("Error removing embed script:", e);
      }
      scriptLoaded.current = false;
    };
  }, []);

  return <>{children}</>;
}
