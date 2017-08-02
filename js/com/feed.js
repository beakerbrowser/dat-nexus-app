const html = require('choo/html')
const renderLikeBtn = require('./like-btn')
const {getViewProfileURL, getAvatarUrl, getAvatarStyle, niceDate} = require('../util')

module.exports = function renderFeed (state, emit) {
  if (!state.broadcasts) {
    return html`
      <p class="feed">
        Loading...
      </p>
    `
  } else if (state.broadcasts.length) {
    return html`
      <ul class="feed">
        ${state.broadcasts.map(b => renderBroadcast(emit, b))}
      </ul>
    `
  } else {
    return html`
      <p class="feed">
        No broadcasts.
      </p>
    `
  }
}

function renderBroadcast (emit, broadcast) {
  if (!broadcast.text) {
    return ''
  }
  return html`
    <li class="broadcast">
      <a href=${getViewProfileURL(broadcast.author)}><img src=${getAvatarUrl(broadcast.author)} class="avatar" style=${getAvatarStyle(broadcast.author)}/></a>
      <div class="container">
        <div class="metadata">
          <a href=${getViewProfileURL(broadcast.author)} class="name">${broadcast.author.name}</span>
          <a href=${broadcast.url} target="_blank"><span class="date">${niceDate(broadcast.createdAt)}</span></a>
        </div>
        <p class="content">${broadcast.text}</p>
        <div class="controls">
          <a class="count"><i class="fa fa-comment-o"></i> 0</a>
          ${renderLikeBtn(emit, broadcast)}
        </div>
      </div>
    </li>
  `
}
