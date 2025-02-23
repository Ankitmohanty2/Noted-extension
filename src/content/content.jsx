// Inject custom styles for the note-taking sidebar
const styles = `
  .note-ed-sidebar {
    position: fixed;
    right: 0;
    top: 0;
    width: 300px;
    height: 100vh;
    background: white;
    box-shadow: -2px 0 5px rgba(0,0,0,0.1);
    z-index: 9999;
    padding: 20px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    overflow-y: auto;  /* Add scrolling for long content */
  }

  .note-ed-sidebar.open {
    transform: translateX(0);
  }

  .note-ed-toggle {
    position: fixed;
    right: 20px;
    top: 20px;
    z-index: 10000;
    padding: 10px;
    background: #4285f4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .note-item {
    border-bottom: 1px solid #eee;
    padding: 10px 0;
  }

  .timestamp-btn {
    background: #4285f4;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    margin: 5px 0;
  }

  .note-controls {
    margin: 10px 0;
  }

  .note-textarea {
    width: 100%;
    height: 100px;
    margin: 10px 0;
    padding: 5px;
    resize: vertical;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .close-sidebar {
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
  }
`;

// Inject styles into the page
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Create and inject the sidebar HTML
const sidebarHTML = `
  <button class="note-ed-toggle">📝 Notes</button>
  <div class="note-ed-sidebar">
    <div class="sidebar-header">
      <h2>Video Notes</h2>
      <button class="close-sidebar">×</button>
    </div>
    <div class="note-controls">
      <button id="captureTimestamp" class="timestamp-btn">Capture Current Time</button>
      <div id="currentTimestamp"></div>
      <textarea id="noteContent" class="note-textarea" placeholder="Enter your note here..."></textarea>
      <select id="folderSelect">
        <option value="Default">Default Folder</option>
      </select>
      <button id="saveNote" class="timestamp-btn">Save Note</button>
    </div>
    <div id="notesList"></div>
  </div>
`;

// Create container for the sidebar
const container = document.createElement('div');
container.innerHTML = sidebarHTML;
document.body.appendChild(container);

// Initialize variables
let currentVideoId = null;
let currentVideoTitle = null;

// Helper function to get video ID from URL
function getVideoId(url) {
  const urlParams = new URLSearchParams(new URL(url).search);
  return urlParams.get('v');
}

// Helper function to format time
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Helper function to create timestamp URL
function createTimestampUrl(videoId, seconds) {
  return `https://youtube.com/watch?v=${videoId}&t=${Math.floor(seconds)}s`;
}

// Initialize sidebar functionality
function initializeSidebar() {
  const toggle = document.querySelector('.note-ed-toggle');
  const sidebar = document.querySelector('.note-ed-sidebar');
  const captureBtn = document.getElementById('captureTimestamp');
  const timestampDisplay = document.getElementById('currentTimestamp');
  const noteContent = document.getElementById('noteContent');
  const folderSelect = document.getElementById('folderSelect');
  const saveNote = document.getElementById('saveNote');
  const notesList = document.getElementById('notesList');

  // Toggle sidebar
  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Add close button functionality
  const closeBtn = document.querySelector('.close-sidebar');
  closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
  });

  // Load folders
  chrome.storage.sync.get(['folders'], (result) => {
    if (chrome.runtime.lastError) {
      console.error('Error loading folders:', chrome.runtime.lastError);
      return;
    }
    const folders = result.folders || ['Default'];
    folderSelect.innerHTML = ''; // Clear existing options
    folders.forEach(folder => {
      const option = document.createElement('option');
      option.value = folder;
      option.textContent = folder;
      folderSelect.appendChild(option);
    });
  });

  // Capture timestamp
  captureBtn.addEventListener('click', () => {
    const video = document.querySelector('video');
    if (video) {
      const currentTime = video.currentTime;
      const formattedTime = formatTime(currentTime);
      timestampDisplay.textContent = formattedTime;
      timestampDisplay.dataset.seconds = currentTime;
    }
  });

  // Save note
  saveNote.addEventListener('click', () => {
    const timestamp = timestampDisplay.textContent;
    const seconds = parseFloat(timestampDisplay.dataset.seconds);
    const note = noteContent.value.trim();
    const folder = folderSelect.value;
    
    if (!note) {
      alert('Please enter a note');
      return;
    }
    if (!timestamp) {
      alert('Please capture a timestamp first');
      return;
    }

    const noteData = {
      timestamp,
      seconds,
      note,
      videoId: currentVideoId,
      videoTitle: currentVideoTitle,
      videoUrl: createTimestampUrl(currentVideoId, seconds),
      createdAt: new Date().toISOString()
    };

    chrome.storage.sync.get(['notes'], (result) => {
      const notes = result.notes || {};
      if (!notes[folder]) notes[folder] = [];
      notes[folder].push(noteData);

      chrome.storage.sync.set({ notes }, () => {
        noteContent.value = '';
        timestampDisplay.textContent = '';
        displayNotes();
      });
    });
  });

  // Display notes for current video
  function displayNotes() {
    chrome.storage.sync.get(['notes'], (result) => {
      const notes = result.notes || {};
      const currentFolder = folderSelect.value;
      
      notesList.innerHTML = '';
      if (notes[currentFolder]) {
        const videoNotes = notes[currentFolder]
          .filter(note => note.videoId === currentVideoId)
          .sort((a, b) => a.seconds - b.seconds);

        videoNotes.forEach(note => {
          const noteElement = document.createElement('div');
          noteElement.className = 'note-item';
          noteElement.innerHTML = `
            <strong>${note.timestamp}</strong>
            <p>${note.note}</p>
            <a href="${note.videoUrl}" target="_blank">Jump to timestamp</a>
          `;
          notesList.appendChild(noteElement);
        });
      }
    });
  }

  // Update notes when folder selection changes
  folderSelect.addEventListener('change', displayNotes);

  // Initial display of notes
  displayNotes();
}

// Listen for video page navigation
function handleVideoChange() {
  const videoId = getVideoId(window.location.href);
  if (videoId && videoId !== currentVideoId) {
    currentVideoId = videoId;
    currentVideoTitle = document.querySelector('h1.ytd-video-primary-info-renderer')?.textContent || '';
    // Reset and update notes display
    const timestampDisplay = document.getElementById('currentTimestamp');
    const noteContent = document.getElementById('noteContent');
    if (timestampDisplay) timestampDisplay.textContent = '';
    if (noteContent) noteContent.value = '';
    const notesList = document.getElementById('notesList');
    if (notesList) notesList.innerHTML = '';
  }
}

// Initialize when page loads
initializeSidebar();
handleVideoChange();

// Listen for URL changes (for single-page-application navigation)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    handleVideoChange();
  }
}).observe(document, { subtree: true, childList: true });

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCurrentTime") {
    const video = document.querySelector('video');
    if (video) {
      const currentTime = Math.floor(video.currentTime);
      sendResponse({ 
        time: formatTime(currentTime),
        seconds: currentTime,
        videoId: currentVideoId,
        videoTitle: currentVideoTitle
      });
    }
  }
  return true;
});