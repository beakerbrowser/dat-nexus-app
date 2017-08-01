const html = require('choo/html')
const renderFollowBtn = require('./follow-btn')
const {getViewProfileURL, getAvatarUrl, getAvatarStyle, getViewFollowsURL, getEditProfileURL, pluralize} = require('../util')

module.exports = function renderProfile (state, emit, profile) {
  if (!profile) {
    return ''
  }
  var numFollows = profile.follows ? profile.follows.length : 0
  var isUser = profile._origin === state.userProfile._origin
  return html`
    <div class="profile">
      <a href=${getViewProfileURL(profile)}><img class="avatar" src=${getAvatarUrl(profile)} style=${getAvatarStyle(profile)} /></a>
      <div class="profile-info">
        <h1 class="name"><a href=${getViewProfileURL(profile)}>${profile.name}</a></h1>
        <div class="description">
          ${profile.bio}
          ${isUser ? html`<a href=${getEditProfileURL(profile)}>Edit profile</a>` : ''}
        </div>
        ${isUser ? '' : html`<hr />`}
        ${isUser ? '' : html`<p>${renderFollowBtn(state, emit, profile)}</p>`}
        <hr />
        <div>Posted <a href=${getViewProfileURL(profile)}>${profile.numBroadcasts} ${pluralize(profile.numBroadcasts, 'broadcast')}</a></div>
        <div>Following <a href=${getViewFollowsURL(profile)}>${numFollows} ${pluralize(numFollows, 'user')}</a></div>
        <p><a target="_blank" href=${profile._origin}><i class="fa fa-external-link"></i> View site</a></p>
      </div>
    </div>
  `
}
