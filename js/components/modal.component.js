import { toggleVisibility } from './utils.js'

export default class Modal extends HTMLElement {
  constructor () {
    super()

    this.modalHandler = this.modalController()
  }

  connectedCallback () {
    window.connectedModals = window.connectedModals || 0
    window.connectedModals++
    this.addListeners()
  }

  disconnectedCallback () {
    window.connectedModals--
    if (window.connectedModals === 0) {
      window.removeEventListener('modalchange', this.modalHandler.bind(this))
      window.removeEventListener('click', this.handleModalEvents)
    }
  }

  addListeners () {
    // Event listener for opening the modal
    if (window.connectedModals === 1) {
      window.addEventListener('modalchange', this.modalHandler.bind(this))
      window.addEventListener('click', this.handleModalEvents.bind(this))
      window.addEventListener('keydown', this.handleModalEvents.bind(this))
      window.addEventListener('modalcloseall', this.closeAllOpenModals.bind(this))
    }
  }

  handleModalEvents (event) {
    if (event.key === 'Escape') {
      this.handleEscapeKey(event)

    }
    if (event.key === 'Enter' || event.type === 'click') {
      this.handleModalAction(event)
      this.handleModalZIndex(event)
    }
  }

  handleModalZIndex (event) {
    if (event.target.hasAttribute('data-z-index')) {
      if (event.target.hasAttribute('data-z-element')) {
        const zIndex = event.target.getAttribute('data-z-index')
        const zIndexElement = document.querySelector(event.target.getAttribute('data-z-element'))
        zIndexElement.style.zIndex = zIndex
      } else {
        this.style.zIndex = event.target.getAttribute('data-z-index')
      }
    }
  }

  handleModalAction (event) {
    if (event.target.hasAttribute('data-modal-action')) {
      const modalAction = event.target.getAttribute('data-modal-action')
      const modalElement = event.target.getAttribute('data-modal-element')
      const withOverlay = event.target.getAttribute('data-modal-overlay') || true
      window.dispatchEvent(
        new CustomEvent('modalchange', {
          detail: {
            action: modalAction,
            element: modalElement,
            withOverlay: withOverlay,
            initiator: event.target,
          },
        })
      )
    }
  }

  handleEscapeKey (event) {
    if (event.key === 'Escape') {
      const openModal = document.querySelector('modal-component.open')
      if (openModal) {
        // Close the modal
        window.dispatchEvent(
          new CustomEvent('modalchange', {
            detail: {
              action: 'close',
              element: `#${openModal.id}`,
              withOverlay: false,
            },
          })
        )
      }
    }
  }

  modalController () {
    // Closure to keep track of the original action
    let originalAction = null
    let shouldToggleAction = false

    return function (event) {
      const { action, element, initiator } = event.detail
      const modalElement = document.querySelector(element)
      if (!modalElement) return

      // Check if the action should be toggled
      if (initiator && initiator.hasAttribute('data-action-toggle')) {
        shouldToggleAction = true
      }

      // Keep track of the original action if it's not set yet
      if (!originalAction) {
        originalAction = action
      }

      // Toggle the action
      if (initiator && shouldToggleAction) {
        const newAction = action !== 'close' ? 'close' : originalAction
        initiator.setAttribute('data-modal-action', newAction)
      }

      this.handleOpenModal(action, modalElement)
      toggleVisibility(modalElement, action)

      // Dispatch 'overlaychange' event with additional details
      if (event.detail.withOverlay === true || event.detail.withOverlay === 'true') {
        window.dispatchEvent(
          new CustomEvent('overlaychange', {
            detail: {
              action,
              element: modalElement,
              initiator,
            },
          })
        )
      }
    }
  }

  handleOpenModal (action, modalElement) {
    if (action !== 'close') {
      // Check if there is another open modal and close it.
      const openModals = document.querySelectorAll('modal-component.open')
      openModals.forEach((openModal) => {
        this.closeModal(openModal)
      })
    }
  }

  closeModal (element) {
    // Try to find the initiator of the modal
    let initiator = document.querySelector(`[data-modal-element="#${element.id}"]`)
    if (!initiator) {
      initiator = document.querySelector(`[data-modal-element=".${element.id}"]`)
    }
    window.dispatchEvent(
      new CustomEvent('modalchange', {
        detail: {
          action: 'close',
          element: `#${element.id}`,
          withOverlay: false,
          initiator,
        },
      })
    )
  }

  closeAllOpenModals () {
    const openModals = document.querySelectorAll('modal-component.open')
    openModals.forEach((openModal) => {
      this.closeModal(openModal)
    })
  }
}

customElements.define('modal-component', Modal)
