function getPrice(type, km, kg) {
  var start = 0;
  var perKm = 0;

  if (type == "express") {
    start = 1500;
    perKm = 250;
  } else if (type == "sameday") {
    start = 1000;
    perKm = 150;
  } else if (type == "standard") {
    start = 700;
    perKm = 100;
  } else if (type == "business") {
    start = 600;
    perKm = 90;
  } else if (type == "bulk") {
    start = 2500;
    perKm = 120;
  } else if (type == "scheduled") {
    start = 800;
    perKm = 110;
  } else if (type == "intercity") {
    start = 5000;
    perKm = 60;
  }

  var price = start + perKm * km;
  if (kg > 5) {
    price = price + (kg - 5) * 100;
  }
  return price;
}

function naira(amount) {
  return "₦" + Math.round(amount).toLocaleString();
}

var steps = [
  "Order received",
  "Rider assigned",
  "Package picked up",
  "In transit",
  "Out for delivery",
  "Successfully delivered"
];

var parcelStep;
var parcelSender;
var parcelReceiver;
var parcelFrom;
var parcelTo;
var parcelEta;

function findParcel(number) {
  if (number == "BEX-1001") {
    parcelStep = 3;
    parcelSender = "Ada Eze";
    parcelReceiver = "Bola Ade";
    parcelFrom = "Ikeja, Lagos";
    parcelTo = "Lekki Phase 1, Lagos";
    parcelEta = "Today, 4:30 PM";
    return true;
  }
  if (number == "BEX-1002") {
    parcelStep = 5;
    parcelSender = "Kunle Bello";
    parcelReceiver = "Zainab Musa";
    parcelFrom = "Wuse, Abuja";
    parcelTo = "Garki, Abuja";
    parcelEta = "Delivered at 11:12 AM";
    return true;
  }
  if (number == "BEX-1003") {
    parcelStep = 0;
    parcelSender = "Ngozi Obi";
    parcelReceiver = "Emeka Nwosu";
    parcelFrom = "GRA, Port Harcourt";
    parcelTo = "Trans-Amadi, Port Harcourt";
    parcelEta = "Tomorrow, 10:00 AM";
    return true;
  }
  return false;
}

function badPhone(phone) {
  phone = phone.split(" ").join("");
  if (phone.length != 11 || phone.charAt(0) != "0") {
    return true;
  }
  return false;
}

function badEmail(email) {
  if (email.indexOf("@") == -1 || email.indexOf(".") == -1) {
    return true;
  }
  return false;
}

function showPage() {
  var name = location.hash.replace("#", "");
  var pages = ["home", "services", "book", "track", "pricing", "account", "rider", "business", "contact", "admin"];
  var goToAbout = false;

  if (name == "about") {
    goToAbout = true;
    name = "home";
  }
  if (pages.indexOf(name) == -1) {
    name = "home";
  }

  for (var i = 0; i < pages.length; i++) {
    document.getElementById("page-" + pages[i]).style.display = "none";
  }
  document.getElementById("page-" + name).style.display = "block";
  document.getElementById("menu").className = "links";
  document.getElementById("burger").className = "burger";

  if (goToAbout) {
    document.getElementById("about").scrollIntoView();
  } else {
    window.scrollTo(0, 0);
  }
}

window.onhashchange = showPage;

function toggleMenu() {
  var menu = document.getElementById("menu");
  var burger = document.getElementById("burger");
  if (menu.className == "links") {
    menu.className = "links open";
    burger.className = "burger open";
  } else {
    menu.className = "links";
    burger.className = "burger";
  }
}

function showPanel(group, name, button) {
  var names;
  if (group == "acc") {
    names = ["active", "history", "addresses", "payments", "alerts"];
  } else {
    names = ["deliveries", "riders", "customers", "revenue", "transactions"];
  }

  for (var i = 0; i < names.length; i++) {
    document.getElementById(group + "-" + names[i]).style.display = "none";
  }
  document.getElementById(group + "-" + name).style.display = "block";

  var buttons = button.parentElement.getElementsByTagName("button");
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].className = "";
  }
  button.className = "on";

  if (group == "adm") {
    filterRows();
  }
}

