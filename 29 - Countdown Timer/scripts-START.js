let countdown;
const displayTime = document.querySelector('.display__time-left');
const endTimeDisplay = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('.timer__button');
const form = document.querySelector('#custom');
const minutesInput = form.querySelector('input');

function startCoundDown(seconds) {
    clearInterval(countdown);
    const start = Date.now();
    const end = start + (seconds * 1000);
    displayEndTime(end);

    displayRemainingTime(Math.round(end - start)/1000);
    countdown = setInterval(() => {
        const now = Date.now();
        const timeRemaining = Math.round((end - now) / 1000);
        if (timeRemaining < 0) {
            clearInterval(countdown);
            return;
        }
        displayRemainingTime(timeRemaining);
    }, 1000);
}

function displayRemainingTime(seconds) {
    const remainingMinutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const text = `${remainingMinutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    displayTime.textContent = text;
    document.title = text;
}

function displayEndTime(end) {
    end = new Date(end); 
    const hours = end.getHours();
    const minutes = end.getMinutes();
    endTimeDisplay.textContent = `Be back at ${hours}:${minutes > 9 ? '' : '0'}${minutes}`;
}

buttons.forEach(button => button.addEventListener('click', function() {
    startCoundDown(this.dataset['time']);
}));

form.addEventListener('submit', (e) => {
    e.preventDefault();
    startCoundDown(minutesInput.value * 60);
    minutesInput.reset();
});
