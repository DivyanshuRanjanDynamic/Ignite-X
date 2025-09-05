import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    education: "",
    domain: "",
    skills: [],
    location: "",
    interests: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("User Data:", formData);
  };

  const stepTitles = [
    "👤 Basic Info",
    "🎓 Education & Skills",
    "📍 Location & Interests",
    "📄 Resume & Security",
  ];

  const domains = [
    { label: "IT", icon: "💻" },
    { label: "Education", icon: "📚" },
    { label: "Healthcare", icon: "🏥" },
    { label: "Construction", icon: "🏗️" },
    { label: "Creative Arts", icon: "🎨" },
    { label: "Others", icon: "🌍" },
  ];

  const skillsList = [
    { label: "Web Development", icon: "💻" },
    { label: "Graphic Design", icon: "🎨" },
    { label: "Data Entry", icon: "⌨️" },
    { label: "Digital Marketing", icon: "📢" },
    { label: "Cooking", icon: "🍳" },
    { label: "Tailoring", icon: "✂️" },
    { label: "Driving", icon: "🚗" },
    { label: "Carpentry", icon: "🔨" },
    { label: "Electrical Work", icon: "⚡" },
    { label: "Plumbing", icon: "🚿" },
    { label: "Tutoring", icon: "📚" },
    { label: "Nursing", icon: "🏥" },
    { label: "Sales", icon: "💼" },
    { label: "Customer Support", icon: "🎧" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-white">
      <Navbar />

      {/* Progress Tracker */}
      <div className="flex justify-center mt-6 mb-2">
        <div className="flex space-x-4">
          {stepTitles.map((title, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  step === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <span className="text-sm mt-1 text-gray-700 text-center">
                {title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="flex flex-1 items-center justify-center px-6 py-6 md:px-16">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* STEP 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-5"
                >
                  <h2 className="text-2xl font-bold text-blue-700 mb-4">
                    👤 Basic Information
                  </h2>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
                    >
                      Continue →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Education, Domain, Skills */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-5"
                >
                  <h2 className="text-2xl font-bold text-blue-700 mb-4">
                    🎓 Education, Domain & Skills
                  </h2>

                  {/* Education */}
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
                    required
                  >
                    <option value="">Select Education Level</option>
                    <option value="highschool">High School</option>
                    <option value="undergrad">Undergraduate</option>
                    <option value="postgrad">Postgraduate</option>
                    <option value="other">Other</option>
                  </select>

                  {/* Domain Selection */}
                  <h3 className="text-lg font-semibold text-blue-600">
                    🌍 Choose Your Domain
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {domains.map((domain) => {
                      const isSelected = formData.domain === domain.label;
                      return (
                        <button
                          type="button"
                          key={domain.label}
                          onClick={() =>
                            setFormData({ ...formData, domain: domain.label })
                          }
                          className={`flex items-center justify-center p-3 border rounded-xl text-lg transition 
                            ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-gray-100 hover:bg-gray-200"
                            }`}
                        >
                          <span className="mr-2">{domain.icon}</span>{" "}
                          {domain.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Skills Selection */}
                  <h3 className="text-lg font-semibold text-blue-600">
                    💼 Choose Your Skills
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {skillsList.map((skill) => {
                      const isSelected = formData.skills.includes(skill.label);
                      return (
                        <button
                          type="button"
                          key={skill.label}
                          onClick={() => {
                            const newSkills = isSelected
                              ? formData.skills.filter((s) => s !== skill.label)
                              : [...formData.skills, skill.label];
                            setFormData({ ...formData, skills: newSkills });
                          }}
                          className={`flex items-center justify-center p-3 border rounded-xl text-sm md:text-lg transition 
                            ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-gray-100 hover:bg-gray-200"
                            }`}
                        >
                          <span className="mr-2">{skill.icon}</span>{" "}
                          {skill.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-2 bg-gray-300 rounded-xl shadow hover:bg-gray-400 transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
                    >
                      Continue →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Location & Interests */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-5"
                >
                  <h2 className="text-2xl font-bold text-blue-700 mb-4">
                    📍 Location & Interests
                  </h2>
                  <input
                    type="text"
                    name="location"
                    placeholder="Your City, State"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="text"
                    name="interests"
                    placeholder="Your Interests (e.g. Web Dev, AI)"
                    value={formData.interests}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-2 bg-gray-300 rounded-xl shadow hover:bg-gray-400 transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
                    >
                      Continue →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Resume & Security */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-5"
                >
                  <h2 className="text-2xl font-bold text-blue-700 mb-4">
                    📄 Upload Resume (Optional)
                  </h2>
                  <p className="text-gray-600 mb-3">
                    Don’t have a resume? No worries — you can{" "}
                    <span className="text-blue-600 font-semibold">
                      create one easily
                    </span>{" "}
                    after signup!
                  </p>
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    className="w-full p-2 border rounded-xl mb-4"
                  />

                  <h3 className="text-lg font-semibold text-blue-600">
                    🔑 Secure Your Account
                  </h3>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 mb-3"
                    required
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 mb-3"
                    required
                  />

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-2 bg-gray-300 rounded-xl shadow hover:bg-gray-400 transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
                    >
                      ✅ Finish
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;
