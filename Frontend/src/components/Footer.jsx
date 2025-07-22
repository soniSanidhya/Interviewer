import { Zap } from 'lucide-react';
import React from 'react';
import { footerLinks } from '../utils/mockData';

export default function Footer() {
  return (
    <footer className="pt-10 pb-8 px-4" style={{ 
      backgroundColor: 'var(--color-gray-100)', 
      color: 'var(--color-gray-800)',
      borderTop: `1px solid var(--color-gray-200)`
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          {/* Logo */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center space-x-2">
              <Zap className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
              <span className="font-semibold text-xl">CodeInterview.Tech</span>
            </a>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--color-primary-dark)' }}>
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="transition-colors hover:underline"
                      style={{ color: 'var(--color-gray-600)' }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--color-primary-hover)'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--color-gray-600)'}
                    >
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