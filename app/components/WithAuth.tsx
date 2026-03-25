"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getFromCookies } from "@/lib/utils/cookies";

const REFERENCE_ID = process.env.NEXT_PUBLIC_REFERENCE_ID!;

declare function initVerification(config: object): void;

const WithAuth = <P extends object>(Children: React.ComponentType<P & { loading: boolean }>) => {
  return function AuthWrapper(props: P) {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    const proxy_auth_token = searchParams.get("proxy_auth_token");

    useEffect(() => {
      const runEffect = async () => {
        const proxyToken = getFromCookies("proxy_token");
        const proxyAuthToken = proxy_auth_token;

        if (proxyToken && pathName === "/login") {
          router.replace("/");
          return;
        }
        if (proxyToken) {
          setLoading(false);
          return;
        }

        if (proxyAuthToken) {
          setLoading(true);
          await fetch("/api/set-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: proxyAuthToken }),
          });
          router.replace("/");
          return;
        }

        setLoading(false);

        const configuration = {
          referenceId: REFERENCE_ID,
          addInfo: {
            redirect_path: "/",
          },
          success: (data: unknown) => {
            console.log("Login success", data);
          },
          failure: (error: unknown) => {
            console.error("Login failure", error);
          },
        };

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = () => {
          const checkInitVerification = setInterval(() => {
            if (typeof initVerification === "function") {
              clearInterval(checkInitVerification);
              initVerification(configuration);
            }
          }, 100);
        };
        script.src = "https://proxy.msg91.com/assets/proxy-auth/proxy-auth.js";
        document.body.appendChild(script);
      };

      runEffect();
    }, [pathName, proxy_auth_token]);

    return <Children {...props} loading={loading} />;
  };
};

export default WithAuth;
