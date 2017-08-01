const html = require('choo/html')
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
        ${state.broadcasts.map(renderBroadcast)}
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

function renderBroadcast (broadcast) {
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
      </div>
    </li>
  `
}
