const html = require('choo/html')
const renderBroadcast = require('./broadcast')

module.exports = function renderFeed (state, emit) {
  if (!state.broadcasts) {
    return html`
      <p class="card">
        <i class="fa fa-spinner"></i> Loading feed...
      </p>
    `
  }

  return html`
    <ul class="feed">${state.broadcasts.map(b => renderBroadcast(emit, b))}</ul>
  `
}
