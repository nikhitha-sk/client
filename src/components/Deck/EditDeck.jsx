import React, { useState, useEffect } from 'react';
   import { useParams, useNavigate } from 'react-router-dom';
   import axios from 'axios';

   function EditDeck() {
     const { deckId } = useParams();
     const [title, setTitle] = useState('');
     const navigate = useNavigate();

     useEffect(() => {
       axios.get(`http://localhost:5000/api/decks`, { withCredentials: true })
         .then(response => {
           const deck = response.data.find(d => d._id === deckId);
           if (deck) setTitle(deck.title);
         })
         .catch(error => console.error('Error fetching deck:', error));
     }, [deckId]);

     const handleSubmit = async (e) => {
       e.preventDefault();
       try {
         await axios.put(`http://localhost:5000/api/decks/${deckId}`, { title }, { withCredentials: true });
         navigate('/decks');
       } catch (error) {
         alert('Error updating deck');
       }
     };

     return (
       <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
         <h2 className="text-2xl mb-4">Edit Deck</h2>
         <div className="space-y-4">
           <input
             type="text"
             placeholder="Deck Title"
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             className="w-full p-2 border rounded"
           />
           <button onClick={handleSubmit} className="w-full bg-blue-600 text-white p-2 rounded">Update</button>
         </div>
       </div>
     );
   }

   export default EditDeck;