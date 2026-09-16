/* =====================================================================
   NEXERASOFT — SITE SCRIPT
   Every animation on this page (hero entrance, popup open/close, navbar
   shadow, scroll-reveal, pointer tilt, and the partner-logo marquee) is
   driven from here with plain JavaScript — no CSS @keyframes and no CSS
   transitions are used for motion. CSS only defines the static layout.
===================================================================== */

/* ---------------------------------------------------------------------
   BRIEF POPUP — open/close, plus enquiry form validation & send
--------------------------------------------------------------------- */
function openBrief() {
  const overlay = document.getElementById("briefOverlay");
  const box = overlay.querySelector(".brief-box");

  overlay.style.display = "flex";
  overlay.style.opacity = "0";

  overlay.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    { duration: 220, easing: "ease-out", fill: "forwards" }
  );

  if (box) {
    box.animate(
      [
        { opacity: 0, transform: "scale(0.9)" },
        { opacity: 1, transform: "scale(1)" },
      ],
      { duration: 320, easing: "cubic-bezier(.2,.8,.3,1.2)", fill: "forwards" }
    );
  }
}

function closeBrief() {
  const overlay = document.getElementById("briefOverlay");
  const box = overlay.querySelector(".brief-box");

  const overlayAnim = overlay.animate(
    [{ opacity: 1 }, { opacity: 0 }],
    { duration: 180, easing: "ease-in", fill: "forwards" }
  );

  if (box) {
    box.animate(
      [
        { opacity: 1, transform: "scale(1)" },
        { opacity: 0, transform: "scale(0.94)" },
      ],
      { duration: 180, easing: "ease-in", fill: "forwards" }
    );
  }

  overlayAnim.onfinish = () => {
    overlay.style.display = "none";
  };
}

