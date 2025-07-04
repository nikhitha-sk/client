import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './FlashcardViewer.css'; // Import FlashcardViewer.css from client/src

function FlashcardViewer() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/flashcards/${deckId}`, { withCredentials: true })
      .then(response => {
        console.log('Flashcards API response:', response.data); // Debug response
        setFlashcards(response.data);
      })
      .catch(error => {
        console.error('Error fetching flashcards:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message
        });
        alert('Error fetching flashcards');
      });
  }, [deckId]);

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex(prev => Math.min(prev + 1, flashcards.length - 1));
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const handleReview = async (quality) => {
    try {
      const flashcardId = flashcards[currentIndex]._id;
      console.log('Reviewing flashcard with ID:', flashcardId); // Debug review
      await axios.post(`http://localhost:5000/api/flashcards/${flashcardId}/review`, { quality }, { withCredentials: true });
      const updatedFlashcards = [...flashcards];
      const response = await axios.get(`http://localhost:5000/api/flashcards/${flashcardId}`, { withCredentials: true });
      updatedFlashcards[currentIndex] = response.data;
      setFlashcards(updatedFlashcards);
      setFlipped(false);
      handleNext();
    } catch (error) {
      console.error('Error submitting review:', error.response || error.message);
      alert('Error submitting review');
    }
  };

  const handleDelete = async (flashcardId) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      try {
        console.log('Deleting flashcard with ID:', flashcardId); // Debug delete
        await axios.delete(`http://localhost:5000/api/flashcards/${flashcardId}`, { withCredentials: true });
        setFlashcards(flashcards.filter(flashcard => flashcard._id !== flashcardId));
        if (currentIndex >= flashcards.length - 1 && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
      } catch (error) {
        console.error('Error deleting flashcard:', error.response || error.message);
        alert('Error deleting flashcard');
      }
    }
  };

  const getQualityLabel = (quality) => {
    if (quality === null) return 'Not reviewed';
    const labels = { 1: 'Hard', 3: 'Good', 5: 'Easy' };
    return labels[quality] || 'Unknown';
  };

  if (flashcards.length === 0) {
    return (
      <div className="flashcard-container">
        <h2>Flashcard Viewer</h2>
        <p className="text-gray-600 text-center">No flashcards available. <Link to={`/decks/${deckId}/flashcards/create`} className="text-blue-600">Add a flashcard</Link>.</p>
      </div>
    );
  }

  return (
    <div className="flashcard-container">
      <h2>Flashcard Viewer</h2>
      <div className="flashcard-info">
        <p>Last Rating: {getQualityLabel(flashcards[currentIndex].lastQuality)}</p>
        <p>Next Review: {new Date(flashcards[currentIndex].nextReviewDate).toLocaleDateString()}</p>
        <p>Interval: {flashcards[currentIndex].interval} day(s)</p>
        <p>Repetition: {flashcards[currentIndex].repetition}</p>
      </div>
      <div className="flip-card" onClick={() => setFlipped(!flipped)}>
        <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
          <div className="flip-card-front">
            <p>{flashcards[currentIndex].front}</p>
          </div>
          <div className="flip-card-back">
            <p>{flashcards[currentIndex].back}</p>
          </div>
        </div>
      </div>
      <div className="action-buttons">
        <button onClick={handlePrev} className="bg-blue-600" disabled={currentIndex === 0}>Previous</button>
        <button onClick={handleNext} className="bg-blue-600" disabled={currentIndex === flashcards.length - 1}>Next</button>
        <Link 
          to={`/decks/${deckId}/flashcards/${flashcards[currentIndex]._id}/edit`} 
          className="bg-yellow-600"
          onClick={() => console.log('Navigating to edit with flashcardId:', flashcards[currentIndex]._id, 'deckId:', deckId)}
        >
          Edit
        </Link>
        <button onClick={() => handleDelete(flashcards[currentIndex]._id)} className="bg-red-600">Delete</button>
      </div>
      {flipped && (
        <div className="review-buttons">
          <button onClick={() => handleReview(1)} className="bg-red-600">Hard</button>
          <button onClick={() => handleReview(3)} className="bg-yellow-600">Good</button>
          <button onClick={() => handleReview(5)} className="bg-green-600">Easy</button>
        </div>
      )}
    </div>
  );
}

export default FlashcardViewer;