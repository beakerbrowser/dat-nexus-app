const html = require('choo/html')
const {getViewProfileURL, getAvatarStyle} = require('../util')

module.exports = function renderProfileEditor (state, emit, profile) {
  var avatarStyle = state.tmpAvatarURL ? `background-image: url(${state.tmpAvatarURL})` : getAvatarStyle(profile)
  return html`
    <div class="profile-card profile-sidebar">
      <div class="profile-info edit">
        <form onsubmit=${onSubmit}>
          <label>Update your avatar</label>
          <div class="avatar avatar-editor" style=${avatarStyle}>
            <input type="file" accept="image/*" onchange=${onChangeAvatar} />
            <div class="icon-container">
              <i class="fa fa-picture-o"></i>
            </div>
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

  async function onChangeAvatar (e) {
    if (e.target.files) {
      const reader = new FileReader()
      reader.onload = () => {
        state.tmpAvatar = e.target.files[0]
        state.tmpAvatarURL = reader.result
        emit('render')
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  async function onSubmit (e) {
    e.preventDefault()

    state.updateProfile({
      name: e.target.name.value || '',
      bio: e.target.bio.value || '',
      avatar: profile.avatar || ''
    })

    const archive = new DatArchive(profile._url)
    if (state.tmpAvatar) {
      state.setAvatar(archive, state.tmpAvatar)
      emit('render')
    }
  }
}
