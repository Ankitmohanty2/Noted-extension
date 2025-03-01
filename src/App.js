import React, { useEffect } from 'react';
import { NotesProvider, useNotes } from './context/NotesContext';
import NoteInput from './components/NoteInput';
import NotesList from './components/NotesList';

function AppContent() {
  const { notes, addNote, deleteNote, setCurrentVideo } = useNotes();
  
  useEffect(() => {
    // Get current video info when popup opens
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "getVideoInfo"}, (response) => {
        if (response) {
          setCurrentVideo({
            id: response.videoId,
            title: response.videoTitle
          });
        }
      });
    });
  }, []);

  const handleTimeClick = (seconds) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "jumpToTime",
        time: seconds
      });
    });
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Note-ed</h1>
          <p className="text-gray-400">YouTube Video Notes</p>
        </header>

        <main>
          <NoteInput onSave={addNote} />
          <NotesList 
            notes={notes} 
            onDelete={deleteNote}
            onTimeClick={handleTimeClick}
          />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <NotesProvider>
      <AppContent />
    </NotesProvider>
  );
}

export default App;