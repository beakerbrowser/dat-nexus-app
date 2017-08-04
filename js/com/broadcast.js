const html = require('choo/html')
const renderLikeBtn = require('./like-btn')
const {getViewProfileURL, getViewBroadcastURL, getAvatarUrl, getAvatarStyle, niceDate} = require('../util')

module.exports = function renderBroadcast (emit, broadcast) {
  if (!broadcast.text) {
    return ''
  }
  return html`
    <div hre=${getViewBroadcastURL(broadcast)} class="broadcast">
      <a class="avatar-container" href=${getViewProfileURL(broadcast.author)}>
        <img src=${getAvatarUrl(broadcast.author)} class="avatar" style=${getAvatarStyle(broadcast.author)}/>
      </a>

      <div class="main-container">
        <div class="metadata">
          <a href=${getViewProfileURL(broadcast.author)} class="name">${broadcast.author.name}</span>
          <a href=${getViewBroadcastURL(broadcast)} target="_blank"><span class="date">${niceDate(broadcast.createdAt)}</span></a>
        </div>

        <p class="content">${broadcast.text}</p>

        <div class="controls">
          <a class="action comment" href=${getViewBroadcastURL(broadcast)}><i class="fa fa-comment-o"></i></a>
          ${renderLikeBtn(emit, broadcast)}
        </div>
      </div>
    </div>
  `
}
