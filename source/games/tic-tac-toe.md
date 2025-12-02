---
title: Tic-Tac-Toe
date: 2025-12-03 00:00:00
---

# 井字棋

这是一个简单的井字棋游戏。

<style>
  .tic-tac-toe {
    width: 306px;
    height: 306px;
    margin: 20px auto;
    border: 3px solid #333;
  }
  .tic-tac-toe .cell {
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
    float: left;
    font-size: 80px;
    text-align: center;
    line-height: 100px;
    cursor: pointer;
    user-select: none;
  }
  .tic-tac-toe .cell:hover {
    background-color: #f0f0f0;
  }
  .game-status {
    text-align: center;
    font-size: 24px;
    margin-top: 20px;
  }
  .restart-btn {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    font-size: 18px;
    cursor: pointer;
  }
</style>

<div class="tic-tac-toe" id="tic-tac-toe">
  <div class="cell" data-index="0"></div>
  <div class="cell" data-index="1"></div>
  <div class="cell" data-index="2"></div>
  <div class="cell" data-index="3"></div>
  <div class="cell" data-index="4"></div>
  <div class="cell" data-index="5"></div>
  <div class="cell" data-index="6"></div>
  <div class="cell" data-index="7"></div>
  <div class="cell" data-index="8"></div>
</div>

<div class="game-status" id="game-status"></div>
<button class="restart-btn" id="restart-btn">重新开始</button>

<script>
  const board = document.getElementById('tic-tac-toe');
  const cells = document.querySelectorAll('.cell');
  const gameStatus = document.getElementById('game-status');
  const restartBtn = document.getElementById('restart-btn');

  let currentPlayer = 'X';
  let gameState = ['', '', '', '', '', '', '', '', ''];
  let gameActive = true;

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
      return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;

    handleResultValidation();
  }

  function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
      const winCondition = winningConditions[i];
      let a = gameState[winCondition[0]];
      let b = gameState[winCondition[1]];
      let c = gameState[winCondition[2]];
      if (a === '' || b === '' || c === '') {
        continue;
      }
      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      gameStatus.innerHTML = `玩家 ${currentPlayer} 获胜!`;
      gameActive = false;
      return;
    }

    let roundDraw = !gameState.includes('');
    if (roundDraw) {
      gameStatus.innerHTML = '平局!';
      gameActive = false;
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.innerHTML = `轮到玩家 ${currentPlayer}`;
  }

  function handleRestartGame() {
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    gameStatus.innerHTML = `轮到玩家 ${currentPlayer}`;
    cells.forEach(cell => cell.innerHTML = '');
  }

  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  restartBtn.addEventListener('click', handleRestartGame);

  gameStatus.innerHTML = `轮到玩家 ${currentPlayer}`;
</script>
