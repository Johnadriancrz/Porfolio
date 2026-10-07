export type Certification = {
  title: string
  issuer: string
  issuedAt: string
  credentialUrl?: string
}

// TODO: placeholders, replace with the real certifications
export const certifications: Certification[] = [
  {
    title: "Placeholder Certification One",
    issuer: "Issuing Organization",
    issuedAt: "2026-01",
    credentialUrl: "#",
  },
  {
    title: "Placeholder Certification Two",
    issuer: "Issuing Organization",
    issuedAt: "2025-09",
    credentialUrl: "#",
  },
  {
    title: "Placeholder Certification Three",
    issuer: "Issuing Organization",
    issuedAt: "2025-04",
    credentialUrl: "#",
  },
  {
    title: "Placeholder Certification Four",
    issuer: "Issuing Organization",
    issuedAt: "2024-11",
  },
]
