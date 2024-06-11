export default class TopElement extends HTMLElement {
  constructor () {
    super()
    this.debounceTimer = null
    this.marginTop = 0 // Initialize marginTop

    // Add event listener with debouncing
    window.addEventListener('resize', this.debouncedHandleResize.bind(this));
    window.addEventListener('top-element:trigger-resize', this.handleResize.bind(this));
  }

  connectedCallback () {
    // Calculate the initial marginTop value
    this.calculateMarginTop()
    this.style.display = 'block'
  }

  calculateMarginTop () {
    // Get the height of the header
    const header = document.querySelector('header')
    if (header) {
      this.marginTop = header.getBoundingClientRect().height + 'px'
      // Apply marginTop to the component
      this.style.marginTop = this.marginTop
    }
  }

  debouncedHandleResize () {
    // Clear the previous timeout to avoid multiple rapid calls
    clearTimeout(this.debounceTimer)

    // Set a new timeout
    this.debounceTimer = setTimeout(() => {
      // Handle resize event after the debounce interval
      this.handleResize()
    }, 200) // Adjust the debounce interval as needed
  }

  handleResize () {
    // Recalculate marginTop on resize
    this.calculateMarginTop()
  }
}

customElements.define('top-element', TopElement)
