class Validator {
  constructor (element) {
    this.formElement = element

    this.#listenHandlers()
  }

  #listenHandlers () {
    this.formElement.addEventListener('submit', this.#handleFormSubmit.bind(this))
  }

  #handleFormSubmit (event) {
    if (!this.formElement.checkValidity()) {
      event.preventDefault()
    }

    this.formElement.classList.add('needs-validation')
  }
}

export { Validator }
