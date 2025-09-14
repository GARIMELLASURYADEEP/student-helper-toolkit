document.addEventListener('DOMContentLoaded', () => {
    const timeLeftDisplay = document.getElementById('time-left');
    const startStopBtn = document.getElementById('start-stop-btn');
    const resetBtn = document.getElementById('reset-btn');
    const timerStatus = document.getElementById('timer-status');
    const progressBar = document.getElementById('progress-bar');

    const FOCUS_TIME = 25 * 60;
    const BREAK_TIME = 5 * 60;
    const radius = progressBar.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    let timerId = null;
    let timeLeft = FOCUS_TIME;
    let isRunning = false;
    let isFocusMode = true;
    let totalTime = FOCUS_TIME;

    progressBar.style.strokeDasharray = circumference;
    progressBar.style.strokeDashoffset = circumference;

    const updateDisplay = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeLeftDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const progress = (totalTime - timeLeft) / totalTime;
        const offset = circumference * (1 - progress);
        progressBar.style.strokeDashoffset = offset;
    };

    const startTimer = () => {
        isRunning = true;
        startStopBtn.textContent = 'Pause';
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerId);
                switchMode();
            }
        }, 1000);
    };

    const pauseTimer = () => {
        isRunning = false;
        startStopBtn.textContent = 'Start';
        clearInterval(timerId);
    };

    const resetTimer = () => {
        pauseTimer();
        isFocusMode = true;
        timeLeft = FOCUS_TIME;
        totalTime = FOCUS_TIME;
        timerStatus.textContent = 'Focus';
        updateDisplay();
    };

    const switchMode = () => {
        pauseTimer();
        isFocusMode = !isFocusMode;
        timeLeft = isFocusMode ? FOCUS_TIME : BREAK_TIME;
        totalTime = isFocusMode ? FOCUS_TIME : BREAK_TIME;
        timerStatus.textContent = isFocusMode ? 'Focus' : 'Break';
        updateDisplay();
        // Optional: Auto-start next session
        startTimer();
    };

    startStopBtn.addEventListener('click', () => {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });

    resetBtn.addEventListener('click', resetTimer);

    updateDisplay();
});