function filterRows() {
  var text = document.getElementById("admin-search").value.toLowerCase();
  var names = ["deliveries", "riders", "customers", "revenue", "transactions"];

  for (var i = 0; i < names.length; i++) {
    var rows = document.getElementById("adm-" + names[i]).getElementsByTagName("tr");
    for (var j = 1; j < rows.length; j++) {
      if (rows[j].textContent.toLowerCase().indexOf(text) == -1) {
        rows[j].style.display = "none";
      } else {
        rows[j].style.display = "";
      }
    }
  }
}

function filterServices() {
  var text = document.getElementById("service-search").value.toLowerCase();
  var cards = document.getElementsByClassName("service");
  var found = 0;

  for (var i = 0; i < cards.length; i++) {
    if (cards[i].textContent.toLowerCase().indexOf(text) == -1) {
      cards[i].style.display = "none";
    } else {
      cards[i].style.display = "block";
      found = found + 1;
    }
  }

  if (found == 0) {
    document.getElementById("no-services").style.display = "block";
  } else {
    document.getElementById("no-services").style.display = "none";
  }
}

function bookType(type) {
  document.getElementById("book-form").type.value = type;
  updateBookPrice();
  location.hash = "book";
}

var bookForm = document.getElementById("book-form");

function updateBookPrice() {
  document.getElementById("book-price").textContent = naira(getPrice(bookForm.type.value, 0, 0));
}

bookForm.oninput = updateBookPrice;
updateBookPrice();

bookForm.onsubmit = function (e) {
  e.preventDefault();
  var f = bookForm;
  var today = new Date().toISOString().slice(0, 10);

  if (f.pickup.value == "") { alert("Please enter the pickup location"); return; }
  if (f.destination.value == "") { alert("Please enter the delivery destination"); return; }
  if (f.senderName.value == "") { alert("Please enter the sender's name"); return; }
  if (badPhone(f.senderPhone.value)) { alert("Sender phone number is not valid"); return; }
  if (f.receiverName.value == "") { alert("Please enter the receiver's name"); return; }
  if (badPhone(f.receiverPhone.value)) { alert("Receiver phone number is not valid"); return; }
  if (f.category.value == "") { alert("Please select a package category"); return; }
  if (f.date.value == "") { alert("Please choose a pickup date"); return; }
  if (f.date.value < today) { alert("The pickup date cannot be in the past"); return; }
  if (f.time.value == "") { alert("Please choose a pickup time"); return; }
  if (f.description.value.length < 5) { alert("Please describe the package"); return; }

  document.getElementById("r-route").textContent = f.pickup.value + " to " + f.destination.value;
  document.getElementById("r-people").textContent = f.senderName.value + " (" + f.senderPhone.value + ") to " + f.receiverName.value + " (" + f.receiverPhone.value + ")";
  document.getElementById("r-package").textContent = f.category.value + ": " + f.description.value;
  document.getElementById("r-when").textContent = f.type.options[f.type.selectedIndex].text + ", " + f.date.value + " at " + f.time.value;
  document.getElementById("r-total").textContent = naira(getPrice(f.type.value, 0, 0));

  document.getElementById("confirmed").style.display = "none";
  document.getElementById("review").style.display = "block";
};

function hideReview() {
  document.getElementById("review").style.display = "none";
}

function confirmOrder() {
  var number = "BEX-" + (1100 + Math.floor(Math.random() * 900));
  document.getElementById("new-number").textContent = number;
  document.getElementById("review").style.display = "none";
  document.getElementById("confirmed").style.display = "block";
  alert("Booking confirmed. Your tracking number is " + number);
  bookForm.reset();
  updateBookPrice();
}

document.getElementById("track-form").onsubmit = function (e) {
  e.preventDefault();
  var number = document.getElementById("track-input").value.trim().toUpperCase();
  var result = document.getElementById("track-result");

  if (number == "") {
    alert("Please enter a tracking number");
    return;
  }

  if (!findParcel(number)) {
    result.style.display = "none";
    alert("Tracking number not found");
    return;
  }

  document.getElementById("t-number").textContent = number;
  document.getElementById("t-status").textContent = steps[parcelStep];
  document.getElementById("t-sender").textContent = parcelSender;
  document.getElementById("t-receiver").textContent = parcelReceiver;
  document.getElementById("t-from").textContent = parcelFrom;
  document.getElementById("t-to").textContent = parcelTo;
  document.getElementById("t-eta").textContent = parcelEta;

  var items = document.getElementById("timeline").getElementsByTagName("li");
  for (var i = 0; i < items.length; i++) {
    if (i < parcelStep) {
      items[i].className = "done";
    } else if (i == parcelStep) {
      items[i].className = "done cur";
    } else {
      items[i].className = "";
    }
  }

  result.style.display = "block";
};

