'use client'

import { SplineScene } from "@/components/ui/splite";
import NavBar from "@/components/NavBar";
import Feature from "./Feature";
import Footer from "./Footer";
 
export function LandingPage() {
  return (
    <>
    <NavBar/>
    <div className="w-full h-[500px] bg-neutral-950 relative overflow-hidden">
      
      <div className="flex h-full">
        {/* Left content */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center px-28">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          How design systems & frontend teams work together
          </h1>
          <p className="mt-4 text-neutral-300 max-w-lg">
          Collaborate on web development without the hassle of setting up local environments. StackBlitz lets you write, run, and debug frontend code directly in your browser.
          </p>
        </div>

        {/* Right content */}
        <div className="flex-1 relative">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
    <Feature/>
    <Footer/>
    </>
  )
}