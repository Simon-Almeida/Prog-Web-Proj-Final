import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { BackendStatus } from "@/components/BackendStatus";

export const metadata: Metadata = {
  title: "Local-AI Chat",
  description: "Local-AI Chat frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <BackendStatus />
        {children}
      </body>
    </html>
  );
}
