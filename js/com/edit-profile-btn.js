const html = require('choo/html')
const {getEditProfileURL} = require('../util')

module.exports = function renderEditProfileBtn (state, emit, profile) {
  return html`
    <a href=${getEditProfileURL(profile)} class="btn center">
      Edit profile
      <i class="fa fa-pencil"></i>
    </a>
  `
}
