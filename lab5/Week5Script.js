;(function () {

  var SUITS = ["hearts","diamonds","clubs","spades"];
  var FACES = ["ace","two","three","four","five","six", "seven","eight","nine",
               "ten","jack","queen","king"];

  function play() {
    var deck = buildDeck();
    shuffleDeck(deck, 5);
    var players = [
      new Player("Player", deck),
      new Player("Dealer", deck)
    ];
    displayHands(players);
    displayScore(players);
  }

  function Player(id, deck) {
    this.id = id;
    this.hand = deck.splice(0, 5);
    this.points = this.calculateHandPoints();
  }

  Player.prototype.calculateHandPoints = function () {
    var total = 0;
    for (var i = 0, l = this.hand.length; i < l; i ++) {
      var card = this.hand[i];
      total += card.value;
    }
    return total;
  };

  function buildDeck() {
    var deck = [];
    for (var row = 0; row < SUITS.length; row++) {
      for (var col = 0; col < FACES.length; col++) {
        deck.push({
          suit: SUITS[row],
          face: FACES[col],
          offsetW: (col * -144),
          offsetH: (row * -200),
          value: col > 8 ? 10 : (col+1)
        });
      }
    }
    return deck;
  }

  function shuffleDeck(deck, times) {
    for (var i = 0; i < times; i++) {
      for (var j = 0; j < deck.length; j++) {
        var tempIndex = Math.floor(Math.random() * 52);
        var tempCard = deck[j];
        deck[j] = deck[tempIndex];
        deck[tempIndex] = tempCard;
      }
    }
  }

  function displayHands(players) {
    for (var i = 0; i < players.length; i++) {
      var player = players[i];
      var frag = document.createDocumentFragment();
      var container = document.getElementById("hand-" + player.id);
      var hand = player.hand;
      for (var j = 0; j < hand.length; j++) {
        var card = hand[j];
        var el = document.createElement("div");
        el.className = "card";
        el.style.backgroundPosition = card.offsetW + "px " + card.offsetH + "px";
        frag.appendChild(el);
      }
      container.appendChild(frag);
    }
  }

  function displayScore(players) {
    var el = document.getElementById("msg");
    var messages = [];
    var winner = players[0];
    for (var i = 0; i < players.length; i++) {
      var player = players[i];
      messages.push(player.id + " Total: " + player.points);
      if (player.points >= winner.points) winner = player;
    }
    messages.push(winner.id + " wins!");
    el.textContent = messages.join("  ");
  }

  play();

}());
