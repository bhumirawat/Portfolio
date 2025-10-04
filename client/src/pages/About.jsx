import React from "react";
import profileImage from "../assets/Profile.png"; 

export default function About() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row sm:flex-row items-center justify-center px-6 sm:px-8 md:px-12 pt-20 md:pt-24 gap-8 pb-20 md:pb-24">
  {/* flex-col for md, flex-row for lg+, responsive padding and top + bottom spacing */}


      {/* Image Section */}
      <div className="flex-shrink-0">
        <img 
          src={profileImage} 
          alt="Bhumika Rawat" 
          className="
            w-60 h-60 sm:w-72 sm:h-72 
            md:w-80 md:h-80 lg:w-96 lg:h-96 
            rounded-full object-cover border-4 border-white/20 shadow-lg mx-auto
          "
        />
      </div>
      
      {/* Text Content */}
      <div className="
        max-w-xl sm:max-w-2xl md:max-w-3xl 
        bg-white/10 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-xl
      ">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white text-center lg:text-left">
          About Me
        </h1>
        <p className="text-gray-300 leading-relaxed text-base sm:text-lg md:text-lg">
          Hi, I'm Bhumika Rawat, a passionate Full Stack Developer with a strong 
          foundation in the MERN stack and C++ for Data Structures & Algorithms. 
          I recently completed my B.Tech in Information Technology (2025) from AKTU, 
          and I'm eager to begin my journey in a dynamic, innovation-driven environment.<br/><br/>

          I love crafting user-centric web applications that are both visually 
          engaging and technically robust. My passion lies in turning ideas into 
          functional, impactful digital experiences — blending clean design, 
          optimized code, and seamless interactivity. I approach every challenge 
          with curiosity, creativity, and a problem-solving mindset, continuously 
          learning and adapting to new technologies.<br/><br/>

          My goal is to join an innovative tech company where I can contribute to
          meaningful projects, collaborate with talented teams, and grow into a 
          well-rounded full stack engineer. You can explore my work and projects on&nbsp;
          <a 
            href="https://github.com/bhumirawat" 
            aria-label="GitHub" 
            target="_blank"
            className="text-blue-400 hover:underline"
          >
            GitHub
          </a>
        </p>
      </div>
    </div>
  );
}
