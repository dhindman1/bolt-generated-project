const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreBoard = document.getElementById('scoreBoard');
    const eatSound = document.getElementById('eatSound');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let snake = [
      { x: 10, y: 10 }
    ];
    let food = { x: 15, y: 15 };
    let dx = 0;
    let dy = 0;
    let score = 0;
    let gameLoop;

    function drawGame() {
      clearCanvas();
      moveSnake();
      checkCollision();
      drawSnake();
      drawFood();
      updateScore();
    }

    function clearCanvas() {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawGrid();
    }

    function drawGrid() {
      ctx.strokeStyle = '#333';
      for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
      }
    }

    function drawSnake() {
      ctx.fillStyle = '#4CAF50';
      snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
      });
    }

    function drawFood() {
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }

    function moveSnake() {
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };
      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        eatSound.play();
        score += 10;
        generateFood();
      } else {
        snake.pop();
      }

      // Wrap around the canvas
      if (head.x < 0) head.x = tileCount - 1;
      if (head.x >= tileCount) head.x = 0;
      if (head.y < 0) head.y = tileCount - 1;
      if (head.y >= tileCount) head.y = 0;
    }

    function generateFood() {
      food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
    }

    function checkCollision() {
      for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
          resetGame();
        }
      }
    }

    function updateScore() {
      scoreBoard.textContent = `Score: ${score}`;
    }

    function startGame() {
      if (!gameLoop) {
        gameLoop = setInterval(drawGame, 100);
      }
    }

    function resetGame() {
      clearInterval(gameLoop);
      gameLoop = null;
      snake = [{ x: 10, y: 10 }];
      dx = 0;
      dy = 0;
      score = 0;
      generateFood();
      drawGame();
    }

    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (dy !== 1) { dx = 0; dy = -1; }
          break;
        case 'ArrowDown':
          if (dy !== -1) { dx = 0; dy = 1; }
          break;
        case 'ArrowLeft':
          if (dx !== 1) { dx = -1; dy = 0; }
          break;
        case 'ArrowRight':
          if (dx !== -1) { dx = 1; dy = 0; }
          break;
      }
    });
