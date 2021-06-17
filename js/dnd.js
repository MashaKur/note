class DnD {
  shifts = {
    x: 0,
    y: 0
  }

  constructor (element) {
    this.element = element
    this.position = { // сюда надо передавать текущее положение element
      left: this.element.style.left,
      top: this.element.style.top
    }

    this.handleMousemove = this._handleMousemove.bind(this)

    this._init()
  }

  _init () {
    this.element.addEventListener('mousedown', (event) => {
      this._handleMousedown(event)
    })
    this.element.addEventListener('mouseup', this._handleMouseup.bind(this))
  }

  _handleMousedown (event) {
    const { clientX, clientY } = event
    this._calcShifts({ clientX, clientY })

    document.addEventListener('mousemove', this.handleMousemove)
  }

  _handleMousemove (event) {
    const { clientX, clientY } = event

    this._setPosition({ clientX, clientY })
  }

  _handleMouseup () {
    document.removeEventListener('mousemove', this.handleMousemove)

    const customEvent = new CustomEvent('dnd:end', {
      detail: { position: this.position }
    })
    this.element.dispatchEvent(customEvent)
  }

  _calcShifts (coords) {
    const { clientX, clientY } = coords
    const rect = this.element.getBoundingClientRect()

    this.shifts.x = clientX - rect.left
    this.shifts.y = clientY - rect.top
  }

  _setPosition (coords) {
    const { clientX, clientY } = coords
    const { x: shiftX, y: shiftY } = this.shifts

    this.position = {
      left: clientX - shiftX + 'px',
      top: clientY - shiftY + 'px'
    }

    this.element.style.left = this.position.left
    this.element.style.top = this.position.top
  }
}

export { DnD }
