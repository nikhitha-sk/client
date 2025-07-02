import React, { useState, useEffect } from 'react';
   import { useParams, useNavigate } from 'react-router-dom';
   import axios from 'axios';

   function EditFlashcard() {
     const { deckId, flashcardId } = useParams();
     const [front, setFront] = useState('');
     const [back, setBack] = useState('');
     const navigate = useNavigate();

     useEffect(() => {
       axios.get(`http://localhost:5000/api/flashcards/${deckId}`, { withCredentials: true })
         .then(response => {
           const flashcard = response.data.find(fc => fc._id === flashcardId);
           if (flashcard) {
             setFront(flashcard.front);
             setBack(flashcard.back);
           }
         })
         .catch(error => console.error('Error fetching flashcard:', error));
     }, [deckId, flashcardId]);

     const handleSubmit = async (e) => {
       e.preventDefault();
       try {
         await axios.put(`http://localhost:5000/api/flashcards/${flashcardId}`, { front, back }, { withCredentials: true });
         navigate(`/decks/${deckId}/flashcards`);
       } catch (error) {
         alert('Error updating flashcard');
       }
     };

     return (
       <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
         <h2 className="text-2xl mb-4">Edit Flashcard</h2>
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
           <button onClick={handleSubmit} className="w-full bg-blue-600 text-white p-2 rounded">Update</button>
         </div>
       </div>
     );
   }

   export default EditFlashcard;