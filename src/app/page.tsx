"use client";

import SplashScreen from "@/components/SplashScreen";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CapabilityStrip from "@/components/CapabilityStrip";
import About from "@/components/About";
import Solutions from "@/components/Solutions";
import Technology from "@/components/Technology";
import Products from "@/components/Products";
import Process from "@/components/Process";
import Impact from "@/components/Impact";
import Vision from "@/components/Vision";
import Team from "@/components/Team";
import Research from "@/components/Research";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Recognition from "@/components/Recognition";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <SplashScreen />
      <Navigation />
      <main>
        <Hero />
        <CapabilityStrip />
        <About />
        <Solutions />
        <Technology />
        <Products />
        <Process />
        <Impact />
        <Vision />
        <Team />
        <Research />
        <Testimonials />
        <Recognition />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
