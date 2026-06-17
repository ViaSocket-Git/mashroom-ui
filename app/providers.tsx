"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import ClarityIdentify from "./components/ClarityIdentify";
import ChatbotLoader from "./components/ChatbotLoader";
import EmbedLoader from "./components/EmbedLoader";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ClarityIdentify />
      <ChatbotLoader />
      <EmbedLoader />
      {children}
    </Provider>
  );
}
