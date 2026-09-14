/* Drs Rego — main.js
   1. Mobile navigation (toggle, focus trap, Escape to close)
   2. Sticky header hairline on scroll
   3. Scroll reveal (IntersectionObserver, respects prefers-reduced-motion)
   4. Contact form validation (submission itself is handled by Netlify Forms)
*/
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  /* ---------- 1. Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      if (open) {
        var first = nav.querySelector("a, button");
        if (first) first.focus();
      }
    });

    // Escape closes the panel and returns focus to the toggle
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
        toggle.focus();
      }
      // Simple focus trap while the panel is open
      if (e.key === "Tab" && nav.classList.contains("is-open")) {
        var items = [toggle].concat(
          Array.prototype.slice.call(nav.querySelectorAll("a, button"))
        );
        var firstEl = items[0];
        var lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    });

    // Close when a nav link is chosen (same-page anchors)
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
  }

  /* ---------- 2. Sticky header hairline ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 3. Scroll reveal ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 4. Contact form ---------- */
  var form = document.getElementById("enquiry-form");
  if (!form) return;

  function setError(input, message) {
    var field = input.closest(".field, .field-checkbox");
    var errorEl = field && field.querySelector(".error-message");
    if (message) {
      field.classList.add("has-error");
      if (errorEl) errorEl.textContent = message;
      input.setAttribute("aria-invalid", "true");
    } else {
      field.classList.remove("has-error");
      input.removeAttribute("aria-invalid");
    }
  }

  function validate() {
    var firstInvalid = null;

    form.querySelectorAll("[required]").forEach(function (input) {
      var message = "";
      if (input.type === "checkbox") {
        if (!input.checked) message = "Please tick this box so we can respond to your enquiry.";
      } else if (!input.value.trim()) {
        message = "Please complete this field.";
      } else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        message = "Please enter a valid email address, e.g. name@example.com.";
      }
      setError(input, message);
      if (message && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  // Validate on blur once a field has been touched
  form.addEventListener(
    "blur",
    function (e) {
      var input = e.target;
      if (input.matches && input.matches("[required]") && input.value !== "") {
        validate();
      }
    },
    true
  );

  // Block submission only when invalid; a valid form submits natively so
  // Netlify Forms can capture it and redirect to the form's action URL.
  form.addEventListener("submit", function (e) {
    if (!validate()) {
      e.preventDefault();
    }
  });
})();
