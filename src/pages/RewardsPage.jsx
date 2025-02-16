import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";
import { Navbar } from "./LandingPage";

const TierCard = ({ tier, points, features, icon }) => (
  <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="flex items-center mb-6">
      <span className="text-3xl mr-3">{icon}</span>
      <h3 className="font-['SF Pro Display'] text-2xl font-bold text-black">{tier}</h3>
    </div>
    <div className="mb-6">
      <span className="text-lg text-gray-600">Required Points:</span>
      <span className="ml-2 text-2xl font-bold text-black">
        {points}
      </span>
    </div>
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-gray-600">
          <span className="text-black mr-2">•</span>
          {feature}
        </li>
      ))}
    </ul>
  </div>
);

const FeatureCard = ({ title, description, icon }) => (
  <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="flex items-center mb-4">
      <span className="text-2xl mr-3">{icon}</span>
      <h3 className="font-['SF Pro Display'] text-xl font-bold text-black">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

export function RewardsPage() {
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
            Rewards Program
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Earn points through positive interactions and unlock exclusive features. The more you contribute, the more you earn.
          </p>
        </div>
      </section>

      {/* Tiers Section */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['SF Pro Display'] text-4xl font-bold text-center text-black mb-16" data-aos="fade-up">
            Membership Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div data-aos="fade-up" data-aos-delay="100">
              <TierCard
                tier="Bronze"
                points="0"
                icon="🥉"
                features={[
                  "Basic chat features",
                  "100 messages per day",
                  "Standard support",
                  "Basic room creation",
                  "Public channels access"
                ]}
              />
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <TierCard
                tier="Silver"
                points="1000"
                icon="🥈"
                features={[
                  "Enhanced chat features",
                  "Unlimited messages",
                  "Priority support",
                  "Custom room themes",
                  "Private channels",
                  "File sharing up to 100MB"
                ]}
              />
            </div>
            <div data-aos="fade-up" data-aos-delay="300">
              <TierCard
                tier="Gold"
                points="5000"
                icon="🥇"
                features={[
                  "Premium features",
                  "Custom room themes",
                  "24/7 VIP support",
                  "Unlimited file sharing",
                  "Custom emojis",
                  "Voice channels",
                  "Priority server access"
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How to Earn Points Section */}
      <section className="py-24 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['SF Pro Display'] text-4xl font-bold text-center text-black mb-16" data-aos="fade-up">
            How to Earn Points
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div data-aos="fade-up" data-aos-delay="100">
              <FeatureCard
                icon="💬"
                title="Active Participation"
                description="Earn points by engaging in meaningful conversations and helping others in the community."
              />
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <FeatureCard
                icon="🎯"
                title="Daily Challenges"
                description="Complete daily tasks and challenges to earn bonus points and rewards."
              />
            </div>
            <div data-aos="fade-up" data-aos-delay="300">
              <FeatureCard
                icon="🌟"
                title="Quality Contributions"
                description="Get recognized for high-quality messages and helpful responses."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <h2 className="font-['SF Pro Display'] text-4xl font-bold text-black mb-8">
            Exclusive Benefits
          </h2>
          <p className="text-gray-600 mb-8">
            Our rewards program is designed to recognize and appreciate our most engaged users. 
            As you progress through the tiers, you'll unlock exclusive features, custom themes, 
            and special privileges that enhance your WebChat experience.
          </p>
          <Link
            to="/signup"
            className="font-['SF Pro Display'] bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-all duration-300 inline-block"
          >
            Join Now
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