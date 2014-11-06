var deck = [];	// The main deck array.
var suitArray = ["Hearts","Diamonds","Clubs","Spades"];
var faceArray = ["Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Jack","Queen","King", "Ace"];
var playerHand = []; 	// Array for the player's hand.
var dealerHand = [];	// Array for the dealer's hand.

buildDeck(); 	// Builds the deck of cards.
shuffleDeck(5); // Shuffles the deck 5 times.

function buildDeck()
{
	// Create a temporary variable for a card object.
	var tempCard;
	// Build the deck...
	for (var row = 0; row < suitArray.length; row++)
	{
		for (var col = 0; col < faceArray.length; col++)
		{
			tempCard = {};
			tempCard.suitName = suitArray[row];
			tempCard.faceName = faceArray[col];
			tempCard.offsetW = (col * -144);
			tempCard.offsetH = (row * -200);
			tempCard.pointVal = col + 2; // Cards now have a unique point value from 2-14.
			deck.push(tempCard);
		}
	}
}

function shuffleDeck(numTimes)
{
	// Create temporary variables.
	var tempIndex;
	var tempCard;
	
	for (var i = 0; i < numTimes; i++) 
	{
		for (var j = 0; j < deck.length; j++) 
		{
			do 	// This do...while loop will ensure that the random index stored into tempIndex does not equal the current j value for the iteration of the loop. So the card doesn't get swapped with itself.
			{	 
				tempIndex = Math.floor(Math.random() * deck.length);
			} while ( tempIndex == j);
			// Swap two card objects in deck[]...
			tempCard = deck[j];
			deck[j] = deck[tempIndex];
			deck[tempIndex] = tempCard;
		}
	}
}

function dealCard()
{
	// Remove a card from the front of the deck and return it from the function.
	return deck.splice(0,1)[0];
}



