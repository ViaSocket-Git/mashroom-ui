"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import ClarityIdentify from "./components/ClarityIdentify";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ClarityIdentify />
      {children}
    </Provider>
  );
}
