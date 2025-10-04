import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      // ❌ FIX: Remove /api from the path - change to /contact
      await axios.post(`${API_BASE_URL}/contact`, form); // CHANGED FROM /api/contact to /contact
      setStatus("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      if (err.response) {
        setStatus("Error: " + (err.response.data.message || "Server error"));
      } else if (err.request) {
        setStatus("Error: Cannot connect to server. Please try again.");
      } else {
        setStatus("Error: " + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 mt-10 sm:mt-14 md:mt-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-8 rounded-xl w-full max-w-lg"
      >
        <h1 className="text-3xl font-bold mb-6">Contact Me</h1>
        <input
          className="w-full mb-4 p-3 rounded bg-white/20 border border-white/30 focus:outline-none focus:border-purple-400 transition"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="w-full mb-4 p-3 rounded bg-white/20 border border-white/30 focus:outline-none focus:border-purple-400 transition"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <textarea
          className="w-full mb-4 p-3 rounded bg-white/20 border border-white/30 focus:outline-none focus:border-purple-400 transition"
          placeholder="Message"
          rows="5"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 transition rounded py-3 font-semibold"
        >
          Send
        </button>
        {status && (
          <p className={`mt-4 text-center text-sm ${
            status.includes("successfully") ? "text-green-400" : 
            status.includes("Error") ? "text-red-400" : "text-white"
          }`}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}