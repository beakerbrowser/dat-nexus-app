/* globals window */

const html = require('choo/html')
const loadingView = require('./loading')
const renderError = require('../com/error')
const renderHeader = require('../com/header')
const renderBroadcast = require('../com/broadcast')
const renderProfile = require('../com/profile-card')
const {getViewProfileURL} = require('../util')

module.exports = function broadcastView (state, emit) {
  if (!state.isAppLoaded) {
    return loadingView(state, emit)
  }
  if (!state.currentBroadcast) {
    state.loadCurrentBroadcast('dat://' + state.params.wildcard)
    return loadingView(state, emit)
  } else {
    var author = state.currentBroadcast.author
  }
  state.expandedBroadcasts.push(state.currentBroadcast._url)
  return html`
    <main>
      ${renderHeader(state, emit, state.userProfile)}
      <div class="main-container">
        <div class="main-content center">
          ${renderError(state, emit)}
          <a href=${getViewProfileURL(author)} class="breadcrumbs">
            <i class="fa fa-caret-left"></i>
            Back to ${author.name}'s feed
          </a>
          ${state.currentBroadcastParent
            ? renderBroadcast(state, emit, state.currentBroadcastParent, true)
            : ''
          }
          ${renderBroadcast(state, emit, state.currentBroadcast)}
        </div>
      </div>
    </main>
  `
}
