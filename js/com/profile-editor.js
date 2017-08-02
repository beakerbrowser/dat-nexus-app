const html = require('choo/html')
const {getViewProfileURL, getAvatarUrl} = require('../util')

module.exports = function renderProfileEditor (state, emit, profile) {
  return html`
    <div class="profile">
      <img class="avatar" src=${getAvatarUrl(profile)} />
      <div class="profile-info edit">
        <form onsubmit=${onSubmit}>
          <p>
            <label for="name">Your name</label>
            <input id="name" name="name" type="text" autofocus value=${profile ? profile.name : ''} />
          </p>
          <p>
            <label for="bio">Your bio</label>
            <textarea id="bio" name="bio" placeholder="Optional">${profile ? profile.bio : ''}</textarea>
          </p>
          <p>
            <a href=${getViewProfileURL(profile)} class="btn">Cancel</a>
            <button type="submit" class="btn primary">Save</button>
          </p>
        </form>
      </div>
    </div>
  `

  function onSubmit (e) {
    e.preventDefault()
    state.updateProfile({
      name: e.target.name.value || '',
      bio: e.target.bio.value || ''
    })
  }
}
