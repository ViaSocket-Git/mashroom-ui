"use client";

import { LifeBuoy, LogOut } from "lucide-react";
import { removeCookie } from "@/lib/utils/cookies";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

export default function AccountPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const name = useAppSelector((s) => s.clusters.userName);
  const email = useAppSelector((s) => s.clusters.userEmail);
  const userIdLoaded = useAppSelector((s) => s.clusters.userId !== null);

  function handleLogout() {
    removeCookie("proxy_token");
    removeCookie("local_token");
    router.replace("/login");
  }

  return (
    <div
      className="absolute z-50 flex flex-col"
      style={{
        top: "calc(100% + 10px)",
        right: 0,
        width: 260,
        background: "#fff",
        border: "1px solid rgb(226,232,240)",
        borderRadius: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "rgb(226,232,240)" }}>
        {!userIdLoaded ? (
          <div style={{ height: 12, borderRadius: 4, background: "rgb(226,232,240)", width: "60%", animation: "pulse 1.4s ease-in-out infinite" }} />
        ) : (
          <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: 14, color: "rgb(10,10,10)", margin: 0 }}>
            {name || "Your Account"}
          </p>
        )}
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "rgb(100,116,139)", margin: "2px 0 0" }}>
          {email || "Manage your profile & settings"}
        </p>
      </div>

      {/* Menu items */}
      <div className="px-2 pb-2 border-t" style={{ borderColor: "rgb(243,244,246)", paddingTop: 6 }}>
        <button
          data-testid="account-sign-out"
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 w-full cursor-pointer text-left rounded"
          style={{ background: "transparent", border: "none", color: "rgb(220,38,38)", fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 500 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgb(254,242,242)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          <LogOut width={13} height={13} strokeWidth={2} />
          Sign out
        </button>
      </div>
    </div>
  );
}
