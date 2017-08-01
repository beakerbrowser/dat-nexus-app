const html = require('choo/html')
const renderError = require('../com/error')

module.exports = function loadingView (state, emit) {
  return html`
    <main>
      <div class="grid">
        <div class="feed-container">
          ${state.error ? renderError(state, emit) : 'Loading...'}
        </div>
      </div>
    </main>
  `
}
