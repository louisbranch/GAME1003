;(function () {

  var SUITS = ["hearts", "diamonds", "clubs", "spades"];
  var FACES = [
    "two", "three", "four", "five", "six", "seven",
    "eight", "nine", "ten", "jack", "queen", "king", "ace"
  ];

  function Game() {
    var deck = new Deck();
    var decks = deck.split();
    this.player = new Player("player", decks[0], 2);
    this.dealer = new Player("dealer", decks[1]);
  }

  Game.prototype.start = function () {
    while (this.player.hasCards()) {
      var match = new Match(this.player, this.dealer);
      var winner = match.play();
      winner.score++;
    }
  };

  function Player(id, deck, maxHand) {
    this.id = id;
    this.deck = deck;
    this.maxHand = maxHand || 1;
    this.score = 0;
  }

  Player.prototype.hasCards = function () {
    return !!this.deck.cards.length;
  };

  Player.prototype.renderHand = function () {
    var cards = this.deck.deal(this.maxHand);
    var el = document.getElementById(this.id + "-hand");
    for (var i = 0, l = cards.length; i < l; i ++) {
      var card = cards[i];
      el.appendChild(card.render());
    }
  };

  function Match(player, dealer) {
    this.player = player;
    this.dealer = dealer;
  }

  Match.prototype.render = function () {
    var player = this.player.renderHand();
    var dealer = this.dealer.renderHand();
  };

  Match.prototype.play = function () {
    this.render();
    var winner = this.player;
    return winner;
  };

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

  // Deals n first cards from the deck
  Deck.prototype.deal = function (number) {
    number = number || 1;
    return this.cards.splice(0, number);
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
    var el = document.createElement("div");
    el.className = "card";
    el.style.backgroundPosition = this.position.x + "px " +
                                  this.position.y + "px";
    this.el = el;
    return el;
  };

  var game = new Game();
  game.start();

}());
