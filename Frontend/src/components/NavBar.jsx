import React from 'react';
import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1B1E]/95 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-[#00E8C6]" />
            <span className="text-white font-bold text-xl tracking-wide">CodeInterview.Tech</span>
          </Link>

          {/* Dropdown */}
          <div className="relative group">
            <button
              className="bg-[#3d3d3d] text-white px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-[#00E8C6] hover:text-black focus:outline-none"
            >
              Get Started as
            </button>
            <ul className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 ease-in-out pointer-events-none group-hover:pointer-events-auto z-50">
              <li>
                <Link
                  to="/candidate-signup"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Candidate
                </Link>
              </li>
              <li>
                <Link
                  to="/interviewer-signup"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Interviewer
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
