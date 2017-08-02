const html = require('choo/html')

module.exports = function renderLikeBtn (emit, broadcast) {
  var likeAction
  if (broadcast.votes.currentUsersVote === 1) {
    likeAction = html`<a class="like-action" onclick=${() => emit('unlike', broadcast)}>
      <i class="fa fa-star"></i>
    </a>`
  } else {
    likeAction = html`<a class="like-action" onclick=${() => emit('like', broadcast)}>
      <i class="fa fa-star-o"></i>
    </a>`
  }

  return html`<span class="like-btn">
    ${likeAction}
    <a class="count">${broadcast.votes.up}</a>
  </span>`
}
