// Rule of thumb: if only one is needed - use a module
// If you need multiple (e.g. players) - create factories

// TIC TAC TOE

// Allow players to input X or O
// Logic - three in a row = win

// Create Empty 3x3 array
// [][][]
// [][][]
// [][][]

// The playerFactory will accept the player name and the mark ('X' or 'O').
// It will have a method to play when it's the player's turn.
// The playTurn method will accept a board which will be the game board and the cell.
// It will find the index of the cell and return it if it's empty or it will return null if it's occupied.

const playerFactory = (name, mark) => {
  const playTurn = (board, cell) => {
    const idx = board.cells.findIndex((position) => position === cell);
    if (board.boardArray[idx] === "") {
      board.render();
      return idx;
    }

    return null;
  };

  return { name, mark, playTurn };
};

// Next, we will make the board module.
// A module is similar to a factory in JavaScript but they are like static classes.
// They can be called without being instantiated.
// We will have the board array to hold the 9 positions in the game.

const boardModule = (() => {
  let boardArray = ["", "", "", "", "", "", "", "", ""];
  const gameBoard = document.querySelector("#board");
  const cells = Array.from(document.querySelectorAll(".cell"));
  let winner = null;

  // The render method will make the value of the html cells equal to the board array.
  const render = () => {
    boardArray.forEach((mark, idx) => {
      cells[idx].textContent = boardArray[idx];
    });
  };

  // The reset method will reset the board making all values to an empty string.
  const reset = () => {
    boardArray = ["", "", "", "", "", "", "", "", ""];
  };

  // The checkWin method will check the winning positions in a tictactoe game.
  const checkWin = () => {
    const winArrays = [
      ["0", "1", "2"],
      ["3", "4", "5"],
      ["6", "7", "8"],
      ["0", "3", "6"],
      ["1", "4", "7"],
      ["2", "5", "8"],
      ["0", "4", "8"],
      ["2", "4", "6"],
    ];

    winArrays.forEach((combo) => {
      if (
        boardArray[combo[0]] &&
        boardArray[combo[0]] === boardArray[combo[1]] &&
        boardArray[combo[0]] === boardArray[combo[2]]
      ) {
        winner = "current";
        document.querySelectorAll(".cell").forEach((cell) => cell.classList.add("cell-win"));
      }
    });

    return winner || (boardArray.includes("") ? null : "Tie");
  };

  return { render, gameBoard, cells, boardArray, checkWin, reset };
})();

const gamePlay = (() => {
  const playerOneName = document.querySelector("#playerOne");
  const playerTwoName = document.querySelector("#playerTwo");
  const form = document.querySelector(".player-info");
  const resetBtn = document.querySelector("#reset");
  let currentPlayer;
  let playerOne;
  let playerTwo;

  // The switchTurn method will switch turns between the players as the name describes.
  const switchTurn = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };

  const gameRound = () => {
    const board = boardModule;
    const gameStatus = document.querySelector(".game-status");
    if (currentPlayer.name !== "") {
      gameStatus.textContent = `${currentPlayer.name}'s Turn`;
    } else {
      gameStatus.textContent = "Board: ";
    }

    board.gameBoard.addEventListener("click", (e) => {
      e.preventDefault();
      const play = currentPlayer.playTurn(board, e.target);
      if (play !== null) {
        board.boardArray[play] = `${currentPlayer.mark}`;
        board.render();
        const winStatus = board.checkWin();
        if (winStatus === "Tie") {
          gameStatus.textContent = "It's a tie!";
          document.querySelector(".cell").classList.add("cell-tie");
        } else if (winStatus === null) {
          switchTurn();
          gameStatus.textContent = `${currentPlayer.name}'s Turn`;
        } else {
          gameStatus.textContent = `${currentPlayer.name} Wins!`;
          board.render();
        }
      }
    });
  };

  const gameInit = () => {
    if (playerOneName.value !== "" && playerTwoName.value !== "") {
      playerOne = playerFactory(playerOneName.value, "X");
      playerTwo = playerFactory(playerTwoName.value, "O");
      currentPlayer = playerOne;
      gameRound();
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (playerOneName.value !== "" && playerTwoName.value !== "") {
      gameInit();
      form.classList.add("transition");
      const transition = document.querySelector(".transition");
      const myTimeout = setTimeout(hideScreen, 500);
      function hideScreen() {
        form.classList.add("hidden");
      }
      document.querySelector(".place").classList.remove("hidden");

    } else {
      playerOneName.value = "Player One";
      playerTwoName.value = "Player Two";
      gameInit();
      form.classList.add("transition");
      console.log("TRANSITION START!");
      const transition = document.querySelector(".transition");
      const myTimeout = setTimeout(hideScreen, 500);
      function hideScreen() {
        form.classList.add("hidden");
      }
      document.querySelector(".place").classList.remove("hidden");
    }
  });

  resetBtn.addEventListener("click", () => {
    document.querySelector(".game-status").textContent = "Board: ";
    document.querySelector("#playerOne").value = "";
    document.querySelector("#playerTwo").value = "";
    window.location.reload();
  });

  return { gameInit };
})();

gamePlay.gameInit();
