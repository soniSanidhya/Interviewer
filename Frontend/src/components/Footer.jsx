import { Zap } from 'lucide-react';
import React from 'react';
import { footerLinks } from '../utils/mockData';

export default function Footer() {
  return (
    <footer className="bg-[#1A1B1E] text-white pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          {/* Logo */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-[#00E8C6]" />
              <span className="font-semibold text-xl">CodeInterview.Tech</span>
            </a>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}