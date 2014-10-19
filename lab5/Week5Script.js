var deck = [];
var suitArray = ["Hearts","Diamonds","Clubs","Spades"];
var faceArray = ["Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Jack","Queen","King"];
var msgBar = document.getElementById("msg");

buildDeck(); 	// Builds the deck of cards.
shuffleDeck(5); // Shuffles the deck 5 times.
printDeck(); 	// Prints the shuffled deck out to the console.

function buildDeck()
{
	// Build the deck...
	for (var row = 0; row < suitArray.length; row++)
	{
		for (var col = 0; col < faceArray.length; col++)
		{
			var tempCard = {};
			tempCard.suitName = suitArray[row];
			tempCard.faceName = faceArray[col];
			tempCard.offsetW = (col * -144);
			tempCard.offsetH = (row * -200);
			tempCard.pointVal = col > 8 ? 10 : (col+1);
			deck.push(tempCard);
		}
	}
}

function shuffleDeck(numTimes)
{
	for (var i = 0; i < numTimes; i++) 
	{
		for (var j = 0; j < deck.length; j++) 
		{
			var tempIndex = Math.floor(Math.random() * 52);
			var tempCard = deck[j];
			deck[j] = deck[tempIndex];
			deck[tempIndex] = tempCard;
		}
	}
}

function printDeck()
{
	for (var i = 0; i < deck.length; i++) 
	{
		console.log(deck[i].faceName+" of "+deck[i].suitName+" ("+deck[i].pointVal+")");
	}
}

/* Old onCardClick() function. 
   Not used anymore, but some clues you need to complete Lab 5 are in here. */
function onCardClick(cardNum) 
{
	if (deck.length > 0)
	{
		var cardId = document.getElementById("card"+(cardNum));
		var cardDealt = {};
		cardDealt = dealCard();
		console.log(cardDealt.pointVal);
		cardId.style.background = "url('Deck.gif') "+cardDealt.offsetW+"px "+cardDealt.offsetH+"px";
		msg.innerHTML = "Cards left: "+deck.length;
	}
}

function dealCard()
{
	return deck.splice(0,1)[0];
}



