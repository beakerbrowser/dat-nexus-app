const html = require('choo/html')
const renderLikeBtn = require('./like-btn')
const renderAvatar = require('./avatar')
const renderComments = require('./comments')
const {getViewProfileURL, getViewBroadcastURL, niceDate, pluralize} = require('../util')

module.exports = function renderBroadcast (state, emit, broadcast) {
  if (!broadcast.text) {
    return ''
  }
  var commentsExpanded = state.expandedBroadcasts.indexOf(broadcast._url) !== -1
  return html`
    <div class="broadcast">
      <div class="broadcast-content">
        <a class="avatar-container" href=${getViewProfileURL(broadcast.author)}>
          ${renderAvatar(broadcast.author)}
        </a>

        <div class="broadcast-container">
          <div class="metadata">
            <a href=${getViewProfileURL(broadcast.author)} class="name">${broadcast.author.name}</span>
            <a href=${getViewBroadcastURL(broadcast)} target="_blank"><span class="date">${niceDate(broadcast.createdAt)}</span></a>
          </div>

          <p class="content">${broadcast.text}</p>
        </div>
      </div>

      <div class="controls">
        ${renderLikeBtn(emit, broadcast)}

        <span class="action comment" onclick=${onToggleComments}>
          ${broadcast.replies && broadcast.replies.length
            ? pluralize(broadcast.replies.length, 'comment', 's')
            : 'Write a comment'}
        </span>
      </div>

      ${commentsExpanded ? renderComments(state, emit, broadcast) : ''}
    </div>
  `

  function onToggleComments () {
    var idx = state.expandedBroadcasts.indexOf(broadcast._url)
    if (idx === -1) {
      state.expandedBroadcasts.push(broadcast._url)
    } else {
      state.expandedBroadcasts.splice(idx, 1)
    }
    emit('render')
  }
}
