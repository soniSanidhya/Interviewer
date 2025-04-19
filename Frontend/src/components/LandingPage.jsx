'use client'

import { SplineScene } from "@/components/ui/splite";
import NavBar from "@/components/NavBar";
import Feature from "./Feature";
import Footer from "./Footer";
import { CheckCircle, ArrowRight, Zap, ChevronRight, Calendar, Video, ClipboardCheck } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      {/* Hero Section (unchanged but made more zoom-resistant) */}
      <div className="w-full min-h-[600px] bg-neutral-950 relative overflow-hidden text-white flex items-center">
        <div className="container mx-auto flex flex-col lg:flex-row items-center px-4 sm:px-6 lg:px-8 py-16">
          <div className="lg:w-1/2 relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-300 leading-tight">
              Conduct Better Technical Interviews in One Place
            </h1>
            <br />
            <p className="mt-4 text-lg sm:text-xl text-neutral-300 max-w-xl">
              Live coding + video calls + evaluation rubrics – no more app juggling.
            </p>
            <br />
            <br />
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition text-base sm:text-lg">
                Try Free Demo
              </button>
              <button className="border border-neutral-500 text-neutral-300 hover:text-white hover:border-white font-semibold py-3 px-8 rounded-lg transition text-base sm:text-lg">
                See How It Works
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 relative hidden lg:block h-[400px] lg:h-[500px] mt-12 lg:mt-0">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
      <div className="border-t-4 border-blue-500 my-4"></div>
      {/* Problem/Solution Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm sm:text-base font-medium mb-4">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              The Interview Revolution
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              From Chaos to <span className="text-blue-600">Clarity</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-gray-50 p-6 sm:p-8 rounded-xl border border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-red-500 mb-3 sm:mb-4">Current Pain Points</h3>
              <ul className="space-y-3 sm:space-y-4 text-gray-600 text-base sm:text-lg">
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
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>

            <div className="bg-blue-50 p-6 sm:p-8 rounded-xl border border-blue-200">
              <h3 className="text-lg sm:text-xl font-semibold text-blue-600 mb-3 sm:mb-4">Our Solution</h3>
              <ul className="space-y-3 sm:space-y-4 text-gray-700 text-base sm:text-lg">
                {[
                  "All tools in one workspace",
                  "Real-time code streaming",
                  "Built-in scoring rubrics",
                  "Collaborative whiteboard",
                  "Automated candidate reports"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="ml-3">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* <div className="border-t-2 border-gray-500 my-4"></div> */}
      {/* How It Works Section */}
      <section className="py-16 sm:py-20 bg-blue-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Simple Yet <span className="text-blue-600">Powerful</span>
            </h2>
            <p className=" text-gray-900 mb-3 sm:mb-4">
              Our streamlined process gets you from scheduling to hiring decision faster than ever.
            </p>
            <br />
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Schedule & Prepare",
                description: "Set up interviews with custom rubrics and coding exercises.",
                icon: <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              },
              {
                title: "Conduct Interview",
                description: "Integrated video call and collaborative coding environment.",
                icon: <Video className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              },
              {
                title: "Evaluate & Decide",
                description: "Score candidates in real-time and compare results.",
                icon: <ClipboardCheck className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-lg flex items-center justify-center mb-5 sm:mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{index + 1}</h3>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">{item.title}</h4>
                <p className="text-gray-600 text-base sm:text-lg">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* <div className="border-t-2 border-gray-500 my-4"></div> */}
      {/* Testimonials */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Trusted by <span className="text-blue-600">Engineering Teams</span>
            </h2>

            <p className=" text-gray-900 mb-3 sm:mb-4">
              Don't just take our word for it. Here's what our users say.
            </p>
            <br />
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
              <div key={index} className="bg-gray-50 p-6 sm:p-8 rounded-xl border border-gray-200">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 mb-5 sm:mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16 sm:py-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-5 sm:mb-6">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className=" text-white mb-3 sm:mb-4 underline">
            Join thousands of teams making better hiring decisions faster with our all-in-one platform.
          </p>
          <br />
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition transform hover:-translate-y-1 duration-300 shadow-lg text-base sm:text-lg">
              Start Free Trial
            </button>
            <button className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition text-base sm:text-lg">
              Schedule Demo
            </button>
          </div>
          <br />
          <p className="mt-6 text-blue-100 text-sm sm:text-base">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
        <br />

      </section>



      <Footer />
    </div>
  );
}