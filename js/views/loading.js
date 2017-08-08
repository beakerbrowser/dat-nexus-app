const html = require('choo/html')
const renderError = require('../com/error')

module.exports = function loadingView (state, emit) {
  return html`
    <main>
      <div class="grid">
        <div class="feed-container">
          ${state.error ? renderError(state, emit) : html`<div class="card"><p><i class="fa fa-spinner"></i>Loading...</p></div>`}
        </div>
      </div>
    </main>
  `
}
