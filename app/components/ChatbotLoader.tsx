"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "../../lib/hooks";

const CHATBOT_SCRIPT_SRC = process.env.NEXT_PUBLIC_CHATBOT_URL || "https://chatbot.gtwy.ai/chatbot.js";
const CHATBOT_SCRIPT_ID = "chatbot-main-script";
export const CHATBOT_PARENT_ID = "mushroom-test-chatbot-parent";

export default function ChatbotLoader() {
  const chatbotEmbedToken = useAppSelector((s) => s.clusters.chatbotEmbedToken);
  const pathname = usePathname();
  const activeClusterId = pathname?.startsWith("/cluster/") ? pathname.split("/")[2] ?? null : null;
  const activeCluster = useAppSelector((s) =>
    activeClusterId ? s.clusters.clusters.find((c) => c.id === activeClusterId) ?? null : null,
  );
  // Ensure the persistent parent div exists exactly once.
  useEffect(() => {
    let parent = document.getElementById(CHATBOT_PARENT_ID);
    if (!parent) {
      parent = document.createElement("div");
      parent.id = CHATBOT_PARENT_ID;
      // Park it hidden in body until a cluster view relocates it.
      parent.style.cssText =
        "position:fixed;width:0;height:0;overflow:hidden;opacity:0;pointer-events:none;z-index:-9999;top:0;left:0;";
      document.body.appendChild(parent);
    }
  }, []);

  // Load the chatbot script exactly once when we have an embed token AND
  // (if we are on a cluster page) the active cluster's url is known, so we can
  // pass the initial threadId + mcpConfig as script attributes. This avoids a
  // race where SendDataToChatbot is called before the chatbot's RTLayer
  // connection is open (which silently drops the payload on first page load).
  useEffect(() => {
    if (!chatbotEmbedToken) return;
    if (activeClusterId && !activeCluster?.url) return;
    if (document.getElementById(CHATBOT_SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = CHATBOT_SCRIPT_ID;
    script.src = CHATBOT_SCRIPT_SRC;
    script.setAttribute("embedToken", chatbotEmbedToken);
    script.setAttribute("bridgeName", "Mushrooms chatbot");
    script.setAttribute("theme", "light");
    script.setAttribute("parentId", CHATBOT_PARENT_ID);
    script.setAttribute("defaultOpen", "true");
    script.setAttribute("hideIcon", "true");
    script.setAttribute("hideCloseButton", "true");
    script.setAttribute("hideFullScreenButton", "true");
    if (activeCluster?.url) {
      const mcpConfig = [
        { name: (activeCluster.name || "mushrooms").replace(/\s+/g, "_"), url: activeCluster.url },
      ];
      script.setAttribute("threadId", activeCluster.id);
      script.setAttribute("mcpConfig", JSON.stringify(mcpConfig));
    }

    script.onload = () => {
      const tryOpen = (attempts = 0) => {
        const fn = (window as any).openChatbot;
        if (typeof fn === "function") {
          fn();
        } else if (attempts < 40) {
          setTimeout(() => tryOpen(attempts + 1), 100);
        }
      };
      tryOpen();
    };
    document.body.appendChild(script);
  }, [chatbotEmbedToken, activeClusterId, activeCluster?.id, activeCluster?.url, activeCluster?.name]);

  return null;
}
