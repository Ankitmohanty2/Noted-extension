import React, { useState } from 'react';

function NoteInput({ onSave }) {
  const [note, setNote] = useState('');
  const [folder, setFolder] = useState('Default');

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <textarea 
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter your note here..."
        rows="4"
      />
      <div className="flex gap-2 mt-2">
        <select 
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          className="flex-grow bg-gray-700 text-white rounded-lg p-2"
        >
          <option value="Default">Default Folder</option>
          {/* Add more folders dynamically */}
        </select>
        <button 
          onClick={() => onSave(note, folder)}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          Save Note
        </button>
      </div>
    </div>
  );
}

export default NoteInput; 