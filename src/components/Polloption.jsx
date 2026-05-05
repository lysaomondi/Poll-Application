import React, { useState, useEffect } from 'react';

const API_URL = "http://localhost:3000/options";

const PollOption = () => {
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");

  // Load data on start
  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setOptions(data);
  };

  // 🔹 addOption
  const addOption = async () => {
    if (!newOption.trim()) return;
    
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newOption, votes: 0 })
    });

    if (res.ok) {
      setNewOption("");
      fetchOptions(); // Refresh the list
    }
  };

  // 🔹 handleVote
  const handleVote = async (id, currentVotes) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH', // PATCH only updates the fields you send
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ votes: currentVotes + 1 })
    });

    if (res.ok) fetchOptions();
  };

  // 🔹 resetVotes
  const resetVotes = async () => {
    // Note: JSON Server doesn't have a "delete all" command.
    // We have to loop through and delete each one.
    const deletePromises = options.map(opt => 
      fetch(`${API_URL}/${opt.id}`, { method: 'DELETE' })
    );
    
    await Promise.all(deletePromises);
    setOptions([]);
  };

  // 🔹 totalVotes
  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Total Votes: {totalVotes}</h2>
      
      <input 
        value={newOption} 
        onChange={(e) => setNewOption(e.target.value)} 
        placeholder="Add choice..."
      />
      <button onClick={addOption}>Add</button>
      <button onClick={resetVotes} style={{ color: 'red' }}>Reset All</button>

      <div style={{ marginTop: '20px' }}>
        {options.map(opt => (
          <div key={opt.id} style={{ marginBottom: '10px' }}>
            {opt.text}: <strong>{opt.votes}</strong>
            <button onClick={() => handleVote(opt.id, opt.votes)}>Vote</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollOption;