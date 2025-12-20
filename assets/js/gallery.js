class Lightbox {
  constructor() {
    this.el = document.querySelector("[data-lightbox]");
    this.content = this.el.querySelector("[data-lightbox-content]");
    this.closeBtn = this.el.querySelector("[data-lightbox-close]");
    this.prevBtn = this.el.querySelector("[data-lightbox-prev]");
    this.nextBtn = this.el.querySelector("[data-lightbox-next]");
    this.transitionAnimation = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease-out";

    this.slides = [];
    this.currentIndex = 0;

    //Swipe tracking
    this.startX = 0;
    this.currentX = 0;
    this.isDragging = false;
    this.swipeThreshold = 50;

    this.closeBtn.addEventListener("click", () => this.close());
    this.prevBtn.addEventListener("click", () => this.prev());
    this.nextBtn.addEventListener("click", () => this.next());

    this.el.addEventListener("click", (e) => {
      if (e.target === this.el) this.close();
    });
    document.addEventListener("keydown", (e) => {
      if (!this.el.classList.contains("is-open")) return;
      if (e.key === "Escape") this.close();
      if (e.key === "ArrowLeft") this.prev();
      if (e.key === "ArrowRight") this.next();
    });

    //Swipe events
    this.el.addEventListener("touchstart", this.onSwipeStart.bind(this), { passive: true });
    this.el.addEventListener("touchmove", this.onSwipeMove.bind(this), { passive: false });
    this.el.addEventListener("touchend", this.onSwipeEnd.bind(this));

    //Mouse drag
    this.el.addEventListener("mousedown", this.onSwipeStart.bind(this));
    this.el.addEventListener("mousemove", this.onSwipeMove.bind(this));
    this.el.addEventListener("mouseup", this.onSwipeEnd.bind(this));
    this.el.addEventListener("mouseleave", this.onSwipeEnd.bind(this));
  }

  onSwipeStart(e) {
    if (e.target.closest("button")) return;

    this.isDragging = true;
    this.startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    this.currentX = 0;

    this.content.style.transition = "none";
  }

  onSwipeMove(e) {
    if (!this.isDragging) return;

    const x = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    this.currentX = x - this.startX;

    if (e.type === "touchmove") e.preventDefault();

    //Add resistance at edges
    if (
      (this.currentIndex === 0 && this.currentX > 0) ||
      (this.currentIndex === this.slides.length - 1 && this.currentX < 0)
    ) {
      this.currentX = this.currentX * 0.3;
    }

    const opacity = 1 - Math.min(Math.abs(this.currentX) / 300, 0.25);

    this.content.style.transform = `translateX(${this.currentX}px)`;
    this.content.style.opacity = opacity;
  }

  onSwipeEnd(e) {
    if (!this.isDragging) return;
    this.isDragging = false;

    this.content.style.transition = this.transitionAnimation;

    if (this.currentX < -this.swipeThreshold && this.currentIndex < this.slides.length - 1) {
      this.content.style.transform = "translateX(-100%)";
      this.content.style.opacity = "0";
      setTimeout(() => {
        this.currentIndex++;
        this.render();
        this.animateIn("left");
      }, 300);
    } else if (this.currentX > this.swipeThreshold && this.currentIndex > 0) {
      this.content.style.transform = "translateX(100%)";
      this.content.style.opacity = "0";
      setTimeout(() => {
        this.currentIndex--;
        this.render();
        this.animateIn("right");
      }, 300);
    } else {
      this.content.style.transform = "translateX(0)";
      this.content.style.opacity = "1";
    }

    this.currentX = 0;
  }

  animateIn(from) {
    const startX = from === "left" ? "50%" : "-50%";
    this.content.style.transition = "none";
    this.content.style.transform = `translateX(${startX})`;
    this.content.style.opacity = "0";

    this.content.offsetHeight;

    this.content.style.transition = this.transitionAnimation;
    this.content.style.transform = "translateX(0)";
    this.content.style.opacity = "1";
  }

  open(slides, index = 0) {
    this.slides = slides;
    this.currentIndex = index;
    this.render();
    this.el.classList.add("is-open");
    document.body.style.overflow = "hidden";

    this.content.style.transition = "";
    this.content.style.transform = "";
    this.content.style.opacity = "";
  }

  close() {
    const galleryId = this.slides[this.currentIndex].getAttribute("data-parent");
    const gallery = document.querySelector(`#${galleryId}`);
    gallery.querySelector(`[data-index="${this.currentIndex}"]`).scrollIntoView({
      behavior: "instant",
      block: "center",
    });

    this.el.classList.remove("is-open");
    document.body.style.overflow = "";

    this.content.innerHTML = "";
  }

  prev() {
    if (this.currentIndex > 0) {
      this.content.style.transition = this.transitionAnimation;
      this.content.style.transform = "translateX(100%)";
      this.content.style.opacity = "0";
      setTimeout(() => {
        this.currentIndex--;
        this.render();
        this.animateIn("right");
      }, 150);
    }
  }

  next() {
    if (this.currentIndex < this.slides.length - 1) {
      this.content.style.transition = this.transitionAnimation;
      this.content.style.transform = "translateX(-100%)";
      this.content.style.opacity = "0";
      setTimeout(() => {
        this.currentIndex++;
        this.render();
        this.animateIn("left");
      }, 150);
    }
  }

  render() {
    const mediaEl = this.slides[this.currentIndex];
    const clone = mediaEl.cloneNode(true);

    const isVideo = mediaEl.querySelector("video") ? true : false;
    if (isVideo) {
      const originalVideo = document.querySelector(
        `[data-id=${mediaEl.querySelector("video").getAttribute("data-id")}]`
      );
      const originalCurrentTime = originalVideo.currentTime;
      const delay = -(originalVideo.duration * (originalVideo.currentTime / originalVideo.duration));

      clone.querySelector("video").currentTime = originalCurrentTime;
      clone.style.setProperty("--delay", `${delay}s`);
      clone.querySelector("video").play();
    }

    this.content.innerHTML = "";
    this.content.appendChild(clone);

    this.prevBtn.classList.toggle("is-hidden", this.currentIndex === 0);
    this.nextBtn.classList.toggle("is-hidden", this.currentIndex === this.slides.length - 1);
  }
}
class Gallery {
  constructor(el, lightbox) {
    this.el = el;
    this.lightbox = lightbox;
    this.track = el.querySelector("[data-gallery-track]");
    this.slides = [...el.querySelectorAll("[data-gallery-slide")];
    this.mediaItems = this.slides.map((slide) => slide.querySelector("img, .video"));

    this.isDragging = false;
    this.hasMoved = false;
    this.startX = 0;
    this.scrollLeft = 0;
    this.clickThreshold = 5;

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

    this.bindEvents();
  }
  bindEvents() {
    this.track.addEventListener("mousedown", this.onDragStart);
    window.addEventListener("mousemove", this.onDragMove);
    window.addEventListener("mouseup", this.onDragEnd);

    this.slides.forEach((slide, index) => {
      slide.addEventListener("click", (e) => {
        if (this.hasMoved) {
          e.preventDefault();
          return;
        }
        this.lightbox.open(this.mediaItems, index);
      });
    });
  }

  onDragStart(e) {
    this.isDragging = true;
    this.hasMoved = false;
    this.startX = e.clientX;
    this.scrollLeft = this.track.scrollLeft;
  }

  onDragMove(e) {
    if (!this.isDragging) return;

    const x = e.clientX;
    const delta = x - this.startX;

    if (Math.abs(delta) > this.clickThreshold) {
      this.hasMoved = true;
    }

    this.track.scrollLeft = this.scrollLeft - delta;
  }

  onDragEnd() {
    if (!this.isDragging) return;

    this.isDragging = false;
  }
}
