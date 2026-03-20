import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniLog — Capture at the speed of thought",
  description: "The frictionless inbox for your mind. Stop organizing, start capturing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
