import React, { useState, useEffect } from 'react';
     import { useParams } from 'react-router-dom';
     import axios from 'axios';
     import './FlashcardViewer.css'; // Import CSS for flip animation

     function FlashcardViewer() {
       const { deckId } = useParams();
       const [flashcards, setFlashcards] = useState([]);
       const [currentIndex, setCurrentIndex] = useState(0);
       const [flipped, setFlipped] = useState(false);

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
           </div>
         </div>
       );
     }

     export default FlashcardViewer;