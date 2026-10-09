// Single source of truth for site-wide identity and SEO values (layout, sitemap, robots, manifest, JSON-LD).
// Set NEXT_PUBLIC_BASE_URL to the production domain (e.g. https://yourdomain.com) so canonical URLs, the sitemap
// and social previews point to the real site.

export const SITE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "")

export const SITE = {
  name: "John Adrian Cruz",
  fullName: "John Adrian B. Cruz",
  jobTitle: "Full Stack Web Developer",
  title: "John Adrian Cruz | Full Stack Web Developer",
  description:
    "Portfolio of John Adrian Cruz, a Full Stack Web Developer from Quezon City, Philippines. I build web apps, REST APIs and WordPress sites with Laravel, React, Next.js, Spring Boot, Node.js and MySQL.",
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
