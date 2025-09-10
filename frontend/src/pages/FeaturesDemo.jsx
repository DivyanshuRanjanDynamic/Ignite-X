import React, { useState } from 'react';
import FeaturesShowcase from '../components/FeaturesShowcase';
import SimpleFeaturesShowcase from '../components/SimpleFeaturesShowcase';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesDemo = () => {
  const [showFullFeatures, setShowFullFeatures] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Features Showcase Demo</h1>
              <p className="text-gray-600">White theme features dropdown components</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Demo Section 1: Full Features Showcase */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Full Features Showcase</h2>
            <p className="text-gray-600">Large dropdown with 9 features in a 3x3 grid layout</p>
          </div>
          
          <div className="flex items-center gap-4">
            <FeaturesShowcase 
              isOpen={showFullFeatures} 
              onToggle={() => setShowFullFeatures(!showFullFeatures)} 
            />
            <span className="text-sm text-gray-500">← Click to see the full features dropdown</span>
          </div>
        </div>

        {/* Demo Section 2: Simple Features Showcase */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Simple Features Showcase</h2>
            <p className="text-gray-600">Compact dropdown with 6 features in a 2x3 grid layout</p>
          </div>
          
          <div className="flex items-center gap-4">
            <SimpleFeaturesShowcase />
            <span className="text-sm text-gray-500">← Click to see the simple features dropdown</span>
          </div>
        </div>

        {/* Integration Examples */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Integration Examples</h2>
          
          {/* Navbar Integration Example */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">1. Navbar Integration</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between bg-white rounded-lg px-6 py-3 shadow-sm">
                <div className="flex items-center gap-8">
                  <div className="text-lg font-bold text-blue-600">PM Internship AI</div>
                  <nav className="flex items-center gap-6">
                    <SimpleFeaturesShowcase />
                    <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Solutions</a>
                    <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Pricing</a>
                    <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
                  </nav>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-gray-700 hover:text-blue-600 font-medium">Login</button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Landing Page Hero Integration */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">2. Landing Page Hero Integration</h3>
            <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg p-8 text-white">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-bold mb-4">
                  Find Your Perfect Internship with AI
                </h1>
                <p className="text-blue-100 mb-6 text-lg">
                  Get personalized internship recommendations, track applications, and accelerate your career with our AI-powered platform.
                </p>
                <div className="flex items-center gap-4">
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Start Free Trial
                  </button>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg">
                    <FeaturesShowcase 
                      isOpen={false} 
                      onToggle={() => {}} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">3. Code Examples</h3>
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-4 text-green-400 text-sm font-mono overflow-x-auto">
                <div className="text-gray-400">// Simple integration in Navbar</div>
                <div>import SimpleFeaturesShowcase from './components/SimpleFeaturesShowcase';</div>
                <br />
                <div>&lt;nav className="flex items-center gap-6"&gt;</div>
                <div className="ml-4">&lt;SimpleFeaturesShowcase /&gt;</div>
                <div className="ml-4">&lt;a href="#"&gt;Solutions&lt;/a&gt;</div>
                <div className="ml-4">&lt;a href="#"&gt;Pricing&lt;/a&gt;</div>
                <div>&lt;/nav&gt;</div>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 text-green-400 text-sm font-mono overflow-x-auto">
                <div className="text-gray-400">// Full showcase with state control</div>
                <div>const [isOpen, setIsOpen] = useState(false);</div>
                <br />
                <div>&lt;FeaturesShowcase</div>
                <div className="ml-4">isOpen={`{isOpen}`}</div>
                <div className="ml-4">onToggle={`{() => setIsOpen(!isOpen)}`}</div>
                <div>/&gt;</div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Notes */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3">📝 Usage Notes</h3>
          <ul className="space-y-2 text-blue-700 text-sm">
            <li>• <strong>FeaturesShowcase:</strong> Use for prominent feature displays (900px wide)</li>
            <li>• <strong>SimpleFeaturesShowcase:</strong> Use for navbar integration (600px wide)</li>
            <li>• Both components use Framer Motion for smooth animations</li>
            <li>• Components are fully responsive and match your blue/orange theme</li>
            <li>• Features can be easily customized by editing the features array</li>
            <li>• Click outside the dropdown to close it</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeaturesDemo;
