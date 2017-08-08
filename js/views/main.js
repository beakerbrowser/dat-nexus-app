const html = require('choo/html')
const loadingView = require('./loading')
const renderError = require('../com/error')
const renderHeader = require('../com/header')
const renderPostForm = require('../com/post-form')
const renderFeed = require('../com/feed')
const renderProfile = require('../com/profile-card')
const renderProfileEditor = require('../com/profile-editor')
const renderCreateProfileModal = require('../com/create-profile-modal')

module.exports = function mainView (state, emit) {
  if (!state.isAppLoaded) {
    return loadingView(state, emit)
  }
  if (!state.broadcasts) {
    state.loadMainFeed()
  }
  if (!state.userProfile) {
    return html`<main>${renderCreateProfileModal(state, emit)}</main>`
  }
  return html`
    <main>
      ${renderHeader(state, emit)}

      <div class="main-container">
        <div class="sidebar">
          ${renderProfile(state, emit, state.userProfile)}
        </div>

        <div class="main-content feed-container">
          ${renderError(state, emit)}
          ${renderPostForm(state, emit)}
          ${renderFeed(state, emit)}
        </div>
      </div>
    </main>
  `
}
