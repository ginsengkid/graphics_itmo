const BrightnessSlider = document.querySelector(".range__slider1");
const ContrastSlider = document.querySelector(".range__slider2");
const img = new Image();
img.src = 'img.png';

let ctxPic = (document.getElementById('canvasPic')).getContext('2d', {willReadFrequently: true});
let ctxBr = (document.getElementById('canvasBrightness')).getContext('2d', {willReadFrequently: true});
let ctxCtr = (document.getElementById('canvasContrast')).getContext('2d', {willReadFrequently: true});
let ctxInv = (document.getElementById('canvasInversion')).getContext('2d', {willReadFrequently: true});

let brightness = 0;
let contrast = 1;

function UploadIMG() {
    ctxPic.drawImage(img, 0, 0, 400, 400);
    drawHist(ctxPic, 'canvasDefaultHist');
    BrightnessIMG();
    ContrastIMG();
    InverseDefaultIMG();
}

function BrightnessIMG() {
    ctxBr.drawImage(img, 0, 0, 400, 400);
    let imageData = ctxBr.getImageData(0, 0, 400, 400);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
         data[i] += brightness;
         data[i + 1] += brightness;
         data[i + 2] += brightness;
    }
    ctxBr.putImageData(imageData, 0, 0);
    drawHist(ctxBr,'canvasBrightnessHist');
}


function ContrastIMG(){
    ctxCtr.drawImage(img, 0, 0, 400, 400);
    let imageData = ctxCtr.getImageData(0, 0, 400, 400);
    let data = imageData.data;

    let c = (contrast/100) + 1;
    let intercept = 128 * (1 - c);

    for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] * c + intercept;
        data[i + 1] = data[i + 1] * c + intercept;
        data[i + 2] = data[i + 2] * c + intercept;
    }
    ctxCtr.putImageData(imageData, 0, 0);
    drawHist(ctxCtr,'canvasContrastHist');
}


function InverseDefaultIMG() {
   inverseImg(ctxPic);
    drawHist(ctxInv,'canvasInversionHist');
}

function InverseBrightnessIMG() {
    inverseImg(ctxBr);
    drawHist(ctxInv,'canvasInversionHist');
}

function InverseContrastIMG() {
    inverseImg(ctxCtr);
    drawHist(ctxInv,'canvasInversionHist');
}

function inverseImg(ctx){
    ctxInv.drawImage(img, 0, 0, 400, 400);
    let imageData = ctx.getImageData(0, 0, 400, 400);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
    ctxInv.putImageData(imageData, 0, 0);
}

function drawHist(inImg, canvas_id) {
    const src = new Uint32Array(inImg.getImageData(0,0,400,400).data.buffer);
    let histR = (new Array(256)).fill(0);
    let histG = (new Array(256)).fill(0);
    let histB = (new Array(256)).fill(0);

    for (let i = 1; i < src.length; i++) {
        let r = src[i] & 0xFF;
        let g = (src[i] >> 8) & 0xFF;
        let b = (src[i] >> 16) & 0xFF;
        histR[r]++;
        histG[g]++;
        histB[b]++;
    }

    let maxBrightness = 0;
    for (let i = 1; i < 256; i++) {
        if (maxBrightness < histR[i]) {
            maxBrightness = histR[i]
        } else if (maxBrightness < histG[i]) {
            maxBrightness = histG[i]
        } else if (maxBrightness < histB[i]) {
            maxBrightness = histB[i]
        }
    }

    const canvas = document.getElementById(canvas_id);
    const ctx = canvas.getContext('2d');
    let dx = canvas.width / 256;
    let dy = canvas.height / maxBrightness;
    ctx.lineWidth = dx;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 1; i < 256; i++) {
        let x = i * dx;

        ctx.strokeStyle = "rgba(200,0,0,0.5)";
        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(x, canvas.height - histR[i] * dy);
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = "rgba(0,230,0,0.5)";
        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(x, canvas.height - histG[i] * dy);
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = "rgba(0,0,235,0.5)";
        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(x, canvas.height - histB[i] * dy);
        ctx.closePath();
        ctx.stroke();
    }
}


BrightnessSlider.querySelector("input").addEventListener("input", event => {
    brightness = event.target.value - 250;
});

ContrastSlider.querySelector("input").addEventListener("input", event => {
    contrast = event.target.value - 100;
});

