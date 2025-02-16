import React, { useState, useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/signup', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        sessionStorage.setItem('symmetricKey', response.data.symmetric_key);
        toast.success("Account created successfully!");
        navigate('/signin');
      }
    } catch (err) {
      console.error('Signup error:', err);
      toast.error(err.response?.data || 'Failed to create account');
      setError(err.response?.data || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center lg:justify-between">
        {/* Welcome Section */}
        <div
          className="text-center lg:text-left lg:w-1/2 mb-8 lg:mb-0 px-8"
          data-aos="fade-right"
        >
          <h1 className="font-['SF Pro Display'] text-5xl font-bold text-black">
            Welcome to <span className="text-black">WebChat</span>
          </h1>
          <p className="font-['SF Pro Display'] text-gray-600 mt-6 text-lg leading-relaxed">
            Join our secure platform for private and rewarding conversations. Experience the future of communication.
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
            Create Your Account
          </h2>
          
          {/* Show error message if exists */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mb-4">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="font-['SF Pro Display'] block text-sm text-gray-600 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="font-['SF Pro Display'] w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="font-['SF Pro Display'] block text-sm text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="font-['SF Pro Display'] w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="font-['SF Pro Display'] block text-sm text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="font-['SF Pro Display'] w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="font-['SF Pro Display'] text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/signin" className="text-black hover:text-gray-600 transition-colors duration-300">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
