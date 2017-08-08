const html = require('choo/html')
const {getViewProfileURL, getAvatarStyle} = require('../util')

module.exports = function renderProfileEditor (state, emit, profile) {
  return html`
    <div class="profile-card profile-sidebar">
      <div class="profile-info edit">
        <form onsubmit=${onSubmit}>
          <div class="avatar avatar-editor" style=${getAvatarStyle(profile)}>
            <input type="file" accept="image/*"/>
            <i class="fa fa-picture-o"></i>
          </div>
          <input name="avatar" type="hidden"/>
          <p>
            <label for="name">Name</label>
            <input id="name" name="name" type="text" autofocus value=${profile ? profile.name : ''} />
          </p>

          <p>
            <label for="bio">Bio</label>
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

  async function onSubmit (e) {
    e.preventDefault()

    state.updateProfile({
      name: e.target.name.value || '',
      bio: e.target.bio.value || '',
      avatar: profile.avatar || ''
    })

    const avatarInput = document.querySelector('input[type="file"]')
    const archive = new DatArchive(profile._url)
    if (avatarInput.files.length) {
      state.setAvatar(archive, avatarInput.files[0])
      emit('render')
    }
  }
}
