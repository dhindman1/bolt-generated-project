const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Set canvas size
canvas.width = 600;
canvas.height = 400;

const gridSize = 20;
const tileCount = canvas.width / gridSize;
const tileCountY = canvas.height / gridSize;

let snake = [
  { x: 10, y: 10 }
];
let food = { x: 15, y: 15 };
let dx = 1;
let dy = 0;
let score = 0;
let gameSpeed = 100;

// Base64 encoded beep sound (short beep)
const beepSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
const gameLoop = () => {
  // Move snake
  const head = { 
    x: (snake[0].x + dx + tileCount) % tileCount,
    y: (snake[0].y + dy + tileCountY) % tileCountY
  };

  // Check self-collision
  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      alert('Game Over! Score: ' + score);
      document.location.reload();
    }
  }

  snake.unshift(head);

  // Check food collision
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = `Score: ${score}`;
    beepSound.play();
    generateFood();
  } else {
    snake.pop();
  }

  // Clear canvas
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = '#333';
  for (let i = 0; i &lt; canvas.width; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i &lt; canvas.height; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  // Draw snake
  ctx.fillStyle = '#4CAF50';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
};

function generateFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCountY)
  };
  // Ensure food doesn't spawn on snake
  snake.forEach(segment => {
    if (segment.x === food.x && segment.y === food.y) generateFood();
  });
}

// Controls
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowUp':
      if (dy === 0) { dx = 0; dy = -1; }
      break;
    case 'ArrowDown':
      if (dy === 0) { dx = 0; dy = 1; }
      break;
    case 'ArrowLeft':
      if (dx === 0) { dx = -1; dy = 0; }
      break;
    case 'ArrowRight':
      if (dx === 0) { dx = 1; dy = 0; }
      break;
  }
});

// Start game
setInterval(gameLoop, gameSpeed);
