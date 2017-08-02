const html = require('choo/html')
const loadingView = require('./loading')
const renderError = require('../com/error')
const renderPostForm = require('../com/post-form')
const renderFeed = require('../com/feed')
const renderProfile = require('../com/profile')
const renderProfileEditor = require('../com/profile-editor')

module.exports = function mainView (state, emit) {
  if (!state.isAppLoaded) {
    return loadingView(state, emit)
  }
  if (!state.broadcasts) {
    state.loadMainFeed()
  }
  return html`
    <main>
      <div class="grid">
        <div class="feed-container">
          ${renderError(state, emit)}
          ${state.userProfile ? renderPostForm(state, emit) : ''}
          ${renderFeed(state, emit)}
        </div>
        <div class="sidebar">
          ${state.userProfile
            ? renderProfile(state, emit, state.userProfile)
            : renderProfileEditor(state, emit)}
        </div>
      </div>
    </main>
  `
}
