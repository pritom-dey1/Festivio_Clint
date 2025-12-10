import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-black backdrop-blur-md border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & description */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-10" />
          </div>
          <p className="text-gray-100 text-sm">
            Connecting clubs, events, and members seamlessly. Your platform for managing and joining communities with ease.
          </p>
          <div className="flex gap-3 mt-2 text-gray-200">
            <a href="#" className="hover:text-gray-300"><FaFacebookF /></a>
            <a href="#" className="hover:text-gray-300"><FaTwitter /></a>
            <a href="#" className="hover:text-gray-300"><FaInstagram /></a>
            <a href="#" className="hover:text-gray-300"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-gray-200 mb-3">Quick Links</h4>
          <ul className="flex flex-col gap-2 text-gray-300 text-sm">
            <li><Link to="/" className="hover:text-gray-400">Home</Link></li>
            <li><Link to="/clubs" className="hover:text-gray-400">Clubs</Link></li>
            <li><Link to="/events" className="hover:text-gray-400">Events</Link></li>
            <li><Link to="/about" className="hover:text-gray-400">About</Link></li>
            <li><Link to="/contact" className="hover:text-gray-400">Contact</Link></li>
          </ul>
        </div>

        {/* Member Links */}
        <div>
          <h4 className="font-semibold text-gray-100 mb-3">Member</h4>
          <ul className="flex flex-col gap-2 text-gray-200 text-sm">
            <li><Link to="/profile" className="hover:text-gray-400">Profile</Link></li>
            <li><Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link></li>
            <li><Link to="/login" className="hover:text-gray-400">Login</Link></li>
            <li><Link to="/register" className="hover:text-gray-400">Register</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold text-gray-100 mb-3">Contact</h4>
          <p className="text-gray-300 text-sm">123 Club Street, City, Country</p>
          <p className="text-gray-300 text-sm">Email: support@clubsphere.com</p>
          <p className="text-gray-300 text-sm">Phone: +123 456 7890</p>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-6">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-gray-100 text-sm">
          &copy; {new Date().getFullYear()} ClubSphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
