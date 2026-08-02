import {renderCheckout} from "../../scripts/checkout.js";


describe("suite test: renderCheckout()", () => {
  it("displays the cart", () => {
    document.querySelector('.js-test-container').innerHTMl = `
    <div class="js-order-summary"></div>
    `;
  renderCheckout();
  });
});