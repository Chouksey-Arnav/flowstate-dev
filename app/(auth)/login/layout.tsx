import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

const TITLE = "Log in";
const DESCRIPTION = "Log in to FlowState to sync your tasks, habits, focus sessions, and XP across every device.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/login`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/login`,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
