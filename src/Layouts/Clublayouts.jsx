import React from "react";
import Navbar from "../components/Global/Navbar";
import { Outlet } from "react-router";
import { Footer } from "../components/Global/Footer";

const Clublayouts = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Bottom Footer */}
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Clublayouts;
