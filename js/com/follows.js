const html = require('choo/html')
const renderFollowBtn = require('./follow-btn')
const {getViewProfileURL, getAvatarUrl, getAvatarStyle} = require('../util')

module.exports = function renderFollows (state, emit, profile) {
  if (profile.followProfiles.length) {
    return html`
      <div class="follows">
        ${profile.followProfiles.map(f => renderFollow(state, emit, f))}
      </div>
    `
  } else {
    return html`
      <p class="follows">
        Not following anybody.
      </p>
    `
  }
}

function renderFollow (state, emit, profile) {
  return html`
    <div class="profile">
      <a href=${getViewProfileURL(profile)}><img class="avatar" src=${getAvatarUrl(profile)} style=${getAvatarStyle(profile)} /></a>
      <div class="profile-info">
        <h1 class="name"><a href=${getViewProfileURL(profile)}>${profile.name}</a></h1>
        <div class="description">${profile.bio}</div>
        <p>${renderFollowBtn(state, emit, profile)}</p>
      </div>
    </div>
  `
}
