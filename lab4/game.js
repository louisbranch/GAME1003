// Enumerates hands available
var ROCK = 0,
    PAPER = 1,
    SCISSORS = 2,
    LIZARD = 3,
    SPOCK = 4;

// List all hands available as strings
var HAND_NAMES = ["rock", "paper", "scissors", "lizard", "spock"];

// Enumerates ending conditions
var LOSE = -1,
    TIE = 0,
    WIN = 1;

// Global variables to hold scores
var defeats = 0,
    ties = 0,
    victories = 0;

// Disable expanded game by default
var GEEK_MODE = false;

/*
 * Generate a random value from 0 to 2 inclusive
 * If geek mode is enabled, the range is from 0 to 4 inclusive
 */
function rnd() {
  var choices = 3
  if (GEEK_MODE) choices = 5;
  return Math.floor(Math.random() * choices);
};

/*
 * Compare two hands: h1 and h2
 * If the hands are equal, then it is a TIE ending
 * If h2 is a better hand, then it is a LOSE ending
 * Otherwise it is a WIN ending
 */
function compare(h1, h2) {
  if (h1 === h2) return TIE;
  switch (h1) {
    case ROCK:
      if (h2 === PAPER || h2 === SPOCK) return LOSE;
      return WIN;
    case PAPER:
      if (h2 === SCISSORS || h2 === LIZARD) return LOSE;
      return WIN;
    case SCISSORS:
      if (h2 === ROCK || h2 === SPOCK) return LOSE;
      return WIN;
    case LIZARD:
      if (h2 === ROCK || h2 === SCISSORS) return LOSE;
      return WIN;
    case SPOCK:
      if (h2 === PAPER || h2 === LIZARD) return LOSE;
      return WIN;
  }
};

/*
 * Generate a hand for the computer and compares if the player
 * Display which hand each one has
 * Display result
 */
function play(hand) {
  var computer = rnd();
  var result = compare(hand, computer);
  hide("game-options");
  updateScore(result);
  showHands(hand, computer);
  showResult(result);
  show("game-ending");
};

// Find hand name using hand list of names
function handName(index) {
  return HAND_NAMES[index];
};

// Update score depending on the outcome
function updateScore(result) {
  var el;
  switch (result) {
    case TIE:
      el = document.getElementById("game-ties");
      ties++;
      el.textContent = ties;
      break;
    case WIN:
      el = document.getElementById("game-victories");
      victories++;
      el.textContent = victories;
      break;
    case LOSE:
      el = document.getElementById("game-defeats");
      defeats++;
      el.textContent = defeats;
      break;
  }
};

// Show hands name
function showHands(h1, h2) {
  var el = document.getElementById("game-hands");
  var text = "You show " + handName(h1) +
             " and the computer shows " + handName(h2);
  el.textContent = text;
  show("game-hands");
}

// Show final result
function showResult(result) {
  var el = document.getElementById("game-result");
  var message = resultMessage(result);
  el.textContent = message;
  show("game-result");
}

// Generates a friendly result message
function resultMessage(result) {
  if (result === TIE) return "It was a tie! :|";
  if (result === LOSE) return "You lost! :(";
  return "You won! :)";
};

/*
 * Show rules section
 * Hide menu section
 */
function showRules() {
  show("game-rules");
  hide("game-menu");
}

/*
 * Hide rules section
 * Show menu section
 */
function hideRules() {
  hide("game-rules");
  show("game-menu");
}

/*
 * Query HTML element by its id
 * Remove hidden class from that element
 */
function show(id) {
  var el = document.getElementById(id);
  el.className = "";
};

/*
 * Query HTML element by its id
 * Add hidden class to that element
 */
function hide(id) {
  var el = document.getElementById(id);
  el.className = "hidden";
}

/*
 * Disabled geek mode
 * Show game menu option with geek options hidden
 */
function basicGame() {
  GEEK_MODE = false;
  show("game-options");
  hide("game-menu");
}

/*
 * Enables geek mode
 * Show game menu option with geek options visible
 */
function geekGame() {
  GEEK_MODE = true;
  show("game-options");
  show("game-lizard");
  show("game-spock");
  hide("game-menu");
}

// Play again using the same type of game
function playAgain() {
  show("game-options");
  hide("game-ending");
};

function chooseRock() {
  play(ROCK)
}

function choosePaper() {
  play(PAPER)
}

function chooseScissors() {
  play(SCISSORS)
}

function chooseLizard() {
  play(LIZARD)
}

function chooseSpock() {
  play(SPOCK)
}

/*
 * Bind click events to html elements
 */
var basicEl = document.getElementById("game-basic");
var geekEl  = document.getElementById("game-geek");
var rulesEl = document.getElementById("game-instructions");
var backEl = document.getElementById("game-rules-back");
var againEl = document.getElementById("game-play-again");
var rockEl = document.getElementById("game-rock");
var paperEl = document.getElementById("game-paper");
var scissorsEl = document.getElementById("game-scissors");
var lizardEl = document.getElementById("game-lizard");
var spockEl = document.getElementById("game-spock");

basicEl.addEventListener("click", basicGame);
geekEl.addEventListener("click", geekGame);
rulesEl.addEventListener("click", showRules);
backEl.addEventListener("click", hideRules);
againEl.addEventListener("click", playAgain);

rockEl.addEventListener("click", chooseRock);
paperEl.addEventListener("click", choosePaper);
scissorsEl.addEventListener("click", chooseScissors);
lizardEl.addEventListener("click", chooseLizard);
spockEl.addEventListener("click", chooseSpock);
