import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    education: "",
    skills: "",
    location: "",
    interests: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("User Data:", formData);
    // Later: Send to backend API
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Section */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 md:px-16">
        <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
          
          {/* Left side - Illustration */}
          <div className="hidden md:flex w-1/2 bg-blue-100 items-center justify-center p-8">
            <img
              src="/src/assets/register.png"
              alt="Register Illustration"
              className="w-3/4"
            />
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">Create Your Account 🎓</h2>
            <p className="mb-6 text-gray-600">
              Register now to explore internships, projects, and skill-building opportunities.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />

              {/* Phone */}
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />

              {/* Password */}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />

              {/* Confirm Password */}
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />

              {/* Education Level */}
              <select
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Education Level</option>
                <option value="highschool">High School</option>
                <option value="undergrad">Undergraduate</option>
                <option value="postgrad">Postgraduate</option>
                <option value="other">Other</option>
              </select>

              {/* Skills */}
              <textarea
                name="skills"
                placeholder="Your Skills (e.g. React, Python, ML)"
                value={formData.skills}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                rows="3"
              />

              {/* Location */}
              <input
                type="text"
                name="location"
                placeholder="Location (City, State)"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />

              {/* Interests */}
              <input
                type="text"
                name="interests"
                placeholder="Interests (e.g. Web Dev, AI, Marketing)"
                value={formData.interests}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />

              {/* Resume Upload */}
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Register;
