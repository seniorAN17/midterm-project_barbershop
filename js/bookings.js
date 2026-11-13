// "My bookings" page: shows the bookings saved in localStorage.
// The functions getBookings(), saveBookings() and formatDate() come from storage.js,
// formatPrice() comes from services.js.

const list = document.getElementById("bookings-list");
const bar = document.getElementById("bookings-bar");
const summary = document.getElementById("bookings-summary");
const empty = document.getElementById("bookings-empty");
const clearButton = document.getElementById("clear-all");

// One line of text inside a card
function addLine(card, text, className) {
  const p = document.createElement("p");
  p.textContent = text;
  if (className) p.className = className;
  card.appendChild(p);
}

// Build one card with DOM methods
function createBookingCard(booking) {
  const card = document.createElement("article");
  card.className = "booking-card";

  const title = document.createElement("h3");
  title.textContent = booking.service;
  card.appendChild(title);

  addLine(card, formatDate(booking.date) + " at " + booking.time);
  addLine(card, "Barber: " + booking.barber + " · " + booking.minutes + " min");
  addLine(card, "Name: " + booking.name + ", " + booking.phone);
  addLine(card, formatPrice(booking.price) + (booking.student ? " (student -10%)" : ""), "booking-price");

  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-remove";
  button.textContent = "Remove";
  button.dataset.id = booking.id;   // we need the id to know which booking to remove
  button.setAttribute("aria-label", "Remove the booking: " + booking.service + ", " + formatDate(booking.date));
  card.appendChild(button);

  return card;
}

// Show everything: cards, the counter, the total price
function render() {
  const bookings = getBookings();

  // the nearest visit first (the date and the time are texts, so we can compare them)
  const sorted = bookings.slice().sort(function (a, b) {
    return (a.date + a.time).localeCompare(b.date + b.time);
  });

  list.innerHTML = "";
  let total = 0;
  for (const booking of sorted) {
    list.appendChild(createBookingCard(booking));
    total += booking.price;                    // the calculated value
  }

  summary.textContent = "Bookings: " + bookings.length + ". Total: " + formatPrice(total);
  bar.hidden = bookings.length === 0;          // no bookings: no counter and no "Clear all"
  empty.hidden = bookings.length > 0;          // no bookings: the message "No bookings yet"
  clearButton.disabled = false;

  showBookingCount();
  $(".booking-card").hide().fadeIn(300);       // jQuery effect: the cards appear smoothly
}

// Remove one booking (one click on a "Remove" button; the click is caught on the whole list)
list.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-id]");
  if (!button) return;

  const id = Number(button.dataset.id);
  button.disabled = true;                      // a second fast click does nothing

  // jQuery effect: the card fades out, then the booking is removed from the storage
  $(button.closest(".booking-card")).fadeOut(250, function () {
    const left = getBookings().filter(function (booking) {
      return booking.id !== id;
    });
    saveBookings(left);
    render();
  });
});

// Clear all
clearButton.addEventListener("click", function () {
  clearButton.disabled = true;                 // a second fast click does nothing
  $("#bookings-list").fadeOut(250, function () {
    saveBookings([]);
    render();
    $("#bookings-list").show();
  });
});

render();
