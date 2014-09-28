var scores = {victories: 0, ties: 0, defeats: 0};

var stage = document.querySelector(".Stage");
var divTitle = document.querySelector(".Title");
var divGame = document.querySelector(".Game");
var divEnd = document.querySelector(".End");
var inst = document.getElementById("Inst");
var endMsg = document.getElementById("EndMsg");
var victoriesEl = document.getElementById("game-victories");
var tiesEl = document.getElementById("game-ties");
var defeatsEl = document.getElementById("game-defeats");

inst.addEventListener("click",doInstructions,false);
divGame.style.display = "none";
divEnd.style.display = "none";

function doNewGame(event)
{
	divTitle.style.display = "none";
	divGame.style.display = "inline";
	divEnd.style.display = "none";
	stage.style.backgroundColor = "Wheat";
}

function doInstructions(event)
{
	window.alert("It's Rock, Paper, Scissors...");
}

function doCompare(val)
{
	var compVal = Math.ceil(Math.random() * 3);
	if ( val == compVal ) {
    scores.ties++;
		doEnd("It's a draw!", 1);
    return;
  }
	switch (val)
	{
		case 1:
			if ( compVal == 2 ) {
        scores.defeats++;
				doEnd("You threw Rock, Computer threw Paper...<br><br>Sorry, you lose!",0);
      } else {
        scores.victories++;
				doEnd("You threw Rock, Computer threw Scissors...<br><br>You win!",1);
      }
			break;
		case 2:
			if ( compVal == 1 ) {
        scores.victories++;
				doEnd("You threw Paper, Computer threw Rock...<br><br>You win!",1);
      } else {
        scores.defeats++;
				doEnd("You threw Paper, Computer threw Scissors...<br><br>Sorry, you lose!",0);
      }
			break;
		case 3:
			if ( compVal == 1 ) {
        scores.defeats++;
				doEnd("You threw Scissors, Computer threw Rock...<br><br>Sorry, you lose!",0);
      }
			else {
        scores.victories++;
				doEnd("You threw Scissors, Computer threw Paper...<br><br>You win!",1);
      }
			break;
	}
}

function doEnd(message, win)
{
	divTitle.style.display = "none";
	divGame.style.display = "none";
	divEnd.style.display = "inline";
	endMsg.innerHTML = message;
  victoriesEl.textContent = scores.victories;
  tiesEl.textContent = scores.ties;
  defeatsEl.textContent = scores.defeats;
	if (win)
		stage.style.backgroundColor = "Green";
	else
		stage.style.backgroundColor = "Red";
}
