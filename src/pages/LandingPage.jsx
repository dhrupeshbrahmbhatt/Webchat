// src/App.js
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import AOS from "aos";
import "aos/dist/aos.css";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100" data-aos="fade-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/docs"
              className="font-['SF Pro Display'] text-gray-600 hover:text-black transition-colors duration-300 text-base font-medium"
            >
              Docs
            </Link>
            <Link
              to="/rewards"
              className="font-['SF Pro Display'] text-gray-600 hover:text-black transition-colors duration-300 text-base font-medium"
            >
              Rewards
            </Link>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-['SF Pro Display'] text-4xl font-bold text-black">
              WebChat
            </span>
          </Link>

          {/* Right Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/security"
              className="font-['SF Pro Display'] text-gray-600 hover:text-black transition-colors duration-300 text-base font-medium"
            >
              Security
            </Link>
            <Link
              to="/signup"
              className="font-['SF Pro Display'] bg-black text-white px-6 py-2 rounded-full text-base font-medium hover:bg-gray-800 transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export const LandingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out',
    });
  }, []);

  return (
    <div className="bg-white text-black min-h-screen font-['SF Pro Display']">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 text-center overflow-hidden">
        <div className="relative z-10 mt-20 mb-20 max-w-4xl mx-auto px-4" data-aos="fade-up">
          <h1 className="font-['SF Pro Display'] text-7xl font-bold text-black leading-tight">
            The Future of <br />Human Connection
          </h1>
          <p className="mt-8 text-2xl text-gray-600 max-w-2xl mx-auto">
            Beautiful. Intuitive. Secure. The way messaging should be.
          </p>
          <div className="mt-12 space-x-6">
            <button className="font-['SF Pro Display'] bg-black text-white py-4 px-8 rounded-full text-lg font-medium hover:bg-gray-800 transition-all duration-300">
              Start Chatting
            </button>
            <button className="font-['SF Pro Display'] border-2 border-black text-black py-4 px-8 rounded-full text-lg font-medium hover:bg-black hover:text-white transition-all duration-300">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-['SF Pro Display'] text-5xl font-bold text-center text-black mb-20" data-aos="fade-up">
            Designed for the Future
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div data-aos="fade-up" data-aos-delay="100">
              <FeatureCard 
                title="Quantum-Safe Security" 
                description="Future-proof encryption that's ready for tomorrow."
              />
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <FeatureCard 
                title="Neural Interface Ready" 
                description="Prepared for next-gen communication methods."
              />
            </div>
            <div data-aos="fade-up" data-aos-delay="300">
              <FeatureCard 
                title="Zero Knowledge" 
                description="Your conversations are truly private."
              />
            </div>
            <div data-aos="fade-up" data-aos-delay="400">
              <FeatureCard 
                title="AI Enhanced" 
                description="Smart features that respect privacy."
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-black text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-['SF Pro Display'] text-5xl font-bold text-center mb-20" data-aos="fade-up">
            Simplicity Meets Innovation
          </h2>
          <div className="space-y-8">
            <div data-aos="fade-up" data-aos-delay="100">
              <Step number="01" text="Sign in with biometrics or your digital wallet." />
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <Step number="02" text="Connect with anyone, anywhere in the universe." />
            </div>
            <div data-aos="fade-up" data-aos-delay="300">
              <Step number="03" text="Experience communication at the speed of thought." />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white text-center">
        <p className="font-['SF Pro Display'] text-gray-600">
          © 2024 WebChat. Crafted for Humanity.
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, description }) => (
  <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
    <h3 className="font-['SF Pro Display'] text-xl font-bold text-black mb-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Step = ({ number, text }) => (
  <div className="flex items-center space-x-8 bg-white/10 p-8 rounded-2xl backdrop-blur-sm">
    <div className="text-3xl font-bold text-white">{number}</div>
    <p className="text-xl text-white">{text}</p>
  </div>
);
