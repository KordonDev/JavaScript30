const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const filter = {};
document.querySelectorAll('.filterSelector input').forEach(input => {
    filter[input.id] = input.checked;
    input.addEventListener('change', (e) => filter[e.target.id] = e.target.checked);
});

function getVideo() {
    navigator.mediaDevices.getUserMedia({audio: false, video: true})
        .then(videoStream => {
            console.log(videoStream);
            video.src = window.URL.createObjectURL(videoStream);
            video.play();
        })
        .catch(error => console.log(error));
}

function paintPhoto() {
    const height = video.videoHeight;
    const width = video.videoWidth;

    canvas.height = height;
    canvas.width = width;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0, 0, width, height);
        if (filter.redFilter) {
            pixels = redEffect(pixels);
        }
        if (filter.slowFilter) {
            ctx.globalAlpha = 0.1;
        } else {
            ctx.globalAlpha = 1;
        }
        if (filter.rgbFilter) {
            pixels = rgbSplit(pixels);
        }
        if (filter.colorFilter) {
            pixels = removeColor(pixels);
        }
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function redEffect(pixels) {
    for(let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i+0] = pixels.data[i+0] + 100;
        pixels.data[i+1] = pixels.data[i+1] - 100;
        pixels.data[i+2] = pixels.data[i+2] - 100;
    }
    return pixels;
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i+300] = pixels.data[i+0];
        pixels.data[i-150] = pixels.data[i+1];
        pixels.data[i+180] = pixels.data[i+2];
    }
    return pixels;
}

function removeColor(pixels) {
    const levels = {};
    document.querySelectorAll('.rgb input').forEach(input => levels[input.name] = input.value);

    for (let i = 0; i < pixels.data.length; i += 4) {
        let red = pixels.data[i];
        let green = pixels.data[i+1];
        let blue = pixels.data[i+2];

        if (red >= levels.rmin && red <= levels.rmax
            && green >= levels.gmin && green <= levels.gmax
            && blue >= levels.bmin && blue <= levels.bmax) {
            pixels.data[i+3] = 0;    
        }
    }
    return pixels;
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg');

    const link = document.createElement('a');
    link.href = data;
    link.innerHTML = `<img src="${data}" alt="screenshot">`;
    link.setAttribute('downloda', 'webcam_picture');
    strip.insertBefore(link, strip.firstChild);
}
getVideo();

video.addEventListener('canplay', paintPhoto);
