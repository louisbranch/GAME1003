;(function () {

  function Carousel(tagId) {
    this.el = this.findEl(tagId);
    this.imgs = this.findImgs();
    this.index = 0;
    this.bindClick();
    this.renderPager();
  }

  Carousel.prototype.findEl = function (tagId) {
    var el = document.querySelector(tagId);
    if (!el) throw("Element not found " + tagId);
    return el;
  };

  Carousel.prototype.findImgs = function () {
    var els = this.el.querySelectorAll("img");
    return [].slice.call(els);
  };

  Carousel.prototype.slide = function (index) {
    this.current().className = "fadeOut";
    this.next(index).className = "fadeIn";
    this.updatePager();
  };

  Carousel.prototype.current = function () {
    return this.imgs[this.index];
  };

  Carousel.prototype.previous = function () {
    this.index--;
    if (this.index < 0) this.index = this.imgs.length;
    return this.current();
  };

  Carousel.prototype.next = function (index) {
    this.index = index || this.index + 1;
    if (this.index >= this.imgs.length) this.index = 0;
    return this.current();
  };

  Carousel.prototype.bindClick = function () {
    var slider = this;
    this.el.addEventListener("click", function (e) {
      if (e.target.tagName === "IMG") {
        slider.slide();
        slider.stop();
      }
    });
  };

  Carousel.prototype.renderPager = function () {
    var current = this.index;
    var el = this.el.querySelector(".carousel-page");
    var frag = document.createDocumentFragment();
    var pager = [];
    this.imgs.forEach(function (img, index) {
      var page = document.createElement("span");
      page.textContent = index + 1;
      if (index === current) page.className = "highlight";
      frag.appendChild(page)
      pager.push(page);
    });
    el.appendChild(frag);
    this.pager = pager;
    el.addEventListener("click", this.goTo.bind(this));
  };

  Carousel.prototype.updatePager = function () {
    var current = this.index;
    this.pager.forEach(function (page, index) {
      if (index === current) page.className = "highlight";
      else page.className = "";
    });
  };

  Carousel.prototype.start = function () {
    var slide = this.slide.bind(this);
    this.timer = setInterval(function () {
      slide();
    }, 2000);
  };

  Carousel.prototype.stop = function () {
    clearInterval(this.timer);
  };

  Carousel.prototype.goTo = function (evt) {
    var el = evt.target;
    if (el.tagName !== "SPAN") return;
    var index = this.pager.indexOf(el);
    this.slide(index);
    this.stop();
  };

  var slider = new Carousel("#carousel");
  slider.start();

}());
