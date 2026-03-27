import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import ThemeProvider from "./components/ThemeProvider";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Mashroom",
  description: "Mashroom - AI powered MCP server manager",
  icons: {
    icon: "/icons/mushroom-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col"><ThemeProvider><Providers>{children}</Providers></ThemeProvider></body>
    </html>
  );
}
