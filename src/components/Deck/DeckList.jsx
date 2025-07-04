import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Decks.css'; // Import Decks.css from client/src

function DeckList() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/decks', { withCredentials: true })
      .then(response => setDecks(response.data))
      .catch(error => console.error('Error fetching decks:', error));
  }, []);

  const handleDelete = async (deckId) => {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      try {
        await axios.delete(`http://localhost:5000/api/decks/${deckId}`, { withCredentials: true });
        setDecks(decks.filter(deck => deck._id !== deckId));
      } catch (error) {
        alert('Error deleting deck');
      }
    }
  };

  return (
    <div className="decks-container">
      <h2>My Decks</h2>
      <Link to="/decks/create" className="create-deck-btn">Create New Deck</Link>
      {decks.length === 0 ? (
        <p className="text-gray-600 text-center">No decks available. Create a new deck!</p>
      ) : (
        decks.map(deck => (
          <div key={deck._id} className="deck-card">
            <h3>{deck.title}</h3>
            <div className="deck-actions">
              <Link to={`/decks/${deck._id}/flashcards`} className="bg-blue-600">View Flashcards</Link>
              <Link to={`/decks/${deck._id}/flashcards/create`} className="bg-green-600">Add Flashcard</Link>
              <Link to={`/decks/${deck._id}/edit`} className="bg-yellow-600">Edit</Link>
              <button onClick={() => handleDelete(deck._id)} className="bg-red-600">Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DeckList;