;(function () {

  var SUITS = ["hearts", "diamonds", "clubs", "spades"];
  var FACES = [
    "two", "three", "four", "five", "six", "seven",
    "eight", "nine", "ten", "jack", "queen", "king", "ace"
  ];

  // Create a deck from a list of cards or generates its own cards
  function Deck(cards) {
    if (cards) {
      this.cards = cards;
    } else {
      this.build();
      this.shuffle(5);
    }
  }

  // Build deck of cards elements
  Deck.prototype.build = function () {
    var cards = [];

    for (var i = 0, l = SUITS.length; i < l; i++) {
      var suit = SUITS[i];
      for (var j = 0, m = FACES.length; j < m; j++) {
        var face = FACES[j];
        var value = j + 2;
        var position = {x: j * -144, y: i * -200};
        var card = new Card(suit, face, value, position);
        cards.push(card);
      }
    }

    this.cards = cards;
  };

  // Shuffle deck n times
  Deck.prototype.shuffle = function(times) {
    var cards = this.cards;

    for (var i = 0; i < times; i++) {
      for (var j = 0, l = cards.length; j < l; j++) {
        var index = Math.floor(Math.random() * l);
        var card = cards[j];
        cards[j] = cards[index];
        cards[index] = card;
      }
    }
  }

  // Deals one or more cards from the deck
  Deck.prototype.deal = function (number) {
    number = number || 1;
    var cards = this.cards.splice(0, number);
    return number == 1 ? cards[0] : cards;
  };

  // Split deck into smaller parts n times
  Deck.prototype.split = function (parts) {
    parts = parts || 2;
    var decks = [];
    var number = Math.floor(this.cards.length / parts);
    for (var i = 0; i < parts; i++) {
      var cards = this.deal(number);
      decks[i] = new Deck(cards);
    }
    return decks;
  };

  // Create card element
  function Card(suit, face, value, position) {
    this.suit = suit;
    this.face = face;
    this.value = value;
    this.position = position;
  }

  Card.prototype.render = function () {
    //TODO
  };

}());
