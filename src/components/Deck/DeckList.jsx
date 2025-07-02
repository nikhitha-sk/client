import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function DeckList() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/decks', { withCredentials: true })
      .then(response => setDecks(response.data))
      .catch(error => console.error('Error fetching decks:', error));
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4">My Decks</h2>
      <Link to="/decks/create" className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block">Create New Deck</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {decks.map(deck => (
          <div key={deck._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl">{deck.title}</h3>
            <Link to={`/decks/${deck._id}/flashcards`} className="text-blue-600">View Flashcards</Link>
            <Link to={`/decks/${deck._id}/flashcards/create`} className="text-green-600 ml-4">Add Flashcard</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeckList;