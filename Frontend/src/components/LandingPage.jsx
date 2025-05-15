'use client'
import { useState } from "react";
import { X } from "lucide-react";
import { SplineScene } from "@/components/ui/splite";
import NavBar from "@/components/NavBar";
import Feature from "./Feature";
import Footer from "./Footer";
import { CheckCircle, ArrowRight, Zap, ChevronRight, Calendar, Video, ClipboardCheck } from 'lucide-react';

export function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      {/* Global Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Main Gradient Background - Improved contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-white"></div>

        {/* Glow Circles - Adjusted opacity for better visibility without distraction */}
        <div className="absolute w-[1200px] h-[1200px] bg-blue-500 rounded-full opacity-8 blur-3xl -top-1/4 -left-1/4 animate-glow-slow"></div>
        <div className="absolute w-[800px] h-[800px] bg-indigo-400 rounded-full opacity-8 blur-3xl bottom-1/4 -right-1/4 animate-glow-slower"></div>

        {/* Meteor Shower */}
        {[...Array(100)].map((_, i) => (
          <span
            key={i}
            className="absolute w-[2px] h-[2px] bg-blue-400 rounded-full animate-meteor"
            style={{
              top: `0%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${(i % 20) * 0.3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: 0.7,
              boxShadow: `0 0 6px 3px rgba(59,130,246,0.15)`, // blue-500
            }}
          />
        ))}
      </div>

      <NavBar />

      {/* Hero Section */}
      <section className="w-full min-h-screen relative flex items-center justify-center z-10">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-b from-blue-800 to-indigo-600">
            Conduct Better Technical Interviews in One Place
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-800">
            Live coding + video calls + evaluation rubrics – no more app juggling.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">

            <div className="flex gap-4 p-4">
              <button onClick={() => { window.location.href = "/interviewer-signup" }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition transform hover:scale-105">
                Enter as Interviewer
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="border border-neutral-400 text-neutral-700 hover:border-blue-600 hover:text-blue-700 font-semibold py-3 px-8 rounded-lg transition transform hover:scale-105"
              >
                Try Demo
              </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-all">
                <div className="bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full relative">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 text-white hover:text-red-400 transition"
                  >
                    <X size={28} />
                  </button>
                  <div className="w-full aspect-video">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Demo Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="w-full min-h-screen flex items-center justify-center z-10 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm sm:text-base font-medium mb-4 backdrop-blur-sm">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              The Interview Revolution
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-900">
              From Chaos to <span className="text-blue-600">Clarity</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-200 hover:border-blue-400 shadow-sm transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold text-red-600 mb-3 sm:mb-4">Current Pain Points</h3>
              <ul className="space-y-3 sm:space-y-4 text-slate-800 text-base sm:text-lg">
                {[
                  "Switching between Zoom/LeetCode",
                  "Unreliable screensharing",
                  "Manual note-taking",
                  "Disorganized feedback",
                  "No standardized evaluation"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className="ml-3">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:scale-110 transition-transform">
                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>

            <div className="bg-blue-50/95 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-blue-200 hover:border-blue-400 shadow-sm transition-all duration-300">

              <h3 className="text-lg sm:text-xl font-semibold text-blue-700 mb-3 sm:mb-4">Our Solution</h3>

              <ul className="space-y-3 sm:space-y-4 text-gray-800 text-base sm:text-lg">
                {[
                  "All tools in one workspace",
                  "Real-time code streaming",
                  "Built-in scoring rubrics",
                  "Collaborative whiteboard",
                  "Automated candidate reports"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-5 w-5 text-blue-400" />
                    </div>
                    <span className="ml-3">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full min-h-screen flex items-center justify-center z-10 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-3 sm:mb-4">
              Simple Yet <span className="text-blue-600">Powerful</span>
            </h2>
            <p className="text-lg text-neutral-700">
              Our streamlined process gets you from scheduling to hiring decision faster than ever.
            </p>
          </div>
          <br />
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Schedule & Prepare",
                description: "Set up interviews with custom rubrics and coding exercises.",
                icon: <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
              },
              {
                title: "Conduct Interview",
                description: "Integrated video call and collaborative coding environment.",
                icon: <Video className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
              },
              {
                title: "Evaluate & Decide",
                description: "Score candidates in real-time and compare results.",
                icon: <ClipboardCheck className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm hover:border-blue-400 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-5 sm:mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{index + 1}</h3>
                <h4 className="text-lg sm:text-xl font-semibold text-blue-700 mb-3 sm:mb-4">{item.title}</h4>
                <p className="text-slate-800 text-base sm:text-lg">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full min-h-screen flex items-center justify-center z-10 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-3 sm:mb-4">
              Trusted by <span className="text-blue-600">Engineering Teams</span>
            </h2>
            <p className="p-4 text-lg text-neutral-700">
              Don't just take our word for it. Here's what our users say.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                quote: "Reduced our interview setup time by 70% while improving candidate experience significantly.",
                author: "ByteTech",
                role: "Engineering Lead",
                rating: 5
              },
              {
                quote: "Finally eliminated the need to juggle between Zoom and HackerRank. Everything we need is in one place.",
                author: "CodeForge",
                role: "Hiring Manager",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm hover:border-blue-400 transition-all duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-lg text-slate-800 mb-5 sm:mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      <section className="w-full py-8 bg-gray-100 z-10 border-t border-gray-200">
        <Footer />
        </section>

        
      {/* Animation Style */}
      <style jsx>{`
        @keyframes meteor {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.7;
          }
          100% {
            transform: translate(-400px, 900px) scale(0.1);
            opacity: 0.2;
          }
        }
        @keyframes glow-slow {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.12; }
        }
        @keyframes glow-slower {
          0%, 100% { opacity: 0.06; }
          50% { opacity: 0.1; }
        }
        .animate-meteor {
          animation-name: meteor;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .animate-glow-slow {
          animation: glow-slow 8s ease-in-out infinite;
        }
        .animate-glow-slower {
          animation: glow-slower 12s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
}