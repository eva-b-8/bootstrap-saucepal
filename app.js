let form = document.querySelector("#my-form form");
let toastTimer;

let fridgeSection = document.createElement("section");
fridgeSection.innerHTML =
  '<p id="fridge-count"></p><p id="fridge-empty">Your fridge is empty.</p><div id="fridge-list"></div>';
form.after(fridgeSection);

let toastElement = document.createElement("div");
toastElement.id = "toast";
toastElement.setAttribute("role", "status");
document.body.appendChild(toastElement);

function showToast(message) {
  let toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("toast-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("toast-visible");
  }, 4000);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let ingredientField = document.getElementById("inlineFormInputName2");
  let quantityField = document.getElementById("inlineFormInputGroupUsername2");
  let categoryField = document.getElementById("exampleFormControlSelect1");
  let ingredientError = document.getElementById("inlineFormInputName2Feedback");
  let quantityError = document.getElementById(
    "inlineFormInputGroupUsername2Feedback",
  );

  let ingredient = ingredientField.value;
  let quantity = +quantityField.value;
  let category = categoryField.value;

  ingredientField.classList.remove("is-invalid");
  quantityField.classList.remove("is-invalid");

  let ingredientIsValid = ingredient.trim().length > 2;
  if (!ingredientIsValid) {
    ingredientError.textContent =
      "Ingredient name needs to be at least 3 characters long.";
    ingredientField.classList.add("is-invalid");
  }

  let quantityIsValid = quantity >= 0 && quantity <= 50;
  if (!quantityIsValid) {
    quantityError.textContent = "The weight needs to be between 0.1 and 50 kg.";
    quantityField.classList.add("is-invalid");
  }

  if (!ingredientIsValid || !quantityIsValid) {
    return;
  }

  let fridge = JSON.parse(localStorage.getItem("fridge")) || [];
  fridge.push({ ingredient, quantity, category });
  localStorage.setItem("fridge", JSON.stringify(fridge));

  form.reset();
  showFridge();
  showToast("Added to fridge");
});

function showFridge() {
  let fridge = JSON.parse(localStorage.getItem("fridge")) || [];
  let list = document.getElementById("fridge-list");
  list.innerHTML = "";

  let count = document.getElementById("fridge-count");
  if (fridge.length === 1) {
    count.textContent = "1 item in your fridge";
  } else {
    count.textContent = fridge.length + " items in your fridge";
  }

  let empty = document.getElementById("fridge-empty");
  empty.hidden = fridge.length > 0;
  if (fridge.length === 0) return;

  let categories = [
    "Fruit & veg",
    "Meat & fish",
    "Dairy & eggs",
    "Store cupboard",
    "Frozen",
    "Other",
  ];

  categories.forEach((category) => {
    let items = fridge.filter((item) => item.category === category);
    if (items.length === 0) return;

    let shelf = document.createElement("section");
    shelf.className = "shelf";
    shelf.innerHTML = "<h2></h2><ul></ul>";
    shelf.querySelector("h2").textContent = category;

    items.forEach((item) => {
      let li = document.createElement("li");
      li.textContent = item.ingredient + " – " + item.quantity + " kg";

      let removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.className = "secondary-button";
      removeButton.addEventListener("click", () => {
        fridge.splice(fridge.indexOf(item), 1);
        localStorage.setItem("fridge", JSON.stringify(fridge));
        showFridge();
        showToast("Removed from fridge");
      });

      li.appendChild(removeButton);
      shelf.querySelector("ul").appendChild(li);
    });

    list.appendChild(shelf);
  });
}

showFridge();

document.addEventListener("DOMContentLoaded", () => {
  const dayElement = document.getElementById("day-of-week");
  if (dayElement) {
    dayElement.textContent = new Date().toLocaleDateString("en-GB", {
      weekday: "long",
    });
  }
});
