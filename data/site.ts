// Single source of truth for site-wide identity and SEO values (layout, sitemap, robots, manifest, JSON-LD).

// Canonical production origin. Used whenever NEXT_PUBLIC_BASE_URL is unset (e.g. on Vercel without the env var).
const PRODUCTION_URL = "https://www.johnadriancruz.xyz"

// NEXT_PUBLIC_BASE_URL may override the origin (e.g. a staging domain), but a local/non-HTTPS value is ignored so
// canonical URLs, the sitemap and robots.txt can never point at localhost.
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim()
  if (!raw) return PRODUCTION_URL

  try {
    const url = new URL(raw)
    const isLocal = ["localhost", "127.0.0.1", "0.0.0.0", "[::1]"].includes(url.hostname) || url.hostname.endsWith(".local")
    if (url.protocol !== "https:" || isLocal) return PRODUCTION_URL
    return url.origin
  } catch {
    return PRODUCTION_URL
  }
}

export const SITE_URL = resolveSiteUrl()

export const SITE = {
  name: "John Adrian Cruz",
  fullName: "John Adrian B. Cruz",
  jobTitle: "Full Stack Web Developer",
  title: "John Adrian Cruz | Full Stack Web Developer Portfolio",
  description:
    "Portfolio of John Adrian Cruz, a Full Stack Web Developer in the Philippines. Web apps, REST APIs and WordPress sites built with Laravel, React and Next.js.",
  keywords: [
    "John Adrian Cruz",
    "Adrian Cruz",
    "Full Stack Web Developer",
    "Web Developer Philippines",
    "Laravel Developer",
    "React Developer",
    "Next.js Developer",
    "Spring Boot",
    "WordPress Developer",
    "REST API",
    "Portfolio",
  ],
  location: { locality: "Quezon City", region: "Metro Manila", country: "PH" },
  school: "Bulacan State University",
  skills: ["Laravel", "React", "Next.js", "TypeScript", "Node.js", "Express.js", "Spring Boot", "Tailwind CSS", "MySQL", "PostgreSQL", "Prisma", "WordPress", "Docker", "CI/CD", "REST APIs"],
  social: [
    "https://github.com/Johnadriancrz",
    "https://www.linkedin.com/in/johnadriancruz",
    "https://instagram.com/ajay.crz",
    "https://www.tiktok.com/@ajay_crz",
  ],
}
