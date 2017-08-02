/* globals window */

const html = require('choo/html')
const loadingView = require('./loading')
const renderError = require('../com/error')
const renderFeed = require('../com/feed')
const renderProfile = require('../com/profile')
const renderProfileEditor = require('../com/profile-editor')

module.exports = function profileView (state, emit) {
  if (!state.isAppLoaded) {
    return loadingView(state, emit)
  }
  if (!state.currentProfile) {
    // load the profile and rerender
    state.loadProfile('dat://' + state.params.key)
    return loadingView(state, emit)
  }
  if (!state.broadcasts) {
    state.loadUserBroadcasts()
    return loadingView(state, emit)
  }
  var isEditMode = window.location.hash.endsWith('/edit')
  return html`
    <main>
      <div class="grid">
        <div class="feed-container">
          ${renderError(state, emit)}
          <p><a href="#"><i class="fa fa-caret-left"></i> Back to feed</a></p>
          <h2>${state.currentProfile.name + "'"}s broadcasts</h2>
          ${renderFeed(state, emit)}
        </div>
        <div class="sidebar">
          ${isEditMode
            ? renderProfileEditor(state, emit, state.currentProfile)
            : renderProfile(state, emit, state.currentProfile)}
        </div>
      </div>
    </main>
  `
}
