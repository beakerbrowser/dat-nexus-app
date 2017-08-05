const html = require('choo/html')

module.exports = function renderFollowBtn (state, emit, profile) {
  if (profile.isFollowed) {
    return html`
      <button id="follow-toggle" class="btn center" onmouseout=${onShowFollowingButton} onmouseover=${onShowUnfollowButton} onclick=${toggleFollow}>Following<i class="fa fa-check"></i></button>
    `
  } else {
    return html`
      <button id="follow-toggle" class="btn primary center" onclick=${toggleFollow}>Follow<i class="fa fa-plus"></i></button>
    `
  }

  function toggleFollow () {
    state.toggleFollow(profile)
  }

  function onShowUnfollowButton () {
    const btn = document.getElementById('follow-toggle')
    btn.innerHTML = 'Unfollow<i class="fa fa-times"></i>'
  }

  function onShowFollowingButton () {
    const btn = document.getElementById('follow-toggle')
    btn.innerHTML = 'Following<i class="fa fa-check"></i>'
  }
}
