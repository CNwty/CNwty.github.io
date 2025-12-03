document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('tic-tac-toe');
  const cells = document.querySelectorAll('.cell');
  const gameStatus = document.getElementById('game-status');
  const restartBtn = document.getElementById('restart-btn');

  if(board){
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
  }
});
