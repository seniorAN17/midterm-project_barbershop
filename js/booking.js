// Booking page: services in the form, price calculator, validation, saving the booking.
// "services" and "formatPrice" come from services.js, the storage functions from storage.js.

const form = document.getElementById("booking-form");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const serviceSelect = document.getElementById("service");
const barberSelect = document.getElementById("barber");
const studentBox = document.getElementById("student");
const summary = document.getElementById("summary");
const success = document.getElementById("success");

const fields = [nameInput, phoneInput, emailInput, dateInput, timeInput];


// ---------- 0. Barber from the link ----------
// The button "Book Aidar" on the home page opens booking.html?barber=aidar#booking.
// We read the word after "barber=" and select the same barber in the field.
// If the word is not one of our barbers, the field stays "Any barber".
const barberFromLink = new URLSearchParams(window.location.search).get("barber");
if (barberFromLink) {
  for (const option of barberSelect.options) {
    if (option.value === barberFromLink.toLowerCase()) {
      barberSelect.value = option.value;
    }
  }
}


// ---------- 1. Services in the <select> (from the array) ----------
for (const service of services) {
  const option = document.createElement("option");
  option.value = service.id;
  option.textContent = service.name;
  serviceSelect.appendChild(option);
}


// ---------- helpers for dates ----------
// "2026-11-10" -> day of the week: 0 = Sunday, 1 = Monday ... 6 = Saturday
function getWeekday(dateString) {
  return new Date(dateString + "T00:00:00").getDay();
}

// today as "YYYY-MM-DD" (the same format as the value of <input type="date">)
function todayString() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + month + "-" + day;
}

dateInput.min = todayString();   // the calendar does not offer past days


// ---------- 2. Price calculator ----------
// Returns the chosen service and the final price.
function getPrice() {
  const service = services.find(function (s) {
    return s.id === serviceSelect.value;
  });

  let price = service.price;
  let note = "";
  let discount = false;

  if (studentBox.checked) {
    const day = dateInput.value ? getWeekday(dateInput.value) : -1;
    if (day >= 1 && day <= 4) {                  // Monday - Thursday
      price = Math.round(price * 0.9);           // -10%
      discount = true;
      note = " (student -10%)";
    } else {
      note = " (student discount works Monday to Thursday: choose a date)";
    }
  }

  return { service: service, price: price, discount: discount, note: note };
}

function updateSummary() {
  const result = getPrice();
  summary.textContent = "Time: " + result.service.time + " min. Price: " + formatPrice(result.price) + result.note;
  $("#summary").stop(true, true).hide().fadeIn(200);   // jQuery effect
}

serviceSelect.addEventListener("change", updateSummary);
studentBox.addEventListener("change", updateSummary);
dateInput.addEventListener("change", updateSummary);
updateSummary();   // the first show


// ---------- 3. Validation ----------
// Opening hours: Sunday and Saturday are different, other days are the same.
const openHours = { 0: ["12:00", "18:00"], 6: ["10:00", "20:00"] };
const normalHours = ["10:00", "21:00"];

// One rule for one field. It gets the value and returns an error text.
// "" (empty text) means: no error.
const rules = {
  name: function (value) {
    if (value.trim() === "") return "Please enter your name.";
    const name = value.trim();
    // only letters (any language), spaces, hyphens and apostrophes
    if (!/^[\p{L}\s'’-]+$/u.test(name)) return "The name can have only letters, spaces, hyphens and apostrophes.";
    if (name.replace(/[^\p{L}]/gu, "").length < 2) return "The name must have at least 2 letters.";
    // letters first; a space, hyphen or apostrophe is allowed only ONE time between two parts, for example Anna-Maria or O'Neil
    if (!/^\p{L}+(?:[\s'’-]\p{L}+)*$/u.test(name)) return "Use letters only. A hyphen, an apostrophe or a space must be between two parts of the name, for example Anna-Maria.";
    if (name.length > 40) return "The name is too long (maximum 40 characters).";
    return "";
  },
  phone: function (value) {
    if (value.trim() === "") return "Please enter your phone number.";
    const pattern = /^\+7[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
    if (!pattern.test(value.trim())) return "Use the format +7 700 000 00 00.";
    return "";
  },
  email: function (value) {
    if (value.trim() === "") return "";   // the email is optional
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(value.trim())) return "Enter a correct email, for example name@mail.com.";
    return "";
  },
  date: function (value) {
    if (value === "") return "Please choose a date.";
    if (value < todayString()) return "The date cannot be in the past.";
    return "";
  },
  time: function (value) {
    if (value === "") return "Please choose a time.";
    const day = dateInput.value ? getWeekday(dateInput.value) : 1;
    const hours = openHours[day] || normalHours;
    if (value < hours[0] || value > hours[1]) {
      return "On this day we work from " + hours[0] + " to " + hours[1] + ".";
    }
    return "";
  }
};

// Check one field: show or hide its error under the field.
function validateField(field) {
  const message = rules[field.id](field.value);
  document.getElementById(field.id + "-error").textContent = message;
  field.classList.toggle("is-invalid", message !== "");   // red border + error text (Bootstrap)
  return message === "";
}

// The Name field does not accept numbers or other symbols:
// every character that is not a letter, a space, a hyphen or an apostrophe is removed at once.
// The name cannot start with a hyphen/apostrophe/space, and two of them in a row become one.
nameInput.addEventListener("input", function () {
  const cleaned = nameInput.value
    .replace(/[^\p{L}\s'’-]/gu, "")
    .replace(/^[\s'’-]+/, "")
    .replace(/([\s'’-])[\s'’-]+/g, "$1");
  if (cleaned !== nameInput.value) {
    nameInput.value = cleaned;
  }
});

// The error disappears when the visitor corrects the field.
form.addEventListener("input", function (event) {
  if (event.target.classList.contains("is-invalid")) {
    validateField(event.target);
  }
});


// ---------- 4. Saving the booking ----------
// One booking = one object. A list of such objects is saved in localStorage (as JSON).
function createBooking() {
  const result = getPrice();
  return {
    id: Date.now(),                       // a unique number: it is used to remove the booking
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
    service: result.service.name,
    barber: barberSelect.options[barberSelect.selectedIndex].text,
    date: dateInput.value,
    time: timeInput.value,
    minutes: result.service.time,
    price: result.price,
    student: result.discount
  };
}

// Send: check all fields.
form.addEventListener("submit", function (event) {
  event.preventDefault();   // do not reload the page

  let allCorrect = true;
  for (const field of fields) {
    if (!validateField(field)) allCorrect = false;
  }

  if (!allCorrect) {
    form.querySelector(".is-invalid").focus();   // the keyboard goes to the first error
    return;
  }

  // success: save the booking, show the message, clear the form
  const booking = createBooking();
  const saved = saveBookings(getBookings().concat(booking));
  showBookingCount();

  success.textContent = "Thank you, " + booking.name +
    "! We will call you to confirm your visit on " + formatDate(booking.date) +
    " at " + booking.time + ". ";

  if (saved) {
    const link = document.createElement("a");
    link.href = "bookings.html";
    link.textContent = "See my bookings";
    success.append(link);
  } else {
    success.append("This browser cannot save your list of bookings.");
  }

  form.reset();
  updateSummary();
  $("#success").stop(true, true).fadeIn(300).delay(8000).fadeOut(300);   // jQuery effect
});
