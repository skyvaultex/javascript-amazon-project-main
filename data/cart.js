const savedCart = JSON.parse(localStorage.getItem('cart'));
export let cart = savedCart ? savedCart : [];
const updateCart = () => localStorage.setItem('cart', JSON.stringify(cart));;

export function addToCart(productId, selectorQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if(productId === cartItem.productId) matchingItem = cartItem;
    });

    if(matchingItem) { 
      matchingItem.quantity += selectorQuantity;
    } else {
      cart.push({
        productId,
        quantity: selectorQuantity,
        deliveryOptionId: 'standard'
      })
    }
  updateCart();
}

export function removeFromCart(productId) {
  cart = cart.filter(cartItem => cartItem.productId !== productId);
  updateCart();
}

export function updateQuantity(productId, updatedQuantity) {
  const matchingCartItem = cart.find(
    cartItem => productId === cartItem.productId);
  if(!matchingCartItem) return; // safety
  matchingCartItem.quantity = Number(updatedQuantity);
  updateCart();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  const matchingCartItem = cart.find(cartItem => cartItem.productId === productId);

  if(!matchingCartItem) return;

  matchingCartItem.deliveryOptionId = deliveryOptionId;
  updateCart();
}


export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => { 
    console.log(xhr.response);
    fun();
  })

  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
};