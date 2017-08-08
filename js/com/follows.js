const html = require('choo/html')
const renderFollowBtn = require('./follow-btn')
const renderAvatar = require('./avatar')
const {getViewProfileURL} = require('../util')

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
        ${state.userProfile.name} isn't following anyone.
      </p>
    `
  }
}

function renderFollow (state, emit, profile) {
  return html`
    <div class="profile-card minimal">
      <div class="profile-card-header">
        <a href=${getViewProfileURL(profile)}>
          ${renderAvatar(profile)}
        </a>

        <div class="profile-card-info">
          <h2 class="name">
            <a href=${getViewProfileURL(profile)}>${profile.name}</a>
          </h2>
        </div>
      </div>
      ${profile.bio ? html`<p class="description">${profile.bio}</p>` : ''}
      ${renderFollowBtn(state, emit, profile)}
    </div>
  `
}
