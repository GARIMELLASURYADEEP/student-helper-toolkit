document.addEventListener('DOMContentLoaded', () => {
    const addNoteBtn = document.getElementById('add-note-btn');
    const noteModal = document.getElementById('note-modal');
    const closeModalBtn = noteModal.querySelector('.close-btn');
    const noteForm = document.getElementById('note-form');
    const notesGrid = document.getElementById('notes-grid');
    const searchInput = document.getElementById('search-notes');
    const modalTitle = document.getElementById('modal-title');
    const noteIdInput = document.getElementById('note-id');
    const noteTitleInput = document.getElementById('note-title');
    const noteContentInput = document.getElementById('note-content');

    const getNotes = () => JSON.parse(localStorage.getItem('notes-app-notes') || '[]');
    const saveNotes = (notes) => localStorage.setItem('notes-app-notes', JSON.stringify(notes));

    const openModal = (note = null) => {
        noteForm.reset();
        if (note) {
            modalTitle.textContent = 'Edit Note';
            noteIdInput.value = note.id;
            noteTitleInput.value = note.title;
            noteContentInput.value = note.content;
        } else {
            modalTitle.textContent = 'Add New Note';
            noteIdInput.value = '';
        }
        noteModal.classList.add('active');
    };

    const closeModal = () => {
        noteModal.classList.remove('active');
    };

    const createNoteElement = (note) => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        noteCard.dataset.id = note.id;

        noteCard.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <div class="note-card-footer">
                <button class="note-btn edit" title="Edit note">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="note-btn delete" title="Delete note">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        `;

        noteCard.querySelector('.edit').addEventListener('click', () => {
            const notes = getNotes();
            const noteToEdit = notes.find(n => n.id == note.id);
            openModal(noteToEdit);
        });

        noteCard.querySelector('.delete').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this note?')) {
                let notes = getNotes();
                notes = notes.filter(n => n.id != note.id);
                saveNotes(notes);
                renderNotes();
            }
        });

        return noteCard;
    };

    const renderNotes = () => {
        const notes = getNotes();
        const searchTerm = searchInput.value.toLowerCase();
        notesGrid.innerHTML = '';

        const filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) || 
            note.content.toLowerCase().includes(searchTerm)
        );

        filteredNotes.sort((a, b) => b.timestamp - a.timestamp).forEach(note => {
            notesGrid.appendChild(createNoteElement(note));
        });
    };

    addNoteBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === noteModal) {
            closeModal();
        }
    });

    noteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const notes = getNotes();
        const id = noteIdInput.value;
        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();

        if (id) { // Editing existing note
            const noteIndex = notes.findIndex(n => n.id == id);
            if (noteIndex > -1) {
                notes[noteIndex].title = title;
                notes[noteIndex].content = content;
                notes[noteIndex].timestamp = Date.now();
            }
        } else { // Adding new note
            const newNote = {
                id: Date.now(),
                title,
                content,
                timestamp: Date.now()
            };
            notes.push(newNote);
        }

        saveNotes(notes);
        renderNotes();
        closeModal();
    });

    searchInput.addEventListener('input', renderNotes);

    renderNotes();
});
