
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const cellSize = 50;

let rows = 5;
let cols = 10;

const button1 = document.getElementById("option1");
const button2 = document.getElementById("option2");
const button3 = document.getElementById("option3");

window.addEventListener("load", resizeCanvas);

button1.addEventListener("click", () => {
  if (rows == 5 && cols == 10) {
    return;
  }
  rows = 5;
  cols = 10;
  resizeCanvas();
});

button2.addEventListener("click", () => {
  if (rows == 10 && cols == 15) {
    return;
  }
  rows = 10;
  cols = 15;
  resizeCanvas();
});

button3.addEventListener("click", () => {
  if (rows == 15 && cols == 20) {
    return;
  }
  rows = 15;
  cols = 20;
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

  ctx.lineJoin = "round";
  ctx.lineWidth = 4;

  for (let i = 0; i < snake.length; ++i) {
    const segment = snake[i];
    const x = segment.x * cellSize;
    const y = segment.y * cellSize;
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(x, y, cellSize, cellSize);
  }

}

function drawFood() {
  for (const food of foods) {
    ctx.fillStyle = "red";
    ctx.fillRect(
      food.x * cellSize,
      food.y * cellSize,
      cellSize,
      cellSize
    );
  }
}

function getFood() {

  let newFood;

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
  const newHead = getNextCell();

  if (newHead === null || snake.length === rows * cols) {
    running = false;
    return;
  }

  let foodEaten = false;
  let index;

  for (let i = 0; i < foods.length; ++i) {
    if (foods[i].x === newHead.x && foods[i].y === newHead.y) {
      foodEaten = true;
      index = i;
      break;
    }
  }

  snake.unshift(newHead);

  if (!foodEaten) {
    snake.pop();
  } else {
    foods.splice(index, 1);
    foods.push(getFood());
  }

}

function getNextCell() {

  const head = snake[0];

  const newHead = {
    x: head.x + dirs[direction].x,
    y: head.y + dirs[direction].y
  };

  if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows) {
    return null;
  }

  for (const segment of snake) {
    if (segment.x === newHead.x && segment.y === newHead.y) {
      return null;
    }
  }
  return newHead;

}

let running = true;

let speed = 1000; // ms

// 0 = up, 1 = right, 2 = down, 3 = left
let direction = 1;

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

gameLoop();

