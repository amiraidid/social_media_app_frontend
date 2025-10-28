import React from "react";
import { FaComments, FaUserFriends, FaLock, FaRocket } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 bg-black/20 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-indigo-400">ChatHub</h1>
        <div className="space-x-6 text-sm font-medium">
          <a href="#features" className="hover:text-indigo-400 transition">Features</a>
          <a href="#about" className="hover:text-indigo-400 transition">About</a>
          <a href="#contact" className="hover:text-indigo-400 transition">Contact</a>
          <button className="bg-indigo-500 hover:bg-indigo-600 px-5 py-2 rounded-full font-semibold transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col md:flex-row justify-center items-center flex-grow text-center md:text-left px-8"
      >
        <div className="max-w-lg">
          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            Connect. Chat. <span className="text-indigo-400">Grow Together.</span>
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            ChatHub brings people closer with real-time messaging, friend requests, and
            group interactions — all in one place.
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            <button className="bg-indigo-500 hover:bg-indigo-600 px-6 py-3 rounded-full font-semibold transition">
              Start Chatting
            </button>
            <button className="border border-indigo-400 hover:bg-indigo-400 hover:text-white px-6 py-3 rounded-full font-semibold transition">
              Learn More
            </button>
          </div>
        </div>
        <div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="mt-10 md:mt-0 md:ml-16"
        >
          <FaComments className="text-indigo-400 text-[10rem] md:text-[14rem]" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black/30 backdrop-blur-sm">
        <h3 className="text-3xl font-bold text-center mb-12 text-indigo-300">Awesome Features</h3>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-8">
          <FeatureCard
            icon={<FaUserFriends className="text-indigo-400 text-4xl mb-4" />}
            title="Connect with Friends"
            desc="Send requests, build your network, and stay connected with people you care about."
          />
          <FeatureCard
            icon={<FaLock className="text-indigo-400 text-4xl mb-4" />}
            title="Private & Secure"
            desc="Your chats are protected with advanced encryption and secure storage."
          />
          <FeatureCard
            icon={<FaRocket className="text-indigo-400 text-4xl mb-4" />}
            title="Fast & Reliable"
            desc="Experience instant messaging with minimal delay and smooth performance."
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-8 text-center bg-gradient-to-t from-black/30 to-transparent">
        <h3 className="text-3xl font-bold text-indigo-300 mb-6">About ChatHub</h3>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg leading-relaxed">
          ChatHub is designed to make communication seamless. Whether it’s chatting with friends,
          creating new connections, or sharing moments — ChatHub gives you the tools you need
          for meaningful interactions.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 text-gray-400 text-center py-6 text-sm">
        © {new Date().getFullYear()} ChatHub. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white/10 p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 shadow-lg">
      {icon}
      <h4 className="text-xl font-semibold mb-2 text-white">{title}</h4>
      <p className="text-gray-300 text-sm">{desc}</p>
    </div>
  );
}
