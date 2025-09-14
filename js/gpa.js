document.addEventListener('DOMContentLoaded', () => {
    const gpaForm = document.getElementById('gpa-form');
    const coursesList = document.getElementById('courses-list');
    const gpaValue = document.getElementById('gpa-value');

    let courses = JSON.parse(localStorage.getItem('gpa-courses') || '[]');

    const saveCourses = () => {
        localStorage.setItem('gpa-courses', JSON.stringify(courses));
    };

    const calculateGPA = () => {
        if (courses.length === 0) {
            gpaValue.textContent = '0.00';
            return;
        }

        let totalCredits = 0;
        let totalPoints = 0;

        courses.forEach(course => {
            totalCredits += parseFloat(course.credits);
            totalPoints += parseFloat(course.credits) * parseFloat(course.grade);
        });

        const gpa = totalPoints / totalCredits;
        gpaValue.textContent = gpa.toFixed(2);
    };

    const renderCourses = () => {
        coursesList.innerHTML = '';
        courses.forEach((course, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.name}</td>
                <td>${course.credits}</td>
                <td>${course.gradeText}</td>
                <td>
                    <button class="delete-course-btn" data-index="${index}" title="Delete course">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </td>
            `;
            coursesList.appendChild(row);
        });
        calculateGPA();
    };

    gpaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('course-name');
        const creditsInput = document.getElementById('course-credits');
        const gradeSelect = document.getElementById('course-grade');

        const newCourse = {
            name: nameInput.value || 'Untitled Course',
            credits: creditsInput.value,
            grade: gradeSelect.value,
            gradeText: gradeSelect.options[gradeSelect.selectedIndex].text
        };

        courses.push(newCourse);
        saveCourses();
        renderCourses();
        gpaForm.reset();
    });

    coursesList.addEventListener('click', (e) => {
        if (e.target.closest('.delete-course-btn')) {
            const index = e.target.closest('.delete-course-btn').dataset.index;
            courses.splice(index, 1);
            saveCourses();
            renderCourses();
        }
    });

    renderCourses();
});
