import {cart, addToCart} from '../data/cart.js';
import {products} from '../data/products.js';

let productsHTML = '';

products.forEach((product) => {
  const {image, name, rating, priceCents, id} = product;
  productsHTML += `
 <div class="product-container">

      <div class="product-image-container">
        <img class="product-image" src="${image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${name}
      </div>

      <div class="product-rating-container">
        <img
          class="product-rating-stars"
          src="images/ratings/rating-${rating.stars * 10}.png"
        >
        <div class="product-rating-count link-primary">
          ${rating.count}
        </div>
      </div>

      <div class="product-price">
        $${(priceCents / 100).toFixed(2)}
      </div>
      
      <div class="product-quantity-container">
          <select class="js-product-quantity-selector-${id}" name="quantity">
          <option value="1"> 1 </option>
          <option value="2"> 2 </option>
          <option value="3"> 3 </option>
          <option value="4"> 4 </option>
          <option value="5"> 5 </option>
          <option value="6"> 6 </option>
          <option value="7"> 7 </option>
          <option value="8"> 8 </option>
          <option value="9"> 9 </option>
          <option value="10"> 10 </option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-to-cart-${id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart"
      data-product-id="${id}">
        Add to Cart
      </button>

    </div>
  `;
});


function selectorOutput(productId) {
  const selectorEl = document.querySelector(`.js-product-quantity-selector-${productId}`);
  if(selectorEl instanceof HTMLSelectElement) {
    return Number(selectorEl.value);
  } else {
    return 1;
  }
};

document.querySelector('.js-products-grid')
.innerHTML = productsHTML;

document.querySelectorAll('.js-add-to-cart').
  forEach((button) => {
    let timeoutID;
    button.addEventListener('click', () => {
      const { productId } = button.dataset;
      const productQuantity = selectorOutput(productId);
      addToCart(productId, productQuantity);
      timeoutID = addedToCart(productId, timeoutID);
      updateCart();
      console.log(cart);
    });
  });


function updateCart() {
  const cartQuantityEl = document.querySelector('.cart-quantity');
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });


  cartQuantityEl.textContent = cartQuantity;
}

function addedToCart(id, timeoutID) {
  clearTimeout(timeoutID);
  const addedToCartEl = document.querySelector(`.js-added-to-cart-${id}`); 
  addedToCartEl.classList.add('visible');
  return setTimeout(() => {
    addedToCartEl.classList.remove('visible')
  }, 2000);
}

updateCart();