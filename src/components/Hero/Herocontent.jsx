import React from "react";
import { Link } from "react-router";
import { Typewriter } from "react-simple-typewriter";

export const HeroSection = () => {
  return (
    <section className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="w-7xl mx-auto px-6 text-center  "  >
        <span className="uppercase">Join a Community That Fits You</span>
        <h1 className="text-4xl md:text-6xl font-bold uppercase bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg ">
          <Typewriter
            words={[
"Connect With Clubs",

"Join Fun Events",

"Grow Your Network"
            ]}
            loop={true}
            cursor
            cursorStyle="."
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </h1>
        <p className="text-[18px] uppercase">
         Discover exciting events, join vibrant communities, and manage your club  <br /> memberships seamlessly—all in one powerful platform.
        </p>
        <button
          
          className="px-6 py-3 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 uppercase mt-1"
        >
          Explore Clubs
        </button>
      </div>
    </section>
  );
};
