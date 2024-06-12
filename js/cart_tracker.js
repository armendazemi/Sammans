'use strict'
import { handleCartDisplay } from './cart_display.js'

// This is the cart tracker module
document.addEventListener('DOMContentLoaded', function () {
  try {
    getAndStoreCartState()
  } catch (e) {
    console.log(e)
  }

  window.getCartState = getCartState
  window.setCartState = setCartState
  window.clearCartState = clearCartState

  window.addEventListener('cart:item-added', handleItemAddedToCart)
  window.addEventListener('cart:clear', clearCartState)
})

async function getAndStoreCartState () {
  const url = '/w/cart/'
  const response = await fetch(url, {
    method: 'GET', headers: {
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
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: data }))
    window.dispatchEvent(new CustomEvent('cart:items-change', { detail: { count: data.order_items.reduce((total, item) => total + item.quantity, 0) } }))
  }
}

function getCartState () {
  return JSON.parse(sessionStorage.getItem('cartState'))
}

function clearCartState () {
  sessionStorage.removeItem('cartState')
}

function handleItemAddedToCart (event) {
  const newCartState = event.detail
  handleCartDisplay(event.detail)
  setCartState(newCartState)
}

// -------------------
// Event listeners
// -------------------
document.addEventListener('click', (event) => {
  // Remove item (Used in checkout page
  if (event.target.matches('[data-action="remove-from-cart"]')) {
    try {
      const removeFromCartButton = event.target
      handleRemoveFromCart(event)
    } catch (error) {
      console.error(error)
    }
  }

  // Add item to cart (Used in product page)
  if (event.target.matches('[data-action="add-to-cart"]')) {
    try {
      const addToCartButton = event.target
      handleAddToCart(event)
    } catch (error) {
      console.error(error)
    }
  }
})

async function handleRemoveFromCart (event) {
  const target = event.target
  const card = target.closest('.checkout-card')
  const variantId = event.target.getAttribute('data-variant-id')

  const url = `/w/cart/order_items`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      order_items: [
        {
          variant_id: variantId,
          quantity: 0,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to remove item from cart: ${response.status} ${response.statusText}`)
  }

  // Remove the card
  card.remove()

  const data = await response.json()
  if (data.order_items.length === 0) {
    window.location.href = '/w/cart'
  }

  setCartState(data)
}

async function handleAddToCart (event) {
  const addToCartButton = event.target
  const quantity = parseInt(addToCartButton.getAttribute('data-quantity'))
  const currentlySelectedVariantId = parseInt(addToCartButton.getAttribute('data-variant-id'))

  const url = '/w/cart/order_items?associations[]=product_properties&associations[]=variant'
  const response = await fetch(url, {
    method: 'POST', headers: {
      'Content-Type': 'application/json',
    }, body: JSON.stringify({
      order_items: [{
        variant_id: currentlySelectedVariantId,
        quantity: quantity,
      },],
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
