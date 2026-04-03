"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";

export default function ClarityIdentify() {
  const userEmail = useAppSelector((s) => s.clusters.userEmail);

  useEffect(() => {
    if (!userEmail) return;
    if (typeof window !== "undefined" && typeof (window as any).clarity === "function") {
      (window as any).clarity("identify", userEmail);
    }
  }, [userEmail]);

  return null;
}
