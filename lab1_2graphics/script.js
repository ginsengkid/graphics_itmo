var canvas;
var context;
var mouse = {x: 0, y: 0, down: false};
var squares = [];
var mode = 1;
var lineBegin;
var isFirstPoint = false;

function init() {
    canvas = document.getElementById( 'myCanvas' );
    context = canvas.getContext( '2d' );
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.7;

    canvas.addEventListener('mousemove', mouseMove, false);
    canvas.addEventListener("click", draw, false);
    canvas.addEventListener("contextmenu", del, false);
    canvas.addEventListener('click',drawLine, false);
}

function mouseMove ( event ){
    var rect = canvas.getBoundingClientRect();
    mouse.x = Math.round((event.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
    mouse.y = Math.round((event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);

}

function draw() {
    if (mode === 0) return;
    context.fillStyle = 'black';
    context.fillRect(mouse.x - 10, mouse.y - 10, 20, 20)
    squares.push({x: mouse.x, y: mouse.y});
    console.log(squares)
}

function del(){
    for (const [i, value] of squares.entries()){
        console.log(mouse.x + " " + mouse.y);
        if ((mouse.x < value.x + 10 && mouse.x > value.x - 10) && (mouse.y < value.y + 10 && mouse.y > value.y - 10)){
            console.log(mouse.x + " " + mouse.y);
            context.clearRect(value.x - 10, value.y - 10, 20, 20)
            squares.splice(i,1);
            for (let s of squares){
                context.fillStyle = 'black';
                context.fillRect(s.x - 10, s.y - 10, 20, 20)
            }
            return;
        }
    }
}

function changeMode(){
    if (mode === 1){
        document.getElementById('mode1').style.display = 'none';
        document.getElementById('mode2').style.display = 'inherit';
        mode = 0;
    }
    else {
        document.getElementById('mode1').style.display = 'inherit';
        document.getElementById('mode2').style.display = 'none';
        mode = 1;
    }
}

function drawLine(e) {
    if (mode === 1) return;
    if (!isFirstPoint){
        lineBegin = {x: mouse.x, y: mouse.y};
        context.fillRect(lineBegin.x, lineBegin.y,2,2);
        isFirstPoint = !isFirstPoint;
    }
    else{
        context.beginPath();

        context.lineWidth = 5;
        context.lineCap = 'round';
        context.strokeStyle = 'black';

        context.moveTo(lineBegin.x, lineBegin.y);
        context.lineTo(mouse.x, mouse.y);

        context.stroke();
        isFirstPoint = !isFirstPoint;
    }
}


init()
