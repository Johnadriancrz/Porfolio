import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"
import "../styles/globals.css"
import PageLoader from "@/components/PageLoader"
import { SITE, SITE_URL } from "@/data/site"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: `${SITE.name} Portfolio`,
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "/",
    title: SITE.title,
    description: SITE.description,
    siteName: `${SITE.name} Portfolio`,
    images: [{ url: "/images/og.png", width: 1200, height: 630, alt: `${SITE.name}, ${SITE.jobTitle}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/images/og.png"],
  },
  icons: {
    icon: [
      { url: "/images/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/images/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/images/icon-48.png",
    apple: [{ url: "/images/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "ZbLhiilDbtLDyIx5eH6Jeoe1jPkXNKId-LhXG1HhLWA",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef2ff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: SITE.name,
      alternateName: [SITE.fullName, "Adrian Cruz"],
      jobTitle: SITE.jobTitle,
      url: SITE_URL,
      image: `${SITE_URL}/images/og.png`,
      sameAs: SITE.social,
      knowsAbout: SITE.skills,
      alumniOf: { "@type": "CollegeOrUniversity", name: SITE.school },
      address: { "@type": "PostalAddress", addressLocality: SITE.location.locality, addressRegion: SITE.location.region, addressCountry: SITE.location.country },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: `${SITE.name} Portfolio`,
      description: SITE.description,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\u003c") }} />
        <PageLoader />
        {children}
      </body>
    </html>
  )
}
