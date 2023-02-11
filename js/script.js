var state = { board: [], curretGame: [], savedGames: [] };

function start() {
  readLocalStorage();
  createBoard();
  newGame();
}

function readLocalStorage() {
  if (!window.localStorage) {
    return;
  }

  var savedGamesFromLocalStorage = window.localStorage.getItem('saved-games');

  if (savedGamesFromLocalStorage) {
    state.savedGames = JSON.parse(savedGamesFromLocalStorage);
  }
}

function writeToLocalStorage() {
  window.localStorage.setItem('saved-games', JSON.stringify(state.savedGames));
}

function createBoard() {
  state.board = [];

  for (var i = 1; i <= 60; i++) {
    state.board.push(i);
  }
}

function newGame() {
  resetGame();
  render();
}

function render() {
  renderBoard();
  renderButtons();
  renderSavedGames();
}

function renderBoard() {
  var divBoard = document.querySelector("#megasena-board");
  divBoard.innerHTML = "";

  var ulNumbers = document.createElement("ul");
  ulNumbers.classList.add('numbers');

  for (var i = 0; i < state.board.length; i++) {
    var currentNumber = state.board[i];

    var liNumber = document.createElement("li");
    liNumber.textContent = currentNumber;
    liNumber.classList.add('number');

    liNumber.addEventListener("click", handleNumberClick);

    if (isNumberInGame(currentNumber)) {
      liNumber.classList.add('selected-number');
    }

    ulNumbers.appendChild(liNumber);
  }

  divBoard.appendChild(ulNumbers);
}

function handleNumberClick(event) {
  var value = Number(event.currentTarget.textContent);

  if (isNumberInGame(value)) {
    removeNumberFromGame(value);
  } else {
    addNumberToGame(value);
  }

  render();
}

function renderButtons() {
  var divButtons = document.querySelector('#megasena-buttons');
  divButtons.innerHTML = '';

  var buttonNewGame = createNewGameButton();
  var buttonRandomGame = createRadomGameButton();
  var buttonSaveGame = createSaveGameButton();

  divButtons.appendChild(buttonNewGame);
  divButtons.appendChild(buttonRandomGame);
  divButtons.appendChild(buttonSaveGame);
}

function createRadomGameButton() {
  var button = document.createElement('button');
  button.textContent = 'Jogo aleatório';

  button.addEventListener('click', randomGame);

  return button;
}

function createNewGameButton() {
  var button = document.createElement('button');
  button.textContent = 'Novo Jogo';

  button.addEventListener('click', newGame);

  return button;
}

function createSaveGameButton() {
  var button = document.createElement('button');
  button.textContent = 'Salvar Jogo';
  button.disabled = !isGameComplete();

  if (!isGameComplete()) {
    button.classList.add('buttonDisabled');
  }

  button.addEventListener('click', saveGame);

  return button;
}

function renderSavedGames() {
  var divSavedGames = document.querySelector('#megasena-saved-games');
  divSavedGames.innerHTML = '';

  if (state.savedGames.length === 0) {
    divSavedGames.innerHTML = '<p>Nenhum jogo salvo</p>'
  } else {
    var ulSavedGames = document.createElement('ul');

    for (var i = 0; i < state.savedGames.length; i++) {
      var currentGame = state.savedGames[i];

      var liGame = document.createElement('li');
      liGame.textContent = currentGame.join(', ');

      ulSavedGames.appendChild(liGame);
    }

    divSavedGames.appendChild(ulSavedGames);
  }
}

function addNumberToGame(numberToAdd) {
  if (numberToAdd < 1 || numberToAdd > 60) {
    console.error("Número inválido", numberToAdd);
    return;
  }

  if (state.curretGame.length >= 6) {
    console.error("Jogo já está completo.");
    return;
  }

  if (isNumberInGame(numberToAdd)) {
    console.error("Este número já está no jogo", numberToAdd);
    return;
  }

  state.curretGame.push(numberToAdd);
}

function removeNumberFromGame(numerToRemove) {
  if (numerToRemove < 1 || numerToRemove > 60) {
    console.error("Número inválido", numerToRemove);
    return;
  }

  var newGame = [];

  for (var i = 0; i < state.curretGame.length; i++) {
    var currentNumber = state.curretGame[i];

    if (currentNumber === numerToRemove) {
      continue;
    }

    newGame.push(currentNumber);
  }

  state.curretGame = newGame;
}

function isNumberInGame(numberToCheck) {
  return state.curretGame.includes(numberToCheck);
}

function saveGame() {
  if (!isGameComplete()) {
    console.error("O jogo não está completo!");
    return;
  }

  state.savedGames.push(state.curretGame);
  writeToLocalStorage();
  newGame();
}

function isGameComplete() {
  return state.curretGame.length === 6;
}

function resetGame() {
  state.curretGame = [];
}

function randomGame() {
  resetGame();

  while (!isGameComplete()) {
    var randomNumber = Math.ceil(Math.random() * 60);
    addNumberToGame(randomNumber);
  }

  render();
}

start();
