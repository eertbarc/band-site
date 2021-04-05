if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  /*--- Listen for events --*/
  var removeItemButtons = document.getElementsByClassName("btn__danger");
  for (i = 0; i < removeItemButtons.length; i++) {
    var button = removeItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  var qtyInputs = document.getElementsByClassName("cart__item__qty");
  for (i = 0; i < qtyInputs.length; i++) {
    var qtyInput = qtyInputs[i];
    qtyInput.addEventListener("change", quantityChanged);
  }

  var addToCartBtns = document.getElementsByClassName("btn__shop");
  for (i = 0; i < addToCartBtns.length; i++) {
    var addToCartBtn = addToCartBtns[i];
    addToCartBtn.addEventListener("click", addToCartItems);
  }

  document
    .getElementsByClassName("btn__purchase")[0]
    .addEventListener("click", purchaseItems);
}

function purchaseItems() {
  /*--- get the cart items and cycle through removing them ---*/
  var cartItems = document.getElementsByClassName("cart__items")[0];
  if (cartItems.hasChildNodes()) {
    while (cartItems.hasChildNodes()) {
      /*--- use first child as each time that is remove the next child becomes first child ---*/
      cartItems.removeChild(cartItems.firstChild);
    }
    alert("Thank you for your purchase. DUMMY SYSTEM - No transaction made!");
  } else {
    alert("There are no items in the cart!.");
    return;
  }
  updateTotal();
}

function addToCartItems(event) {
  /*--- get the button object that was clicked ---*/
  var buttonItem = event.target;
  /*-- get new shop object ---*/
  var shopItem = buttonItem.parentElement.parentElement;
  /*-- get new values from shop object ---*/
  var price = shopItem.getElementsByClassName("shop__item--price")[0].innerText;
  var title = shopItem.getElementsByClassName("shop__item--title")[0].innerText;
  var image = shopItem.getElementsByClassName("shop__item--img")[0].src;
  /*--- Make sure the item isnt in the cart already ---*/
  /*--- cart__item__title only exists in the cart ---*/
  for (
    i = 0;
    i < document.getElementsByClassName("cart__item_title").length;
    i++
  ) {
    if (
      document.getElementsByClassName("cart__item_title")[i].innerText == title
    ) {
      alert("Item: " + title + " is already in the cart!.");
      return;
    }
  }
  /*--- add new item to cart --*/
  addToCart(title, price, image);
  updateTotal();
}

function addToCart(title, price, image) {
  var newRow = document.createElement("div");
  newRow.classList.add("cart__row");
  newRow.innerHTML = `
        <div class="cart__item cart__column">
            <img class="cart__item__img" src="${image}" />
            <span class="cart__item_title">${title}</span>
        </div>
        <span class="cart__price cart__column">${price}</span>
        <div class="cart__qty cart__column">
            <input class="cart__item__qty" type="number" value="1" />
            <button class="btn btn__danger" type="button">REMOVE</button>
        </div>`;
  var cartItems = document.getElementsByClassName("cart__items")[0];
  cartItems.append(newRow);
  newRow
    .getElementsByClassName("btn__danger")[0]
    .addEventListener("click", removeCartItem);
  newRow
    .getElementsByClassName("cart__item__qty")[0]
    .addEventListener("change", quantityChanged);
}

function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  updateTotal();
}

function quantityChanged(event) {
  var inputObject = event.target;
  if (isNaN(inputObject.value) || inputObject.value <= 0) {
    inputObject.value = 1;
  }
  updateTotal();
}

function updateTotal() {
  var total = 0;
  /*--- cart__row is also in {cart} section__header so get the cart container first ---*/
  var cartItemContainer = document.getElementsByClassName("cart__items")[0];
  var cartRows = cartItemContainer.getElementsByClassName("cart__row");

  for (i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    /*--- cart__price is text, so remove the € sign and convert to float ---*/
    var rowPrice = parseFloat(
      cartRow
        .getElementsByClassName("cart__price")[0]
        .innerText.replace("€", "")
    );
    var rowQty = cartRow.getElementsByClassName("cart__item__qty")[0].value;
    total = total + rowPrice * rowQty;
  }
  /*--- javaScript rounding is to nearest integer ---*/
  total = Math.round(total * 100) / 100;
  /*--- update cart total ---*/
  document.getElementsByClassName("cart__total__price")[0].innerText =
    total + "€";
}
