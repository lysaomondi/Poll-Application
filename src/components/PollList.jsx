import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    const res = await axios.get("http://localhost:3001/polls");
    setPolls(res.data);
  };

  // 🗳️ Vote function
  const vote = async (pollId, optionIndex) => {
    const updatedPolls = polls.map((poll) => {
      if (poll.id === pollId) {
        const updatedOptions = poll.options.map((opt, i) =>
          i === optionIndex
            ? { ...opt, votes: opt.votes + 1 }
            : opt
        );

        return { ...poll, options: updatedOptions };
      }
      return poll;
    });

    setPolls(updatedPolls);

    const updatedPoll = updatedPolls.find((p) => p.id === pollId);

    await axios.put(
      `http://localhost:3001/polls/${pollId}`,
      updatedPoll
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Polls 🗳️
          </h2>

          <button
            onClick={() => navigate("/create")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            + Create Poll
          </button>
        </div>

        {/* Polls */}
        <div className="space-y-6">
          {polls.map((poll) => {
            const totalVotes = poll.options.reduce(
              (sum, opt) => sum + opt.votes,
              0
            );

            return (
              <div
                key={poll.id}
                className="bg-white p-6 rounded-2xl shadow-md"
              >
                {/* Question */}
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {poll.question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {poll.options.map((opt, index) => {
                    const percentage =
                      totalVotes === 0
                        ? 0
                        : Math.round((opt.votes / totalVotes) * 100);

                    return (
                      <div
                        key={index}
                        className="border rounded-lg p-3 bg-gray-50"
                      >
                        <div className="flex justify-between items-center">
                          
                          {/* Candidate name */}
                          <span className="text-gray-700 font-medium">
                            {opt.text}
                          </span>

                          {/* Vote button */}
                          <button
                            onClick={() => vote(poll.id, index)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition"
                          >
                            Vote
                          </button>
                        </div>

                        {/* Votes + percentage */}
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>{opt.votes} votes</span>
                          <span>{percentage}%</span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 h-2 rounded mt-1">
                          <div
                            className="bg-indigo-500 h-2 rounded"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total votes */}
                <p className="text-xs text-gray-500 mt-3">
                  Total votes: {totalVotes}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}