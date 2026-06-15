"use client";

import { useEffect } from "react";
import { useAppSelector } from "../../lib/hooks";

export const VIASOCKET_PARENT_ID = "viasocketParentId";
export default function EmbedLoader() {
  const tokens = useAppSelector((s) => s.clusters.embedTokenByClusterId);

  // Ensure the persistent parent div exists exactly once.
  useEffect(() => {
    let parent = document.getElementById(VIASOCKET_PARENT_ID);
    if (!parent) {
      parent = document.createElement("div");
      parent.id = VIASOCKET_PARENT_ID;
      parent.style.cssText =
        "position:fixed;width:0;height:0;overflow:hidden;opacity:0;pointer-events:none;z-index:-9999;top:0;left:0;";
      document.body.appendChild(parent);
    }
  }, []);

  // Load the embed script exactly once when we have at least one embedToken.
  useEffect(() => {
    const anyToken = Object.values(tokens)[0];
    if (!anyToken) return;

    const scriptId = process.env.NEXT_PUBLIC_EMBED_SCRIPT_ID!;
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = process.env.NEXT_PUBLIC_EMBED_SCRIPT_SRC!;
    script.setAttribute("embedToken", anyToken);
    script.setAttribute("parentId", VIASOCKET_PARENT_ID);
    document.body.appendChild(script);
  }, [tokens]);

  return null;
}
