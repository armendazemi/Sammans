'use strict';
export default class FormComponent extends HTMLElement {
  constructor () {
    super();
    this.style.display = 'block';
    this.form = this.querySelector('form') || null;
    this.form !== null ? this.form.classList.add('needs-validation') : null;
    this.modalSelector = this.getAttribute('modal');
  }

  connectedCallback () {
    if (!this.checkForForm()) {
      this.addForm();
    }
    this.addListeners();
  }

  checkForForm () {
    return this.innerHTML.indexOf('<form') !== -1;
  }

  addForm () {
    const form = document.createElement('form');
    form.innerHTML = this.innerHTML;
    form.className = this.className;
    form.classList.add('needs-validation');
    form.action = this.getAttribute('action');
    form.method = this.getAttribute('method');
    form.enctype = this.getAttribute('enctype');
    form.setAttribute('novalidate', '');
    this.className = '';
    this.innerHTML = '';
    this.form = form;
    this.appendChild(form);
  }

  addListeners () {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!this.form.checkValidity()) {
        this.form.classList.add('was-validated');
      } else {
        this.form.classList.remove('was-validated');
        this.handleFormSubmit(event);
      }
    });
  }

  async handleFormSubmit (event) {
    const action = this.form.getAttribute('action');
    const method = this.form.getAttribute('method');
    const formData = new FormData(this.form);
    const authToken = document.querySelector('meta[name="csrf-token"]').content;
    formData.append('authenticity_token', authToken);

    const response = await fetch(action, {
      method: method,
      body: formData,
    });

    if (this.modalSelector && response.ok && response.status === 200) {
      this.handleModalDisplay(this.modalSelector);
      this.form.reset();
    }

  }

  handleModalDisplay (modalSelector) {
    const modal = document.querySelector(modalSelector);
    window.dispatchEvent(
      new CustomEvent('modalchange', {
        detail: {
          action: 'open',
          element: modalSelector,
          withOverlay: true,
        },
      })
    );
  }
}

customElements.define('form-component', FormComponent);