function sendEmail() {
  const name = document.getElementById("name").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  /* ===== EMPTY FIELD CHECK ===== */
  if (!name || !contact || !email || !message) {
    alert("All fields are mandatory");
    return;
  }

  /* ===== PHONE NUMBER VALIDATION ===== */
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(contact)) {
    alert("Please enter a valid 10-digit phone number");
    return;
  }

  /* ===== GMAIL VALIDATION ===== */
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!gmailRegex.test(email)) {
    alert("Please enter a valid Gmail address (example@gmail.com)");
    return;
  }

  /* ===== EMAIL BODY ===== */
  const body = encodeURIComponent(
    `Name: ${name}\nContact: ${contact}\nEmail: ${email}\n\nMessage:\n${message}`
  );

  /* ===== OPEN GMAIL ONLY AFTER VALIDATION ===== */
  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&to=sales@nexerasoft.in&su=New Inquiry&body=${body}`,
    "_blank"
  );
}

/* ---------------------------------------------------------------------
   Shared helpers
--------------------------------------------------------------------- */
const PREFERS_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

document.addEventListener("DOMContentLoaded", () => {
  initHeroEntrance();
  initNavbarScrollShadow();
  initScrollReveal();
  initPointerTilt();
  initMarquee();
});

/* ---------------------------------------------------------------------
   HERO ENTRANCE
   Fades and lifts the hero copy in on page load.
--------------------------------------------------------------------- */
function initHeroEntrance() {
  const hero = document.querySelector(".hero-content");
  if (!hero) return;

  if (PREFERS_REDUCED_MOTION) {
    hero.style.opacity = "1";
    return;
  }

  hero.animate(
    [
      { opacity: 0, transform: "translateY(24px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 700, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" }
  );
}

/* ---------------------------------------------------------------------
   NAVBAR — SHADOW GROWS AS THE PAGE SCROLLS
   Interpolated every frame in JS (not a CSS transition) so the depth
   change tracks scroll position smoothly rather than snapping at a
   single threshold.
--------------------------------------------------------------------- */
function initNavbarScrollShadow() {
  const nav = document.querySelector(".navbar");
  if (!nav) return;

  const maxScroll = 220; // px of scroll over which the shadow ramps up
  let ticking = false;

  const apply = () => {
    const t = Math.min(window.scrollY / maxScroll, 1); // 0 -> 1
    const blur = 8 + t * 22; // 8px -> 30px
    const spread = t * 6; // 0 -> 6px
    const alpha = 0.35 + t * 0.3; // deeper as you scroll
    nav.style.boxShadow = `0 ${4 + t * 10}px ${blur}px ${spread}px rgba(163,177,198,${alpha})`;
    ticking = false;
  };

  apply();
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(apply);
        ticking = true;
      }
    },
    { passive: true }
  );
}

/* ---------------------------------------------------------------------
   SCROLL REVEAL
   Cards and section blocks animate in via the Web Animations API as
   they cross into the viewport. The direction of motion is read from
   which class is present: .reveal-left / .reveal-right / .reveal-scale,
   default is a simple fade-up.
--------------------------------------------------------------------- */
function initScrollReveal() {
  const selector =
    ".card, .service-card, .industry-card, .about-text, .about-img, " +
    ".contact-container, .map-container, .partners-section h2, .partners-section > p";

  const els = Array.from(document.querySelectorAll(selector));
  if (!els.length) return;

  els.forEach((el) => (el.style.opacity = "0"));

  if (PREFERS_REDUCED_MOTION || !("IntersectionObserver" in window)) {
    els.forEach((el) => (el.style.opacity = "1"));
    return;
  }

  const keyframesFor = (el) => {
    if (el.classList.contains("reveal-left")) {
      return [
        { opacity: 0, transform: "translateX(-40px)" },
        { opacity: 1, transform: "translateX(0)" },
      ];
    }
    if (el.classList.contains("reveal-right")) {
      return [
        { opacity: 0, transform: "translateX(40px)" },
        { opacity: 1, transform: "translateX(0)" },
      ];
    }
    if (el.classList.contains("reveal-scale")) {
      return [
        { opacity: 0, transform: "scale(0.92) translateY(18px)" },
        { opacity: 1, transform: "scale(1) translateY(0)" },
      ];
    }
    return [
      { opacity: 0, transform: "translateY(28px)" },
      { opacity: 1, transform: "translateY(0)" },
    ];
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);

        window.setTimeout(() => {
          el.animate(keyframesFor(el), {
            duration: 650,
            easing: "cubic-bezier(.2,.7,.2,1)",
            fill: "forwards",
          });
        }, i * 60); // small stagger for elements revealing together
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  els.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------------------
   3D POINTER TILT
   Cards and partner logo chips tilt toward the cursor.
--------------------------------------------------------------------- */
function initPointerTilt() {
  if (PREFERS_REDUCED_MOTION) return;
  if (window.matchMedia("(hover: none)").matches) return; // skip touch

  const targets = document.querySelectorAll(
    ".card, .service-card, .industry-card, .partner-chip"
  );

  const maxTilt = 4; // degrees — subtle, not gimmicky

  targets.forEach((el) => {
    let frame = null;

    el.style.transformStyle = "preserve-3d";
    el.style.willChange = "transform";

    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform =
          `perspective(900px) ` +
          `rotateX(${(-y * maxTilt).toFixed(2)}deg) ` +
          `rotateY(${(x * maxTilt).toFixed(2)}deg) ` +
          `translateY(-3px)`;
      });
    });

    el.addEventListener("pointerleave", () => {
      if (frame) cancelAnimationFrame(frame);
      el.style.transition = "transform 0.25s ease";
      el.style.transform = "";
      window.setTimeout(() => (el.style.transition = ""), 260);
    });
  });
}

/* ---------------------------------------------------------------------
   PARTNER MARQUEE
   Fully custom, requestAnimationFrame-driven infinite scroll — no CSS
   animation involved. Each row scrolls continuously at its own speed
   and direction, pauses on hover, and can be dragged by hand.
--------------------------------------------------------------------- */
function initMarquee() {
  const rows = document.querySelectorAll(".marquee-row");
  if (!rows.length) return;

  rows.forEach((row) => {
    const track = row.querySelector(".marquee-track");
    if (!track) return;

    const direction = row.classList.contains("marquee-row--right") ? 1 : -1;
    const pxPerSecond = parseFloat(row.dataset.speed || "40");

    let position = 0; // current translateX in px
    let paused = false;
    let dragging = false;
    let dragStartX = 0;
    let dragStartPosition = 0;
    let lastTime = null;
    let loopWidth = 0; // width of ONE copy of the track (track is duplicated x2)

    const measure = () => {
      loopWidth = track.scrollWidth / 2;
      // start the right-scrolling rows already offset so they have
      // room to travel rightwards before wrapping
      if (direction === 1 && position === 0) {
        position = -loopWidth;
      }
    };

    const normalize = () => {
      if (loopWidth <= 0) return;
      if (position <= -loopWidth) position += loopWidth;
      if (position > 0) position -= loopWidth;
    };

    const render = () => {
      track.style.transform = `translateX(${position}px)`;
    };

    const tick = (time) => {
      if (lastTime === null) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (!paused && !dragging && !PREFERS_REDUCED_MOTION) {
        position += direction * pxPerSecond * dt;
        normalize();
        render();
      }

      requestAnimationFrame(tick);
    };

    if (!PREFERS_REDUCED_MOTION) {
      window.requestAnimationFrame(() => {
        measure();
        render();
        requestAnimationFrame(tick);
      });

      window.addEventListener("resize", measure);
    }

    row.style.cursor = "grab";

    row.addEventListener("mouseenter", () => (paused = true));
    row.addEventListener("mouseleave", () => (paused = false));

    row.addEventListener("pointerdown", (e) => {
      dragging = true;
      dragStartX = e.clientX;
      dragStartPosition = position;
      row.setPointerCapture(e.pointerId);
      row.style.cursor = "grabbing";
    });

    row.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      position = dragStartPosition + (e.clientX - dragStartX);
      normalize();
      render();
    });

    const release = (e) => {
      if (!dragging) return;
      dragging = false;
      row.style.cursor = "grab";
      if (e && row.hasPointerCapture && row.hasPointerCapture(e.pointerId)) {
        row.releasePointerCapture(e.pointerId);
      }
    };

    row.addEventListener("pointerup", release);
    row.addEventListener("pointercancel", release);
  });
}
