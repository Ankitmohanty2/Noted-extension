document.addEventListener('DOMContentLoaded', () => {
    const captureBtn = document.getElementById('captureTimestamp');
    const timestampDisplay = document.getElementById('currentTimestamp');
    const noteContent = document.getElementById('noteContent');
    const folderSelect = document.getElementById('folderSelect');
    const saveNote = document.getElementById('saveNote');
    const notesList = document.getElementById('notesList');
    const loadingState = document.getElementById('loadingState');
    const errorMessage = document.getElementById('errorMessage');
    const newFolderBtn = document.getElementById('newFolder');

    let currentVideoId = '';
    let currentVideoTitle = '';

    const showLoading = () => loadingState.classList.remove('hidden');
    const hideLoading = () => loadingState.classList.add('hidden');
    const showError = (message) => {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        setTimeout(() => errorMessage.classList.add('hidden'), 3000);
    };
  
    const loadFolders = () => {
      showLoading();
      chrome.storage.sync.get(['folders'], (result) => {
        const folders = result.folders || ['Default'];
        folderSelect.innerHTML = folders.map(folder => 
          `<option value="${folder}">${folder}</option>`
        ).join('');
        hideLoading();
      });
    };

    newFolderBtn.addEventListener('click', () => {
      const folderName = prompt('Enter new folder name:');
      if (!folderName) return;

      chrome.storage.sync.get(['folders'], (result) => {
        const folders = result.folders || ['Default'];
        if (folders.includes(folderName)) {
          showError('Folder already exists');
          return;
        }
        folders.push(folderName);
        chrome.storage.sync.set({ folders }, () => {
          loadFolders();
          folderSelect.value = folderName;
        });
      });
    });
  
    const displayNotes = () => {
      chrome.storage.sync.get(['notes'], (result) => {
        const notes = result.notes || [];
        const currentVideoNotes = notes.filter(note => note.videoId === currentVideoId);
        
        notesList.innerHTML = currentVideoNotes.map(note => `
          <div class="note-item bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div class="flex justify-between items-center mb-2">
              <span class="text-blue-500 font-medium cursor-pointer hover:text-blue-600" 
                    data-timestamp="${note.seconds}">
                ${note.timestamp}
              </span>
              <span class="text-gray-500 text-sm">${note.folder}</span>
            </div>
            <p class="text-gray-700">${note.content}</p>
            <div class="flex justify-end mt-2">
              <button class="delete-note text-red-500 hover:text-red-600 text-sm" 
                      data-id="${note.id}">
                Delete
              </button>
            </div>
          </div>
        `).join('');
  
        // Add click handlers for timestamps and delete buttons
        document.querySelectorAll('[data-timestamp]').forEach(el => {
          el.addEventListener('click', () => {
            const seconds = parseInt(el.dataset.timestamp);
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: "jumpToTime",
                time: seconds
              });
            });
          });
        });
  
        document.querySelectorAll('.delete-note').forEach(el => {
          el.addEventListener('click', () => {
            const noteId = el.dataset.id;
            chrome.storage.sync.get(['notes'], (result) => {
              const updatedNotes = result.notes.filter(note => note.id !== noteId);
              chrome.storage.sync.set({ notes: updatedNotes }, () => {
                displayNotes();
              });
            });
          });
        });
      });
    };
  
    captureBtn.addEventListener('click', () => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "getCurrentTime"}, (response) => {
          if (response) {
            timestampDisplay.textContent = response.time;
            currentVideoId = response.videoId;
            currentVideoTitle = response.videoTitle;
          }
        });
      });
    });
  
    saveNote.addEventListener('click', () => {
      const content = noteContent.value.trim();
      if (!content) {
        showError('Please enter a note');
        return;
      }
      if (!timestampDisplay.textContent) {
        showError('Please capture a timestamp first');
        return;
      }
      if (!folderSelect.value) {
        showError('Please select a folder');
        return;
      }

      showLoading();
  
      chrome.storage.sync.get(['notes'], (result) => {
        const notes = result.notes || [];
        const newNote = {
          id: Date.now().toString(),
          timestamp: timestampDisplay.textContent,
          seconds: parseInt(timestampDisplay.dataset.seconds),
          content: noteContent.value.trim(),
          folder: folderSelect.value || 'Default',
          videoId: currentVideoId,
          videoTitle: currentVideoTitle,
          created: new Date().toISOString()
        };
  
        notes.push(newNote);
        chrome.storage.sync.set({ notes }, () => {
          noteContent.value = '';
          timestampDisplay.textContent = '';
          displayNotes();
        });
      });
    });
  
    // Initialize
    loadFolders();
    
    // Get current video info and display relevant notes
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "getVideoInfo"}, (response) => {
        if (response) {
          currentVideoId = response.videoId;
          currentVideoTitle = response.videoTitle;
          displayNotes();
        }
      });
    });
  });