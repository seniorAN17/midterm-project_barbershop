// Shared helpers: save and read data in localStorage as JSON.
// Every call is inside try/catch, so the pages also work when the storage is empty, broken or blocked.

function readJSON(key, fallback) {
  try {
    const text = localStorage.getItem(key);
    return text === null ? fallback : JSON.parse(text);   // text -> object
  } catch (error) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));      // object -> text
    return true;
  } catch (error) {
    return false;
  }
}

// ----- bookings -----
const BOOKINGS_KEY = "northside-bookings";

function getBookings() {
  const data = readJSON(BOOKINGS_KEY, []);
  return Array.isArray(data) ? data : [];   // wrong data in the storage = empty list
}

function saveBookings(list) {
  return writeJSON(BOOKINGS_KEY, list);
}

// the number in the navbar ("My bookings 2")
function showBookingCount() {
  const badge = document.getElementById("booking-count");
  if (badge) {
    badge.textContent = getBookings().length;
  }
}

// "2026-11-10" -> "10.11.2026"
function formatDate(dateString) {
  const parts = dateString.split("-");
  return parts[2] + "." + parts[1] + "." + parts[0];
}
