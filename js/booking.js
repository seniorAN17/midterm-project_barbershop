// Booking page: services in the form, price calculator, validation.
// "services" and "formatPrice" come from services.js.

const form = document.getElementById("booking-form");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const serviceSelect = document.getElementById("service");
const studentBox = document.getElementById("student");
const summary = document.getElementById("summary");
const success = document.getElementById("success");

const fields = [nameInput, phoneInput, emailInput, dateInput, timeInput];


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
function updateSummary() {
  const service = services.find(function (s) {
    return s.id === serviceSelect.value;
  });

  let price = service.price;
  let note = "";

  if (studentBox.checked) {
    const day = dateInput.value ? getWeekday(dateInput.value) : -1;
    if (day >= 1 && day <= 4) {                  // Monday - Thursday
      price = Math.round(price * 0.9);           // -10%
      note = " (student -10%)";
    } else {
      note = " (student discount works Monday to Thursday: choose a date)";
    }
  }

  summary.textContent = "Time: " + service.time + " min. Price: " + formatPrice(price) + note;
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
    if (value.trim().length < 2) return "The name must have at least 2 letters.";
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

// The error disappears when the visitor corrects the field.
form.addEventListener("input", function (event) {
  if (event.target.classList.contains("is-invalid")) {
    validateField(event.target);
  }
});

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

  // success: message, then clear the form
  success.textContent = "Thank you, " + nameInput.value.trim() +
    "! We will call you to confirm your visit on " + dateInput.value +
    " at " + timeInput.value + ".";
  form.reset();
  updateSummary();
  $("#success").stop(true, true).fadeIn(300).delay(5000).fadeOut(300);   // jQuery effect
});
