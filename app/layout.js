import { Unbounded, Instrument_Serif, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Unbounded({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const title = "Roshika Pradhan · SEO & UI/UX Designer";
const description =
  "Roshika Pradhan is an SEO strategist, UI/UX designer and digital marketer based in Kathmandu, Nepal.";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title,
  description,
  keywords: [
    "Roshika Pradhan",
    "SEO",
    "UI/UX designer",
    "digital marketing",
    "Kathmandu",
    "Nepal",
    "portfolio",
  ],
  authors: [{ name: "Roshika Pradhan" }],
  openGraph: { title, description, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#0c0a10",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Roshika Pradhan",
  email: "mailto:roshikapradhan107@gmail.com",
  jobTitle: "SEO & UI/UX Designer",
  address: { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Thames International College" },
  knowsAbout: ["Search Engine Optimization", "UI/UX Design", "Digital Marketing", "Content Strategy"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${body.variable} ${mono.variable} is-loading`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
