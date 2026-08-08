class Cart {
  #localStorageKey;
  cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
  }

  updateCart() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems))
  }

  addToCart(productId, selectorQuantity) {
    let matchingItem;
    const quantity = Number(selectorQuantity)
    this.cartItems.forEach((cartItem) => {
      if(productId === cartItem.productId) matchingItem = cartItem;
      });
      if(matchingItem) { 
        matchingItem.quantity += quantity;
      } else {
        this.cartItems.push({
          productId,
          quantity,
          deliveryOptionId: 'standard'
        })
      }
      this.updateCart();
  }

  removeFromCart(productId) {
      this.cartItems = this.cartItems.filter(cartItem => cartItem.productId !== productId);
      this.updateCart();
  }

  updateQuantity(productId, updatedQuantity) {
      const matchingCartItem = this.cartItems.find(
        cartItem => productId === cartItem.productId);
      if(!matchingCartItem) return; // safety
      matchingCartItem.quantity = Number(updatedQuantity);
      this.updateCart();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    const matchingCartItem = this.cartItems.find(cartItem => cartItem.productId === productId);
    if(!matchingCartItem) return;
    matchingCartItem.deliveryOptionId = deliveryOptionId;
    this.updateCart();
  }

}

const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');