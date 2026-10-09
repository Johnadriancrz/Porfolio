"use client"
import { useRef } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import FadeDown from "@/components/animations/FadeDown"

interface ExperienceItem {
  id: number
  company: string
  role: string
  subRole?: string
  date: string
  description: string
  skills: string[]
}

const experiences: ExperienceItem[] = [
  {
    id: 1,
    company: "Somago International Corporation",
    role: "Full Stack Developer",
    subRole: "Team Leader",
    date: "May 2026 - Present",
    description: "Developed and maintained full-stack web applications, including Somago Portal using Spring Boot and SALAMA Language Center using Laravel 12. Built RESTful APIs, implemented backend services, authentication, business logic, and MySQL database integration. Developed frontend interfaces using React 19, Next.js, and Tailwind CSS.\n\nDeveloped and maintained six WordPress websites using themes, plugins, and visual page builders. Worked with Docker-based CI/CD pipelines, Gitea Actions, GitHub, and Alibaba Cloud ECS for application deployment and version control. Led technical tasks and coordinated development activities as Team Leader.",
    skills: ["Laravel", "Spring Boot", "React", "Next.js", "Tailwind CSS", "MySQL", "WordPress", "Docker", "CI/CD", "Gitea", "GitHub", "Alibaba Cloud ECS"],
  },

  {
    id: 2,
    company: "Procurement and Supply Institute of Asia (PASIA)",
    role: "Intern",
    date: "Dec 2025 - Feb 2026",
    description: "Identified, organized, and classified hospital inventory products using Microsoft Excel, ensuring accurate data entry. Processed and organized large volumes of inventory data and improved record accuracy. Maintained organized records and efficient workflows, helping improve inventory coordination and reduce processing delays.",
    skills: ["Microsoft Excel", "Data Entry", "Inventory Management"],
  },

  {
    id: 3,
    company: "Cursor Publication",
    role: "Video Editor",
    date: "Jan 2025 - Nov 2025",
    description: "Edited school event videos, ensuring clear visuals and clean audio for student and faculty presentation. Utilized Adobe Premiere Pro, CapCut Pro, After Effects to produce polished and engaging content.",
    skills: ["Adobe Premiere Pro", "CapCut Pro", "After Effects"],
  },
]

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll position of the entire section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  })

  // Add a slight spring physics to the line growth for smoothness
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <section id="experience" className="w-full max-w-5xl mx-auto py-24 md:py-32 cursor-default bg-background relative border-t border-text-secondary/10" ref={containerRef}>
      <FadeDown>
        <div className="max-w-5xl mx-auto px-6 md:px-8 mb-16 md:mb-24 w-full text-left">
          <h2 className="text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-4">Career Path</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">Work Experience</h3>
        </div>
      </FadeDown>

      <div className="max-w-5xl mx-auto px-6 md:px-8 relative group/list flex flex-col">
        {/* Timeline line: gray track with a darker fill that grows on scroll */}
        <div className="hidden md:block absolute top-[49px] bottom-8 left-[calc(25%-8px)] w-[2px] -translate-x-1/2 pointer-events-none">
          <div className="w-full h-full bg-text-secondary/20 overflow-hidden">
            <motion.div style={{ scaleY }} className="w-full h-full origin-top bg-text-secondary/60" />
          </div>
          {/* Circular end cap */}
          <span className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full w-2.5 h-2.5 rounded-full bg-text-secondary/20" />
        </div>

        {experiences.map((exp, index) => {
          return (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 40, filter: "blur(5px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: index * 0.1 }} className="group/item relative grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 p-6 md:p-8 -mx-6 md:-mx-8 rounded-2xl transition-all duration-500 hover:!opacity-100 hover:!blur-none group-hover/list:opacity-40 group-hover/list:blur-[2px] hover:bg-text-secondary/5 hover:shadow-lg border border-transparent hover:border-text-secondary/10">
              
              {/* Left Column: Date */}
              <div className="md:col-span-1 pt-1 md:pt-2">
                <span className="text-xs font-bold tracking-widest text-text-secondary uppercase">{exp.date}</span>
              </div>

              {/* Right Column: Details */}
              <div className="md:col-span-3 flex flex-col relative">
                {/* Timeline marker dot: centered on the line, which sits 2rem left of the text column */}
                <span className="hidden md:block absolute -left-8 top-[9px] -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-text-primary ring-4 ring-background" />
                <h4 className="text-2xl font-bold text-text-primary tracking-tight mb-1 group-hover/item:text-text-primary transition-colors">
                  {exp.role}
                  {exp.subRole && <span className="ml-3 text-base font-medium text-text-secondary/70 tracking-normal">- {exp.subRole}</span>}
                </h4>
                <h5 className="text-sm font-bold text-text-secondary tracking-wide uppercase mb-6">{exp.company}</h5>

                <p className="text-base text-text-secondary font-medium leading-relaxed mb-6 whitespace-pre-line">{exp.description}</p>

                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill, i) => (
                    <span key={i} className="text-xs font-bold bg-background md:bg-thirdary text-text-primary px-3 py-1.5 rounded-lg border border-text-secondary/10 uppercase tracking-wider group-hover/item:bg-background transition-colors duration-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
