import React, { createContext, useContext, useState, useEffect } from 'react';

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    // Load notes from chrome.storage.sync
    chrome.storage.sync.get(['notes'], (result) => {
      setNotes(result.notes || []);
    });
  }, []);

  const addNote = (content, folder, timestamp, seconds) => {
    const newNote = {
      id: Date.now().toString(),
      content,
      folder,
      timestamp,
      seconds,
      videoId: currentVideo?.id,
      videoTitle: currentVideo?.title,
      created: new Date().toISOString()
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    chrome.storage.sync.set({ notes: updatedNotes });
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    chrome.storage.sync.set({ notes: updatedNotes });
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote, currentVideo, setCurrentVideo }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
} 