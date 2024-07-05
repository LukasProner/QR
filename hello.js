const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const output = document.getElementById('output');
const canvasContext = canvas.getContext('2d');

// Access the camera and stream video
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
        video.srcObject = stream;
        video.setAttribute('playsinline', true); // Required for iOS to play video in <video> element
        video.play();
        requestAnimationFrame(tick);
    })
    .catch(err => {
        console.error('Error accessing the camera', err);
        output.textContent = 'Error accessing the camera';
    });

function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
        });
        if (code) {
            output.textContent = `QR Code Data: ${code.data}`;
        } else {
            output.textContent = 'Scanning...';
        }
    }
    requestAnimationFrame(tick);
}