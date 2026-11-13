// Light and dark mode.
// The attribute data-bs-theme on <html> changes the Bootstrap colors and my CSS variables (see style.css, section 0).
// The chosen mode is saved in localStorage, so it stays after a reload and on every page.
// This file is loaded in the <head>, so the mode is set before the page is drawn (no flash).

const THEME_KEY = "northside-theme";

function getTheme() {
  const saved = readJSON(THEME_KEY, null);
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  // nothing saved yet: use the mode of the device
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);
  document.documentElement.style.colorScheme = theme;   // the browser draws its own parts (scrollbar, empty page) in the same mode

  // The text of the button is made by CSS (.theme-toggle::after), so it is right from the first frame.
  // Here only the label for screen readers is updated.
  const button = document.getElementById("theme-toggle");
  if (button) {
    const next = theme === "dark" ? "light" : "dark";
    button.setAttribute("aria-label", "Switch to " + next + " mode");
  }
}

applyTheme(getTheme());

document.addEventListener("DOMContentLoaded", function () {
  applyTheme(getTheme());   // now the button exists: set its text

  document.getElementById("theme-toggle").addEventListener("click", function () {
    const current = document.documentElement.getAttribute("data-bs-theme");
    const next = current === "dark" ? "light" : "dark";
    writeJSON(THEME_KEY, next);

    // switch all colors at the same moment: the transitions are turned off for a short time
    document.documentElement.classList.add("theme-switching");
    applyTheme(next);
    setTimeout(function () {
      document.documentElement.classList.remove("theme-switching");
    }, 50);
  });
});
