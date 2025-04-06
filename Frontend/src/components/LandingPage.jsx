'use client'

import { SplineScene } from "@/components/ui/splite";
import NavBar from "@/components/NavBar";
import Feature from "./Feature";
import Footer from "./Footer";

export function LandingPage() {
  return (
    <>
      <NavBar />
      
      {/* Hero Section */}
      <div className="w-full h-[600px] bg-neutral-950 relative overflow-hidden text-white">
        <div className="flex h-full">
          {/* Left content */}
          <div className="flex-1 p-8 relative z-10 flex flex-col justify-center px-12 md:px-28">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-300">
              Conduct Better Technical Interviews in One Place
            </h1>
            <p className="mt-4 text-neutral-300 max-w-xl">
              Live coding + video calls + evaluation rubrics – no more app juggling.
            </p>
            <div className="mt-6 flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition">
                Try Free Demo
              </button>
              <button className="border border-neutral-500 text-neutral-300 hover:text-white hover:border-white font-semibold py-2 px-6 rounded-lg transition">
                See How It Works
              </button>
            </div>
          </div>

          {/* Right visual */}
          <div className="flex-1 relative hidden md:block">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Problem/Solution Section */}
      <section className="bg-white py-16 px-6 md:px-28">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-800 mb-12">
          The Interview Chaos Ends Here
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-lg font-semibold text-red-500 mb-2">Current Pain Points</h3>
            <ul className="text-neutral-600 space-y-2">
              <li>Switching between Zoom/LeetCode</li>
              <li>Unreliable screensharing</li>
              <li>Manual note-taking</li>
            </ul>
          </div>
          <div className="md:col-span-1 flex justify-center items-center text-4xl font-bold text-blue-600">→</div>
          <div>
            <h3 className="text-lg font-semibold text-green-600 mb-2">Our Solution</h3>
            <ul className="text-neutral-700 space-y-2">
              <li>All tools in one tab</li>
              <li>Real-time code streaming</li>
              <li>Built-in scoring rubrics</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <Feature />

      {/* How It Works Section */}
      <section className="bg-gray-100 py-16 px-6 md:px-28">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-neutral-800">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold text-blue-700">1. Schedule</h3>
            <p className="text-neutral-600 mt-2">Set time, duration & attach rubric.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-700">2. Interview</h3>
            <p className="text-neutral-600 mt-2">Candidate joins via secure link.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-700">3. Evaluate</h3>
            <p className="text-neutral-600 mt-2">Score live & download report instantly.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 px-6 md:px-28">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-800 mb-12">
          Trusted by Engineering Teams
        </h2>
        <div className="grid md:grid-cols-2 gap-10 text-neutral-700">
          <blockquote>
            “Cut our interview setup time by 70%.”  
            <footer className="mt-2 text-sm text-neutral-500">– ByteTech, Engineering Lead</footer>
          </blockquote>
          <blockquote>
            “Finally, no more juggling between Zoom and HackerRank.”  
            <footer className="mt-2 text-sm text-neutral-500">– CodeForge, Hiring Manager</footer>
          </blockquote>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-600 py-16 text-white text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Simplify Your Interviews?
        </h2>
        <p className="mb-6">Start using CodeInterview Pro – no credit card required.</p>
        <button className="bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition">
          Get Started
        </button>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
