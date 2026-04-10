"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { getFromCookies, setInCookies } from "@/lib/utils/cookies";

const REFERENCE_ID = process.env.NEXT_PUBLIC_REFERENCE_ID!;

declare function initVerification(config: object): void;

const WithAuth = <P extends object>(Children: React.ComponentType<P & { loading: boolean }>) => {
  return function AuthWrapper(props: P) {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const initCalledRef = useRef(false);

    const proxy_auth_token = searchParams.get("proxy_auth_token");

    useEffect(() => {
      initCalledRef.current = false;
      const runEffect = async () => {
        const proxyToken = getFromCookies("proxy_token");
        const proxyAuthToken = proxy_auth_token;

        if (proxyToken && pathName === "/login") {
          router.replace("/dashboard");
          return;
        }
        if (proxyToken) {
          setLoading(false);
          return;
        }

        if (proxyAuthToken) {
          setLoading(true);
          setInCookies("proxy_token", proxyAuthToken);
          await fetch("/api/set-token", {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: proxyAuthToken }),
          });
          router.replace("/dashboard");
          return;
        }

        setLoading(false);

        const configuration = {
          referenceId: REFERENCE_ID,
          type: "authorization",
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

        const SCRIPT_SRC = "https://proxy.msg91.com/assets/proxy-auth/proxy-auth.js";

        const runInit = () => {
          if (initCalledRef.current) return;
          initCalledRef.current = true;
          const widgetContainer = document.getElementById(REFERENCE_ID);
          if (widgetContainer) widgetContainer.innerHTML = "";
          const checkInitVerification = setInterval(() => {
            if (typeof initVerification === "function") {
              clearInterval(checkInitVerification);
              initVerification(configuration);
            }
          }, 100);
        };

        if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
          runInit();
        } else {
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.src = SCRIPT_SRC;
          script.onload = runInit;
          document.body.appendChild(script);
        }
      };

      runEffect();
    }, [pathName, proxy_auth_token, router]);  

    return <Children {...props} loading={loading} />;
  };
};

export default WithAuth;
