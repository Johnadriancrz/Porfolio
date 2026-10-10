import { MetadataRoute } from "next"
import { SITE_URL } from "@/data/site"

// Only list public, indexable pages. /api/* routes are intentionally excluded.
// lastModified is omitted on purpose: a build-time `new Date()` would claim every page changed on every deploy.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL

  return [
    {
      url: `${baseUrl}/`,
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${baseUrl}/certifications`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    // Add additional routes here if you add more pages in the future
  ]
}
