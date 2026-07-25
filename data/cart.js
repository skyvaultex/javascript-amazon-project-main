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
        quantity: selectorQuantity
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