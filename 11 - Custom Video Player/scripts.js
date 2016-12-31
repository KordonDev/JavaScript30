// Get elements
const video = document.querySelector('video');
const playButton = document.querySelector('.toggle');
const skipButtons = document.querySelectorAll('[data-skip]');
const ranges = document.querySelectorAll('input[type=range]');
const progressBar = document.querySelector('div.progress__filled');
const progress = document.querySelector('div.progress');

let clickedOnRange = false;
let clickOnProgress = false;

// Build functions
function togglePlay() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeChange (event) {
    if (clickedOnRange || event.type === 'change') {
        video[this.name] = this.value;
    }
}

function handleScrub(e) {
    if (clickOnProgress || e.type === 'click') {
        let newTime = (e.offsetX / progress.offsetWidth) * video.duration;
        video.currentTime = newTime;
    }
}

function handleProgress() {
    let percent = (video.currentTime / video.duration) * 100; 
    progressBar.style.flexBasis = `${percent}%`;
}

// Hook everything up
playButton.addEventListener('click', togglePlay);

video.addEventListener('click', togglePlay);
video.addEventListener('pause', () => playButton.innerHTML = '►');
video.addEventListener('play', () => playButton.innerHTML = 'II');
video.addEventListener('timeupdate', handleProgress);

skipButtons.forEach(button => {
    button.addEventListener('click', skip);
});

ranges.forEach(range => range.addEventListener('change', handleRangeChange));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeChange));
ranges.forEach(range => range.addEventListener('mousedown', () => clickedOnRange = true));
ranges.forEach(range => range.addEventListener('mouseleave', () => clickedOnRange = false));
ranges.forEach(range => range.addEventListener('mouseup', () => clickedOnRange = false));

progress.addEventListener('click', handleScrub);
progress.addEventListener('mousemove', handleScrub);
progress.addEventListener('mousedown', () => clickOnProgress = true);
progress.addEventListener('mouseleave', () => clickOnProgress = false);
progress.addEventListener('mouseup', () => clickOnProgress = false);
