import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-3 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-100 ${
        isScrolled
          ? "bg-white/10 backdrop-blur-md border-white/10 mx-4 rounded-lg"
          : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <div className="text-2xl md:text-3xl font-bold">
        <Link to="/">Bhumika.</Link>
      </div>

      {/* Desktop Nav Links */}
      <ul className="hidden md:flex space-x-8 items-center">
        {[
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: "About", path: "/about" },
          { name: "Contact", path: "/contact" },
        ].map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              className="pb-1 border-b-0 hover:border-b-2 hover:border-white transition-all duration-300"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop Resume Button */}
      <a
        className="hidden md:inline-block font-semibold px-4 py-1 rounded shadow border transition-all duration-300 bg-white text-[#141622] hover:bg-[#141622] hover:text-white hover:border-white"
        href="/Resume.pdf"
        target="_blank"
        rel="noreferrer"
      >
        Resumé
      </a>

      {/* Mobile Hamburger */}
      <div className="md:hidden relative">
        <button
          className="text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Mobile Menu */}
        <div
          className={`absolute right-0 mt-2 w-48 bg-[#141622]/95 backdrop-blur-md rounded-lg shadow-lg flex flex-col items-center overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-96 py-4" : "max-h-0"
          }`}
        >
          {[
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: "About", path: "/about" },
            { name: "Contact", path: "/contact" },
          ].map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="w-full text-center py-2 hover:bg-white/10 transition-colors rounded-md"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {/* Mobile Resume Button */}
          <a
            href="/Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="w-full text-center mt-2 font-semibold px-4 py-2 rounded shadow border bg-white text-[#141622] hover:bg-white/10 hover:text-white hover:border-white transition-all duration-300"
          >
            Resumé
          </a>
        </div>
      </div>
    </nav>
  );
}
