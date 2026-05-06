import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PollList() {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 📡 FETCH SINGLE POLL
  useEffect(() => {
    fetchPoll();
  }, []);

  const fetchPoll = async () => {
    try {
      const res = await axios.get("http://localhost:3001/polls");

      // 👉 take first poll only (your system = single poll)
      setPoll(res.data[0] || null);

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load poll");
    } finally {
      setLoading(false);
    }
  };

  // 🗳️ VOTE FUNCTION
  const vote = async (optionIndex) => {
    try {
      if (!poll) return;

      const updatedOptions = poll.options.map((opt, i) =>
        i === optionIndex
          ? { ...opt, votes: opt.votes + 1 }
          : opt
      );

      const updatedPoll = {
        ...poll,
        options: updatedOptions,
      };

      await axios.put(
        `http://localhost:3001/polls/${poll.id}`,
        updatedPoll
      );

      setPoll(updatedPoll);
    } catch (err) {
      console.error(err);
      setError("Vote failed");
    }
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading poll...</p>
      </div>
    );
  }

  // 🚫 NO POLL EXISTS
  if (!poll) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4">No poll created yet</p>

        <button
          onClick={() => navigate("/create")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Create Poll
        </button>
      </div>
    );
  }

  const totalVotes = poll.options.reduce(
    (sum, opt) => sum + opt.votes,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md">

        {/* HEADER (NO QUESTION ANYMORE) */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Vote for Your Candidate 
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* OPTIONS */}
        <div className="space-y-4">
          {poll.options.map((opt, index) => {
            const percentage =
              totalVotes === 0
                ? 0
                : Math.round((opt.votes / totalVotes) * 100);

            return (
              <div
                key={index}
                className="border rounded-lg p-4 bg-gray-50"
              >

                <div className="flex justify-between items-center">

                  {/* Candidate */}
                  <span className="font-medium text-gray-700">
                    {opt.text}
                  </span>

                  {/* Vote */}
                  <button
                    onClick={() => vote(index)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                  >
                    Vote
                  </button>

                </div>

                {/* STATS */}
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{opt.votes} votes</span>
                  <span>{percentage}%</span>
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full bg-gray-200 h-2 rounded mt-2">
                  <div
                    className="bg-indigo-500 h-2 rounded"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

              </div>
            );
          })}
        </div>

        {/* TOTAL */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Total votes: {totalVotes}
        </p>

      </div>
    </div>
  );
}