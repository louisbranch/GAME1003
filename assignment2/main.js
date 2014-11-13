;(function () {

  var SUITS = ["hearts", "diamonds", "clubs", "spades"];
  var FACES = [
    "ace", "two", "three", "four", "five", "six", "seven",
    "eight", "nine", "ten", "jack", "queen", "king"
  ];

  // Create a new game and split a deck for 2 players
  function Game() {
    var deck = new Deck();
    var decks = deck.split();
    this.players = [
      new Hand({id: "player", deck: decks[0], maxCards: 2, playable: true}),
      new Hand({id: "dealer", deck: decks[1]})
    ];
  }

  Game.prototype.start = function () {
    var match = new Match(this);
    var winner = match.play();
  };

  function Hand(options) {
    this.id = options.id;
    this.deck = options.deck;
    this.maxCards = options.maxCards || 1;
    this.playable = options.playable;
    this.score = 0;
    this.cards = null;
    this.selected = null;
    this.setEls();
  }

  // Set current match
  Hand.prototype.setMatch = function (match) {
    this.match = match;
  };

  // Whether hand still has cards to play
  Hand.prototype.hasCards = function () {
    return !!this.deck.cards.length;
  };

  // Set hand dom element
  Hand.prototype.setEls = function () {
    var id = this.id;
    this.el = document.getElementById(id + "-hand");
    this.scoreEl = document.getElementById(id + "-score");
    if (!this.playable) return;
    var btn = document.getElementById(id + "-btn");
    btn.addEventListener("click", this.play.bind(this));
  };

  // Render max cards for hand and set current cards
  Hand.prototype.render = function () {
    this.selected = null;
    var cards = this.deck.deal(this.maxCards);
    for (var i = 0, l = cards.length; i < l; i ++) {
      var card = cards[i];
      card.setHand(this);
      this.el.appendChild(card.render(this.playable));
    }
    this.cards = cards;
  };

  Hand.prototype.play = function () {
    if (!this.selected) return;
    console.log("playing " + this.selected.face);
  };

  Hand.prototype.increaseWins = function () {

  };

  // Set selected card and unselect others
  Hand.prototype.select = function (selected) {
    this.selected = selected;
    this.cards.forEach(function (card) {
      if (selected !== card) card.unselect();
    });
  };

  function Match(game) {
    this.game = game;
  }

  Match.prototype.render = function () {
    var match = this;
    this.game.players.forEach(function (hand) {
      hand.setMatch(match);
      hand.render();
    });
  };

  Match.prototype.play = function () {
    this.render();
  };

  // Create a deck from a list of cards or generates its own cards
  function Deck(cards) {
    if (cards) {
      this.cards = cards;
    } else {
      this.build();
      this.shuffle();
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

  // Shuffle deck
  Deck.prototype.shuffle = function(times) {
    var cards = this.cards;
    var shuffled = new Array(cards.length);
    for (var i = 0, l = shuffled.length; i < l; i++) {
      var index = Math.floor(Math.random() * cards.length);
      shuffled[i] = cards.splice(index, 1)[0];
    }
    this.cards = shuffled;
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

  // Render card html element and bind click function
  Card.prototype.render = function (selectable) {
    var el = document.createElement("div");
    el.style.backgroundPosition = this.position.x + "px " +
                                  this.position.y + "px";
    if (selectable) el.onclick = this.select.bind(this);
    this.el = el;
    return el;
  };

  Card.prototype.setHand = function (hand) {
    this.hand = hand;
  };

  Card.prototype.select = function () {
    this.el.className = "selected";
    this.hand.select(this);
  };

  Card.prototype.unselect = function () {
    this.el.className = "";
  };

  var game = new Game();
  game.start();

}());
