'use strict'
import { handleCartDisplay } from './cart_display.js'

// This is the cart tracker module
document.addEventListener('DOMContentLoaded', function () {
  try {
    getAndStoreCartState()
  } catch (e) {
    console.log(e)
  }

  window.getCartState = getCartState;
  window.setCartState = setCartState;
  window.clearCartState = clearCartState;

  window.addEventListener('cart:item-added', handleItemAddedToCart);
  window.addEventListener('cart:clear', clearCartState);
})

async function getAndStoreCartState () {
  const url = '/w/cart/'
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch cart state: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  setCartState(data)
}

function setCartState (data) {
  if (typeof data === 'object') {
    sessionStorage.setItem('cartState', JSON.stringify(data))
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: data }));
    window.dispatchEvent(new CustomEvent('cart:items-change', { detail: { count: data.order_items.reduce((total, item) => total + item.quantity, 0) } }));
  }
}

function getCartState () {
  return JSON.parse(sessionStorage.getItem('cartState'))
}

function clearCartState () {
  sessionStorage.removeItem('cartState');
}

function handleItemAddedToCart (event) {
  const newCartState = event.detail;
  handleCartDisplay(event.detail);
  setCartState(newCartState)
}

// -------------------
// Event listeners
// -------------------
const addToCartButton = document.querySelector('[data-action="add-to-cart"]')
try {
  addToCartButton.addEventListener('click', handleAddToCart)
} catch (error) {
  console.error(error)
}

async function handleAddToCart (event) {
  const quantity = parseInt(addToCartButton.getAttribute('data-quantity'))
  const currentlySelectedVariantId = parseInt(addToCartButton.getAttribute('data-variant-id'))

  const url = '/w/cart/order_items'
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      order_items: [
        {
          variant_id: currentlySelectedVariantId,
          quantity: quantity,
        },
      ],
    }),
  })
  if (response.ok) {
    const data = await response.json()
    dispatchAddToCartEvent(data)
  } else {
    throw new Error('Failed to add item to cart')
  }
}

function dispatchAddToCartEvent (data) {
  window.dispatchEvent(new CustomEvent('cart:item-added', { detail: data }))
}
