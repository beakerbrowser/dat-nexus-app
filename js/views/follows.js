const html = require('choo/html')
const loadingView = require('./loading')
const renderError = require('../com/error')
const renderFollows = require('../com/follows')
const renderProfile = require('../com/profile')

module.exports = function followsView (state, emit) {
  if (!state.userProfile) {
    return loadingView(state, emit)
  }
  if (!state.currentProfile) {
    // load the profile and rerender
    state.loadProfile('dat://' + state.params.key, {getFollowProfiles: true})
    return loadingView(state, emit)
  }
  return html`
    <main>
      <div class="grid">
        <div class="feed-container">
          ${renderError(state, emit)}
          <p><a href="#"><i class="fa fa-caret-left"></i> Back to feed</a></p>
          <h2>${state.currentProfile.name + "'"}s follows</h2>
          ${renderFollows(state, emit, state.currentProfile)}
        </div>
        <div class="sidebar">
          ${renderProfile(state, emit, state.currentProfile)}
        </div>
      </div>
    </main>
  `
}
