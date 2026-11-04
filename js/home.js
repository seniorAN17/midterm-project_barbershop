// Home page: show the services as cards, search and filter them.
// "services" and "formatPrice" come from services.js.

const list = document.getElementById("services-list");
const searchInput = document.getElementById("service-search");
const categorySelect = document.getElementById("service-category");
const noResult = document.getElementById("no-result");

// 1. Build one card with DOM methods
function createCard(service) {
  const card = document.createElement("div");
  card.className = "service";

  const title = document.createElement("h3");
  title.textContent = service.name;

  const text = document.createElement("p");
  text.textContent = service.description;

  const meta = document.createElement("p");
  meta.className = "service-meta";
  meta.textContent = service.time + " min · " + formatPrice(service.price);

  card.append(title, text, meta);
  return card;
}

// 2. Show a list of services on the page
function showServices(items) {
  list.innerHTML = "";                       // remove the old cards
  for (const service of items) {
    list.appendChild(createCard(service));   // add a new card
  }
  noResult.hidden = items.length > 0;        // the message "Nothing found" is shown only for an empty list
  $(".service").hide().fadeIn(300);          // jQuery effect: the cards appear smoothly
}

// 3. Filter by the search text and by the category
function filterServices() {
  const text = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;

  const result = services.filter(function (service) {
    const matchText = (service.name + " " + service.description).toLowerCase().includes(text);
    const matchCategory = category === "all" || service.category === category;
    return matchText && matchCategory;
  });

  showServices(result);
}

searchInput.addEventListener("input", filterServices);     // every letter
categorySelect.addEventListener("change", filterServices); // another category

filterServices();   // the first show: all services
