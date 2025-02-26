import React from 'react';

function NotesList({ notes, onDelete, onTimeClick }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Your Notes</h2>
      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="bg-gray-700 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <button 
                onClick={() => onTimeClick(note.seconds)}
                className="text-blue-400 hover:text-blue-300"
              >
                {note.timestamp}
              </button>
              <button 
                onClick={() => onDelete(note.id)}
                className="text-gray-400 hover:text-white"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
            <p className="text-gray-200">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotesList; 