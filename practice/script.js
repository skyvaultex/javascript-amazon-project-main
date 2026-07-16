const productContainerEl = document.querySelector('.js-product-container');

const product = [];
const itemCount = 3;

function fillItem(object) {
  object.name = Math.floor(Math.random() * 1000);
  object.id = Math.floor(Math.random() * 1000);
  return object;
}

function createProducts(count) {

  for(let i=0; i<count; ++i){
    const item = {
      name: "",
      id: ""
    };
    product.push(fillItem(item));
  }
  console.log(product);
}

function renderProducts() {

  let html = '';

  product.forEach((button) => {
    const {id, name} = button;
    html +=
    `<button class="js-product-btn" data-product-name='${name}' data-product-id='${id}'> 
    Purchase ${name} 
    </button>`
  });

  productContainerEl.innerHTML = html;
};

createProducts(itemCount);
renderProducts();

const productButtonEl = document.querySelectorAll('.js-product-btn');

function printSentence() {
  productButtonEl.forEach((button) => {
    button.addEventListener('click', () => {
      const { productName, productId } = button.dataset;
      console.log(`Purchased item ${productId}, "${productName}"`);
    });
  });
}


printSentence();