/* Drs Rego, main.js
   1. Mobile navigation (toggle, focus trap, Escape to close)
   2. Sticky header hairline on scroll
   3. Scroll reveal (IntersectionObserver, respects prefers-reduced-motion)
   4. Form validation for any <form data-validate> (submission itself is
      handled by Netlify Forms)
   5. Conversion counting for the Ask us buttons (only when analytics is on)
   6. Prefill from the address bar (?topic=eligibility&job=slug)
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

  /* ---------- 4. Form validation ---------- */
  var MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB, under Netlify's upload limit

  function fieldWrapper(input) {
    return input.closest("fieldset, .field") || input.closest(".field-checkbox");
  }

  function setError(input, message) {
    var field = fieldWrapper(input);
    if (!field) return;
    var errorEl = field.querySelector(".error-message");
    if (message) {
      field.classList.add("has-error");
      if (errorEl) errorEl.textContent = message;
      input.setAttribute("aria-invalid", "true");
    } else {
      field.classList.remove("has-error");
      if (errorEl) errorEl.textContent = "";
      input.removeAttribute("aria-invalid");
    }
  }

  function messageFor(input) {
    var v = input.value.trim();
    if (input.type === "checkbox") {
      return input.checked ? "" : (input.getAttribute("data-error") || "Please tick this box to continue.");
    }
    if (input.type === "radio") {
      var group = input.form.querySelectorAll('input[type="radio"][name="' + input.name + '"]');
      var any = Array.prototype.some.call(group, function (r) { return r.checked; });
      return any ? "" : "Please choose one option.";
    }
    if (input.type === "file") {
      if (input.hasAttribute("required") && input.files.length === 0) return "Please attach a file.";
      if (input.files.length && input.files[0].size > MAX_UPLOAD_BYTES) return "Please upload a file under 8 MB.";
      return "";
    }
    if (input.hasAttribute("required") && !v) return "Please complete this field.";
    if (input.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      return "Please enter a valid email address, e.g. name@example.com.";
    }
    return "";
  }

  function validateForm(form) {
    var firstInvalid = null;
    var seenRadioGroups = {};
    form.querySelectorAll("[required], input[type=file]").forEach(function (input) {
      if (input.type === "radio") {
        if (seenRadioGroups[input.name]) return;
        seenRadioGroups[input.name] = true;
      }
      var message = messageFor(input);
      setError(input, message);
      if (message && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  document.querySelectorAll("form[data-validate]").forEach(function (form) {
    // Validate a field once it has been touched
    form.addEventListener("blur", function (e) {
      var input = e.target;
      if (input.matches && input.matches("[required], input[type=file]") && input.type !== "radio") {
        setError(input, messageFor(input));
      }
    }, true);

    form.addEventListener("change", function (e) {
      var input = e.target;
      if (input.type === "file" || input.type === "checkbox" || input.type === "radio") {
        setError(input, messageFor(input));
      }
    });

    // Block submission only when invalid; a valid form submits natively so
    // Netlify Forms can capture it and redirect to the form's action URL.
    form.addEventListener("submit", function (e) {
      if (!validateForm(form)) e.preventDefault();
    });
  });

  /* ---------- 5. Conversion counting (only if analytics is switched on) ---------- */
  // Records which call to action people actually use. No personal data is sent.
  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest("a.btn, a.link-arrow");
    if (!link || typeof window.gtag !== "function") return;
    var where = link.closest(".eligibility") ? "eligibility_block"
      : link.closest(".ask-us") ? "ask_us_band"
      : link.closest(".job-actions") ? "job_page"
      : link.closest(".empty-state") ? "jobs_empty_state"
      : "other";
    window.gtag("event", "cta_click", {
      cta_text: (link.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60),
      cta_location: where,
      link_url: link.getAttribute("href")
    });
  });

  /* ---------- 6. Prefill from the address bar ---------- */
  // /contact.html?topic=eligibility&job=<slug> and /register-your-interest/?job=<slug>
  var params = new URLSearchParams(window.location.search);
  var topic = params.get("topic");
  var job = params.get("job");
  if (job && !/^[a-z0-9-]{1,80}$/.test(job)) job = null;
  if (topic || job) {
    var topicInput = document.querySelector('input[name="topic"]');
    var jobInput = document.querySelector('input[name="job"]');
    if (topicInput && topic) topicInput.value = topic;
    if (jobInput && job) jobInput.value = job;

    var role = document.getElementById("role");
    if (role && topic === "eligibility") role.value = "Doctor";

    var message = document.getElementById("message");
    if (message && topic === "eligibility" && !message.value) {
      message.value = "I would like to check my section 19AB position" +
        (job ? " for the role: " + job.replace(/-/g, " ") : "") +
        ". I trained in [country], was first registered in Australia in [month and year], and would like to work in [location].";
    }

    var jobNote = document.querySelector("[data-job-note]");
    if (jobNote && job) {
      jobNote.hidden = false;
      var slot = jobNote.querySelector("[data-job-slot]");
      if (slot) slot.textContent = job.replace(/-/g, " ");
    }
  }
})();
