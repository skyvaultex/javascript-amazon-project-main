const savedCart = JSON.parse(localStorage.getItem('cart'));
export const cart = savedCart ? savedCart : [];

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
  localStorage.setItem('cart', JSON.stringify(cart));
}