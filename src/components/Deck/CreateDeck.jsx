import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateDeck() {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/decks', { title }, { withCredentials: true });
      navigate('/decks');
    } catch (error) {
      alert('Error creating deck');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Create Deck</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Deck Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button onClick={handleSubmit} className="w-full bg-blue-600 text-white p-2 rounded">Create</button>
      </div>
    </div>
  );
}

export default CreateDeck;