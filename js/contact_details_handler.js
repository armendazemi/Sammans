'use strict'

document.addEventListener('click', (event) => {
  if (event.target.matches('[data-user-type')) {
    const userType = event.target.getAttribute('data-user-type')
    const button = event.target
    handleUserFormDisplay(userType)
  }
})

function handleUserFormDisplay (userType) {
  const userForms = document.querySelectorAll('[data-user-form]')
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