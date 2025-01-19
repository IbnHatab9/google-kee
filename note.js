// Variables globales
let notes = [];
let currentNoteColor = '#ffffff';

// Éléments du DOM
const noteInput = document.getElementById('noteInput');
const noteTitleInput = document.getElementById('noteTitleInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesContainer = document.getElementById('notes-container');
const colorPicker = document.getElementById('colorPicker');
const colorPalette = document.querySelector('.color-palette');
const searchInput = document.getElementById('searchInput');

// Gestionnaire de couleurs
colorPicker.addEventListener('click', (e) => {
    const rect = colorPicker.getBoundingClientRect();
    colorPalette.style.top = `${rect.bottom + 5}px`;
    colorPalette.style.left = `${rect.left}px`;
    colorPalette.classList.toggle('hidden');
    e.stopPropagation();
});

document.addEventListener('click', () => {
    colorPalette.classList.add('hidden');
});

document.querySelectorAll('.color-option').forEach(option => {
    option.style.backgroundColor = option.dataset.color;
    option.addEventListener('click', () => {
        currentNoteColor = option.dataset.color;
        noteInput.style.backgroundColor = currentNoteColor;
    });
});

// Création de note
function createNote(title, content, color) {
    return {
        id: Date.now(),
        title,
        content,
        color,
        createdAt: new Date().toISOString()
    };
}

function createNoteElement(note) {
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.style.backgroundColor = note.color;

    const title = document.createElement('div');
    title.className = 'note-title';
    title.textContent = note.title;

    const content = document.createElement('div');
    content.className = 'note-content';
    content.textContent = note.content;

    const actions = document.createElement('div');
    actions.className = 'note-actions';

    const editBtn = document.createElement('i');
    editBtn.className = 'fas fa-edit';
    editBtn.title = 'Modifier';
    editBtn.onclick = () => editNote(note.id);

    const colorBtn = document.createElement('i');
    colorBtn.className = 'fas fa-palette';
    colorBtn.title = 'Couleur';
    colorBtn.onclick = () => changeNoteColor(note.id);

    const deleteBtn = document.createElement('i');
    deleteBtn.className = 'fas fa-trash';
    deleteBtn.title = 'Supprimer';
    deleteBtn.onclick = () => deleteNote(note.id);

    actions.appendChild(editBtn);
    actions.appendChild(colorBtn);
    actions.appendChild(deleteBtn);

    noteElement.appendChild(title);
    noteElement.appendChild(content);
    noteElement.appendChild(actions);

    return noteElement;
}

// Ajout d'une note
addNoteBtn.addEventListener('click', () => {
    const title = noteTitleInput.value.trim();
    const content = noteInput.value.trim();

    if (content || title) {
        const note = createNote(title, content, currentNoteColor);
        notes.unshift(note);
        renderNotes();
        resetNoteInput();
        saveNotes();
    }
});

// Gestion des notes
function renderNotes() {
    notesContainer.innerHTML = '';
    notes.forEach(note => {
        const noteElement = createNoteElement(note);
        notesContainer.appendChild(noteElement);
    });
}

function resetNoteInput() {
    noteTitleInput.value = '';
    noteInput.value = '';
    currentNoteColor = '#ffffff';
    noteInput.style.backgroundColor = '#ffffff';
}

function editNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        noteTitleInput.value = note.title;
        noteInput.value = note.content;
        currentNoteColor = note.color;
        noteInput.style.backgroundColor = note.color;
        notes = notes.filter(n => n.id !== noteId);
        renderNotes();
        saveNotes();
        noteTitleInput.focus();
    }
}

function deleteNote(noteId) {
    notes = notes.filter(note => note.id !== noteId);
    renderNotes();
    saveNotes();
}

function changeNoteColor(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        const colors = ['#ffffff', '#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8'];
        const currentIndex = colors.indexOf(note.color);
        const nextIndex = (currentIndex + 1) % colors.length;
        note.color = colors[nextIndex];
        renderNotes();
        saveNotes();
    }
}

// Recherche
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm) || 
        note.content.toLowerCase().includes(searchTerm)
    );
    notesContainer.innerHTML = '';
    filteredNotes.forEach(note => {
        const noteElement = createNoteElement(note);
        notesContainer.appendChild(noteElement);
    });
});

// Stockage local
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        renderNotes();
    }
}

// Initialisation
loadNotes();
