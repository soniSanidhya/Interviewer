import React from 'react'
import { categories, templates } from '../utils/mockData'
import { ArrowRight, Zap } from 'lucide-react'

const Feature = () => {
  return (
    <div className="bg-[#0F1117] text-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#00E8C6]/10 text-[#00E8C6] text-sm font-medium mb-4">
            <Zap className="w-4 h-4 mr-2" />
            Lightning Fast Environments
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 max-w-4xl mx-auto leading-tight">
            Launch <span className="text-[#00E8C6]">production-ready</span> environments in milliseconds
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Pre-configured templates for all major frameworks and languages
          </p>
        </div>

        {/* Categories */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-gray-900 rounded-xl p-1.5">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
                  category.active
                    ? 'bg-[#00E8C6] text-gray-900 shadow-lg shadow-[#00E8C6]/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template, index) => (
            <div
              key={index}
              className="bg-[#1E2028] border border-gray-800 rounded-xl overflow-hidden hover:border-[#00E8C6]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#00E8C6]/10 group"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-gray-900 p-3 rounded-lg">
                    <img
                      src={template.icon}
                      alt={template.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-[#00E8C6] transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-400">{template.tech}</p>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-4">
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                    {template.category}
                  </span>
                  <button className="text-[#00E8C6] hover:text-white text-sm font-medium flex items-center">
                    Launch <ArrowRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="inline-flex items-center px-6 py-3 border border-gray-700 rounded-lg text-white font-medium hover:bg-gray-800/50 hover:border-gray-600 transition-all">
            View all templates ({templates.length}+)
          </button>
        </div>
      </div>
    </div>
  )
}

export default Feature