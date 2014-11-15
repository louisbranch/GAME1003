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
    this.setEls();
    show(this.menuEl);
    hide(this.endEl);
  }

  // Set DOM elements for game and bind events
  Game.prototype.setEls = function () {
    this.msgEl = find("win-msg");
    this.menuEl = find("game-menu");
    this.stageEl = find("game-stage");
    this.endEl = find("game-end");
    var start = find("game-start");
    var restart = find("game-restart");

    start.onclick = this.start.bind(this);
    restart.onclick = function () {
      var game = new Game();
      game.start();
    };

    hide(this.msgEl);
  };

  // Plays start music and enter play loop
  Game.prototype.start = function () {
    hide(this.menuEl);
    show(this.stageEl);
    this.play();
  };

  // Create a new match until the player doesn't have more cards
  Game.prototype.play = function () {
    var game = this;
    var match = new Match(this.hands);
    match.play(function (winner) {
      game.displayWinner(winner);
      winner.increaseScore();
      if (winner.hasCards()) game.play();
      else game.end();
    });
  }

  // Display match winner
  Game.prototype.displayWinner = function (winner) {
    var el = this.msgEl;
    show(el);
    el.textContent = winner.id + " wins the hand!"
    if (winner.id === "player") {
      el.className = "alert alert-success";
    } else {
      el.className = "alert alert-danger";
    }
  };

  // Find hand with highest score
  Game.prototype.findFinalWinner = function () {
    return this.hands.reduce(function (winner, hand) {
      if (!winner || hand.score >= winner.score) {
        return hand;
      } else {
        return winner;
      }
    });
  };

  Game.prototype.displayFinalWinner = function (winner) {
    var el = find("end-msg");
    var victory = find("game-victory");
    var defeat = find("game-defeat");

    el.textContent = winner.id + " has won the game!";
    if (winner.id === "player") {
      el.className = "alert alert-success";
      show(victory);
      hide(defeat);
    } else {
      el.className = "alert alert-danger";
      show(defeat);
      hide(victory);
    }
  };

  Game.prototype.end = function () {
    hide(this.stageEl);
    show(this.endEl);
    var winner = this.findFinalWinner();
    this.displayFinalWinner(winner);
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
    var winner = this.hands.reduce(function (winner, hand) {
      if (!winner || winner.points() <= hand.points()) {
        return hand;
      } else {
        return winner;
      }
    });

    if (winner.id === "player") playAudio("hit");
    else playAudio("miss");

    this.hands.forEach(function (hand) { hand.reshuffle(); });
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
    this.el = find(id + "-hand");
    this.scoreEl = find(id + "-score");
    this.scoreEl.textContent = 0;
    if (!this.playable) return;
    var btn = find(id + "-btn");
    btn.onclick = this.play.bind(this);
  };

  // Render max cards for hand and set current cards
  Hand.prototype.render = function () {
    var hand = this;
    this.el.innerHTML = "";
    var cards = this.deck.deal(this.maxCards);
    cards.forEach(function (card) {
      card.setHand(hand);
      var el = card.render(hand.playable);
      hand.el.appendChild(el);
    });
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
    this.cards.splice(index, 1);
  };

  // Reshuffle unused cards back to deck
  Hand.prototype.reshuffle = function () {
    this.removeCard();
    if (!this.cards.length) return;
    var deck = this.deck.cards;
    this.cards.forEach(function (card) {
      var index = Math.floor(Math.random() * deck.length);
      deck.splice(index, 0, card);
    });
    this.selected = null;
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

  Hand.prototype.unselect = function (card) {
    if (this.selected === card) this.selected = null;
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
    if (this.active) {
      this.unselect();
    } else {
      this.active = true;
      this.hand.select(this);
      this.el.className = "active";
    }
  };

  Card.prototype.unselect = function () {
    this.active = false;
    this.hand.unselect(this);
    this.el.className = "";
  };

  function playAudio(id, volume) {
    var sound = find("sound-" + id);
    sound.volume = volume || 1;
    sound.load();
    sound.play();
  };

  function stopAudio(id) {
    var sound = find("sound-" + id);
    sound.pause();
  }

  function hide(el) {
    el.className += " hidden";
  }

  function show(el) {
    el.className = el.className.replace(/hidden/g, "")
  }

  function find(selector) {
    return document.getElementById(selector);
  }

  playAudio("battle", .2);
  new Game();

}());
