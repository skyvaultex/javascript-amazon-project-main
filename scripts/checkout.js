import {cart, removeFromCart, updateQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

const orderSummaryEl = document.querySelector('.js-order-summary');
let updatingProductId = null;

function renderCheckout() {

  let cartSummaryHTML = '';

  const paymentSummary = {
    itemQuantity: 0,
    taxesPercentage: 10,
    subtotalPriceCents: 0,
  };

  cart.forEach(cartItem => {
    let quantityControlHTML = '';
    const { productId, quantity } = cartItem;
    const matchingProduct = products.find(
      product => product.id === productId
    );

    if(!matchingProduct) return;

    const {name, image, priceCents} = matchingProduct;

    paymentSummary.subtotalPriceCents += priceCents * quantity;
    paymentSummary.itemQuantity += quantity;



    const isUpdating = updatingProductId === productId;

    if(isUpdating) {
      quantityControlHTML = `
        <span>
          Quantity: 
          <input class="js-new-quantity-input-${productId} new-quantity-input" type="number" value="${quantity}">
        </span>
        <span class="update-quantity-link js-save-quantity-link link-primary"
        data-product-id="${productId}">
          Save
        </span>`;
    } else {
      quantityControlHTML = `
        <span>
          Quantity: <span class="quantity-label">${quantity}</span>
        </span>
        <span class="update-quantity-link js-update-quantity-link link-primary"
        data-product-id="${productId}">
          Update
        </span>`;
    }

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${productId}">
        <div class="delivery-date">
          Delivery date: Tuesday, June 21
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${name}
            </div>
            <div class="product-price">
              $${(priceCents / 100).toFixed(2)}
            </div>
            <div class="product-quantity js-product-quantity-${productId}">
              ${quantityControlHTML}
              <span class="delete-quantity-link js-delete-quantity-link link-primary" 
              data-product-id="${productId}">
                Delete
              </span>
            </div>
          </div>

        <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>s

              
        <div class="js-delivery-option delivery-option" data-delivery-option-id="${productId}" data-testid="delivery-option-${productId}">

          <input class="js-delivery-option-input delivery-option-input" checked="" name="${matchingProduct.id}-delivery-option" type="radio" data-testid="delivery-option-input">

          <div>
            <div class="delivery-option-date">
              Tuesday, August 4
            </div>
            <div class="delivery-option-price">
              FREE Shipping
            </div>
          </div>
        </div>
      
        <div class="js-delivery-option delivery-option" data-delivery-option-id="${productId}" data-testid="delivery-option-${productId}">

          <input class="js-delivery-option-input delivery-option-input" name="${matchingProduct.id}-delivery-option" type="radio" data-testid="delivery-option-input">

          <div>
            <div class="delivery-option-date">
              Wednesday, July 29
            </div>
            <div class="delivery-option-price">
              $4.99 - Shipping
            </div>
          </div>
        </div>
      
        <div class="js-delivery-option delivery-option" data-delivery-option-id="${productId}" data-testid="delivery-option-${productId}">

          <input class="js-delivery-option-input delivery-option-input" name="${matchingProduct.id}-delivery-option" type="radio" data-testid="delivery-option-input">

          <div>
            <div class="delivery-option-date">
              Monday, July 27
            </div>
            <div class="delivery-option-price">
              $9.99 - Shipping
            </div>
          </div>
        </div>
      
            </div>
          </div>

        </div>
      </div>`;
  });

  if(cart.length === 0) {
    cartSummaryHTML = `
    <div class="empty-cart-container">
      <span> Your cart is empty. </span>
      <a href="amazon.html" class="button-primary view-products-link"> View Products </a>
    </div>`;
  }
  

  const {itemQuantity, taxesPercentage, subtotalPriceCents} = paymentSummary;

  const shippingCents = itemQuantity > 0 ? 499 : 0;
  const totalPriceBeforeTax = subtotalPriceCents + shippingCents;
  const taxCents = Math.round(totalPriceBeforeTax * taxesPercentage / 100);
  const totalPriceAfterTax = totalPriceBeforeTax + taxCents;
  const paymentSummaryEl = document.querySelector('.js-payment-summary');

  paymentSummaryEl.innerHTML = 
    `<div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${itemQuantity}):</div>
      <div class="payment-summary-money">$${formatCurrency(subtotalPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(shippingCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalPriceBeforeTax)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (${taxesPercentage}%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalPriceAfterTax)}</div>
    </div>

    <button class="place-order-button button-primary js-place-order-button">
      Place your order
    </button>`;


  orderSummaryEl.innerHTML = cartSummaryHTML;

  document.querySelector('.js-checkout-header-middle-section').innerHTML = `
    Checkout (<a class="return-to-home-link"
    href="amazon.html">${itemQuantity} items</a>)`;


    // button disabled if quantity === 0;
  const placeOrderButtonEl = document.querySelector('.js-place-order-button');

  if(itemQuantity === 0) {
    placeOrderButtonEl.classList.add('payment-buttons-disable');
    placeOrderButtonEl.disabled = true;
  } else {
    placeOrderButtonEl.classList.remove('payment-buttons-disable');
    placeOrderButtonEl.disabled = false;
  }

  // buttons 
  const deleteButtonEl = document.querySelectorAll(`.js-delete-quantity-link`);
  deleteButtonEl.forEach(deleteButton => {
    deleteButton.addEventListener('click', () => {
      const { productId } = deleteButton.dataset;
      removeFromCart(productId);
      if(updatingProductId === productId) updatingProductId = null;
      renderCheckout();
    });
  });

    const updateButtonEl = document.querySelectorAll(`.js-update-quantity-link`);
  updateButtonEl.forEach(updateButton => {
    updateButton.addEventListener('click', () => {
      const { productId } = updateButton.dataset;

      updatingProductId = updatingProductId === productId ? null : productId;
      renderCheckout();
    }
  );
  });


  const saveButtonEl = document.querySelectorAll('.js-save-quantity-link');
  saveButtonEl.forEach(saveButton => {
    saveButton.addEventListener('click', () => {
      const { productId } = saveButton.dataset;
      
      const inputEl = document.querySelector(`.js-new-quantity-input-${productId}`);
      const newQuantity = Number(inputEl.value);
      if(newQuantity > 0) {
        updateQuantity(productId, newQuantity);
      } else if(newQuantity === 0) {
        removeFromCart(productId);
      } else {
        alert('Choose valid quantity.');
        return;
      }
      updatingProductId = null;
      renderCheckout();
    });
  });
};


renderCheckout();