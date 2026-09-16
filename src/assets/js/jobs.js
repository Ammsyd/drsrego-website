/* Drs Rego, jobs.js
   Client-side filtering for /jobs/. Without JavaScript every role is shown
   and the filter form is hidden (see .no-js .job-filters in styles.css). */
(function () {
  "use strict";
  var form = document.querySelector("[data-job-filters]");
  var list = document.getElementById("jobs-list");
  if (!form || !list) return;

  var cards = Array.prototype.slice.call(list.querySelectorAll(".job-card"));
  var count = document.getElementById("jobs-count");
  var none = document.getElementById("jobs-none");
  var stateSel = form.querySelector('[name="state"]');
  var typeSel = form.querySelector('[name="type"]');
  var imgBox = form.querySelector('[name="img"]');

  function apply() {
    var state = stateSel.value;
    var type = typeSel.value;
    var imgOnly = imgBox.checked;
    var shown = 0;
    cards.forEach(function (card) {
      var ok =
        (!state || card.getAttribute("data-state") === state) &&
        (!type || card.getAttribute("data-type") === type) &&
        (!imgOnly || card.getAttribute("data-img") === "yes");
      card.hidden = !ok;
      if (ok) shown += 1;
    });
    if (count) count.textContent = shown + " of " + cards.length + " roles shown";
    if (none) none.hidden = shown !== 0;
  }

  form.addEventListener("change", apply);
  form.addEventListener("submit", function (e) { e.preventDefault(); apply(); });
  var reset = document.querySelector("[data-job-reset]");
  if (reset) {
    reset.addEventListener("click", function () {
      stateSel.value = "";
      typeSel.value = "";
      imgBox.checked = false;
      apply();
    });
  }
})();
