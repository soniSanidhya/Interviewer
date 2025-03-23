import React from 'react'
import { Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1B1E] bg-opacity-95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-[#00E8C6]" />
              <span className="text-white font-semibold text-xl">InterCode</span>
            </a>
            {/* <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-6">
                <a href="#" className="text-gray-300 hover:text-white">Docs</a>
                <a href="#" className="text-gray-300 hover:text-white">Pricing</a>
                <a href="#" className="text-gray-300 hover:text-white">Enterprise</a>
                <a href="#" className="text-gray-300 hover:text-white">WebContainers</a>
                <a href="#" className="text-gray-300 hover:text-white">Blog</a>
              </div>
            </div> */}
          </div>
          <div className="flex items-center space-x-4 ">
            <button className="text-gray-300 hover:text-white cursor-pointer">Sign in</button>
            <button className="bg-[#3d3d3d] text-white px-4 py-2 rounded-lg hover:bg-[#00E8C6] cursor-pointer">
              Get started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}