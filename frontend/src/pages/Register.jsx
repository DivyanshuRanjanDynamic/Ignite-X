import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, MapPin, GraduationCap, User, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Register() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("User Data:", formData);
      setIsLoading(false);
      // Navigate to dashboard or show success message
    }, 2000);
  };

  const stepTitles = [
    { title: "Basic Info", icon: User, description: "Personal details" },
    { title: "Education & Skills", icon: GraduationCap, description: "Academic background" },
    { title: "Location & Interests", icon: MapPin, description: "Preferences" },
    { title: "Security", icon: Brain, description: "Account setup" },
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Navbar />

      {/* Header */}
      <div className="text-center py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Join PM Internship AI</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Create your profile to get personalized internship recommendations
          </p>
        </motion.div>
      </div>

      {/* Progress Tracker */}
      <div className="flex justify-center mb-8 px-4">
        <div className="flex space-x-2 md:space-x-8 max-w-4xl w-full">
          {stepTitles.map((stepInfo, index) => {
            const Icon = stepInfo.icon;
            const isActive = step === index + 1;
            const isCompleted = step > index + 1;
            
            return (
              <motion.div 
                key={index} 
                className="flex flex-col items-center flex-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg scale-110"
                      : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div className="text-center mt-2">
                  <span className={`text-sm font-medium ${
                    isActive ? "text-blue-600" : "text-gray-600"
                  }`}>
                    {stepInfo.title}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 hidden md:block">
                    {stepInfo.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <div className="flex flex-1 items-center justify-center px-4 py-6 md:px-8">
        <motion.div 
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-blue-100 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {/* STEP 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      Basic Information
                    </h2>
                    <p className="text-gray-600">Tell us about yourself</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
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
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      Complete Your Profile
                    </h2>
                    <p className="text-gray-600">Final step to get your AI recommendations</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        📄 Upload Resume (Optional)
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Don't have a resume? No worries — you can{" "}
                        <span className="text-blue-600 font-semibold">
                          create one easily
                        </span>{" "}
                        after signup!
                      </p>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition">
                        <input
                          type="file"
                          name="resume"
                          accept=".pdf,.doc,.docx"
                          onChange={handleChange}
                          className="hidden"
                          id="resume-upload"
                        />
                        <label htmlFor="resume-upload" className="cursor-pointer">
                          <div className="text-gray-400 mb-2">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className="text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-sm text-gray-400">PDF, DOC, DOCX (Max 10MB)</p>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        🔑 Secure Your Account
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                          </label>
                          <input
                            type="password"
                            name="password"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition flex items-center"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Creating Account...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Complete Registration
                        </div>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;
