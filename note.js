
let notes = [];
let currentNoteColor = '#ffffff';
let isGridView = true;

// je recupére les DOM éléments
const noteInput = document.getElementById('noteInput');
const noteTitleInput = document.getElementById('noteTitleInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesContainer = document.getElementById('notesContainer');
const colorPicker = document.getElementById('colorPicker');
const colorPalette = document.querySelector('.color-palette');
const searchInput = document.getElementById('searchInput');
const gridViewBtn = document.getElementById('gridView');
const listViewBtn = document.getElementById('listView');
const menuIcon = document.querySelector('.menu-icon');
const sidebar = document.querySelector('.sidebar');
const noteInputContainer = document.querySelector('.note-input');
const noteTools = document.querySelector('.note-tools');

// Expand note input
function expandNoteInput() {
    noteInputContainer.classList.remove('collapsed');
    noteTools.classList.remove('hidden');
}

// Toggle sidebar
menuIcon.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    document.querySelector('.container').classList.toggle('sidebar-collapsed');
});


colorPicker.addEventListener('click', (e) => {
    const rect = colorPicker.getBoundingClientRect();
    colorPalette.style.top = `${rect.bottom + 5}px`;
    colorPalette.style.left = `${rect.left}px`;
    colorPalette.classList.toggle('hidden');
    e.stopPropagation();
});

document.addEventListener('click', (e) => {
    if (!noteInputContainer.contains(e.target)) {
        noteInputContainer.classList.add('collapsed');
        noteTools.classList.add('hidden');
    }
    colorPalette.classList.add('hidden');
});

document.querySelectorAll('.color-option').forEach(option => {
    const color = option.dataset.color;
    option.style.backgroundColor = color;
    option.addEventListener('click', () => {
        currentNoteColor = color;
        noteInputContainer.style.backgroundColor = color;
    });
});

// fonctionnalité pour la barre de recher
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm) || 
        note.content.toLowerCase().includes(searchTerm)
    );
    renderNotes(filteredNotes);
});

// Note creation
addNoteBtn.addEventListener('click', () => {
    const title = noteTitleInput.value.trim();
    const content = noteInput.value.trim();
    
    if (content || title) {
        const note = {
            id: Date.now(),
            title,
            content,
            color: currentNoteColor,
            isPinned: false,
            isArchived: false,
            createdAt: new Date().toISOString()
        };
        
        notes.unshift(note);
        saveNotes();
        resetNoteInput();
        renderNotes(notes);
    }
    
    // Collapse the note input after saving
    noteInputContainer.classList.add('collapsed');
    noteTools.classList.add('hidden');
});

function resetNoteInput() {
    noteTitleInput.value = '';
    noteInput.value = '';
    currentNoteColor = '#ffffff';
    noteInputContainer.style.backgroundColor = '#ffffff';
}

function createNoteElement(note) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.style.backgroundColor = note.color;
    
    const pinIcon = document.createElement('i');
    pinIcon.classList.add('fas', 'fa-thumbtack', 'pinned');
    if (note.isPinned) pinIcon.classList.add('active');
    
    noteDiv.innerHTML = `
        ${note.title ? `<div class="note-title">${note.title}</div>` : ''}
        <div class="note-content">${note.content}</div>
        <div class="note-actions">
            <i class="fas fa-palette" onclick="changeNoteColor(${note.id})"></i>
            <i class="fas fa-archive" onclick="archiveNote(${note.id})"></i>
            <i class="fas fa-trash" onclick="deleteNote(${note.id})"></i>
        </div>
    `;
    
    noteDiv.appendChild(pinIcon);
    pinIcon.addEventListener('click', () => togglePin(note.id));
    
    return noteDiv;
}

function renderNotes(notesToRender) {
    notesContainer.innerHTML = '';
    
    const pinnedNotes = notesToRender.filter(note => note.isPinned && !note.isArchived);
    const unpinnedNotes = notesToRender.filter(note => !note.isPinned && !note.isArchived);
    
    if (pinnedNotes.length > 0) {
        const pinnedSection = document.createElement('div');
        pinnedSection.innerHTML = '<h2>Notes épinglées</h2>';
        pinnedNotes.forEach(note => {
            pinnedSection.appendChild(createNoteElement(note));
        });
        notesContainer.appendChild(pinnedSection);
    }
    
    if (unpinnedNotes.length > 0) {
        const unpinnedSection = document.createElement('div');
        if (pinnedNotes.length > 0) {
            unpinnedSection.innerHTML = '<h2>Autres notes</h2>';
        }
        unpinnedNotes.forEach(note => {
            unpinnedSection.appendChild(createNoteElement(note));
        });
        notesContainer.appendChild(unpinnedSection);
    }
}

// Note actions
function togglePin(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        note.isPinned = !note.isPinned;
        saveNotes();
        renderNotes(notes);
    }
}

function archiveNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        note.isArchived = true;
        saveNotes();
        renderNotes(notes);
    }
}

function deleteNote(noteId) {
    notes = notes.filter(note => note.id !== noteId);
    saveNotes();
    renderNotes(notes);
}

function changeNoteColor(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        const colorPaletteClone = colorPalette.cloneNode(true);
        colorPaletteClone.classList.remove('hidden');
        const noteElement = event.target.closest('.note');
        colorPaletteClone.style.position = 'absolute';
        colorPaletteClone.style.top = `${event.clientY}px`;
        colorPaletteClone.style.left = `${event.clientX}px`;
        
        colorPaletteClone.querySelectorAll('.color-option').forEach(option => {
            const color = option.dataset.color;
            option.style.backgroundColor = color;
            option.addEventListener('click', () => {
                note.color = color;
                saveNotes();
                renderNotes(notes);
                document.body.removeChild(colorPaletteClone);
            });
        });
        
        document.body.appendChild(colorPaletteClone);
        event.stopPropagation();
    }
}

// Local storage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        renderNotes(notes);
    }
}

// Initialize
loadNotes();
