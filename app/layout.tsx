import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowState",
  description: "Stop thinking. Start doing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        <meta
          name="google-site-verification"
          content="a9mcHzp3WMoyiHEXm7ZT1ab-Vkj_XDrEQuEFMZ-7-oY"
        />
      </head>
      <body className="bg-zinc-950 text-zinc-300 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
