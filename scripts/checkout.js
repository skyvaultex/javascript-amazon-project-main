import {cart, removeFromCart, updateQuantity, updateDeliveryOption, loadCart} from '../data/cart.js';
import {products, loadProducts, loadProductsFetch} from '../data/products.js';
import {formatCurrency, formatShippingPrice} from './utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
// import '../data/backend-practice.js';
// import '../data/cart-oop.js';


async function loadPage() {
  await loadProductsFetch();

  await new Promise(resolve => {
    loadCart(() => {
      resolve();
    })
  })

  renderPage();
}

loadPage();

/*
Promise.all([
  loadProductsFetch(),
  new Promise(resolve => {
    loadCart(() => {
      resolve();
    })
  })
]).then(() => {
  renderPage();
});

/*
new Promise ((resolve) => {
  loadProducts(() => {
    resolve('value1');
  });

}).then((value) => {
  console.log(value);
  return new Promise(resolve => {
    loadCart(() => {
      resolve();
    })
  })

}).then(() => {
  return new Promise(resolve => {
    renderPage();
  })
})

  /*
  loadProducts(() => {
    loadCart(() => {
      renderPage();
    });
  })*/ 

function renderPage() {
  const currentDate = dayjs();
  const deliveryOptions = {
    standard: {
      date: currentDate.add(7, 'days').format('dddd, MMMM D'),
      priceCents: 0
    },
    express: {
      date: currentDate.add(3, 'days').format('dddd, MMMM D'),
      priceCents: 499
    },
    nextDay: {
      date: currentDate.add(1, 'days').format('dddd, MMMM D'),
      priceCents: 999
    }
  };

  const { standard, express, nextDay } = deliveryOptions;

  const orderSummaryEl = document.querySelector('.js-order-summary');
  let updatingProductId = null;

  function renderCheckout() {

    let cartSummaryHTML = '';

    const paymentSummary = {
      itemQuantity: 0,
      taxesPercentage: 10,
      subtotalPriceCents: 0,
      shippingCents: 0
    };

    cart.forEach(cartItem => {
      let quantityControlHTML = '';
      const { productId, quantity, deliveryOptionId} = cartItem;
      const matchingProduct = products.find(
        product => product.id === productId
      );

      if(!matchingProduct) return;

      const selectedDeliveryOptionId = deliveryOptionId || 'standard';
      const selectedDeliveryOption = deliveryOptions[selectedDeliveryOptionId];

      const {name, image, priceCents} = matchingProduct;

      paymentSummary.subtotalPriceCents += priceCents * quantity;
      paymentSummary.itemQuantity += quantity;
      paymentSummary.shippingCents += selectedDeliveryOption.priceCents;

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
            Delivery date: ${selectedDeliveryOption.date}
          </div>

          <div class="cart-item-details-grid">
            <img class="product-image"
              src="${image}">

            <div class="cart-item-details">
              <div class="product-name">
                ${name}
              </div>
              <div class="product-price">
                ${matchingProduct.getPrice()}
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
                </div>

                
          <div class="js-delivery-option delivery-option" data-delivery-option-id="${productId}" data-testid="delivery-option-${productId}">

            <input class="js-delivery-option-input delivery-option-input" name="${productId}-delivery-option" type="radio" value="standard" ${selectedDeliveryOptionId === "standard" ? "checked" : ""} data-product-id="${productId}">

            <div>
              <div class="delivery-option-date">
                ${standard.date}
              </div>
              <div class="delivery-option-price">
                ${formatShippingPrice(standard.priceCents)}
              </div>
            </div>
          </div>
        
          <div class="js-delivery-option delivery-option" data-delivery-option-id="${productId}" data-testid="delivery-option-${productId}">

            <input class="js-delivery-option-input delivery-option-input" name="${productId}-delivery-option" type="radio" value="express" ${selectedDeliveryOptionId === "express" ? "checked" : ""} data-product-id="${productId}">

            <div>
              <div class="delivery-option-date">
                ${express.date}
              </div>
              <div class="delivery-option-price">
                ${formatShippingPrice(express.priceCents)}
              </div>
            </div>
          </div>
        
          <div class="js-delivery-option delivery-option" data-delivery-option-id="${productId}" data-testid="delivery-option-${productId}">

            <input class="js-delivery-option-input delivery-option-input" name="${productId}-delivery-option" type="radio" value="nextDay" ${selectedDeliveryOptionId === "nextDay" ? "checked" : ""} data-product-id="${productId}">

            <div>
              <div class="delivery-option-date">
                ${nextDay.date}
              </div>
              <div class="delivery-option-price">
                ${formatShippingPrice(nextDay.priceCents)}
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

    const {itemQuantity, taxesPercentage, subtotalPriceCents, shippingCents} = paymentSummary;

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

    const deliveryOptionEls = document.querySelectorAll('.js-delivery-option-input');
    deliveryOptionEls.forEach(option => {
      option.addEventListener("change", () => {
        const { productId } = option.dataset;
        const deliveryOptionId = option.value;
        updateDeliveryOption(productId, deliveryOptionId);
        renderCheckout();
      });
    });


    

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
}