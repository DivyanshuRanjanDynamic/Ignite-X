import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login:", { email, password, rememberMe });
    // Later: Authenticate with backend
    navigate("/student-dashboard");
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
              src="/src/assets/login.png"
              alt="Login Illustration"
              className="w-3/4"
            />
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">Welcome Back 👋</h2>
            <p className="mb-6 text-gray-600">
              Please login to continue exploring internships and opportunities.
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="mr-2"
                  />
                  Remember Me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Login
              </button>
            </form>

            {/* Social logins */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-3">Or continue with</p>
              <div className="flex justify-center space-x-4">
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                  Google
                </button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                  GitHub
                </button>
              </div>
            </div>

            {/* Register link */}
            <p className="mt-6 text-gray-600 text-center">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Login;
