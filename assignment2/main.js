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
    this.hands = [
      new Hand({id: "player", deck: decks[0], maxCards: 2, playable: true}),
      new Hand({id: "dealer", deck: decks[1]})
    ];
  }

  Game.prototype.start = function () {
    playAudio("battle", .3);
    this.play();
  };

  Game.prototype.play = function () {
    var game = this;
    var match = new Match(this.hands);
    match.play(function (winner) {
      winner.increaseScore();
      if (winner.hasCards()) game.play();
      else game.end();
    });
  }

  Game.prototype.end = function () {
    stopAudio("battle");
    playAudio("ending", .3);
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
    this.el.innerHTML = "";
    var cards = this.deck.deal(this.maxCards);
    for (var i = 0, l = cards.length; i < l; i ++) {
      var card = cards[i];
      card.setHand(this);
      this.el.appendChild(card.render(this.playable));
    }
    this.cards = cards;
  };

  // End match if there is a card selected
  Hand.prototype.play = function () {
    if (!this.selected) return;
    this.match.end();
  };

  // Returns how many points selected card or first card worth
  Hand.prototype.points = function () {
    var card = this.selected || this.cards[0];
    return card.value;
  };

  // Remove card from cards available for selection
  Hand.prototype.removeCard = function () {
    var index = 0;
    if (this.selected) index = this.cards.indexOf(this.selected);
    return this.cards.splice(index, 1);
  };

  // Reshuffle unused cards back to deck
  Hand.prototype.reshuffle = function () {
    if (!this.cards.length) return;
    var deck = this.deck.cards;
    this.cards.forEach(function (card) {
      var index = Math.floor(Math.random() * deck.length);
      deck.splice(index, 0, card);
    });
  };

  // Increase score while updating UI
  Hand.prototype.increaseScore = function () {
    this.scoreEl.textContent = ++this.score;
  };

  // Set selected card and unselect others
  Hand.prototype.select = function (selected) {
    this.selected = selected;
    this.cards.forEach(function (card) {
      if (selected !== card) card.unselect();
    });
  };

  function Match(hands) {
    var match = this;
    this.hands = hands;
    this.hands.forEach(function (hand) {
      hand.setMatch(match);
    });
  }

  // Render a new match hands and their cards
  Match.prototype.render = function () {
    this.hands.forEach(function (hand) {
      hand.render();
    });
  };

  Match.prototype.play = function (callback) {
    this.render();
    this.endCallback = callback;
  };

  Match.prototype.end = function () {
    var winner;

    this.hands.forEach(function (hand) {
      if (!winner) {
        winner = hand;
      } else if (winner.points() <= hand.points() ) {
        winner = hand;
      }
      hand.removeCard();
      hand.reshuffle();
    });

    if (winner.id === "player") {
      playAudio("hit");
    } else {
      playAudio("miss");
    }

    this.endCallback(winner);
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

  function playAudio(id, volume) {
    var sound = document.querySelector("audio#sound-" + id);
    sound.volume = volume || 1;
    sound.load();
    sound.play();
  };

  function stopAudio(id) {
    var sound = document.querySelector("audio#sound-" + id);
    sound.pause();
  }

  var game = new Game();
  game.start();

}());
