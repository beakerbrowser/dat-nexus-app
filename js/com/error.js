const html = require('choo/html')

module.exports = function renderError (state, emit) {
  if (!state.error) {
    return ''
  }
  return html`
    <p class="message error">${state.error.toString()}</p>
  `
}
