const html = require('choo/html')
const {getViewProfileURL, getAvatarUrl, getAvatarStyle} = require('../util')

module.exports = function renderFeed (state, emit) {
  return html`
    <header>
      <div class="container">
        <div class="links">
          <a href="#" class="btn transparent">
            <i class="fa fa-home"></i>
            Home
          </a>
        </div>

        <div class="avatar-card">
          <img class="avatar" src=${getAvatarUrl(state.userProfile)}/>
          <span class="name">${state.userProfile.name}</span>
          <i class="fa fa-caret-down"></>
        </div>
      </div>
    </header>
  `
}
