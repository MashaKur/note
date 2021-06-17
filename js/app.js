import { setCookie, getCookie } from './cookie'
import './localStorage'
import { Note } from './note'
import { Validator } from './validator'

setCookie('Alex', 'hf834hg3hu3h', {
  path: '/',
  'max-age': 120
})

console.log(getCookie('Alex'))

new Note('#wrap', '#button', '.input-color')
// new Validator(form) // убрать комментарий в формы в index.html
