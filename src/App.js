import React from 'react';
import './App.css';

function App() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Note-ed</h1>
          <p className="text-gray-400">YouTube Video Notes</p>
        </header>

        <main>
          {/* Note Taking Section */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg mb-4"
            >
              Capture Current Time
            </button>

            <div className="mb-4">
              <textarea 
                className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your note here..."
                rows="4"
              />
            </div>

            <div className="flex gap-2 mb-4">
              <select 
                className="flex-grow bg-gray-700 text-white rounded-lg p-2"
              >
                <option value="">Select Folder...</option>
                <option value="default">Default Folder</option>
              </select>

              <button 
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Save Note
              </button>
            </div>
          </div>

          {/* Notes List */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Your Notes</h2>
            <div className="space-y-3">
              {/* Note items will be rendered here */}
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-blue-400">00:00:00</span>
                  <button className="text-gray-400 hover:text-white">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
                <p className="text-gray-200">Your note text will appear here...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;