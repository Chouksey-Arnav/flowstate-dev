import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const TITLE = "Flowstate | Open-Source Productivity Tool & Daily Planner";
const DESCRIPTION =
  "FlowState: a dark, minimalist productivity tool with tasks, a drift-free Pomodoro timer, habits & stats. Open-source, no paywalls.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Flowstate",
  },
  description: DESCRIPTION,
  keywords: [
    "productivity",
    "productivity tools",
    "open-source productivity tool",
    "minimalist developer planner",
    "flow state task manager",
    "task manager",
    "focus timer",
    "habit tracker",
  ],
  authors: [{ name: "Flowstate" }],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Flowstate",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Flowstate — open-source productivity tool and flow state task manager dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
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
        <meta name="google-site-verification" content="a9mcHzp3WMoyiHEXm7ZT1ab-Vkj_XDrEQuEFMZ-7-oY" />
      </head>
      <body className="bg-zinc-950 text-zinc-300 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
