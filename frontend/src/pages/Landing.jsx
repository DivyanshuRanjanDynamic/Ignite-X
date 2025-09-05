import { motion } from "framer-motion";
import { Brain, Users, MapPin, Star, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  // Sample featured internships aligned with PM Internship Scheme
  const featuredInternships = [
    { 
      id: 1, 
      title: "Digital India Intern", 
      company: "Ministry of Electronics & IT", 
      location: "Remote", 
      stipend: "₹12,000", 
      duration: "3 Months",
      category: "Government",
      match: "95%"
    },
    { 
      id: 2, 
      title: "Rural Development Intern", 
      company: "Ministry of Rural Development", 
      location: "Delhi", 
      stipend: "₹10,000", 
      duration: "6 Months",
      category: "Social Impact",
      match: "92%"
    },
    { 
      id: 3, 
      title: "Skill Development Intern", 
      company: "Ministry of Skill Development", 
      location: "Mumbai", 
      stipend: "₹8,000", 
      duration: "4 Months",
      category: "Education",
      match: "88%"
    },
  ];

  const stats = [
    { number: "50K+", label: "Students Helped" },
    { number: "500+", label: "Internships Available" },
    { number: "95%", label: "Match Accuracy" },
    { number: "28", label: "States Covered" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-10 py-16 md:py-24 gap-10">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-4">
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered Recommendations
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-blue-700 leading-tight">
            Find Your Perfect <br />
            <span className="text-orange-600">PM Internship</span> Match
          </h1>
          <p className="mt-6 text-lg text-gray-700 max-w-lg">
            Our AI recommendation engine helps students from rural areas, tribal districts, 
            and remote colleges find the most suitable internships based on their skills, 
            location, and aspirations. No more endless searching!
          </p>
          
          {/* Key Benefits */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>3-5 personalized recommendations</span>
            </div>
            <div className="flex items-center text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>Works on mobile devices</span>
            </div>
            <div className="flex items-center text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>Simple, user-friendly interface</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition text-lg font-semibold"
            >
              See How It Works
            </a>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.0 }}
          className="flex-1 flex justify-center"
        >
          <img
            src="/src/assets/hero.png"
            alt="AI Recommendation Engine"
            className="max-w-[400px] w-full h-auto"
          />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-6 md:px-10 py-12 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-600">{stat.number}</div>
              <div className="text-gray-600 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 md:px-10 py-20 bg-blue-50">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-4"
        >
          Why Choose Our AI Recommendation Engine?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-14 max-w-2xl mx-auto"
        >
          Designed specifically for the PM Internship Scheme to help students from all backgrounds
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white shadow-lg rounded-2xl p-8 text-center border border-blue-100"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              AI-Powered Matching
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our intelligent algorithm analyzes your skills, location, and preferences to suggest 
              the most relevant internships from hundreds of available opportunities.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white shadow-lg rounded-2xl p-8 text-center border border-orange-100"
          >
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Location-Aware
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Perfect for students from rural areas and remote colleges. We consider your location 
              and suggest internships that are accessible to you.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white shadow-lg rounded-2xl p-8 text-center border border-green-100"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Inclusive Design
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Simple interface designed for first-generation learners with minimal digital exposure. 
              Works perfectly on mobile devices with regional language support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 md:px-10 py-20 bg-white">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-4"
        >
          How Our AI Recommendation Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-14 max-w-2xl mx-auto"
        >
          Simple steps to get your personalized internship recommendations
        </motion.p>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="/src/assets/features.png"
                alt="AI Recommendation Process"
                className="w-full max-w-md mx-auto"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Your Profile</h3>
                  <p className="text-gray-600">Sign up and tell us about your education, skills, and location preferences.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis</h3>
                  <p className="text-gray-600">Our algorithm analyzes your profile against hundreds of available internships.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Recommendations</h3>
                  <p className="text-gray-600">Receive 3-5 personalized internship suggestions that match your profile.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Apply & Track</h3>
                  <p className="text-gray-600">Apply to your chosen internships and track your application progress.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Internships Preview */}
      <section className="px-6 md:px-10 py-20 bg-blue-50">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-4"
        >
          Featured PM Internship Opportunities
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-14 max-w-2xl mx-auto"
        >
          Sample internships that our AI recommendation engine can help you discover
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuredInternships.map((internship) => (
            <motion.div
              key={internship.id}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {internship.category}
                </span>
                <div className="flex items-center text-green-600">
                  <Star className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{internship.match} Match</span>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {internship.title}
              </h3>
              <p className="text-gray-600 mb-4">{internship.company}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{internship.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-sm">💰 {internship.stipend}/month</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-sm">⏳ {internship.duration}</span>
                </div>
              </div>

              <Link
                to={`/internship/${internship.id}`}
                className="w-full inline-block text-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
              >
                View Details
              </Link>
            </motion.div>
          ))}
        </div>

        {/* See More Button */}
        <div className="text-center mt-12">
          <Link
            to="/internships"
            className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold text-lg inline-flex items-center"
          >
            Browse All Internships
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white px-6 md:px-10 py-12 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PM Internship AI</h3>
              <p className="text-blue-100 leading-relaxed">
                Empowering students from rural areas and remote colleges with AI-powered 
                internship recommendations for the PM Internship Scheme.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-blue-100">
                <li><Link to="/register" className="hover:text-white transition">Get Started</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
                <li><Link to="/internships" className="hover:text-white transition">Browse Internships</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-blue-100">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Regional Language Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-500 pt-8 text-center text-blue-100">
            <p>© {new Date().getFullYear()} PM Internship AI Recommendation Engine. All rights reserved.</p>
            <p className="mt-2 text-sm">Designed for the PM Internship Scheme - Bridging opportunities across India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
