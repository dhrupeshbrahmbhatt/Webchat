// src/App.js
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import AOS from "aos";
import "aos/dist/aos.css";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10" data-aos="fade-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/docs"
              className="font-['Graphik'] text-gray-300 hover:text-white transition-colors duration-300 text-base font-medium"
            >
              Docs
            </Link>
            <Link
              to="/rewards"
              className="font-['Graphik'] text-gray-300 hover:text-white transition-colors duration-300 text-base font-medium"
            >
              Rewards System
            </Link>
          </div>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
          >
            <span className="font-['Freight_Disp_Pro'] text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              WebChat
            </span>
          </Link>

          {/* Right Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/security"
              className="font-['Graphik'] text-gray-300 hover:text-white transition-colors duration-300 text-base font-medium"
            >
              Security
            </Link>
            <Link
              to="/signup"
              className="font-['Graphik'] bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-base font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
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
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-screen font-['Graphik']">
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/30 to-blue-800/30 z-0"></div>
        <div className="relative z-10 mt-20 mb-20" data-aos="fade-up">
          <h1 className="font-['Freight_Disp_Pro'] text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Secure Conversations. Powered by Blockchain.
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Experience seamless, decentralized messaging with privacy, innovation, and rewards.
          </p>
          <div className="mt-10">
            <button className="font-['Graphik'] bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-8 rounded-full mr-6 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300">
              Get Started
            </button>
            <button className="font-['Graphik'] border-2 border-white/20 text-white py-3 px-8 rounded-full hover:bg-white/10 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black/20">
        <h2 className="font-['Freight_Disp_Pro'] text-6xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent" data-aos="fade-up">
          Why Choose WebChat?
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8 max-w-7xl mx-auto">
          <div data-aos="fade-up" data-aos-delay="100"><FeatureCard title="Decentralized Messaging" description="No middleman." /></div>
          <div data-aos="fade-up" data-aos-delay="200"><FeatureCard title="Privacy First" description="End-to-end encryption." /></div>
          <div data-aos="fade-up" data-aos-delay="300"><FeatureCard title="Rewards System" description="Incentivize positive engagement." /></div>
          <div data-aos="fade-up" data-aos-delay="400"><FeatureCard title="Blockchain Security" description="Robust and tamper-proof." /></div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-8 bg-gradient-to-b from-slate-800 to-slate-900">
        <h2 className="font-['Freight_Disp_Pro'] text-6xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent" data-aos="fade-up">
          How It Works
        </h2>
        <div className="mt-12 space-y-6 max-w-3xl mx-auto">
          <div data-aos="fade-right" data-aos-delay="100"><Step number="1" text="Sign up using a blockchain wallet or email." /></div>
          <div data-aos="fade-right" data-aos-delay="200"><Step number="2" text="Start chatting securely with peers." /></div>
          <div data-aos="fade-right" data-aos-delay="300"><Step number="3" text="Earn rewards for positive interactions." /></div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-8 bg-black/20">
        <h2 className="font-['Freight_Disp_Pro'] text-6xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-20" data-aos="fade-up">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div data-aos="fade-up" data-aos-delay="100"><Testimonial name="Sarah Chen" role="Blockchain Developer" quote="WebChat has revolutionized how our team communicates. The security features are unmatched, and the rewards system keeps everyone engaged." image="https://randomuser.me/api/portraits/men/1.jpg" /></div>
          <div data-aos="fade-up" data-aos-delay="200"><Testimonial name="Michael Roberts" role="Crypto Entrepreneur" quote="Finally, a messaging platform that takes privacy seriously. The blockchain integration is seamless, and the UI is absolutely stunning." image="https://randomuser.me/api/portraits/men/4.jpg" /></div>
          <div data-aos="fade-up" data-aos-delay="300"><Testimonial name="Elena Martinez" role="Security Analyst" quote="As a security professional, I'm impressed by WebChat's commitment to user privacy and data protection. It's the future of secure communication." image="https://randomuser.me/api/portraits/women/8.jpg" /></div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-8 bg-black/20">
        <h2 className="font-['Freight_Disp_Pro'] text-5xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent" data-aos="fade-up">
          Get in Touch
        </h2>
        <form className="mt-12 max-w-lg mx-auto" data-aos="fade-up" data-aos-delay="100">
          <input
            type="text"
            placeholder="Name"
            className="font-['Graphik'] block w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="font-['Graphik'] block w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <textarea
            placeholder="Message"
            className="font-['Graphik'] block w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 mb-6 h-14 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button type="submit" className="font-['Graphik'] w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300">
            Submit
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black/40 text-center text-gray-400 font-['Graphik']">
        <p>© 2024 WebChat. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, description }) => (
  <div className="p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300">
    <h3 className="font-['Freight_Disp_Pro'] text-xl font-bold text-white">{title}</h3>
    <p className="mt-3 text-gray-400">{description}</p>
  </div>
);

const Step = ({ number, text }) => (
  <div className="flex items-center space-x-6 bg-white/5 p-6 rounded-xl border border-white/10">
    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
      {number}
    </div>
    <p className="text-gray-300 text-lg">{text}</p>
  </div>
);

const Testimonial = ({ name, role, quote, image }) => (
  <div className="p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 flex flex-col items-center text-center">
    <div className="relative mb-6">
      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500/50">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xl">"</span>
      </div>
    </div>
    <p className="text-gray-300 italic mb-6">
      {quote}
    </p>
    <div>
      <h4 className="font-bold text-white">{name}</h4>
      <p className="text-sm text-gray-400">{role}</p>
    </div>
  </div>
);
