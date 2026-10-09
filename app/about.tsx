import ScrollVelocity from "@/components/ScrollVelocity"
import FadeDown from "@/components/animations/FadeDown"
import Fade from "@/components/animations/Fade"
import FadeLeft from "@/components/animations/FadeLeft"
import Image from "next/image"
import Link from "next/link"
import { certifications } from "@/data/certifications"

// How many certifications the About section previews before linking to /certifications
const PREVIEW_COUNT = 3

export default function About() {
  const velocity = 50

  return (
    <>
      <section id="about" className="w-full max-w-5xl mx-auto py-24 md:py-32 cursor-default bg-background overflow-hidden border-t border-text-secondary/10">
        <FadeDown>
          <div className="max-w-5xl mx-auto px-6 md:px-8 mb-16 md:mb-24 w-full text-left">
            <h2 className="text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-4">Discover</h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">About Me</h3>
          </div>
        </FadeDown>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 lg:items-start gap-12 lg:gap-20 px-6 md:px-8">

          <div className="lg:col-span-5 hidden lg:flex flex-col items-center justify-start relative">
            <div className="w-full max-w-[350px] lg:max-w-[450px] relative">
              <Fade>
                <div className="relative z-10 p-2 bg-background border border-text-secondary/10 rounded-3xl overflow-hidden aspect-[4/5] w-full group transition-all duration-500 hover:-translate-y-1">
                  <Image 
                    src="/images/avatar.jpg"
                    alt="John Adrian Cruz, Full Stack Web Developer" 
                    fill
                    quality={100}
                    className="object-cover object-top origin-bottom transition-all duration-700 scale-115 group-hover:scale-120"
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 text-8xl lg:text-9xl font-black text-text-secondary/5 select-none pointer-events-none tracking-tighter mix-blend-multiply dark:mix-blend-screen z-0">DEV.</div>
              </Fade>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-start">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              <div className="flex flex-col">
                <Fade>
                  <h4 className="text-lg md:text-xl font-bold text-text-primary mb-4 flex items-center border-b border-text-secondary/20 pb-4">Who Am I</h4>
                  <p className="text-base text-text-secondary leading-relaxed font-medium">I am an experienced Full Stack Developer who designs and builds web applications using Node.js, Express.js, Laravel, React, Next.js, TypeScript, Prisma, and MySQL. I am skilled at building REST APIs, integrating third-party services, and developing automation systems.</p>
                </Fade>
              </div>
              
              <div className="flex flex-col">
                <Fade className="flex flex-col h-full">
                  <h4 className="text-lg md:text-xl font-bold text-text-primary mb-4 flex items-center border-b border-text-secondary/20 pb-4">Certifications</h4>
                  <ul className="flex flex-col gap-2 flex-1">
                    {certifications.slice(0, PREVIEW_COUNT).map((cert) => (
                      <li key={cert.title} className="flex flex-1">
                        <Link href="/certifications" className="flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-lg border border-text-secondary/20 bg-background relative cursor-pointer transition-all duration-300 ease-out hover:z-10 hover:scale-110 hover:bg-thirdary hover:border-text-primary/40 hover:shadow-xl focus-visible:z-10 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary">
                          <div className="flex flex-col min-w-0">
                            <span className="text-[13px] font-bold text-text-primary leading-tight">{cert.title}</span>
                            <span className="text-[11px] font-medium text-text-secondary mt-0.5">
                              {cert.issuer}{cert.via && ` · via ${cert.via}`}
                            </span>
                          </div>
                          {cert.logo && (
                            <Image src={cert.logo} alt={`${cert.issuer} logo`} width={48} height={48} className={`size-12 shrink-0 rounded-lg object-contain ${cert.logoFullBleed ? "" : "bg-white p-1.5 ring-1 ring-black/10 shadow-sm"}`} />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href="/certifications" className="mt-3 self-start inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-text-primary group/btn">
                    View all
                    <span className="w-8 h-[2px] bg-text-primary group-hover/btn:w-12 transition-all duration-300"></span>
                  </Link>
                </Fade>
              </div>
            </div>

            <div className="mt-10 md:mt-12">
              <Fade>
                <h4 className="text-lg md:text-xl font-bold text-text-primary mb-8 border-b border-text-secondary/20 pb-4 border-l-4 border-l-text-primary pl-4">Personal Details</h4>
              </Fade>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                <FadeLeft delay={0.1}>
                  <div className="flex flex-col p-2 -m-2 rounded-xl transition-colors duration-300 hover:bg-thirdary/40">
                    <span className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-1">Name</span>
                    <span className="text-base font-semibold text-text-primary">John Adrian B. Cruz</span>
                  </div>
                </FadeLeft>

                <FadeLeft delay={0.2}>
                  <div className="flex flex-col p-2 -m-2 rounded-xl transition-colors duration-300 hover:bg-thirdary/40">
                    <span className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-1">Place of Birth</span>
                    <span className="text-base font-semibold text-text-primary">Quezon City, Philippines</span>
                  </div>
                </FadeLeft>

                <FadeLeft delay={0.3}>
                  <div className="flex flex-col p-2 -m-2 rounded-xl transition-colors duration-300 hover:bg-thirdary/40">
                    <span className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-1">Phone</span>
                    <span className="text-base font-semibold text-text-primary">+63 995-355-1650</span>
                  </div>
                </FadeLeft>

                <FadeLeft delay={0.5}>
                  <div className="flex flex-col p-2 -m-2 rounded-xl transition-colors duration-300 hover:bg-thirdary/40">
                    <span className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-1">Email</span>
                    <a href="mailto:johnbarbozacruz@gmail.com" className="text-base font-semibold text-text-primary hover:text-text-secondary transition-colors underline decoration-text-secondary/30 underline-offset-4">
                      johnbarbozacruz@gmail.com
                    </a>
                  </div>
                </FadeLeft>

                <div className="sm:col-span-2">
                  <FadeLeft delay={0.6}>
                    <div className="flex flex-col p-2 -m-2 rounded-xl transition-colors duration-300 hover:bg-thirdary/40">
                      <span className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-1">Education</span>
                      <span className="text-base font-semibold text-text-primary">Bulacan State University - Malolos</span>
                      <span className="text-sm text-text-secondary mt-1">BS in Information Technology - Major in Web and Mobile Applications</span>
                    </div>
                  </FadeLeft>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Fade>
          <div className="mt-24 md:mt-32 pb-6 border-text-secondary/10">
            <ScrollVelocity texts={["Hello I'm Adrian", "Fullstack Web Developer"]} velocity={velocity} className="font-black tracking-tighter text-thirdary dark:text-button-hover opacity-50" />
          </div>
        </Fade>
      </section>
    </>
  )
}
