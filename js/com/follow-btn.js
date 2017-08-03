const html = require('choo/html')

module.exports = function renderFollowBtn (state, emit, profile) {
  if (profile.isFollowed) {
    return html`
      <button id="follow-toggle" class="btn success outline" onmouseout=${onShowFollowingButton} onmouseover=${onShowUnfollowButton} onclick=${toggleFollow}>Following<i class="fa fa-check"></i></button>
    `
  } else {
    return html`
      <button id="follow-toggle" class="btn primary outline" onclick=${toggleFollow}>Follow<i class="fa fa-plus"></i></button>
    `
  }

  function toggleFollow () {
    state.toggleFollow(profile)
  }

  function onShowUnfollowButton () {
    const btn = document.getElementById('follow-toggle')
    btn.innerHTML = 'Unfollow<i class="fa fa-times"></i>'
    btn.classList.remove('success')
    btn.classList.add('destructive')
  }

  function onShowFollowingButton () {
    const btn = document.getElementById('follow-toggle')
    btn.innerHTML = 'Following<i class="fa fa-check"></i>'
    btn.classList.remove('destructive')
    btn.classList.add('success')
  }
}
