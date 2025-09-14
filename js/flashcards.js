document.addEventListener('DOMContentLoaded', () => {
    const flashcard = document.getElementById('flashcard');
    const flashcardFront = document.getElementById('flashcard-front');
    const flashcardBack = document.getElementById('flashcard-back');
    const prevBtn = document.getElementById('prev-card');
    const nextBtn = document.getElementById('next-card');
    const shuffleBtn = document.getElementById('shuffle-cards');
    const cardCounter = document.getElementById('card-counter');
    const addCardBtn = document.getElementById('add-card-btn');
    const cardModal = document.getElementById('card-modal');
    const closeModalBtn = cardModal.querySelector('.close-btn');
    const cardForm = document.getElementById('card-form');

    let cards = JSON.parse(localStorage.getItem('flashcards-app-cards') || '[]');
    let currentIndex = 0;

    const saveCards = () => {
        localStorage.setItem('flashcards-app-cards', JSON.stringify(cards));
    };

    const updateCardDisplay = () => {
        if (cards.length === 0) {
            flashcardFront.textContent = 'No cards yet. Add one!';
            flashcardBack.textContent = '';
            cardCounter.textContent = '0 / 0';
            return;
        }
        flashcard.classList.remove('is-flipped');
        setTimeout(() => {
            flashcardFront.textContent = cards[currentIndex].question;
            flashcardBack.textContent = cards[currentIndex].answer;
            cardCounter.textContent = `${currentIndex + 1} / ${cards.length}`;
        }, 150); // Wait for flip back animation
    };

    flashcard.addEventListener('click', () => {
        if (cards.length > 0) {
            flashcard.classList.toggle('is-flipped');
        }
    });

    nextBtn.addEventListener('click', () => {
        if (cards.length > 0) {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCardDisplay();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (cards.length > 0) {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCardDisplay();
        }
    });

    shuffleBtn.addEventListener('click', () => {
        if (cards.length > 1) {
            for (let i = cards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cards[i], cards[j]] = [cards[j], cards[i]];
            }
            currentIndex = 0;
            updateCardDisplay();
        }
    });

    const openModal = () => cardModal.classList.add('active');
    const closeModal = () => cardModal.classList.remove('active');

    addCardBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === cardModal) closeModal();
    });

    cardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const question = document.getElementById('card-question').value.trim();
        const answer = document.getElementById('card-answer').value.trim();

        if (question && answer) {
            cards.push({ question, answer });
            saveCards();
            if (cards.length === 1) {
                currentIndex = 0;
            }
            updateCardDisplay();
            cardForm.reset();
            closeModal();
        }
    });

    updateCardDisplay();
});
