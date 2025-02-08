const LOSE_SOUND = new Audio("./audio/game-over.mp3");
const JUMP_SOUND = new Audio("./audio/jump.mp3");
const BOARDWIDTH = 750;
const BOARDHEIGHT = 320;
LOSE_SOUND.preload = "auto";
JUMP_SOUND.preload = "auto";

const BACKGROUNDMUSIC = new Audio("audio/dino-dance.mp3");
BACKGROUNDMUSIC.loop = true;
BACKGROUNDMUSIC.volume = 0.5;

let board;
let context;
let hasRunOnce = false;

// dino
const DINOWIDTH = 88;
const DINOHEIGHT = 94;
const DINO_X = 50;
const DINO_Y = BOARDHEIGHT - DINOHEIGHT;
let dinoImg;

const DINO = {
  x: DINO_X,
  y: DINO_Y,
  width: DINOWIDTH,
  height: DINOHEIGHT,
};

// cactus
let cactusArray = [];
const CACTUSWIDTH = 34;
const CACTUS2WIDTH = 69;
const CACTUS3WIDTH = 90;
const CACTUSHEIGHT = 70;
const CACTUS_X = 700;
const CACTUS_Y = BOARDHEIGHT - CACTUSHEIGHT;

let cactus1Img;
let cactus2Img;
let cactus3Img;

// bird
const BIRDWIDTH = 50;
const BIRDHEIGHT = 40;
const BIRD_X = BOARDWIDTH;
const BIRD_Y = 50;
let birdImg;

const BIRD = {
  x: BIRD_X,
  y: BIRD_Y,
  width: BIRDWIDTH,
  height: BIRDHEIGHT,
};

// physics
const VELOCITY_X = -10;
let velocityY = 0;
const GRAVITY = 0.4;

let gameOver = false;
let score = 0;

document.addEventListener("keydown", moveDinosaur);
document.getElementById("resetButton").addEventListener("click", resetGame);

window.addEventListener("DOMContentLoaded", play);

function play() {
  if (!localStorage.getItem("firstLoad")) {
    getStory();
    localStorage.setItem("firstLoad", "true");
  }
  //  alert("Press OK to start the game!");
  BACKGROUNDMUSIC.play();

  board = document.getElementById("board");
  board.height = BOARDHEIGHT;
  board.width = BOARDWIDTH;

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
}

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  velocityY += GRAVITY;
  DINO.y = Math.min(DINO.y + velocityY, DINO_Y);
  context.drawImage(dinoImg, DINO.x, DINO.y, DINO.width, DINO.height);

  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    cactus.x += VELOCITY_X;
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    );

    if (detectCollision(DINO, cactus)) {
      gameOver = true;
      localStorage.setItem('score', score);
      LOSE_SOUND.play();
      dinoImg.src = "./img/dino-dead.png";
      dinoImg.onload = function () {
        context.drawImage(dinoImg, DINO.x, DINO.y, DINO.width, DINO.height);
      };
      document.getElementById("resetButton").style.display = "block";
      BACKGROUNDMUSIC.pause();
      BACKGROUNDMUSIC.currentTime = 0;
    }

    if (cactus.x + cactus.width < DINO.x && !cactus.passed) {
      score += 5;
      cactus.passed = true;
    }
  }

  context.drawImage(birdImg, BIRD.x, BIRD.y, BIRD.width, BIRD.height);

  context.fillStyle = "black";
  context.font = "20px Arial";
  context.fillText("Score: " + score, 10, 30);
}

function moveDinosaur(e) {
  if (gameOver) {
    return;
  }
  if ((e.code == "Space" || e.code == "ArrowUp") && DINO.y == DINO_Y) {
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
    x: CACTUS_X,
    y: CACTUS_Y,
    width: null,
    height: CACTUSHEIGHT,
    passed: false,
  };

  let placeCactusChance = Math.random();

  if (placeCactusChance > 0.9) {
    cactus.img = cactus3Img;
    cactus.width = CACTUS3WIDTH;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.7) {
    cactus.img = cactus2Img;
    cactus.width = CACTUS2WIDTH;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.5) {
    cactus.img = cactus1Img;
    cactus.width = CACTUSWIDTH;
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
  BIRD.x += VELOCITY_X;
  if (BIRD.x + BIRD.width < 0) {
    BIRD.x = BOARDWIDTH;
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
  alert(`Drax 🦕 , the champion of the T-Rex Cactus Jumping Olympia.`);
  alert(`And on this day the newbie, Dino 🦖, has come to take that title 🏆 `);
  alert(
    `Drax 🦕 : Think you can beat me,  you have another thing coming. Hope your keyboard doesn't break 😈!`
  );
}
