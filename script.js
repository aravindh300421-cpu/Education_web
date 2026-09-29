/* ==========================================================
   EduLearn – script.js
   1. Mobile menu   2. Smooth scrolling   3. Course search
   4. Form validation   5. Dark mode   6. Welcome popup
   7. Small extras (enroll button, scroll reveal, footer year)
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. Mobile navigation toggle ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  function setMenu(open) {
    navMenu.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "✕" : "☰";
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  menuToggle.addEventListener("click", () => {
    setMenu(!navMenu.classList.contains("open"));
  });

  /* ---------- 2. Smooth scrolling for nav links ---------- */
  // CSS already sets scroll-behavior: smooth; this also closes the
  // mobile menu and works in browsers that ignore the CSS rule.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setMenu(false);
    });
  });

  /* ---------- 3. Course search filter (filters while typing) ---------- */
  const searchInput = document.getElementById("courseSearch");
  const courseCards = document.querySelectorAll(".course");
  const noResults = document.getElementById("noResults");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    courseCards.forEach((card) => {
      // Search in the card's title and description
      const text = card.textContent.toLowerCase();
      const match = text.includes(query);
      card.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });

    // Show a friendly message when nothing matches
    noResults.hidden = visibleCount > 0;
  });

  /* ---------- 4. Contact form validation ---------- */
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");

  // Simple email pattern: text@text.text
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Show or clear an error message under a field
  function setError(input, message) {
    const field = input.closest(".field");
    field.classList.toggle("invalid", Boolean(message));
    document.getElementById(input.id + "Error").textContent = message;
  }

  // Each validator returns an error message, or "" if the value is fine
  const validators = {
    name: (v) => (v ? "" : "Enter your name."),
    email: (v) => {
      if (!v) return "Enter your email address.";
      return emailPattern.test(v) ? "" : "Enter a valid email, like name@example.com.";
    },
    message: (v) => (v ? "" : "Write a message."),
  };

  // Validate one field; returns true if it is valid
  function validateField(input) {
    const error = validators[input.id](input.value.trim());
    setError(input, error);
    return error === "";
  }

  // Re-check a field as the user fixes it
  form.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", () => {
      success.hidden = true;
      if (input.closest(".field").classList.contains("invalid")) validateField(input);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Validate every field (no short-circuit, so all errors appear)
    const results = [...form.querySelectorAll("input, textarea")].map(validateField);

    if (results.every(Boolean)) {
      // In a real site you would send the data to a server here
      form.reset();
      success.hidden = false;
    } else {
      success.hidden = true;
      form.querySelector(".invalid input, .invalid textarea").focus();
    }
  });

  /* ---------- 5. Dark mode toggle ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  // Use the saved choice, otherwise the visitor's system preference
  let savedTheme = null;
  try { savedTheme = localStorage.getItem("edulearn-theme"); } catch (err) { /* storage unavailable */ }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("edulearn-theme", next); } catch (err) { /* ignore */ }
  });

  /* ---------- 6. Welcome popup on page load ---------- */
  const modal = document.getElementById("welcomeModal");
  const closeModal = document.getElementById("closeModal");

  modal.hidden = false;
  closeModal.focus();

  const hideModal = () => { modal.hidden = true; };
  closeModal.addEventListener("click", hideModal);
  // Close by clicking the dark backdrop or pressing Escape
  modal.addEventListener("click", (e) => { if (e.target === modal) hideModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideModal(); });

  /* ---------- 7. Extras ---------- */
  // Enroll buttons confirm the action
  document.querySelectorAll(".enroll").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.textContent = "Enrolled ✓";
      btn.classList.add("enrolled");
    });
  });

  // Fade cards in as they scroll into view
  const revealItems = document.querySelectorAll(".card");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((el) => { el.classList.add("reveal"); observer.observe(el); });
  }

  // Keep the footer year current
  document.getElementById("year").textContent = new Date().getFullYear();
});
