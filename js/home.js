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

  // the badge is shown on the 3 most popular services
  if (top3Ids.includes(service.id)) {
    const badge = document.createElement("span");
    badge.className = "badge-popular";
    badge.textContent = "Popular";
    card.append(badge);
  }

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
  $(".service").hide().fadeIn(600);          // jQuery effect: the cards appear smoothly
}

// The most popular services first: sort a COPY of the array by "popularity", from the biggest number to the smallest.
// (slice() makes the copy, so the original array and the booking form stay as they are)
const popularServices = services.slice().sort(function (a, b) {
  return b.popularity - a.popularity;
});

// The 3 most popular services (the first 3 after sorting). Their ids are used for the badge and for the filter "Top 3".
const top3Ids = popularServices.slice(0, 3).map(function (service) {
  return service.id;
});

// 3. Filter by the search text and by the category
function filterServices() {
  const text = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;

  const result = popularServices.filter(function (service) {
    const matchText = (service.name + " " + service.description).toLowerCase().includes(text);
    let matchCategory;
    if (category === "all") {
      matchCategory = true;
    } else if (category === "top3") {
      matchCategory = top3Ids.includes(service.id);   // "Top 3 popular": only the 3 most popular services
    } else {
      matchCategory = service.category === category;
    }
    return matchText && matchCategory;
  });

  showServices(result);
}

searchInput.addEventListener("input", filterServices);     // every letter
categorySelect.addEventListener("change", filterServices); // another category

filterServices();   // the first show: all services
