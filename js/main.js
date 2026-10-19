// All website forms and email links post here; Formspree forwards each submission by email.
var FORMSPREE_URL = "https://formspree.io/f/xkjoaqaj";
var LAKE_EMAIL = "lake@sp-automotive.com";

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var header = document.querySelector(".site-header");

  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.querySelectorAll(".main-nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Services dropdown: hover/focus opens it on desktop; the chevron button opens it on touch and mobile.
  document.querySelectorAll(".nav-dropdown").forEach(function (dropdown) {
    var button = dropdown.querySelector(".dropdown-toggle");
    if (!button) return;

    button.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.toggle("open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
      }
    });

    dropdown.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        dropdown.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
        button.focus();
      }
    });
  });

  // "Email Lake" pop-up: every lake@sp-automotive.com link opens a short form that sends through Formspree.
  var emailLinks = document.querySelectorAll("[data-email-lake]");
  var dialog = null;

  function buildEmailDialog() {
    var d = document.createElement("dialog");
    d.className = "email-dialog";
    d.setAttribute("aria-labelledby", "email-lake-title");
    d.innerHTML =
      '<div class="form-card">' +
      '<button type="button" class="dialog-close" aria-label="Close">&times;</button>' +
      '<span class="eyebrow">' + LAKE_EMAIL + '</span>' +
      '<h2 id="email-lake-title">Email Lake</h2>' +
      '<p class="form-note">Send a message straight to the shop. We usually reply the same business day. In a hurry? Call <a class="text-link" href="tel:+18584063375">(858) 406-3375</a>.</p>' +
      '<form class="contact-form" action="' + FORMSPREE_URL + '" method="POST">' +
      '<input type="hidden" name="_subject" value="New email from sp-automotive.com">' +
      '<input type="hidden" name="for" value="' + LAKE_EMAIL + '">' +
      '<input type="hidden" name="form" value="Email Lake (website email link)">' +
      '<input type="hidden" name="page" value="">' +
      '<div class="form-hp" aria-hidden="true"><label for="el-gotcha">Leave this field empty</label>' +
      '<input type="text" id="el-gotcha" name="_gotcha" tabindex="-1" autocomplete="off"></div>' +
      '<div class="form-field"><label for="el-name">Name</label>' +
      '<input type="text" id="el-name" name="name" autocomplete="name" required></div>' +
      '<div class="form-field"><label for="el-phone">Phone (optional)</label>' +
      '<input type="tel" id="el-phone" name="phone" autocomplete="tel"></div>' +
      '<div class="form-field form-field--full"><label for="el-email">Your Email</label>' +
      '<input type="email" id="el-email" name="email" autocomplete="email" required></div>' +
      '<div class="form-field form-field--full"><label for="el-message">Message</label>' +
      '<textarea id="el-message" name="message" required></textarea></div>' +
      '<div class="form-field--full"><button type="submit" class="btn btn--maroon">Send to Lake</button></div>' +
      "</form></div>";
    document.body.appendChild(d);

    d.querySelector(".dialog-close").addEventListener("click", function () { d.close(); });
    d.addEventListener("click", function (e) {
      if (e.target === d) d.close();
    });
    enhanceForm(d.querySelector("form"));
    return d;
  }

  if (emailLinks.length && typeof HTMLDialogElement === "function") {
    emailLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        if (!dialog) dialog = buildEmailDialog();
        dialog.querySelector('input[name="page"]').value = window.location.href;
        dialog.showModal();
        dialog.querySelector("#el-name").focus();
      });
    });
  }

  // Send every Formspree form in place and show a thank-you, instead of leaving the site.
  function enhanceForm(form) {
    if (!window.fetch || !window.FormData) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var button = form.querySelector('button[type="submit"]');
      var status = form.querySelector(".form-status");
      if (!status) {
        status = document.createElement("p");
        status.className = "form-status";
        status.setAttribute("role", "status");
        form.appendChild(status);
      }
      button.disabled = true;
      status.className = "form-status";
      status.textContent = "Sending…";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Formspree error " + response.status);
          form.reset();
          status.className = "form-status form-status--ok";
          status.textContent = "Thanks! Your message is on its way to Lake. We’ll get back to you shortly.";
        })
        .catch(function () {
          status.className = "form-status form-status--error";
          status.textContent = "Sorry, that didn’t go through. Please call (858) 406-3375 or try again.";
        })
        .then(function () {
          button.disabled = false;
        });
    });
  }

  document.querySelectorAll('form[action^="https://formspree.io/"]').forEach(enhanceForm);

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
