import { motion } from "framer-motion";
import { Rocket, Users, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  // Sample featured internships (later connect to backend)
  const featuredInternships = [
    { id: 1, title: "Frontend Developer Intern", company: "Tech Corp", location: "Remote", stipend: "₹10,000", duration: "3 Months" },
    { id: 2, title: "AI Research Intern", company: "AI Labs", location: "Bangalore", stipend: "₹15,000", duration: "6 Months" },
    { id: 3, title: "Marketing Intern", company: "StartUpX", location: "Delhi", stipend: "₹8,000", duration: "2 Months" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-10 py-16 md:py-24 gap-10">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <h1 className="text-5xl font-extrabold text-blue-700 leading-tight">
            Unlock Internships <br /> Tailored For You 🚀
          </h1>
          <p className="mt-6 text-lg text-gray-700 max-w-lg">
            Ignite-X connects students with the right opportunities based on
            their skills, background, and aspirations. Whether you’re from a
            rural or urban area, we make sure the right door opens for you.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-blue-600 text-white text-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="px-6 py-3 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Image */}
        <motion.img
          src="/src/assets/hero.png"
          alt="Internship illustration"
          className="max-w-[300px] w-full h-auto mx-auto"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.0 }}
        />
      </section>

      {/* Features Section */}
      <section id="features" className="px-10 py-20 bg-blue-50">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center text-blue-700 mb-14"
        >
          Why Choose Ignite-X?
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Card 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-2xl p-8 text-center"
          >
            <Rocket className="mx-auto h-12 w-12 text-blue-600" />
            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              Smart Matching
            </h3>
            <p className="mt-3 text-gray-600">
              Get internship opportunities recommended by AI tailored to your
              profile.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-2xl p-8 text-center"
          >
            <Users className="mx-auto h-12 w-12 text-blue-600" />
            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              Equal Access
            </h3>
            <p className="mt-3 text-gray-600">
              Bridging the gap between rural and urban students with fair
              opportunities.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-2xl p-8 text-center"
          >
            <GraduationCap className="mx-auto h-12 w-12 text-blue-600" />
            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              Skill Growth
            </h3>
            <p className="mt-3 text-gray-600">
              Resources and mentorship that help you grow while finding the
              perfect role.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-10 py-20">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center text-blue-700 mb-14"
        >
          How It Works
        </motion.h2>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.img
            src="/src/assets/features.png"
            alt="Features illustration"
            className="w-full md:w-[450px]"
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />

          <ul className="space-y-8 text-lg">
            <li>
              <span className="font-semibold text-blue-600">1.</span> Sign up
              and create your profile.
            </li>
            <li>
              <span className="font-semibold text-blue-600">2.</span> Fill in
              your background, skills, and preferences.
            </li>
            <li>
              <span className="font-semibold text-blue-600">3.</span> Receive
              AI-powered internship recommendations.
            </li>
            <li>
              <span className="font-semibold text-blue-600">4.</span> Apply &
              track progress from your dashboard.
            </li>
          </ul>
        </div>
      </section>

      {/* Featured Internships Preview */}
      <section className="px-10 py-20 bg-blue-50">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center text-blue-700 mb-14"
        >
          Featured Internships
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredInternships.map((internship) => (
            <motion.div
              key={internship.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-semibold text-blue-600">
                {internship.title}
              </h3>
              <p className="text-gray-600">{internship.company}</p>
              <p className="mt-2 text-sm">📍 {internship.location}</p>
              <p className="text-sm">💰 {internship.stipend}</p>
              <p className="text-sm">⏳ {internship.duration}</p>

              <Link
                to={`/internship/${internship.id}`}
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Details
              </Link>
            </motion.div>
          ))}
        </div>

        {/* See More Button */}
        <div className="text-center mt-10">
          <Link
            to="/internships"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse All Internships
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white px-10 py-8 mt-12 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Ignite-X. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
