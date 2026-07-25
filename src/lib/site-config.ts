const FALLBACK_SITE_URL = "https://beacon-frontend-mu.vercel.app";

export const siteConfig = {
  name: "Beacon",
  title: "Beacon — Civic Infrastructure Intelligence",
  description:
    "Report public infrastructure problems in Bangladesh, receive a public tracking code, and follow each civic issue from submission to resolution.",
  socialDescription:
    "Your street sends a signal. Beacon helps route it to the right team and keeps public progress visible.",
  language: "en-BD",
  locale: "en_BD",
  themeColor: "#0b2928",
  backgroundColor: "#f5f1e8",
  keywords: [
    "civic infrastructure Bangladesh",
    "report public infrastructure issue",
    "civic issue tracking",
    "pothole reporting Bangladesh",
    "public service reporting",
    "Bangladesh civic technology",
    "infrastructure monitoring",
  ],
  ogImage: {
    url: "/og.png",
    width: 1730,
    height: 909,
    alt: "Beacon civic infrastructure reporting platform and Bangladesh signal map",
  },
} as const;

function withProtocol(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function getSiteUrl() {
  const configuredUrl = process.env.APP_URL?.trim();
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const candidate =
    configuredUrl ||
    (vercelUrl ? withProtocol(vercelUrl) : FALLBACK_SITE_URL);

  try {
    return new URL(withProtocol(candidate)).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}
