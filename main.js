/** Player Factory Function */
const Player = (sign) => {
  /** Return sign of Player object. "X", "O" */
  const getSign = () => sign;

  return { getSign };
};

/** GameBoard Module */
const gameBoard = (() => {
  const gameArray = [];

  /**
   * Sets the given position in gameArray to the sign of the player for it to
   * be updated to.
   *
   * @param {Number} index position in array to be updated.
   * @param {String} playerSign sign of the player for cell to be updated to
   */
  const updateField = (index, playerSign) => {
    gameArray[index] = playerSign;
  };

  /**
   * @param {*} index index of the value in array to be returned
   * @returns Player sign at given index in gameArray
   */
  const getField = (index) => gameArray[index];

  /** Returns array of board state. */
  const getBoardArray = () => gameArray;

  /** Clears board state array of all values. */
  const resetBoard = () => {
    gameArray.length = 0;
  };

  return { updateField, getField, getBoardArray, resetBoard };
})();

/** DisplayController Module */
const displayController = (() => {
  const gameCells = document.querySelectorAll(".game-container__game-cell");
  const messageElement = document.querySelector(".message-container");
  const restartButton = document.querySelector(".btn-restart");
  const endgameModal = document.querySelector(".endgame-modal");
  const endgameModalMessage = document.querySelector(".endgame-modal__message");
  const overlay = document.querySelector(".overlay");

  /**
   * Loops through gameCell DOM elements and sets the HTML of each to the corresponding
   * value in gameBoard array.
   */
  const updateBoardDisplay = () => {
    gameCells.forEach((cell, index) => {
      // handle undefined in gameBoard array
      const fieldText = gameBoard.getField(index) === undefined ? "" : gameBoard.getField(index);
      // eslint-disable-next-line no-param-reassign
      cell.innerHTML = fieldText;
    });
  };

  /**
   * Empties HTML for each gameCell DOM element.
   */
  const resetBoardDisplay = () => {
    gameCells.forEach((cell) => {
      // eslint-disable-next-line no-param-reassign
      cell.innerHTML = "";
    });
    messageElement.innerHTML = "";
  };

  /**
   * Updates message DOM element to reflect the turn of the next player.
   *
   * @param {String} playerSign sign of the player to next move.
   */
  const setMessageElement = (playerSign) => {
    messageElement.innerHTML = `It's ${playerSign}'s turn!`;
  };

  /**
   * Adds "active" class to both endgame modal and overlay DOM elements
   */
  const displayModal = () => {
    endgameModal.classList.add("active");
    overlay.classList.add("active");
  };

  /**
   * Calls function to display modal and updates the modal message element to
   * reflect the player who has won.
   *
   * @param {String} playerSign Sign of the player who played the last move
   */
  const displayWinMessage = (playerSign) => {
    displayModal();
    endgameModalMessage.innerHTML = `${playerSign} Won!`;
  };

  /**
   * Calls function to display modal and updates end modal message to reflect draw
   * state.
   */
  const displayDrawMessage = () => {
    displayModal();
    endgameModalMessage.innerHTML = "It's a Draw!";
  };

  // setup listeners on individual cells
  gameCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      // eslint-disable-next-line no-use-before-define
      gameController.playRound(cell.dataset.indexNumber);
      updateBoardDisplay();
    });
  });

  // setup listner of restart button click
  restartButton.addEventListener("click", () => {
    endgameModal.classList.remove("active");
    overlay.classList.remove("active");
    // eslint-disable-next-line no-use-before-define
    gameController.resetGame();
  });

  return {
    setMessageElement,
    displayWinMessage,
    displayDrawMessage,
    resetBoardDisplay,
  };
})();

/** GameController Module */
const gameController = (() => {
  const fontAwesomeX = "<i class='fa-solid fa-x'></i>";
  const fontAwesomeO = "<i class='fa-solid fa-o'></i>";
  const playerOne = Player(fontAwesomeX);
  const playerTwo = Player(fontAwesomeO);
  let round = 1;

  /** Uses round variable to calculate the current players sign */
  const getCurrentPlayerSign = () => (round % 2 === 1 ? playerOne.getSign() : playerTwo.getSign());

  /**
   * Function to check if the current board state is a winner. Not fully sure how this works,
   * it has been ripped shamelessly from the react tutorial:
   * https://reactjs.org/tutorial/tutorial.html#declaring-a-winner
   *
   * @param {Array} boardArray Array of X's and O's from gameBoard module.
   * @returns {Boolean} true if board is in a win state.
   */
  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i += 1) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return true;
      }
    }
    return false;
  };

  /**
   * Key logic for the game, calls necessary functions to update board fields
   * with current player sign and checks if a win / draw condition has been met.
   *
   * @param {Number} index index of the clicked cell
   */
  const playRound = (index) => {
    // return if clicked position is already set in board array.
    if (gameBoard.getBoardArray()[index]) return;
    
    // set given index in gameBoard array to current player sign.
    gameBoard.updateField(index, getCurrentPlayerSign());

    // check for win or draw conditions, display and update modal message.
    if (checkWinner(gameBoard.getBoardArray())) {
      displayController.displayWinMessage(getCurrentPlayerSign());
      return;
    }
    if (round === 9) {
      displayController.displayDrawMessage();
    }

    // increment round so that getCurrentPlayerSign() is the next player
    // and set message under board to alert next player to move.
    round += 1;
    displayController.setMessageElement(getCurrentPlayerSign());
  };

  /**
   * Calls functinos to reset board array and clear DOM display elements.
   */
  const resetGame = () => {
    round = 1;
    gameBoard.resetBoard();
    displayController.resetBoardDisplay();
  };

  return { playRound, resetGame };
})();
