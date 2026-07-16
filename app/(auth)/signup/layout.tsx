import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

const TITLE = "Sign up";
const DESCRIPTION = "Create a free FlowState account — just a username and password, no email required.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/signup`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/signup`,
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
