import { DnD } from './dnd'

class Note {
  data = JSON.parse(localStorage.getItem('data')) || []
  editNoteClass = 'card_edit'
  DnD = DnD
  bg = 'rgb(190, 220, 238)'

  constructor (wrapSector = null, buttonSelector = null, inputColorSelector = null) {
    this.wrapElement = document.querySelector(wrapSector) || document.body
    this.buttonElement = document.querySelector(buttonSelector)
    this.inputColorElements = [...document.querySelectorAll(inputColorSelector)]

    this.#init()
  }

  #init () {
    if (!this.buttonElement) {
      const error = new Error('Вы не указали кнопку')
      console.error(error)

      return
    }

    this.#listenHandlers()
    this.render()
  }

  #listenHandlers () {
    this.buttonElement.addEventListener('click', this.#handleClickButtonCreateNote.bind(this))
    document.addEventListener('dblclick', this.#handleDoubleClick.bind(this))
    document.addEventListener('click', this.#handleClickButtonSubmit.bind(this))
    window.addEventListener('beforeunload', this.#handleBeforeUnload.bind(this))

    this.inputColorElements.forEach(element => {
      console.log(element)
      element.addEventListener('click', this.#handleChangeColor.bind(this))
    })
  }

  #handleChangeColor ({ target }) {
    const { value } = target

    this.bg = value
  }

  #handleBeforeUnload () {
    localStorage.setItem('data', JSON.stringify(this.data))
  }

  #handleClickButtonCreateNote () {
    this.#createNote()

    this.render()
  }

  #handleDoubleClick (event) {
    const { target } = event
    const cardElement = target.closest('.card')

    if (cardElement) {
      cardElement.classList.add(this.editNoteClass)
    }
  }

  #handleClickButtonSubmit (event) {
    event.preventDefault()
    const { target } = event

    if (target.classList.value.includes('submit-form')) {
      const textareaElement = target.previousElementSibling
      const cardElement = target.closest('.card')

      const { id } = cardElement.dataset
      const index = this.#getIndexSelectedNote(id)
      this.data[index].content = textareaElement.value // edit note

      this.render()
    }
  }

  #handleClickClose (event) {
    const { target } = event

    if (target.classList.value.includes('card__close')) {
      const cardElement = target.closest('.card')

      const { id } = cardElement.dataset
      const index = this.#getIndexSelectedNote(id)
      this.data.splice(index, 1) // remove item

      this.render()
    }
  }

  #createNote () {
    const noteData = {
      id: new Date().getTime(),
      content: 'Hello!',
      bg: this.bg,
      position: {
        left: 'auto',
        top: 'auto'
      }
    }

    this.data.push(noteData)
  }

  #buildNoteElement (noteData) {
    const { id, content, position, bg } = noteData
    const dndWrapElement = document.createElement('div')

    // тут последовательность важна
    this.#setPosition(position, dndWrapElement) // 1. устанавливаем позицию
    dndWrapElement.classList.add('dnd')
    new this.DnD(dndWrapElement) // 2. передаем элемент с его сохраненной позицией

    dndWrapElement.addEventListener('dnd:end', (event) => {
      const { position } = event.detail
      const index = this.#getIndexSelectedNote(id)

      this.data[index].position = position
      this.#setPosition(position, dndWrapElement)
      console.log(this.data)
    })

    dndWrapElement.addEventListener('click', this.#handleClickClose.bind(this))

    const template = `
      <div data-id="${id}" class="card" style="background-color: ${bg}">
        <button type="button" class="card__close">❌</button>
        <div class="card__content">${content}</div>
        <form class="card__form mt-2">
          <textarea class="w-100" rows="4">${content}</textarea>
          <button type="submit" class="btn btn-sm btn-success submit-form">Save</button>
        </form>
      </div>
    `
    dndWrapElement.innerHTML = template

    return dndWrapElement
  }

  #getIndexSelectedNote (id) {
    let index = 0

    this.data.forEach((item, i) => {
      if (item.id == id) {
        index = i
      }
    })

    return index
  }

  #setPosition ({ left, top }, element) {
    element.style.left = left
    element.style.top = top
  }

  render () {
    this.wrapElement.innerHTML = ''

    this.data.forEach((item) => {
      const noteElement = this.#buildNoteElement(item)
      this.wrapElement.append(noteElement)
    })
  }
}

export { Note }
