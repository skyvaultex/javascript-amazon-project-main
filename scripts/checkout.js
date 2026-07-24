import {cart} from '../data/cart.js';
import {products} from '../data/products.js';

const orderSummaryEl = document.querySelector('.js-order-summary');
let cartSummaryHTML = '';


const paymentSummary = {
  itemQuantity: 0,
  taxesPercentage: 10,
  subtotalPriceCents: 0,
};

cart.forEach(cartItem => {
  const { productId } = cartItem;
  const matchingProduct = products.find(
    product => product.id === productId
  );

  if(!matchingProduct) return;

  const {name, image, priceCents} = matchingProduct;
  const {quantity} = cartItem;

  paymentSummary.subtotalPriceCents += priceCents * quantity;
  paymentSummary.itemQuantity += quantity;

  cartSummaryHTML += `
    <div class="cart-item-container">
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
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label">${quantity}</span>
          </span>
          <span class="update-quantity-link link-primary">
            Update
          </span>
          <span class="delete-quantity-link link-primary">
            Delete
          </span>
        </div>
      </div>
      </div>
      </div>`
});

orderSummaryEl.innerHTML = cartSummaryHTML;

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
            <div class="payment-summary-money">$${(subtotalPriceCents / 100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${(shippingCents / 100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${(totalPriceBeforeTax / 100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (${taxesPercentage}%):</div>
            <div class="payment-summary-money">$${(taxCents / 100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${(totalPriceAfterTax / 100).toFixed(2)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>`;

document.querySelector('.js-checkout-header-middle-section').innerHTML = `
  Checkout (<a class="return-to-home-link"
  href="amazon.html">${itemQuantity} items</a>)`;
