export type Certification = {
  title: string
  issuer: string
  via?: string
  issuedAt: string
  credentialUrl?: string
  logo?: string
  logoFullBleed?: boolean
}

// TODO: placeholders below the first entry, replace with the real certifications
export const certifications: Certification[] = [
  {
    title: "Network Support and Security",
    issuer: "Cisco",
    via: "Cisco Networking Academy",
    issuedAt: "2025-12",
    credentialUrl: "https://www.credly.com/earner/earned/badge/f0a4e46f-95a4-4cf1-9454-c68895d40af3",
    logo: "/images/cisco.png",
  },
  {
    title: "Introduction to Software Engineering",
    issuer: "IBM",
    via: "Coursera",
    issuedAt: "2022-12",
    credentialUrl: "https://www.coursera.org/account/accomplishments/verify/FUKERWEWJNQG",
    logo: "/images/ibm.svg",
  },
  {
    title: "Technical Support Fundamentals",
    issuer: "Google",
    via: "Coursera",
    issuedAt: "2025-09",
    credentialUrl: "https://www.coursera.org/account/accomplishments/verify/LBH9QI2EELTC",
    logo: "/images/google.svg",
  },
  {
    title: "Networking Basics",
    issuer: "Cisco",
    via: "Cisco Networking Academy",
    issuedAt: "2025-11",
    credentialUrl: "https://www.credly.com/badges/7391bd39-56cc-4f86-871f-39cff86df4c6/linked_in_profile",
    logo: "/images/cisco.png",
  },
  {
    title: "Programming Fundamentals",
    issuer: "Duke University",
    via: "Coursera",
    issuedAt: "2022-10",
    credentialUrl: "https://www.coursera.org/account/accomplishments/verify/JSF3QLM8VKCL",
    logo: "/images/duke.svg",
    logoFullBleed: true,
  },
]
