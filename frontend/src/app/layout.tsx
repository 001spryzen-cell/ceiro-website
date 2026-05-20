import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ceiro | Modern Websites Built to Convert",
  description:
    "Premium websites with AI-powered lead systems, automation, and conversion-focused experiences for growing businesses.",
  icons: {
    icon: "/ceiro-logo.png",
    apple: "/ceiro-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
