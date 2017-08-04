const html = require('choo/html')

module.exports = function renderLikeBtn (emit, broadcast) {
  var likeAction
  if (broadcast.votes.currentUsersVote === 1) {
    likeAction = html`
      <button onclick=${() => emit('unlike', broadcast)}>
        <i class="fa fa-star"></i>
      </button>`
  } else {
    likeAction = html`
      <button onclick=${() => emit('like', broadcast)}>
        <i class="fa fa-star-o"></i>
      </button>`
  }

  return html`
    <span class="action like">
      ${likeAction}
      <a class="count">${broadcast.votes.up || ''}</a>
    </span>`
}
