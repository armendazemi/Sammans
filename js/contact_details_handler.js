'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const submitCheckout = document.getElementById('checkout-submit')
  submitCheckout.addEventListener('click', (event) => {
    handleUserFormSubmit()
  })
})

document.addEventListener('click', (event) => {
  if (event.target.matches('[data-user-type')) {
    const userType = event.target.getAttribute('data-user-type')
    const button = event.target
    handleUserFormDisplay(userType)
  }
})

function handleUserFormDisplay (userType) {
  const userForms = document.querySelectorAll('form')
  const buttons = document.querySelectorAll('[data-user-type]')
  userForms.forEach((form) => {
    if (form.getAttribute('data-user-form') === userType) {
      form.classList.remove('d-none')
      form.classList.add('row')
    } else {
      form.classList.add('d-none')
      form.classList.remove('row')
    }
  })

  buttons.forEach((button) => {
    if (button.getAttribute('data-user-type') === userType) {
      button.classList.remove('inactive')
    } else {
      button.classList.add('inactive')
    }
  })
}

async function handleUserFormSubmit () {
  const activeUserForms = document.querySelector('[data-user-form]:not(.d-none)')

  if (!activeUserForms.checkValidity()) {
    activeUserForms.reportValidity()
    return
  }

  const formData = new FormData(activeUserForms)
  const action = activeUserForms.getAttribute('action')
  const authToken = document.querySelector('meta[name="csrf-token"]').content

  const response = await fetch(action, {
    method: 'POST',
    body: formData,
    headers: {
      'X-CSRF-Token': authToken,
    },
  })

  if (response.ok) {
    window.location = '/w/checkout/complete';
  }

}