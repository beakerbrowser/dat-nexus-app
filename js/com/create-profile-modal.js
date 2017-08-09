const html = require('choo/html')

module.exports = function createProfileModal (state, emit, profile) {
  return html`
    <form class="modal register" onsubmit=${onSubmit}>
      <div class="modal-content">
        <div class="modal-header">
          Create a profile
        </div>

        <h1 class="modal-title">
          Welcome to Nexus!
        </h1>

        <p class="modal-subtitle">
          Set up your profile to get started.
        </p>

        <div class="modal-main">
          <div class="content">
            <div class="avatar avatar-editor">
              <input type="file" accept="image/*"/>
              <i class="fa fa-picture-o"></i>
            </div>

            <label for="name">Your name</label>
            <input type="text" name="name" placeholder="Jane Smith" value=${profile ? profile.name : ''} onkeyup=${validateName}/>

            <label for="bio">Add a short bio</label>
            <textarea name="bio" placeholder="Optional">${profile ? profile.bio : ''}</textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button id="submit-register" disabled type="submit" class="btn primary">Create profile</button>
        </div>
      </div>
    </form>
  `

  async function onSubmit (e) {
    e.preventDefault()
    await state.updateProfile({
      name: e.target.name.value || '',
      bio: e.target.bio.value || '',
      avatar: ''
    })

    const avatarInput = document.querySelector('input[type="file"]')
    const archive = new DatArchive(state.userProfile._origin)
    if (avatarInput.files.length) {
      state.setAvatar(archive, avatarInput.files[0])
      emit('render')
    }
  }

  function validateName (e) {
    const btn = document.getElementById('submit-register')
    if (e.target.value.length) {
      btn.disabled = false
    } else {
      btn.disabled = true
    }
  }
}
