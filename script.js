let board;
let boardWidth = 750;
let boardHeight = 320;
let context;

// dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

// cactus
let cactusArray = [];
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 90;
let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

// bird
let birdWidth = 50;
let birdHeight = 40;
let birdX = boardWidth;
let birdY = 50;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

// physics
let velocityX = -10;
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height =  boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    // Load images
    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";

    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";
    
    birdImg = new Image();
    birdImg.src = "./img/bird.jpg";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);
    setInterval(moveBird, 50);

    document.addEventListener("keydown", moveDinosaur);

    document.getElementById("resetButton").addEventListener("click", resetGame);
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }

    context.clearRect(0 , 0, board.width, board.height);

    // dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); 
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // cactus
    for(let i = 0; i < cactusArray.length; i++){
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if(detectCollision(dino, cactus)){
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            // function to reload dino-dead.png
            dinoImg.onload = function() {
               context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
           };
        }

        if(cactus.x + cactus.width < dino.x && !cactus.passed) {
            score += 5;
            cactus.passed = true;
        }
    }

    // bird
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // score
    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText("Score: " + score, 10, 30);
}

function moveDinosaur(e){
    if(gameOver){
        return;
    }
    if((e.code == "Space"  || e.code == "ArrowUp") && dino.y == dinoY){
        velocityY = -10;
    }
}

function placeCactus(){
    if(gameOver){
        return;
    }

    let cactus = {
        img : null,
        x : cactusX,
        y : cactusY,
        width : null,
        height : cactusHeight,
        passed: false
    }

    let placeCactusChance = Math.random();

    if(placeCactusChance > .90){
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70){
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50){
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }
 
    if(cactusArray.length > 5){
        cactusArray.shift();
    }
}
// function for bird movements
function moveBird(){
    if(gameOver){
        return;
    }
    bird.x += velocityX;
    if(bird.x + bird.width < 0){
        bird.x = boardWidth;
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width && 
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}  
// function to reset the game
function resetGame() {
   location.reload();
}
