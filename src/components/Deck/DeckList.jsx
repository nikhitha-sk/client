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
        // After deletion, filter the decks and adjust index if necessary
        const updatedDecks = decks.filter(deck => deck._id !== deckId);
        setDecks(updatedDecks);
        // No need to adjust currentIndex here as this is DeckList, not FlashcardViewer
      } catch (error) {
        alert('Error deleting deck');
      }
    }
  };

  return (
    <div className="decks-container">
      <h2 className="decks-title">My Decks</h2> {/* Added class 'decks-title' */}
      <Link to="/decks/create" className="create-deck-btn">Create New Deck</Link>
      {decks.length === 0 ? (
       <p className="no-decks-message">No decks available. Create a new deck!</p>
      ) : (
        // *** IMPORTANT CHANGE HERE: Added the 'decks-grid-wrapper' div ***
        <div className="decks-grid-wrapper">
          {decks.map(deck => (
            <div key={deck._id} className="deck-card">
              <h3>{deck.title}</h3> {/* Assuming 'title' is the correct property for deck name */}
              <div className="deck-actions">
                <Link to={`/decks/${deck._id}/flashcards`} className="bg-blue-600">View Flashcards</Link>
                <Link to={`/decks/${deck._id}/flashcards/create`} className="bg-green-600">Add Flashcard</Link>
                <Link to={`/decks/${deck._id}/edit`} className="bg-yellow-600">Edit</Link>
                <button onClick={() => handleDelete(deck._id)} className="bg-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DeckList;