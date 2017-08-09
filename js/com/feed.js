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

  var broadcasts = state.broadcasts.filter(b => !(b.threadRoot || b.threadParent))
  return html`
    <ul class="feed">${broadcasts.map(b => renderBroadcast(state, emit, b))}</ul>
  `
}
