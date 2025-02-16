import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";
import { Navbar } from "./LandingPage";

const SecurityFeatureCard = ({ title, description, features, icon }) => (
  <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="flex items-center mb-4">
      <span className="text-3xl mr-3">{icon}</span>
      <h3 className="font-['SF Pro Display'] text-xl font-bold text-black">{title}</h3>
    </div>
    <p className="text-gray-600 mb-4">{description}</p>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-gray-600">
          <span className="text-black mr-2">•</span>
          {feature}
        </li>
      ))}
    </ul>
  </div>
);

const TechnologyCard = ({ title, description, features, link }) => (
  <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
    <h3 className="font-['SF Pro Display'] text-xl font-bold text-black mb-4">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <ul className="space-y-2 mb-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-gray-600">
          <span className="text-black mr-2">•</span>
          {feature}
        </li>
      ))}
    </ul>
    <a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-black hover:text-gray-600 transition-colors font-medium"
    >
      Learn More →
    </a>
  </div>
);

export function SecurityPage() {
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
            Security Architecture
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our advanced P2P technology stack ensures your conversations remain private, secure, and decentralized.
          </p>
        </div>
      </section>

      {/* Core Technologies Section */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['SF Pro Display'] text-4xl font-bold text-center text-black mb-16" data-aos="fade-up">
            Core Security Technologies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TechnologyCard
              title="LibP2P Implementation"
              description="Our foundation for secure peer-to-peer communications"
              features={[
                "Noise protocol for secure channel establishment",
                "Multi-stream selection for protocol negotiation",
                "Peer routing and discovery mechanisms",
                "NAT traversal capabilities",
                "Multiplexed connections for efficient resource usage",
                "Connection encryption and authentication"
              ]}
              link="https://libp2p.io/"
            />
            <TechnologyCard
              title="WebRTC Security"
              description="Enterprise-grade security for real-time communications"
              features={[
                "DTLS (Datagram Transport Layer Security)",
                "SRTP for media encryption",
                "ICE framework for NAT traversal",
                "Perfect Forward Secrecy",
                "Built-in protection against man-in-the-middle attacks",
                "Secure key exchange protocols"
              ]}
              link="https://webrtc.org/"
            />
          </div>
        </div>
      </section>

      {/* Encryption Layers Section */}
      <section className="py-24 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['SF Pro Display'] text-4xl font-bold text-center text-black mb-16" data-aos="fade-up">
            Multi-Layer Encryption
          </h2>
          <div className="space-y-8">
            <SecurityFeatureCard
              title="Transport Layer Security"
              description="Secure communication channels between peers"
              icon="🔐"
              features={[
                "TLS 1.3 protocol implementation",
                "Perfect Forward Secrecy (PFS)",
                "Strong cipher suites",
                "Certificate pinning",
                "Automatic key rotation",
                "Protection against downgrade attacks"
              ]}
            />
            <SecurityFeatureCard
              title="Message Layer Security"
              description="End-to-end encryption for all messages"
              icon="📨"
              features={[
                "Double Ratchet Algorithm implementation",
                "Post-quantum cryptography readiness",
                "Zero-knowledge message verification",
                "Secure group messaging protocols",
                "Message integrity verification",
                "Encrypted metadata"
              ]}
            />
            <SecurityFeatureCard
              title="File Transfer Security"
              description="Secure file sharing using Helia"
              icon="📁"
              features={[
                "Content-addressed storage",
                "Deduplication for efficiency",
                "Encrypted file chunks",
                "Distributed storage network",
                "Secure file verification",
                "Access control mechanisms"
              ]}
            />
          </div>
        </div>
      </section>

      {/* P2P Network Security Section */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['SF Pro Display'] text-4xl font-bold text-center text-black mb-16" data-aos="fade-up">
            P2P Network Security
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SecurityFeatureCard
              title="Peer Discovery"
              description="Secure peer discovery and connection"
              icon="🔍"
              features={[
                "DHT-based peer discovery",
                "Bootstrap node verification",
                "Peer blacklisting capabilities",
                "Secure peer routing",
                "Connection rate limiting"
              ]}
            />
            <SecurityFeatureCard
              title="Network Resilience"
              description="Protection against network attacks"
              icon="🛡️"
              features={[
                "DDoS protection mechanisms",
                "Circuit breaker patterns",
                "Automatic peer selection",
                "Network segmentation",
                "Bandwidth management"
              ]}
            />
            <SecurityFeatureCard
              title="Identity Management"
              description="Secure peer identification system"
              icon="👤"
              features={[
                "Public key infrastructure",
                "Identity verification",
                "Reputation system",
                "Revocation mechanisms",
                "Identity privacy protection"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-24 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['SF Pro Display'] text-4xl font-bold text-center text-black mb-16" data-aos="fade-up">
            Advanced Security Features
          </h2>
          <div className="space-y-8">
            <SecurityFeatureCard
              title="Privacy Enhancements"
              description="Additional privacy features"
              icon="🕶️"
              features={[
                "Metadata minimization",
                "Traffic analysis prevention",
                "Anonymous routing options",
                "Private group messaging",
                "Secure contact discovery",
                "Message unlinkability"
              ]}
            />
            <SecurityFeatureCard
              title="Audit & Compliance"
              description="Security auditing capabilities"
              icon="📋"
              features={[
                "Security event logging",
                "Compliance reporting",
                "Regular security audits",
                "Penetration testing",
                "Vulnerability assessments",
                "Security certifications"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Security Commitment Section */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <h2 className="font-['SF Pro Display'] text-4xl font-bold text-black mb-8">
            Our Security Commitment
          </h2>
          <p className="text-gray-600 mb-8">
            We are committed to maintaining the highest standards of security and privacy. 
            Our platform undergoes regular security audits and penetration testing to ensure 
            your data remains protected. We continuously monitor and update our security 
            measures to stay ahead of emerging threats.
          </p>
          <Link
            to="/docs"
            className="font-['SF Pro Display'] bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-all duration-300 inline-block"
          >
            View Technical Documentation
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