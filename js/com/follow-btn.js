const html = require('choo/html')

module.exports = function renderFollowBtn (state, emit, profile) {
  if (profile.isFollowed) {
    return html`
      <div><a onclick=${toggleFollow}><i class="fa fa-user-times"></i> Unfollow</a></div>
    `
  } else {
    return html`
      <div><a onclick=${toggleFollow}><i class="fa fa-user-plus"></i> Follow</a></div>
    `
  }

  function toggleFollow () {
    state.toggleFollow(profile)
  }
}
