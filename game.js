
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const cellSize = 50;

let rows = 5;
let cols = 10;

const button1 = document.getElementById("option1");
const button2 = document.getElementById("option2");
const button3 = document.getElementById("option3");

window.addEventListener("load", resizeCanvas);

document.addEventListener("keydown", (event) => {

  let newDirection = -1;

  if (event.key === "w" || event.key === "ArrowUp") newDirection = 0;
  else if (event.key === "d" || event.key === "ArrowRight") newDirection = 1;
  else if (event.key === "s" || event.key === "ArrowDown") newDirection = 2;
  else if (event.key === "a" || event.key === "ArrowLeft") newDirection = 3;

  if (
    newDirection === -1 ||
    newDirection === opposite[direction] ||
    nextDirection !== direction
  ) return;

  nextDirection = newDirection;

});

button1.addEventListener("click", () => {
  if (rows == 5 && cols == 10) {
    return;
  }
  rows = 5;
  cols = 10;
  resetGame();
  resizeCanvas();
});

button2.addEventListener("click", () => {
  if (rows == 10 && cols == 15) {
    return;
  }
  rows = 10;
  cols = 15;
  resetGame();
  resizeCanvas();
});

button3.addEventListener("click", () => {
  if (rows == 15 && cols == 20) {
    return;
  }
  rows = 15;
  cols = 20;
  resetGame();
  resizeCanvas();
});

function resizeCanvas() {
  const dpr = window.devicePixelRatio;
  canvas.width = cols * cellSize * dpr;
  canvas.height = rows * cellSize * dpr;
  canvas.style.width = `${cols * cellSize}px`;
  canvas.style.height = `${rows * cellSize}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw();
}

function drawGrid() {

  ctx.strokeStyle = "azure";
  ctx.lineWidth = 2;

  for (let x = 0; x <= cols * cellSize; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, rows * cellSize);
    ctx.stroke();
  }

  for (let y = 0; y <= rows * cellSize; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(cols * cellSize, y);
    ctx.stroke();
  }
}

function drawSnake() {

  const offset = cellSize / 3;

  ctx.beginPath();

  ctx.fillStyle = "lime";

  let headX = snake[0].x * cellSize + (cellSize / 2);
  let headY = snake[0].y * cellSize + (cellSize / 2);

  if (direction == 0) {
    headY += offset;
  } else if (direction == 1) {
    headX -= offset;
  } else if (direction == 2) {
    headY -= offset;
  } else {
    headX += offset;
  }

  ctx.arc(headX, headY, cellSize / 2, 0, Math.PI * 2, false);

  ctx.fill();

  ctx.fillStyle = "green";

  for (let i = 1; i < snake.length; ++i) {
    ctx.fillRect(snake[i].x * cellSize, snake[i].y * cellSize, cellSize, cellSize);
  }

}

function drawFood() {
  ctx.font = `${cellSize * 0.75}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const food of foods) {
    ctx.fillText("🍎", food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2);
  }
}

function getFood() {

  let newFood = null;

  while (true) {

    newFood = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows)
    };

    let collision = false;

    for (const segment of snake) {
      if (segment.x === newFood.x && segment.y === newFood.y) {
        collision = true;
        break;
      }
    }

    if (!collision) break;
  }

  return newFood;

}

function draw() {
  ctx.clearRect(0, 0, cols * cellSize, rows * cellSize);
  drawGrid();
  drawSnake();
  drawFood();
}

function update() {

  direction = nextDirection;

  const newHead = getNextHead();

  if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows || snake.length === rows * cols) {
    running = false;
    return;
  }

  const foodIndex = foods.findIndex(
    (food) => food.x === newHead.x && food.y === newHead.y
  );

  if (foodIndex === -1) {
    snake.pop();
  } else {
    foods.splice(foodIndex, 1);
    if (snake.length + 1 < rows * cols) {
      foods.push(getFood());
    }
  }

  for (const segment of snake) {
    if (segment.x === newHead.x && segment.y === newHead.y) {
      running = false;
      return;
    }
  }

  snake.unshift(newHead);

}

function getNextHead() {
  const head = snake[0];
  const newHead = {
    x: head.x + dirs[direction].x,
    y: head.y + dirs[direction].y
  };
  return newHead;
}

let running = true;

let speed = 300; // ms

// 0 = up, 1 = right, 2 = down, 3 = left
let direction = 1;
let nextDirection = 1;

const opposite = [2, 3, 0, 1];

let snake = [{ x: 1, y: 0 }, { x: 0, y: 0 }];

let foods = [getFood()];

const dirs = [
  { x: 0, y: -1 }, // up
  { x: 1, y: 0 },  // right
  { x: 0, y: 1 },  // down
  { x: -1, y: 0 }  // left
];

function gameLoop() {

  if (!running) return;
  update();
  draw();
  setTimeout(gameLoop, speed);

}

function resetGame() {
  running = true;
  snake = [{ x: 1, y: 0 }, { x: 0, y: 0 }];
  foods = [getFood()];
}

gameLoop();

