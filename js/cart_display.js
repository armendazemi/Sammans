'use strict'

export function handleCartDisplay (data) {
  console.log(data)
  const order_items = data.order_items;
  const cartItems = document.getElementById('side-cart__items');
  const fragment = document.createDocumentFragment();
  const cartCount = document.getElementById('side-cart__total-items');
  const subTotal = document.querySelector('.side-cart__subtotal');

  order_items.forEach(item => {
    const itemHtml = generateCartItemHtml(item)
    const itemElement = document.createRange().createContextualFragment(itemHtml);
    fragment.appendChild(itemElement);
  })

  cartItems.innerHTML = '';
  cartItems.appendChild(fragment);

  // Update the cart count and hide subtotal
  const count = order_items.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = count === 1 ? `${count}  ${getTranslation('föreläsning')}` :`${count}  ${getTranslation('föreläsningar')}`;
  subTotal.style.display = 'none';
  triggerModalEvent();
}

function generateCartItemHtml (item) {
  return `
   <div class="side-cart__item">
      <div class="side-cart__image-wrapper">
        <img src="${item.image.url_small}"
             alt="" height="67" width="100" 
             class="side-cart__image">
      </div>

      <a href="${item.links.product.href}" class="side-cart__content" aria-label="${item.name}">
        <p class="side-cart__title">${item.name}</p>
        <div class="side-cart__availability">
          <span>${getTranslation("Tillgänglig mellan")}:</span>
          <span>${item.availability}</span>
        </div>
      </a>
    </div>
  `
}

function triggerModalEvent () {
  window.dispatchEvent(
    new CustomEvent('modalchange', {
      detail: {
        action: 'flex',
        element: '#side-cart',
        withOverlay: true,

      },
    })
  )
}

function getTranslation(key) {
  return window.translations[key] || key;
}