function calculate() {
  var type = document.getElementById("calc-type").value;
  var km = Number(document.getElementById("calc-km").value);
  var kg = Number(document.getElementById("calc-kg").value);

  if (km > 0 && kg > 0) {
    document.getElementById("calc-result").innerHTML = "Estimated cost: <b>" + naira(getPrice(type, km, kg)) + "</b>";
  } else {
    document.getElementById("calc-result").textContent = "Enter a valid distance and weight.";
  }
}
calculate();

document.getElementById("rider-form").onsubmit = function (e) {
  e.preventDefault();
  var f = this;

  if (f.fullName.value == "") { alert("Please enter your full name"); return; }
  if (badPhone(f.phone.value)) { alert("Phone number is not valid"); return; }
  if (badEmail(f.email.value)) { alert("Email address is not valid"); return; }
  if (f.address.value == "") { alert("Please enter your address"); return; }
  if (f.state.value == "") { alert("Please select your state"); return; }
  if (f.city.value == "") { alert("Please enter your city"); return; }
  if (f.bike.value == "") { alert("Please say if you own a motorcycle"); return; }
  if (f.idType.value == "") { alert("Please select your ID type"); return; }
  if (f.licence.value == "") { alert("Please enter your licence number"); return; }

  alert("Application received. We will contact you soon.");
  f.reset();
};

document.getElementById("business-form").onsubmit = function (e) {
  e.preventDefault();
  var f = this;

  if (f.company.value == "") { alert("Please enter your company name"); return; }
  if (badEmail(f.email.value)) { alert("Email address is not valid"); return; }
  if (f.volume.value == "") { alert("Please select your monthly deliveries"); return; }
  if (f.message.value == "") { alert("Please type a message"); return; }

  alert("Enquiry sent");
  f.reset();
};

document.getElementById("contact-form").onsubmit = function (e) {
  e.preventDefault();
  var f = this;

  if (f.name.value == "") { alert("Please enter your name"); return; }
  if (badEmail(f.email.value)) { alert("Email address is not valid"); return; }
  if (f.message.value == "") { alert("Please type a message"); return; }

  alert("Message sent");
  f.reset();
};

document.getElementById("report-form").onsubmit = function (e) {
  e.preventDefault();
  var f = this;

  if (!findParcel(f.tracking.value.trim().toUpperCase())) { alert("Tracking number not found"); return; }
  if (f.issue.value == "") { alert("Please select the issue"); return; }
  if (f.details.value == "") { alert("Please type the details"); return; }

  alert("Report submitted");
  f.reset();
};

function getApp(store) {
  alert("The " + store + " app is not available yet.");
}

function whatsapp() {
  window.open("https://wa.me/2349131788516", "_blank");
}

var authMode = "login";

function openAuth(mode) {
  authMode = mode;
  if (mode == "login") {
    document.getElementById("auth-title").textContent = "Login";
    document.getElementById("name-field").style.display = "none";
  } else {
    document.getElementById("auth-title").textContent = "Create account";
    document.getElementById("name-field").style.display = "block";
  }
  document.getElementById("auth-modal").style.display = "flex";
}

function closeAuth() {
  document.getElementById("auth-modal").style.display = "none";
}

document.getElementById("auth-form").onsubmit = function (e) {
  e.preventDefault();
  var f = this;

  if (badEmail(f.email.value)) { alert("Email address is not valid"); return; }
  if (authMode == "signup" && f.fullName.value == "") { alert("Please enter your full name"); return; }
  if (f.password.value.length < 6) { alert("Password must be at least 6 characters"); return; }

  closeAuth();
  if (authMode == "login") {
    alert("You are logged in");
  } else {
    alert("Account created");
  }
  f.reset();
  location.hash = "account";
};

showPage();