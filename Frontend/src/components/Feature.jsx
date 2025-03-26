import React from 'react'
import { categories } from '../utils/mockData'
import { templates } from '../utils/mockData'

const Feature = () => {
  return (
    <div className="bg-[#1A1B1E] text-white py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-2">
          Boot a shareable environment in{' '}
          <span className="text-[#00E8C6]">milliseconds</span>.
        </h2>

        <div className="mt-12">
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  category.active
                    ? 'text-white border-b-2 border-[#00E8C6]'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {templates.map((template, index) => (
              <div
                key={index}
                className={`bg-[#23262f] p-6 rounded-lg hover:bg-opacity-50 transition-all cursor-pointer group`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={template.icon}
                      alt={template.name}
                      className="w-10 h-12 object-contain"
                    />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold group-hover:text-[#00E8C6] transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-400">{template.tech}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feature