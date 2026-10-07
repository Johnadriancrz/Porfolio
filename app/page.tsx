import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Hero from "./hero"
import About from "./about"
import Experience from "./experience"
import TechStack from "./tech-stack"
import Project from "./project"
import WordPress from "./wordpress"
import Contact from "./contact"

export default function Home() {
  return (
    <>
      <header className="cursor-default sticky top-0 z-50">
        <Header />
      </header>
      <Hero />
      <About />
      <Experience />
      <Project />
      <WordPress />
      <TechStack />
      <Contact />
      <Footer />
    </>
  )
}
