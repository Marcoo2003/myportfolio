"use client";

import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import Timeline from "./components/Timeline";
import Identity from "./components/Identity";
import DeviceShowcase from "./components/DeviceShowcase";
import Projects from "./components/Projects";
import Approach from "./components/Approach";
import Contact from "./components/Contact";
import BootSequence from "./components/BootSequence";

export default function Home() {
  const [isBooted, setIsBooted] = useState(false);
  const [showBoot, setShowBoot] = useState(true);

  useEffect(() => {
    // Check if already booted in this session
    const hasBooted = sessionStorage.getItem("hasBooted");
    if (hasBooted) {
      setIsBooted(true);
      setShowBoot(false);
    }
  }, []);

  const handleBootComplete = () => {
    setIsBooted(true);
    // Small delay before hiding boot screen
    setTimeout(() => setShowBoot(false), 100);
  };

  return (
    <>
      {showBoot && <BootSequence onComplete={handleBootComplete} />}
      <main 
        className="min-h-screen"
        style={{
          opacity: isBooted ? 1 : 0,
          visibility: isBooted ? "visible" : "hidden",
          transition: "opacity 1s ease-out",
        }}
      >
        <Hero />
        <Timeline />
        
        
        <Projects />
        <DeviceShowcase />
        <Identity />
        <Approach />
        <Contact />
      </main>
    </>
  );
}
