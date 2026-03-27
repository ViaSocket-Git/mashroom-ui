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
      className="fixed z-50 flex flex-col bg-card border border-border rounded-[10px]"
      style={{
        top: 12,
        right: 12,
        width: 260,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        {!userIdLoaded ? (
          <div className="h-3 rounded bg-muted w-[60%]" style={{ animation: "pulse 1.4s ease-in-out infinite" }} />
        ) : (
          <p className="text-foreground font-bold text-[14px] m-0" style={{ fontFamily: "Geist, sans-serif" }}>
            {name || "Your Account"}
          </p>
        )}
        <p className="text-muted-foreground text-[12px] mt-[2px] m-0" style={{ fontFamily: '"DM Sans", sans-serif' }}>
          {email || "Manage your profile & settings"}
        </p>
      </div>

      {/* Menu items */}
      <div className="px-2 py-2 flex flex-col gap-0.5">
        <button
          className="flex items-center gap-2.5 px-3 py-2 w-full cursor-pointer text-left rounded bg-transparent border-0 text-foreground text-[13px] font-medium hover:bg-muted"
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          <LifeBuoy width={14} height={14} strokeWidth={2} />
          Support
        </button>
      </div>

      <div className="px-2 pb-2 border-t border-border" style={{ paddingTop: 6 }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 w-full cursor-pointer text-left rounded bg-transparent border-0 text-destructive text-[13px] font-medium hover:bg-destructive/10"
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          <LogOut width={13} height={13} strokeWidth={2} />
          Sign out
        </button>
      </div>
    </div>
  );
}
