document.addEventListener('DOMContentLoaded', () => {
    const monthYearDisplay = document.getElementById('month-year');
    const calendarDays = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const reminderModal = document.getElementById('reminder-modal');
    const closeModalBtn = reminderModal.querySelector('.close-btn');
    const reminderDateDisplay = document.getElementById('reminder-date');
    const reminderList = document.getElementById('reminder-list');
    const reminderForm = document.getElementById('reminder-form');
    const reminderTextInput = document.getElementById('reminder-text');

    let currentDate = new Date();
    let selectedDateKey = '';

    const getReminders = () => JSON.parse(localStorage.getItem('calendar-reminders') || '{}');
    const saveReminders = (reminders) => localStorage.setItem('calendar-reminders', JSON.stringify(reminders));

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const today = new Date();

        monthYearDisplay.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
        calendarDays.innerHTML = '';

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const reminders = getReminders();

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.innerHTML += `<div class="calendar-day padding"></div>`;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('calendar-day');
            dayEl.textContent = day;
            const dateKey = `${year}-${month + 1}-${day}`;
            dayEl.dataset.date = dateKey;

            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayEl.classList.add('today');
            }
            if (reminders[dateKey] && reminders[dateKey].length > 0) {
                dayEl.classList.add('has-reminder');
            }

            dayEl.addEventListener('click', () => openReminderModal(dateKey));
            calendarDays.appendChild(dayEl);
        }
    };

    const openReminderModal = (dateKey) => {
        selectedDateKey = dateKey;
        const [year, month, day] = dateKey.split('-');
        const dateObj = new Date(year, month - 1, day);
        reminderDateDisplay.textContent = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        renderRemindersForDate(dateKey);
        reminderModal.classList.add('active');
    };

    const renderRemindersForDate = (dateKey) => {
        const reminders = getReminders();
        const dayReminders = reminders[dateKey] || [];
        reminderList.innerHTML = '';
        dayReminders.forEach((text, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${text}</span>
                <button class="delete-reminder-btn" data-index="${index}" title="Delete reminder">&times;</button>
            `;
            reminderList.appendChild(li);
        });
    };

    const closeModal = () => {
        reminderModal.classList.remove('active');
    };

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === reminderModal) closeModal();
    });

    reminderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const reminderText = reminderTextInput.value.trim();
        if (reminderText) {
            const reminders = getReminders();
            if (!reminders[selectedDateKey]) {
                reminders[selectedDateKey] = [];
            }
            reminders[selectedDateKey].push(reminderText);
            saveReminders(reminders);
            renderRemindersForDate(selectedDateKey);
            renderCalendar(); // To update the dot indicator
            reminderForm.reset();
        }
    });

    reminderList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-reminder-btn')) {
            const index = e.target.dataset.index;
            const reminders = getReminders();
            reminders[selectedDateKey].splice(index, 1);
            if (reminders[selectedDateKey].length === 0) {
                delete reminders[selectedDateKey];
            }
            saveReminders(reminders);
            renderRemindersForDate(selectedDateKey);
            renderCalendar(); // To update the dot indicator
        }
    });

    renderCalendar();
});
