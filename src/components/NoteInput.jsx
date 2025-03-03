import React, { useState } from 'react';

function NoteInput({ onSave }) {
  const [note, setNote] = useState('');
  const [folder, setFolder] = useState('Default');
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-5 mb-6 shadow-xl border border-gray-700/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-3 w-3 rounded-full bg-red-500"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
      </div>
      
      <textarea 
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onFocus={() => setIsExpanded(true)}
        className="w-full bg-gray-700/50 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out resize-none"
        placeholder="✍️ Take a note..."
        rows={isExpanded ? "4" : "2"}
      />
      
      {isExpanded && (
        <div className="flex gap-3 mt-4 animate-fadeIn">
          <select 
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="flex-grow bg-gray-700/50 text-white rounded-lg p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Default">📁 Default Folder</option>
            <option value="Important">⭐ Important</option>
            <option value="Watch Later">⏰ Watch Later</option>
            <option value="Favorites">❤️ Favorites</option>
          </select>
          
          <button 
            onClick={() => {
              if (note.trim()) {
                onSave(note, folder);
                setNote('');
                setIsExpanded(false);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center gap-2"
          >
            <span>Save</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default NoteInput; 