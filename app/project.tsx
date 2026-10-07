"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import FadeDown from "@/components/animations/FadeDown"
import FadeUp from "@/components/animations/FadeUp"
import GlareHover from "@/components/GlareHover"

export default function Project() {
  const [isOpen, setIsOpen] = useState<number | null>(null)
  const total = projectList.length
  // On phones there is no room for three cards, so the highlighted card must always be centered on screen
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  // The desktop carousel shows at most 3 cards at once, so with 3 or fewer everything is already on screen and navigation is locked
  const isStatic = total <= 3 && !isMobile
  // `active` is the highlighted (full size) card; it can be any card, including the first and last
  const [active, setActive] = useState(total <= 3 ? Math.floor((total - 1) / 2) : 0)
  // On desktop the 3-card window follows the highlight but never slides past the ends, so there is never an empty slot.
  // The highlighted card then sits in the left or right slot of the window when it is the first or last card.
  // On mobile the window is always centered on the highlighted card.
  const windowCenter = isMobile ? active : isStatic ? (total - 1) / 2 : Math.min(Math.max(active, 1), total - 2)
  const isFirst = isStatic || active === 0
  const isLast = isStatic || active === total - 1
  // Stops at both ends instead of looping
  const paginate = (dir: number) => !isStatic && setActive((prev) => Math.min(Math.max(prev + dir, 0), total - 1))

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen !== null) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])


  const activeProject = projectList.find((p) => p.index === isOpen)

  return (
    <>
      <section id="projects" className="w-full max-w-5xl mx-auto py-24 md:py-32 cursor-default bg-background relative border-t border-text-secondary/10">
        <FadeDown>
          <div className="max-w-5xl mx-auto px-6 md:px-8 mb-16 md:mb-24 w-full text-left">
            <h2 className="text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-4">Portfolio</h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">Selected Works</h3>
          </div>
        </FadeDown>

        {/* Coverflow Carousel */}
        <FadeUp>
          <div className="relative w-full overflow-hidden py-10">
            <motion.div className="relative mx-auto h-[500px] w-full touch-pan-y select-none" onPanEnd={(_, info) => (info.offset.x < -60 ? paginate(1) : info.offset.x > 60 && paginate(-1))}>
              {projectList.map((project, index) => {
                const offset = index - windowCenter
                const isActive = index === active
                const isVisible = Math.abs(offset) <= 1
                const targetOpacity = isActive ? 1 : isVisible ? 0.55 : 0

                return (
                  <motion.div
                    key={project.index}
                    initial={false}
                    animate={{
                      x: `${offset * 88}%`,
                      scale: isActive ? 1 : 0.84,
                      opacity: targetOpacity,
                    }}
                    transition={{ type: "spring", damping: 26, stiffness: 170 }}
                    style={{ zIndex: isActive ? 20 : 10 - Math.abs(offset), pointerEvents: isVisible ? "auto" : "none" }}
                    className={`absolute left-1/2 top-0 h-[460px] w-[280px] -ml-[140px] sm:w-[340px] sm:-ml-[170px] rounded-2xl ${isActive ? "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]" : "shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]"}`}
                  >
                    <GlareHover className="group flex flex-col h-full bg-background border border-text-secondary/20 rounded-2xl overflow-hidden">
                      <div className="relative overflow-hidden aspect-[16/10] bg-text-secondary/5 border-b border-text-secondary/10">
                        <Image src={project.imagePath} alt={project.title} fill sizes="340px" className="object-cover transition-all duration-700 group-hover:scale-105" />

                        {/* Tech Stack Overlay */}
                        <div className="absolute top-4 right-4 flex flex-wrap gap-2 justify-end z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-[-10px] group-hover:translate-y-0">
                          {project.tech.slice(0, 3).map((tech, i) => (
                            <span key={i} className="text-[10px] font-bold bg-background/90 text-text-primary px-2 py-1 rounded backdrop-blur-md border border-text-secondary/20 uppercase tracking-widest shadow-sm">
                              {tech}
                            </span>
                          ))}
                          {project.tech.length > 3 && <span className="text-[10px] font-bold bg-background/90 text-text-primary px-2 py-1 rounded backdrop-blur-md border border-text-secondary/20 uppercase tracking-widest shadow-sm">+{project.tech.length - 3}</span>}
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow relative">
                        {/* Numbering */}
                        <div className="absolute top-0 right-6 -translate-y-1/2 bg-background border border-text-secondary/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-text-secondary shadow-sm">{String(project.index + 1).padStart(2, "0")}</div>

                        <h4 className="text-2xl font-black text-text-primary tracking-tight leading-tight mb-4">{project.title}</h4>

                        <p className="text-sm text-text-secondary font-medium leading-relaxed mb-6 flex-grow line-clamp-4">{project.shortDescription}</p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-text-secondary/10">
                          <button tabIndex={isActive || isStatic ? 0 : -1} className="text-xs font-bold tracking-[0.2em] uppercase text-text-primary flex items-center gap-3 group/btn" onClick={() => setIsOpen(project.index)}>
                            View Details
                            <span className="w-8 h-[2px] bg-text-primary group-hover/btn:w-12 transition-all duration-300"></span>
                          </button>

                          <a href={project.liveDemoUrl} tabIndex={isActive || isStatic ? 0 : -1} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} live demo`} className="p-2 border border-text-secondary/20 rounded-full text-text-secondary hover:text-background hover:bg-text-primary hover:border-text-primary transition-all duration-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </GlareHover>

                    {/* Side cards: click anywhere to bring into focus */}
                    {!isStatic && !isActive && isVisible && <button type="button" aria-label={`Show ${project.title}`} onClick={() => setActive(index)} className="absolute inset-0 z-20 rounded-2xl cursor-pointer" />}
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Prev / Next */}
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" aria-label="Previous project" disabled={isFirst} onClick={() => paginate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full border border-text-secondary/40 text-text-primary enabled:hover:bg-text-primary enabled:hover:text-background enabled:hover:border-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m0 0l7 7m-7-7l7-7" />
                </svg>
              </button>
              <button type="button" aria-label="Next project" disabled={isLast} onClick={() => paginate(1)} className="w-10 h-10 flex items-center justify-center rounded-full border border-text-secondary/40 text-text-primary enabled:hover:bg-text-primary enabled:hover:text-background enabled:hover:border-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m0 0l-7-7m7 7l-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </FadeUp>

        <AnimatePresence>
          {isOpen !== null && activeProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              {/* Backdrop */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={() => setIsOpen(null)} />

              {/* Modal Container */}
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="bg-background border border-text-secondary/20 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative z-10">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-text-secondary/10">
                  <h4 className="text-2xl font-black text-text-primary tracking-tight">{activeProject.title}</h4>
                  <button className="text-text-secondary hover:text-text-primary transition-colors p-2 bg-text-secondary/5 rounded-full" onClick={() => setIsOpen(null)}>
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 md:p-8 overflow-y-auto flex-grow custom-scrollbar">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 pb-8 border-b border-text-secondary/10">
                    <div>
                      <span className="text-xs font-bold tracking-widest text-text-secondary uppercase block mb-3">Created</span>
                      <span className="text-sm font-bold bg-thirdary text-text-primary px-3 py-1.5 rounded-lg border border-text-secondary/10">{activeProject.createdAt}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold tracking-widest text-text-secondary uppercase block mb-3">Technologies</span>
                      <div className="flex flex-wrap gap-2">
                        {activeProject.tech.map((tech, i) => (
                          <span key={i} className="text-xs font-bold bg-thirdary text-text-primary px-3 py-1.5 rounded-lg border border-text-secondary/10 uppercase tracking-wider">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold tracking-widest text-text-secondary uppercase block mb-5">Key Features</span>
                    <ul className="space-y-4">
                      {activeProject.features.map((feature, i) => (
                        <li key={i} className="flex items-center bg-thirdary/50 p-4 rounded-xl border border-text-secondary/5">
                          <span className="text-text-primary mr-3 font-black">&rarr;</span>
                          <span className="text-sm font-bold text-text-primary uppercase tracking-wide">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-text-secondary/10 flex flex-col sm:flex-row gap-4 bg-background">
                  <a href={activeProject.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center font-bold text-sm tracking-widest uppercase bg-text-primary text-background py-4 rounded-xl hover:-translate-y-1 transition-transform duration-300">
                    Live Demo
                  </a>
                  {activeProject.isPrivateRepo ? (
                    <button disabled className="flex-1 flex justify-center items-center gap-2 text-center font-bold text-sm tracking-widest uppercase border-2 border-text-secondary/20 text-text-secondary opacity-50 cursor-not-allowed py-4 rounded-xl">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Source Code
                    </button>
                  ) : (
                    <a href={activeProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 text-center font-bold text-sm tracking-widest uppercase border-2 border-text-secondary/20 text-text-primary hover:border-text-primary hover:-translate-y-1 transition-all duration-300 py-4 rounded-xl">
                      Source Code
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>
    </>
  )
}

const projectList = [
  {
    index: 0,
    imagePath: "/images/jadibotwa.png",
    title: "JadibotWA",
    shortDescription: "Architected a code-free WhatsApp automation platform featuring live bot logs via WebSockets for real-time data, status monitoring, and scalable REST APIs.",
    createdAt: "2025-05-10",
    features: ["Live Bot Logs via WebSockets", "High-performance Microservices", "Multi-device Session Management", "AI-powered Chat Workflows"],
    tech: ["Go (Fiber)", "PostgreSQL", "WhatsMeow", "Next.js", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/RyHarJr",
    liveDemoUrl: "https://jadibotwa.xyz",
    isPrivateRepo: true,
  },
  {
    index: 1,
    imagePath: "/images/ryharpanel.png",
    title: "RyHar Panel",
    shortDescription: "Built a modern landing page and management platform for a Pterodactyl hosting service, focused on fast, responsive, and conversion-driven user experience.",
    createdAt: "2025-08-05",
    features: ["Pterodactyl Integration", "Automated Transaction Processing", "Payment Gateway", "SEO Optimization"],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Express.js", "Prisma ORM", "MySQL"],
    githubUrl: "https://github.com/RyHarJr",
    liveDemoUrl: "https://ryhar-panel.my.id",
    isPrivateRepo: true,
  },
  {
    index: 2,
    imagePath: "/images/hero.jpg",
    title: "RyHar Portfolio",
    shortDescription: "Developed a personal portfolio website with a modern, responsive design focused on user experience to showcase profile, skills, and completed projects.",
    createdAt: "2026-07-20",
    features: ["Interactive Animations", "Responsive Design", "Modern UI/UX"],
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com/RyHarJr/portofoliov2",
    liveDemoUrl: "https://ryhar.my.id",
    isPrivateRepo: false,
  },
  // TODO: placeholder, replace with the real fourth project
  {
    index: 3,
    imagePath: "/images/hero.jpg",
    title: "New Project",
    shortDescription: "Placeholder description for the fourth project. Replace this with a short summary of what you built and the problem it solves.",
    createdAt: "2026-10-07",
    features: ["Feature One", "Feature Two", "Feature Three"],
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/RyHarJr",
    liveDemoUrl: "https://github.com/RyHarJr",
    isPrivateRepo: true,
  },
]
