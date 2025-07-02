import React, { useState, useEffect } from 'react';
   import { Link, useNavigate } from 'react-router-dom';
   import axios from 'axios';

   function DeckList() {
     const [decks, setDecks] = useState([]);
     const navigate = useNavigate();

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
       <div>
         <h2 className="text-2xl mb-4"><center>My Decks</center></h2>
         <Link to="/decks/create" className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block">Create New Deck</Link>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {decks.map(deck => (
             <div key={deck._id} className="bg-white p-4 rounded shadow">
               <h3 className="text-xl">{deck.title}</h3>
               <div className="mt-2 space-x-2">
                 <Link to={`/decks/${deck._id}/flashcards`} className="text-blue-600">View Flashcards</Link>
                 <Link to={`/decks/${deck._id}/edit`} className="text-yellow-600">Edit</Link>
                 <button onClick={() => handleDelete(deck._id)} className="text-red-600">Delete</button>
                 <Link to={`/decks/${deck._id}/flashcards/create`} className="text-green-600">Add Flashcard</Link>
               </div>
             </div>
           ))}
         </div>
       </div>
     );
   }

   export default DeckList;