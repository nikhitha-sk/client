import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateFlashcard.css'; // Import CreateFlashcard.css from client/src

function CreateFlashcard() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

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
    <div className="create-flashcard-container">
      <h2>Create Flashcard</h2>
      <form onSubmit={handleSubmit}>
        <label>Front:</label>
        <textarea value={front} onChange={(e) => setFront(e.target.value)} />
        <label>Back:</label>
        <textarea value={back} onChange={(e) => setBack(e.target.value)} />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateFlashcard;