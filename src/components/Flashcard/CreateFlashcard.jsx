import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateFlashcard() {
  const { deckId } = useParams();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/flashcards', { front, back, deckId }, { withCredentials: true });
      navigate(`/decks/${deckId}/flashcards`);
    } catch (error) {
      alert('Error creating flashcard');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Create Flashcard</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Front (Question)"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Back (Answer)"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button onClick={handleSubmit} className="w-full bg-blue-600 text-white p-2 rounded">Create</button>
      </div>
    </div>
  );
}

export default CreateFlashcard;