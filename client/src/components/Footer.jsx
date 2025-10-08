import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/10 backdrop-blur-md border-b border-white/10 p-8">
      <div className="container mx-auto px-4 flex flex-col items-center gap-4">
        
        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 mb-2">
          <a
            href="https://github.com/bhumirawat"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white transition-colors rounded-xl border border-transparent duration-300 hover:text-gray-950 hover:border-white  hover:bg-white hover:border-1px"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/bhumika-rawat-82880829a/"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white transition-colors duration-300 hover:text-blue-700 hover:bg-white"
          >
            <FaLinkedin size={24} />
          </a>
        </div>
        
        {/* Copyright Notice */}
        <div className="text-center text-sm">
          <p>
            &copy; {currentYear} | Designed & Developed By: Bhumika
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;