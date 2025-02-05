const LOSE_SOUND = new Audio("./audio/game-over.mp3");
const JUMP_SOUND = new Audio("./audio/jump.mp3");
LOSE_SOUND.preload = "auto";
JUMP_SOUND.preload = "auto";

const backgroundMusic = new Audio("audio/dino-dance.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

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
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
};

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
  height: birdHeight,
};

// physics
let velocityX = -10;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

getStory();

window.onload = function () {
//  alert("Press OK to start the game!");
  backgroundMusic.play();

  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d");
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
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  velocityY += gravity;
  dino.y = Math.min(dino.y + velocityY, dinoY);
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    cactus.x += velocityX;
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    );

    if (detectCollision(dino, cactus)) {
      gameOver = true;
      LOSE_SOUND.play();
      dinoImg.src = "./img/dino-dead.png";
      dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
      };
      document.getElementById("resetButton").style.display = "block";
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }

    if (cactus.x + cactus.width < dino.x && !cactus.passed) {
      score += 5;
      cactus.passed = true;
    }
  }

  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  context.fillStyle = "black";
  context.font = "20px Arial";
  context.fillText("Score: " + score, 10, 30);
}

function moveDinosaur(e) {
  if (gameOver) {
    return;
  }
  if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
    JUMP_SOUND.play();
    velocityY = -10;
  }
}

function placeCactus() {
  if (gameOver) {
    return;
  }

  let cactus = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: null,
    height: cactusHeight,
    passed: false,
  };

  let placeCactusChance = Math.random();

  if (placeCactusChance > 0.9) {
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.7) {
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.5) {
    cactus.img = cactus1Img;
    cactus.width = cactus1Width;
    cactusArray.push(cactus);
  }

  if (cactusArray.length > 5) {
    cactusArray.shift();
  }
}
function moveBird() {
  if (gameOver) {
    return;
  }
  bird.x += velocityX;
  if (bird.x + bird.width < 0) {
    bird.x = boardWidth;
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function resetGame() {
  location.reload();
}

function getStory() {
  alert(
    `Once upon a time , approximately 245 million years ago on earth 🌎 There lived...  `
  );
  alert(
    `Drax 🦕 , the champion of the T-Rex Cactus Jumping Olympia 245 million BC.`
  );
  alert(`And on this day the newbie, Dino 🦖, has come to take that title 🏆 `);
  alert(
    `Drax 🦕 : Think you can beat me,  you have another thing coming. Hope your keyboard doesn't break 😈!`
  );
}
