import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PollForm() {
  const [question, setQuestion] = useState("");
  const [candidate, setCandidate] = useState("");
  const [options, setOptions] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ➕ Add candidate
  const addCandidate = () => {
    if (!candidate.trim()) return;

    setOptions([...options, { text: candidate, votes: 0 }]);
    setCandidate("");
  };

  // ❌ Remove candidate
  const removeCandidate = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  // 🔄 Reset form
  const resetForm = () => {
    setQuestion("");
    setCandidate("");
    setOptions([]);
    setError("");
  };

  // 📤 Submit poll
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim() || options.length < 2) {
      setError("Add a question and at least 2 candidates");
      return;
    }

    setError("");

    const newPoll = {
      question,
      options,
    };

    await axios.post("http://localhost:3001/polls", newPoll);

    navigate("/polls");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-500 px-4">

      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl">

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create Election Poll 🗳️
        </h2>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Question INPUT (FIXED - was missing) */}
          <input
            placeholder="Enter poll question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Candidate input */}
          <div className="flex gap-2">
            <input
              placeholder="Enter candidate name..."
              value={candidate}
              onChange={(e) => setCandidate(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addCandidate())
              }
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="button"
              onClick={addCandidate}
              className="bg-indigo-600 text-white px-4 rounded-lg hover:bg-indigo-700 transition"
            >
              Add
            </button>
          </div>

          {/* Candidate list */}
          <div className="flex flex-wrap gap-2">
            {options.map((opt, i) => (
              <div
                key={i}
                className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
              >
                {opt.text}

                <button
                  type="button"
                  onClick={() => removeCandidate(i)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">

            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 active:scale-95 transition"
            >
              Create Poll
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}