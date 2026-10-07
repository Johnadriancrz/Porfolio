import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FadeDown from "@/components/animations/FadeDown"
import { certifications } from "@/data/certifications"

export const metadata: Metadata = {
  title: "Certifications",
  alternates: { canonical: "/certifications" },
}

export default function CertificationsPage() {
  return (
    <>
      <header className="cursor-default sticky top-0 z-50">
        <Header />
      </header>

      <section id="certifications" className="w-full max-w-5xl mx-auto pt-32 pb-24 md:pt-40 md:pb-32 cursor-default bg-background min-h-screen">
        <FadeDown>
          <div className="max-w-5xl mx-auto px-6 md:px-8 mb-16 md:mb-20 w-full text-left">
            <Link href="/#about" className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-text-secondary hover:text-text-primary transition-colors mb-8">
              &larr; Back
            </Link>
            <h2 className="text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-4">Credentials</h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">Certifications</h3>
          </div>
        </FadeDown>

        <ul className="max-w-5xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <li key={cert.title} className="flex flex-col justify-between gap-6 p-6 rounded-2xl border border-text-secondary/20 bg-background transition-colors duration-300 hover:bg-thirdary/40">
              <div>
                <h4 className="text-lg font-bold text-text-primary leading-snug">{cert.title}</h4>
                <p className="text-sm font-medium text-text-secondary mt-2">{cert.issuer}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-text-secondary/10">
                <span className="text-xs uppercase tracking-widest font-bold text-text-secondary">{cert.issuedAt}</span>
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold tracking-[0.2em] uppercase text-text-primary hover:text-text-secondary transition-colors">
                    View credential
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </>
  )
}
