// The content of the website: an array of 8 objects (one object = one service).
// popularity = how often visitors book the service (0-100). The home page shows the biggest numbers first.
// Both pages use it: the home page shows the cards, the booking page fills the <select>.
const services = [
  { id: "classic", name: "Classic haircut",  category: "haircut", time: 45, price: 5000, popularity: 88, barber: "Any",   description: "Scissors or clipper, wash and styling." },
  { id: "fade",    name: "Fade haircut",     category: "haircut", time: 50, price: 6000, popularity: 76, barber: "Aidar", description: "Skin fade with a clean line-up." },
  { id: "kids",    name: "Kids haircut",     category: "haircut", time: 30, price: 3500, popularity: 52, barber: "Any",   description: "For boys under 12." },
  { id: "combo",   name: "Haircut + beard",  category: "haircut", time: 60, price: 7500, popularity: 100, barber: "Any",   description: "The most popular combination." },
  { id: "beard",   name: "Beard trim",       category: "beard",   time: 30, price: 3000, popularity: 64, barber: "Any",   description: "Shape, line-up and beard oil." },
  { id: "shave",   name: "Hot towel shave",  category: "beard",   time: 30, price: 4000, popularity: 41, barber: "Timur", description: "Straight razor and two hot towels." },
  { id: "head",    name: "Head shave",       category: "beard",   time: 30, price: 4500, popularity: 20, barber: "Timur", description: "Smooth head shave with a hot towel." },
  { id: "styling", name: "Styling",          category: "styling", time: 15, price: 2000, popularity: 33, barber: "Any",   description: "Wash, dry and a product of your choice." }
];

// 5000 -> "5 000 ₸"
function formatPrice(price) {
  return price.toLocaleString("ru-RU") + " ₸";
}
