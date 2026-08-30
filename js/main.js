(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  function closeNav() {
    nav.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  // Scroll-spy: highlight active nav link
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) { spyObserver.observe(section); });
  }

  // Reveal-on-scroll animation
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Back to top button
  var toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("is-visible", window.scrollY > 480);
    });
  }

  // Carousel (Galería)
  var carousel = document.getElementById("carousel");
  if (carousel) {
    var track = document.getElementById("carouselTrack");
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = document.getElementById("carouselDots");
    var prevBtn = document.getElementById("carouselPrev");
    var nextBtn = document.getElementById("carouselNext");
    var index = 0;
    var autoplayId = null;
    var AUTOPLAY_MS = 5500;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Ir a la imagen " + (i + 1));
      dot.addEventListener("click", function () {
        goTo(i);
        restartAutoplay();
      });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function render() {
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === index);
        d.setAttribute("aria-selected", i === index ? "true" : "false");
      });
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
    }

    function next() { goTo(index + 1); }
    function prevSlide() { goTo(index - 1); }

    function startAutoplay() {
      stopAutoplay();
      autoplayId = window.setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay() {
      if (autoplayId) { window.clearInterval(autoplayId); autoplayId = null; }
    }
    function restartAutoplay() { startAutoplay(); }

    prevBtn.addEventListener("click", function () { prevSlide(); restartAutoplay(); });
    nextBtn.addEventListener("click", function () { next(); restartAutoplay(); });

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", startAutoplay);

    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { next(); restartAutoplay(); }
      if (e.key === "ArrowLeft") { prevSlide(); restartAutoplay(); }
    });

    // Touch / pointer swipe
    var dragStartX = null;
    track.addEventListener("pointerdown", function (e) {
      dragStartX = e.clientX;
      stopAutoplay();
    });
    track.addEventListener("pointerup", function (e) {
      if (dragStartX === null) return;
      var delta = e.clientX - dragStartX;
      if (Math.abs(delta) > 40) {
        delta < 0 ? next() : prevSlide();
      }
      dragStartX = null;
      startAutoplay();
    });

    render();
    startAutoplay();
  }

  // Video cards (click-to-load YouTube embed)
  var videoFrames = Array.prototype.slice.call(document.querySelectorAll(".video-card__frame"));
  videoFrames.forEach(function (frame) {
    frame.addEventListener("click", function () {
      var videoId = frame.getAttribute("data-youtube-id");
      if (!videoId || videoId.indexOf("VIDEO_ID") === 0) return;
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(videoId) + "?autoplay=1&rel=0";
      iframe.title = "Reproductor de video de YouTube";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      frame.innerHTML = "";
      frame.appendChild(iframe);
    });
  });

  // Contact form -> mailto
  var contactForm = document.getElementById("contactForm");
  var CONTACT_EMAIL = "grupoecologicogarzon@hotmail.com";

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = contactForm.name.value.trim();
      var email = contactForm.email.value.trim();
      var subject = contactForm.subject.value.trim();
      var message = contactForm.message.value.trim();

      var body =
        "Nombre: " + name + "\n" +
        "Correo: " + email + "\n\n" +
        message;

      var mailtoUrl =
        "mailto:" + encodeURIComponent(CONTACT_EMAIL) +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailtoUrl;
    });
  }
})();
