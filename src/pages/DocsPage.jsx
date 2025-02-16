import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";
import { Navbar } from "./LandingPage";

const DocSection = ({ title, content, icon }) => (
  <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="flex items-center mb-6">
      <span className="text-3xl mr-3">{icon}</span>
      <h3 className="font-['SF Pro Display'] text-2xl font-bold text-black">{title}</h3>
    </div>
    <div className="space-y-4">
      {content.map((item, index) => (
        <div key={index} className="text-gray-600">
          {item}
        </div>
      ))}
    </div>
  </div>
);

const TechStack = ({ name, description, link }) => (
  <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
    <h4 className="font-['SF Pro Display'] text-xl font-bold text-black mb-3">{name}</h4>
    <p className="text-gray-600 mb-4">{description}</p>
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-black hover:text-gray-600 transition-colors"
    >
      Learn More →
    </a>
  </div>
);

export function DocsPage() {
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
      <section className="relative pt-32 pb-24 text-center overflow-hidden bg-gray-50">
        <div className="relative z-10 mt-20 mb-20" data-aos="fade-up">
          <h1 className="font-['SF Pro Display'] text-6xl font-bold text-black">
            Documentation
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive documentation to understand the technology stack and security features that power WebChat.
          </p>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['SF Pro Display'] text-4xl font-bold text-center text-black mb-16" data-aos="fade-up">
            Getting Started
          </h2>
          <div className="space-y-8">
            <DocSection
              title="1. Create an Account"
              icon="👤"
              content={[
                "Sign up using your email or blockchain wallet",
                "Verify your account through secure authentication",
                "Set up your profile and security preferences",
                "Enable two-factor authentication (recommended)"
              ]}
            />
            <DocSection
              title="2. Join or Create a Room"
              icon="🚪"
              content={[
                "Browse available public rooms",
                "Create private rooms with custom settings",
                "Invite others using secure invitation links",
                "Set room permissions and security levels"
              ]}
            />
            <DocSection
              title="3. Start Chatting Securely"
              icon="💬"
              content={[
                "Begin encrypted conversations",
                "Share files securely",
                "Use voice and video features",
                "Customize your chat experience"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-24 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['SF Pro Display'] text-4xl font-bold text-center text-black mb-16" data-aos="fade-up">
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TechStack
              name="React"
              description="Frontend library for building user interfaces with reusable components and efficient state management."
              link="https://reactjs.org/"
            />
            <TechStack
              name="Tailwind CSS"
              description="Utility-first CSS framework enabling rapid UI development with highly customizable design system."
              link="https://tailwindcss.com/"
            />
            <TechStack
              name="Vite"
              description="Modern build tool offering lightning-fast development server and optimized production builds."
              link="https://vitejs.dev/"
            />
            <TechStack
              name="React Router"
              description="Standard routing library for React applications with dynamic routing capabilities."
              link="https://reactrouter.com/"
            />
            <TechStack
              name="AOS"
              description="Animate On Scroll library providing smooth and customizable scroll animations."
              link="https://michalsnik.github.io/aos/"
            />
            <TechStack
              name="Framer Motion"
              description="Production-ready motion library for React, enabling fluid animations and gestures."
              link="https://www.framer.com/motion/"
            />
          </div>
        </div>
      </section>

      {/* Security Features Section */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['SF Pro Display'] text-4xl font-bold text-center text-black mb-16" data-aos="fade-up">
            Security Features
          </h2>
          <div className="space-y-8">
            <DocSection
              title="End-to-End Encryption"
              icon="🔒"
              content={[
                "All messages are encrypted using state-of-the-art cryptographic protocols",
                "Perfect forward secrecy ensures past communications remain secure",
                "Zero-knowledge architecture means we never have access to your messages",
                "Client-side encryption for all file transfers"
              ]}
            />
            <DocSection
              title="P2P Architecture"
              icon="🌐"
              content={[
                "Direct peer-to-peer connections eliminate central points of failure",
                "Distributed network ensures high availability and resilience",
                "No message storage on central servers",
                "Automatic peer discovery and connection establishment"
              ]}
            />
            <DocSection
              title="Privacy Controls"
              icon="🛡️"
              content={[
                "Granular privacy settings for user profiles and rooms",
                "Anonymous messaging options",
                "Self-destructing messages feature",
                "Customizable data retention policies"
              ]}
            />
          </div>
        </div>
      </section>

      {/* API Documentation Section */}
      <section className="py-24 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['SF Pro Display'] text-4xl font-bold text-center text-black mb-16" data-aos="fade-up">
            API Documentation
          </h2>
          <div className="space-y-8">
            <DocSection
              title="WebSocket API"
              icon="🔌"
              content={[
                "Real-time message delivery and synchronization",
                "Event-based communication protocol",
                "Automatic reconnection handling",
                "Message queuing and delivery guarantees"
              ]}
            />
            <DocSection
              title="REST API"
              icon="📡"
              content={[
                "User authentication and management",
                "Room creation and configuration",
                "File upload and management",
                "User presence and status updates"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <h2 className="font-['SF Pro Display'] text-4xl font-bold text-black mb-8">
            Need Help?
          </h2>
          <p className="text-gray-600 mb-8">
            Our support team is always ready to help you with any questions or issues you might have.
            Join our community channels or reach out to our support team directly.
          </p>
          <Link
            to="/contact"
            className="font-['SF Pro Display'] bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-all duration-300 inline-block"
          >
            Contact Support
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 font-['SF Pro Display']">
        <p>© 2024 WebChat. All Rights Reserved.</p>
      </footer>
    </div>
  );
} 