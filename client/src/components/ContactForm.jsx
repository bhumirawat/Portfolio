import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Contact() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    message: "" 
  });
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("Sending...");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/contact`, 
        form, 
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      setStatus(response.data.message || "Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
      
    } catch (err) {
      let errorMessage = "An unexpected error occurred.";

      if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Please try again.";
      } else if (err.response) {
        errorMessage = err.response.data.message || `Server error (${err.response.status})`;
      } else if (err.request) {
        errorMessage = "Cannot connect to server. Please check your connection.";
      } else {
        errorMessage = err.message;
      }

      setStatus(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusColor = () => {
    if (status?.includes("successfully")) return "text-green-400";
    if (status?.includes("Error")) return "text-red-400";
    return "text-white";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 mt-10 sm:mt-14 md:mt-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-8 rounded-xl w-full max-w-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Contact Me
        </h1>
        
        <div className="space-y-4">
          <input
            className="w-full p-3 rounded bg-white/20 border border-white/30 
                       focus:outline-none focus:border-purple-400 transition
                       placeholder-white/70"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            disabled={isLoading}
          />
          
          <input
            className="w-full p-3 rounded bg-white/20 border border-white/30 
                       focus:outline-none focus:border-purple-400 transition
                       placeholder-white/70"
            placeholder="Your Email"
            type="email"
            value={form.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            disabled={isLoading}
          />
          
          <textarea
            className="w-full p-3 rounded bg-white/20 border border-white/30 
                       focus:outline-none focus:border-purple-400 transition
                       placeholder-white/70 resize-none"
            placeholder="Your Message"
            rows="5"
            value={form.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 
                     disabled:cursor-not-allowed transition-all rounded py-3 
                     font-semibold mt-6"
        >
          Send Message
        </button>
        
        {status && (
          <p className={`mt-4 text-center text-sm ${getStatusColor()}`}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}