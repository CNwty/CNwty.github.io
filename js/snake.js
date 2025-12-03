document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const startGameBtn = document.getElementById('startGameBtn');
  const restartGameBtn = document.getElementById('restartGameBtn');
  const scoreDisplay = document.getElementById('score');

  if(canvas){
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    let snake = [{ x: 10, y: 10 }];
    let food = {};
    let direction = 'right';
    let changingDirection = false;
    let score = 0;
    let gameInterval;
    let gameSpeed = 150; // Milliseconds
    let gameActive = false;

    function generateFood() {
      food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
      };
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === food.x && snake[i].y === food.y) {
          generateFood();
          return;
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'red';
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
      ctx.fillStyle = 'lime';
      snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
      });
    }

    function update() {
      if (!gameActive) return;
      changingDirection = false;
      const head = { x: snake[0].x, y: snake[0].y };
      switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
      }
      if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize || checkCollision(head)) {
        endGame();
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        generateFood();
      } else {
        snake.pop();
      }
      draw();
    }

    function checkCollision(head) {
      for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          return true;
        }
      }
      return false;
    }

    function changeDirection(event) {
      if (changingDirection) return;
      changingDirection = true;
      const keyPressed = event.keyCode;
      const LEFT_KEY = 37;
      const UP_KEY = 38;
      const RIGHT_KEY = 39;
      const DOWN_KEY = 40;
      const goingUp = direction === 'up';
      const goingDown = direction === 'down';
      const goingLeft = direction === 'left';
      const goingRight = direction === 'right';
      if (keyPressed === LEFT_KEY && !goingRight) direction = 'left';
      if (keyPressed === UP_KEY && !goingDown) direction = 'up';
      if (keyPressed === RIGHT_KEY && !goingLeft) direction = 'right';
      if (keyPressed === DOWN_KEY && !goingUp) direction = 'down';
    }

    function startGame() {
      if (gameActive) return;
      gameActive = true;
      snake = [{ x: 10, y: 10 }];
      direction = 'right';
      score = 0;
      scoreDisplay.textContent = score;
      generateFood();
      draw();
      if (gameInterval) clearInterval(gameInterval);
      gameInterval = setInterval(update, gameSpeed);
      document.addEventListener('keydown', changeDirection);
    }

    function endGame() {
      gameActive = false;
      clearInterval(gameInterval);
      alert('游戏结束! 您的分数是: ' + score);
      document.removeEventListener('keydown', changeDirection);
    }

    function restartGame() {
      if (gameInterval) clearInterval(gameInterval);
      startGame();
    }

    startGameBtn.addEventListener('click', startGame);
    restartGameBtn.addEventListener('click', restartGame);

    generateFood();
    draw();
  }
});
