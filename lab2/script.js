var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var mouse = {x: 0, y: 0, down: false};
var cords = []; // наши координаты точек
var arrayCords =[]; //координаты точек безье
var isdrawn = false;
var isClicked = false;
const rectSize = 8;
var dot;
var approximation = 500;
const slider = document.querySelector(".range__slider");
const sliderValue = document.querySelector(".length__title");

canvas.addEventListener("click", setPoint, false);
canvas.addEventListener("mousemove", mouseMove, false);
canvas.addEventListener("mouseup", mouseUp, false);
canvas.addEventListener("mousedown", mouseDown, false);


function mouseMove ( event ){
    var rect = canvas.getBoundingClientRect();
    mouse.x = Math.round((event.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
    mouse.y = Math.round((event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
    if (isdrawn && isClicked && dot !== -1){
        cords[dot] = {x: mouse.x, y: mouse.y}
        drawB();
    }
}

function mouseUp(){
    isClicked = false;
    dot = -1;
}

function mouseDown(){
    isClicked = true;
    for (const [i, value] of cords.entries()) {
        if ((mouse.x < value.x + rectSize && mouse.x > value.x - rectSize) && (mouse.y < value.y + rectSize && mouse.y > value.y - rectSize)) {
            dot = i;
        }
    }
    console.log(dot)
}

function getBezierBasis(i, n, t) { // находим bi,n по алгоритму де Кастельжо
    // Факториал
    function f(n) { // рекурсивно находим факториал
        if(n <= 1){
            return 1;
        }else{
            return n * f(n - 1);
        }
    };
    // считаем i-й элемент полинома Берштейна
    return (f(n)/(f(i)*f(n - i)))* Math.pow(t, i)*Math.pow(1 - t, n - i);
}


function getBezierCurve(arr) {
    var res = []; // создаем массив в котором будем хранить новые точки для построения
    var step = 1 / approximation;
    for (var t = 0; t < 1 + step; t += step) {
        if (t > 1) {
            t = 1; // сумма шага не может быть больше 1
        }
        var ytmp=0;// временные для хранения координат
        var xtmp=0;

        for (var i = 0; i < arr.length; i++) { // проходим по каждой точке
            var b = getBezierBasis(i, arr.length - 1, t); // вычисляем наш полином Берштейна
            xtmp += arr[i].x * b; // записываем и прибавляем результат
            ytmp += arr[i].y * b;
        }
        res.push({"x":xtmp,"y":ytmp}); // запушиваем конечный результат в наш новыйй массив
    }
    return res; // возвращаем его
}

function setPoint() {
    if (cords.length < 4){
        const c = {x: mouse.x, y: mouse.y};
        cords.push({x: c.x, y: c.y});
        ctx.fillStyle = 'black';
        ctx.fillRect(c.x - rectSize/2, c.y - rectSize/2 ,rectSize,rectSize);
        if (cords.length === 4) drawB();
    }
}

function drawB(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    isdrawn = true;
    arrayCords = getBezierCurve(cords);// получаем координаты точек кривой безье

    for (let i in cords){
        ctx.fillRect(cords[i].x - rectSize/2, cords[i].y - rectSize/2 ,rectSize,rectSize);
    }

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(arrayCords[0].x, arrayCords[0].y);
    for (let i in arrayCords) {
        ctx.lineTo(arrayCords[i].x, arrayCords[i].y);
    }
    ctx.stroke();
    ctx.closePath();
    drawVectors()

}

function drawVectors(){
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.moveTo(cords[0].x, cords[0].y);
    ctx.lineTo(cords[1].x, cords[1].y);
    ctx.moveTo(cords[2].x, cords[2].y);
    ctx.lineTo(cords[3].x, cords[3].y);
    ctx.stroke();
}


slider.querySelector("input").addEventListener("input", event => {
    approximation = event.target.value;
    drawB();
    sliderValue.innerHTML = `Approximation step: ${approximation}`;
});

function clearCanv(){
    cords = [];
    isdrawn = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}