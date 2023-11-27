const fileInput = document.getElementById('fileInput');
const spriteCanvas = document.getElementById('spriteCanvas');
const spriteWidthInput = document.getElementById('spriteWidth');
const spriteHeightInput = document.getElementById('spriteHeight');
const downloadLink = document.getElementById('downloadLink');
let spriteSheet;

fileInput.addEventListener('change', handleFileSelect);
spriteHeightInput.addEventListener('change', resetDownloadLink);
spriteWidthInput.addEventListener('change', resetDownloadLink);

function resetDownloadLink(event) {
    downloadLink.href = "";
    downloadLink.textContent = "";
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            spriteSheet = new Image();
            spriteSheet.src = e.target.result;
            spriteSheet.onload = function () {
                resetDownloadLink();
                drawSpriteSheet();
                drawGrid(parseInt(spriteWidthInput.value), parseInt(spriteHeightInput.value));
            };
        };
        reader.readAsDataURL(file);
    }
}

function drawSpriteSheet() {
    spriteCanvas.width = spriteSheet.width;
    spriteCanvas.height = spriteSheet.height;
    const canvasContext = spriteCanvas.getContext('2d');
    const aspectRatio = spriteSheet.width / spriteSheet.height;
    const canvasWidth = spriteCanvas.width;
    const canvasHeight = canvasWidth / aspectRatio;

    canvasContext.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
    canvasContext.drawImage(spriteSheet, 0, 0, canvasWidth, canvasHeight);
}

function drawGrid(spriteWidth, spriteHeight) {
    const canvasContext = spriteCanvas.getContext('2d');
    const canvasWidth = spriteCanvas.width;
    const canvasHeight = spriteCanvas.height;

    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    canvasContext.drawImage(spriteSheet, 0, 0, canvasWidth, canvasHeight);

    canvasContext.beginPath();

    // Linhas horizontais
    for (let y = spriteHeight; y < canvasHeight; y += spriteHeight) {
        canvasContext.moveTo(0, y);
        canvasContext.lineTo(canvasWidth, y);
    }

    // Linhas verticais
    for (let x = spriteWidth; x < canvasWidth; x += spriteWidth) {
        canvasContext.moveTo(x, 0);
        canvasContext.lineTo(x, canvasHeight);
    }

    canvasContext.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    canvasContext.stroke();
    canvasContext.closePath();
}
function generateSprites() {
    console.log("aqui")
    const spriteWidth = parseInt(spriteWidthInput.value);
    const spriteHeight = parseInt(spriteHeightInput.value);

    if (isNaN(spriteWidth) || isNaN(spriteHeight) || spriteWidth <= 0 || spriteHeight <= 0) {
        alert('Please enter valid sprite dimensions.');
        return;
    }
    const maxColum = 50;
    if (spriteWidth < spriteCanvas.width / maxColum || spriteHeight < spriteCanvas.height / maxColum) {
        alert('Please enter valid sprite dimensions. 2');
        return;
    }

    drawGrid(spriteWidth, spriteHeight);

    const canvasContext = spriteCanvas.getContext('2d');
    const sprites = [];

    for (let y = 0; y < spriteCanvas.height; y += spriteHeight) {
        for (let x = 0; x < spriteCanvas.width; x += spriteWidth) {
            const sprite = document.createElement('canvas');
            sprite.width = spriteWidth;
            sprite.height = spriteHeight;
            const spriteContext = sprite.getContext('2d');
            spriteContext.drawImage(spriteSheet, x, y, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
            sprites.push(sprite.toDataURL('image/png'));
        }
    }

    downloadSprites(sprites);
}

function downloadSprites(sprites) {

    const zip = new JSZip();
    sprites.forEach((dataURL, index) => {
        zip.file(`sprite${index + 1}.png`, dataURL.split(',')[1], { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then(function (content) {
        const downloadUrl = URL.createObjectURL(content);
        downloadLink.href = downloadUrl;
        downloadLink.download = 'sprites.zip';
        downloadLink.style.display = 'block';
        downloadLink.textContent = "Download Sprites"
    });
}
