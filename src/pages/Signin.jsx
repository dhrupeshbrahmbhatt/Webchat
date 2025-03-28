import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { FaUserAlt } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';

export const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing auth token when component mounts
    const checkAuthStatus = async () => {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(cookie => cookie.trim().startsWith('Auth='));
      
      if (authCookie) {
        const token = authCookie.split('=')[1];
        try {
          const response = await axios.get('http://localhost:3000/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.data.user) {
            // User is already authenticated, redirect to dashboard
            sessionStorage.setItem('user', JSON.stringify(response.data.user));
            sessionStorage.setItem('symmetric_key', response.data.user.symmetric_key);
            navigate('/dashboard');
          }
        } catch (error) {
          // If token is invalid, clear the cookie
          document.cookie = "Auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          console.log("Invalid or expired token");
        }
      }
    };

    checkAuthStatus();
    AOS.init({ duration: 800 });
  }, [navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/signin", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        const { token, symmetric_key } = response.data;
        document.cookie = `Auth=${token}; path=/; secure; samesite=strict;`;
        sessionStorage.setItem('symmetric_key', symmetric_key);
        toast.success("Login Successful!");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error(error.response?.data || "Failed to sign in");
      setError(error.response?.data || "Invalid credentials or server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Toaster position="top-center" reverseOrder={false}/>
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center lg:justify-between">
        {/* Welcome Section */}
        <div
          className="text-center lg:text-left lg:w-1/2 mb-8 lg:mb-0 px-8"
          data-aos="fade-right"
        >
          <h1 className="font-['SF Pro Display'] text-5xl font-bold text-black">
            Welcome Back to <span className="text-black">WebChat</span>
          </h1>
          <p className="font-['SF Pro Display'] text-gray-600 mt-6 text-lg leading-relaxed">
            Continue your secure messaging journey with next-generation privacy.
          </p>
        </div>

        {/* Form Section */}
        <div
          className="bg-gray-50 p-8 rounded-2xl shadow-sm w-full max-w-md lg:w-1/2 mx-4"
          data-aos="fade-left"
        >
          <div className="flex justify-center items-center">
            <FaUserAlt className="text-black text-4xl mb-6" />
          </div>
          <h2 className="font-['SF Pro Display'] text-3xl font-bold text-center text-black mb-8">
            Sign In to Your Account
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="font-['SF Pro Display'] block text-sm text-gray-600 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="font-['SF Pro Display'] w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="font-['SF Pro Display'] block text-sm text-gray-600 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="font-['SF Pro Display'] w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="font-['SF Pro Display'] w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
          <p className="font-['SF Pro Display'] text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-black hover:text-gray-600 transition-colors duration-300"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
