import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PollForm() {
  const [candidate, setCandidate] = useState("");
  const [options, setOptions] = useState([]);
  const [pollId, setPollId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ➕ ADD CANDIDATE (and create poll on first add)
  const addCandidate = async () => {
    if (!candidate.trim()) return;

    const newOption = { text: candidate.trim(), votes: 0 };

    let updatedOptions = [...options, newOption];

    setOptions(updatedOptions);
    setCandidate("");

    try {
      setError("");

      // 🟢 If first candidate → create poll immediately
      if (!pollId) {
        const newId = Date.now().toString();

        const newPoll = {
          id: newId,
          question: "Vote for your candidate",
          options: updatedOptions,
        };

        await axios.post("http://localhost:3001/polls", newPoll);

        setPollId(newId);

        // 🚀 redirect immediately after creation
        navigate("/polls");
        return;
      }

      // 🟡 If poll already exists → update it
      const updatedPoll = {
        id: pollId,
        question: "Vote for your candidate",
        options: updatedOptions,
      };

      await axios.put(
        `http://localhost:3001/polls/${pollId}`,
        updatedPoll
      );

    } catch (err) {
      console.error(err);
      setError("Failed to save candidate");
    }
  };

  // ❌ REMOVE CANDIDATE
  const removeCandidate = async (index) => {
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);

    if (!pollId) return;

    try {
      await axios.put(`http://localhost:3001/polls/${newPoll}`, {
        id: pollId,
        question: "Vote for your candidate",
        options: updated,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 🔄 RESET
  const resetForm = async () => {
    setCandidate("");
    setOptions([]);
    setError("");
    setPollId(null);
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-blue-400 px-4 pt-10">

      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl">

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add Candidates 
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* INPUT */}
        <div className="flex gap-2 mb-4">

          <input
            placeholder="Enter candidate name..."
            value={candidate}
            onChange={(e) => setCandidate(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addCandidate())
            }
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* ADD BUTTON */}
          <button
            type="button"
            onClick={addCandidate}
            className="bg-indigo-600 text-white px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            Add
          </button>

          {/* RESET BUTTON */}
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-200 text-gray-700 px-4 rounded-lg hover:bg-gray-300 transition"
          >
            Reset
          </button>

        </div>

        {/* LIST */}
        <div className="flex flex-wrap gap-2">
          {options.map((opt, i) => (
            <div
              key={i}
              className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
            >
              {opt.text}

              <button
                onClick={() => removeCandidate(i)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}