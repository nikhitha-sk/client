import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './FlashcardViewer.css';

function FlashcardViewer() {
  const { deckId } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/flashcards/${deckId}`, { withCredentials: true })
      .then(response => setFlashcards(response.data))
      .catch(error => console.error('Error fetching flashcards:', error));
  }, [deckId]);

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleDelete = async (flashcardId) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      try {
        await axios.delete(`http://localhost:5000/api/flashcards/${flashcardId}`, { withCredentials: true });
        setFlashcards(flashcards.filter(fc => fc._id !== flashcardId));
        if (currentIndex >= flashcards.length - 1 && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
      } catch (error) {
        alert('Error deleting flashcard');
      }
    }
  };

  const handleReview = async (quality) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/flashcards/${flashcards[currentIndex]._id}/review`, { quality }, { withCredentials: true });
      setFlipped(false);
      setFlashcards(flashcards.map(fc => fc._id === response.data._id ? response.data : fc));
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    } catch (error) {
      alert('Error submitting review');
    }
  };

  const getQualityLabel = (quality) => {
    if (quality === null) return 'Not reviewed';
    if (quality === 1) return 'Hard';
    if (quality === 3) return 'Good';
    if (quality === 5) return 'Easy';
    return 'Unknown';
  };

  if (!flashcards.length) {
    return (
      <div className="flashcard-container"> {/* Changed class */}
        <h2>Flashcard Viewer</h2> {/* Class remains same from your CSS */}
        <p>No flashcards available. Add new flashcards!</p>
        <Link to={`/decks/${deckId}/flashcards/create`} className="action-buttons bg-green-600">Add Flashcard</Link> {/* Changed class */}
      </div>
    );
  }

  return (
    <div className="flashcard-container"> {/* Changed class */}
      <h2>Flashcard Viewer</h2> {/* Class remains same from your CSS */}
      <div className="flashcard-info"> {/* Added class for info */}
        <p>Last Rating: {getQualityLabel(flashcards[currentIndex].lastQuality)}</p>
        <p>Next Review: {new Date(flashcards[currentIndex].nextReviewDate).toLocaleDateString()}</p>
        <p>Interval: {flashcards[currentIndex].interval} day(s)</p>
        <p>Repetition: {flashcards[currentIndex].repetition}</p>
      </div>
      <div className="flip-card" onClick={() => setFlipped(!flipped)}> {/* Class remains same from your CSS */}
        <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}> {/* Class remains same from your CSS */}
          <div className="flip-card-front"> {/* Changed class, removed inline tailwind */}
            <p>{flashcards[currentIndex].front}</p> {/* Removed inline tailwind */}
          </div>
          <div className="flip-card-back"> {/* Changed class, removed inline tailwind */}
            <p>{flashcards[currentIndex].back}</p> {/* Removed inline tailwind */}
          </div>
        </div>
      </div>
      <div className="action-buttons"> {/* Changed class */}
        <button onClick={handlePrev} className="bg-blue-600" disabled={currentIndex === 0}>Previous</button> {/* Changed class */}
        <button onClick={handleNext} className="bg-blue-600" disabled={currentIndex === flashcards.length - 1}>Next</button> {/* Changed class */}
        <Link to={`/decks/${deckId}/flashcards/${flashcards[currentIndex]._id}/edit`} className="bg-yellow-600">Edit</Link> {/* Changed class */}
        <button onClick={() => handleDelete(flashcards[currentIndex]._id)} className="bg-red-600">Delete</button> {/* Changed class */}
      </div>
      {flipped && (
        <div className="review-buttons"> {/* Changed class */}
          <button onClick={() => handleReview(1)} className="bg-red-600">Hard</button> {/* Changed class */}
          <button onClick={() => handleReview(3)} className="bg-yellow-600">Good</button> {/* Changed class */}
          <button onClick={() => handleReview(5)} className="bg-green-600">Easy</button> {/* Changed class */}
        </div>
      )}
    </div>
  );
}

export default FlashcardViewer;