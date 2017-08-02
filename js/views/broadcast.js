/* globals window */

const html = require('choo/html')
const loadingView = require('./loading')
const renderError = require('../com/error')
const renderBroadcast = require('../com/broadcast')
const renderProfile = require('../com/profile')

module.exports = function broadcastView (state, emit) {
  if (!state.isAppLoaded) {
    return loadingView(state, emit)
  }
  if (!state.currentBroadcast) {
    state.loadCurrentBroadcast('dat://' + state.params.wildcard)
    return loadingView(state, emit)
  }
  return html`
    <main>
      <div class="grid">
        <div class="feed-container">
          ${renderError(state, emit)}
          <p><a href="#"><i class="fa fa-caret-left"></i> Back to feed</a></p>
          <h2>${state.currentBroadcast.author.name + "'"}s broadcast</h2>
          ${renderBroadcast(emit, state.currentBroadcast)}
        </div>
        <div class="sidebar">
          ${renderProfile(state, emit, state.userProfile)}
        </div>
      </div>
    </main>
  `
}
