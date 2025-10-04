import { useEffect, useRef, useState } from 'react';
import MERN_Blog from '../assets/MERN_Blog.png';
import todoApp from '../assets/todoApp.png';
import passwordGenerater from '../assets/passwordGenerater.png';
import Quiz from '../assets/Quiz.png';
import gitHubUserFinder from '../assets/gitHubUserFinder.png';
import colorGenerator from '../assets/colorGenerator.png';
import currencyConverter from '../assets/currencyConverter.png';


const ProjectsSection = () => {
  const cardGridRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollAmount = useRef(0);
  const scrollSpeed = 0.7;
  const animationRef = useRef(null);

  const projects = [
    {
      id: 1,
      title: "Quiz",
      subtitle: "Interactive quiz platform: test knowledge, learn, and have fun engagingly",
      description: "This quiz application offers multiple-choice questions across various topics, tracks user scores in real-time, and provides immediate feedback, all within a clean and intuitive interface suitable for quick knowledge assessments.",
      image: Quiz,
      link: "https://quiz-b4.netlify.app"
    },
    {
      id: 2,
      title: "Todo - App",
      subtitle: "Simple, intuitive To-Do app to organize tasks and boost productivity.",
      description: "The To-Do App at is a straightforward task management tool that allows users to create, view, and organize tasks. It offers basic functionalities such as adding new tasks, marking them as complete, and clearing completed tasks.",
      image: todoApp,
      link: "https://todo-app-b2.netlify.app"
    },
    {
      id: 3,
      title: "Password Generator",
      subtitle: "Secure password generator: instantly create strong, random passwords safely.",
      description: "The password generator at is a client-side application built using HTML, CSS, and JavaScript. It allows users to generate secure, random passwords by selecting criteria such as length, inclusion of uppercase letters, lowercase letters, numbers, and special characters.",
      image: passwordGenerater,
      link: "https://password-generator-b3.netlify.app"
    },
    {
      id: 4,
      title: "MERN_Blog",
      subtitle: "Generate beautiful color palettes instantly—design, match, and inspire creativity.",
      description: "MERN Blog uses React, Express, Node, MongoDB — supports CRUD operations, routing, authentication, responsive UI, and API interactions.",
      image: MERN_Blog,
      link: "https://mern-blog-yzyv.vercel.app"
    },
    {
      id: 5,
      title: "GitHub Finder",
      subtitle: "Search GitHub users—explore profiles, repos, and contributions quickly",
      description: "The GitHub Finder app enables users to search GitHub profiles by username, displaying details like bio, followers, following, and repositories. It provides a user-friendly interface to explore developer profiles.",
      image: gitHubUserFinder,
      link: "https://github-finder-b5.netlify.app"
    },
    {
      id: 6,
      title: "Color Pallet Generator",
      subtitle: "Generate beautiful color palettes instantly—design, match, and inspire creativity.",
      description: "The website is a tool that enables users to generate harmonious color palettes. By simply clicking a button, it produces a set of complementary colors, which can be useful for designers and developers seeking color inspiration or needing to match a brand's color theme.",
      image: colorGenerator,
      link: "https://color-palette-generator-b6.netlify.app"
    },
    {
      id: 7,
      title: "Currency Converter",
      subtitle: "A simple currency converter for accurate, real-time cash value exchange.",
      description: "The Cash Converter is a web-based application designed to facilitate real-time currency conversions. Users can input an amount, select the source and target currencies, and receive an instant conversion based on current exchange rates.",
      image: currencyConverter,
      link: "https://cash-converter-b1.netlify.app"
    }
  ];

  const autoScroll = () => {
    if (!cardGridRef.current || isPaused) {
      animationRef.current = requestAnimationFrame(autoScroll);
      return;
    }

    if (scrollAmount.current >= cardGridRef.current.scrollWidth / 2) {
      scrollAmount.current = 0;
      cardGridRef.current.scrollTo({ left: 0, behavior: "instant" });
    } else {
      cardGridRef.current.scrollTo({ left: scrollAmount.current, behavior: "smooth" });
      scrollAmount.current += scrollSpeed;
    }

    animationRef.current = requestAnimationFrame(autoScroll);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(autoScroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  return (
    <div className="min-h-screen bg-[#141622] text-white py-8 mt-10">

      {/* Projects Section */}
      <div className="latest-card bg-[#141622] py-4 sm:py-6 md:py-8 mt-8 sm:mt-10 md:mt-12 shadow-2xl">

        <div className="Scroll w-[90%] max-w-2xl mx-auto relative overflow-hidden ">
         <header className="text-center py-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            My Projects Collection
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-gray-300">
            A Journey Through My Code and Creations.
          </p>
        </header>


          
          <div 
            ref={cardGridRef}
            className="card-grid flex gap-5 transition-transform duration-300 ease-out pb-4 scroll-smooth -webkit-overflow-scrolling-touch overflow-x-auto scrollbar-hide"
            style={{ willChange: 'transform' }}
          >
            {/* Original Projects */}
            {projects.map((project) => (
              <div
                key={project.id}
                className="card group flex-shrink-0 w-full sm:w-72 md:w-80 lg:w-96 
                          bg-white rounded-2xl overflow-hidden shadow-lg 
                          transition-all duration-300 ease-in-out 
                          hover:-translate-y-2 hover:shadow-2xl relative"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Image Container */}
                <div className="relative w-full h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                  {/* Overlay that appears on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 ease-in-out group-hover:bg-opacity-70"></div>
                </div>
                
                {/* Main Content */}
                <div className="card-content p-6 relative pb-16">
                  <h3 className="text-xl font-bold mb-4 text-[#1a1a2e] text-center">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {project.subtitle}
                  </p>
                </div>
                
                {/* Slide-up Content (Hidden by default, appears on hover) */}
                <div className="absolute inset-0 bg-white text-white p-6 rounded-xl transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0 flex flex-col justify-center items-center text-center">
                  <h3 className="text-2xl font-bold mb-4 text-[#1a1a2e]">
                    {project.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>
                
                {/* Button that stays visible */}
                <a 
                  href={project.link} 
                  className="read-more absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1a1a2e] text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-colors duration-300 ease-in-out hover:bg-[#272746] z-10"
                >
                  Explore
                </a>
              </div>
            ))}
            
            {/* Cloned Projects for seamless loop */}
            {projects.map((project) => (
              <div
                key={project.id}
                className="card group flex-shrink-0 w-full sm:w-72 md:w-80 lg:w-96 
                          bg-white rounded-2xl overflow-hidden shadow-lg 
                          transition-all duration-300 ease-in-out 
                          hover:-translate-y-2 hover:shadow-2xl relative"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >

                {/* Image Container */}
                <div className="relative w-full h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                  {/* Overlay that appears on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 ease-in-out group-hover:bg-opacity-70"></div>
                </div>
                
                {/* Main Content */}
                <div className="card-content p-6 relative pb-16">
                  <h3 className="text-xl font-bold mb-4 text-[#1a1a2e] text-center">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {project.subtitle}
                  </p>
                </div>
                
                {/* Slide-up Content (Hidden by default, appears on hover) */}
                <div className="absolute inset-0 bg-white text-white p-6 rounded-xl transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0 flex flex-col justify-center items-center text-center">
                  <h3 className="text-2xl font-bold mb-4 text-[#1a1a2e]">
                    {project.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>
                
                {/* Button that stays visible */}
                <a 
                  href={project.link} 
                  className="read-more absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1a1a2e] text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-colors duration-300 ease-in-out hover:bg-[#272746] z-10"
                >
                  Explore
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;