'use client'
import NavBar from "@/components/NavBar";
import { CheckCircle, ArrowRight, Zap, ChevronRight, Calendar, Video, ClipboardCheck } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-700 text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 z-10 mb-16 lg:mb-0">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-800 bg-opacity-50 text-blue-100 mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Next-gen technical interviews
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Streamline Your <span className="text-blue-300">Technical Hiring</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-lg">
              All the tools you need for effective technical interviews in one seamless platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105">
                Get Started Free
              </button>
              <button className="bg-transparent border-2 border-blue-300 text-blue-100 hover:bg-blue-800 hover:border-blue-400 font-semibold py-3 px-8 rounded-lg transition">
                Watch Demo
              </button>
            </div>
          </div>
        
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The Interview <span className="text-blue-600">Evolution</span>
            </h2>
            <p className="text-lg text-gray-600">
              Traditional technical interviews are fragmented and inefficient. We've built a better way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-xl font-semibold text-red-400 mb-6">The Problem</h3>
              <ul className="space-y-4">
                {[
                  "Switching between Zoom/LeetCode",
                  "Unreliable screensharing",
                  "Manual note-taking",
                  "Disorganized feedback",
                  "No standardized evaluation"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-xl font-semibold text-blue-200 mb-6">Our Solution</h3>
              <ul className="space-y-4">
                {[
                  "All tools in one workspace",
                  "Real-time code streaming",
                  "Built-in scoring rubrics",
                  "Collaborative whiteboard",
                  "Automated candidate reports"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-blue-300" />
                    </div>
                    <span className="ml-3 text-blue-100">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It <span className="text-blue-600">Works</span>
            </h2>
            <p className="text-lg text-gray-600">
              A streamlined process that saves time and improves hiring quality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Schedule & Prepare",
                description: "Set up interviews with custom rubrics and coding exercises.",
                icon: <Calendar className="w-10 h-10 text-blue-600" />
              },
              {
                title: "Conduct Interview",
                description: "Integrated video call and collaborative coding environment.",
                icon: <Video className="w-10 h-10 text-blue-600" />
              },
              {
                title: "Evaluate & Decide",
                description: "Score candidates in real-time and compare results.",
                icon: <ClipboardCheck className="w-10 h-10 text-blue-600" />
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-center">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by <span className="text-blue-600">Engineering Teams</span>
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of companies revolutionizing their hiring process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
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
              <div key={index} className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:border-blue-300 transition">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join the new standard for technical interviews and make better hiring decisions faster.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-blue-600 font-semibold py-3 px-8 rounded-lg transition">
              Book a Demo
            </button>
          </div>
          <p className="mt-8 text-blue-200">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer would go here */}
    </div>
  );
}