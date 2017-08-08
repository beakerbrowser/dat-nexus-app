const html = require('choo/html')
const {getAvatarStyle} = require('../util')

module.exports = function renderAvatar (profile) {
  return html`<div class="avatar" style=${getAvatarStyle(profile)}></div>`
}
