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

     if (!flashcards.length) return <div>No flashcards available</div>;

     return (
       <div className="flex flex-col items-center">
         <h2 className="text-2xl mb-4">Flashcard Viewer</h2>
         <div className="flip-card" onClick={() => setFlipped(!flipped)}>
           <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
             <div className="flip-card-front w-96 h-64 bg-blue-200 flex items-center justify-center rounded shadow">
               <p className="text-xl p-4">{flashcards[currentIndex].front}</p>
             </div>
             <div className="flip-card-back w-96 h-64 bg-green-200 flex items-center justify-center rounded shadow">
               <p className="text-xl p-4">{flashcards[currentIndex].back}</p>
             </div>
           </div>
         </div>
         <div className="mt-4 space-x-4">
           <button onClick={handlePrev} className="bg-blue-600 text-white px-4 py-2 rounded">Previous</button>
           <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
           <Link to={`/decks/${deckId}/flashcards/${flashcards[currentIndex]._id}/edit`} className="bg-yellow-600 text-white px-4 py-2 rounded">Edit</Link>
           <button onClick={() => handleDelete(flashcards[currentIndex]._id)} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
         </div>
       </div>
     );
   }

   export default FlashcardViewer;