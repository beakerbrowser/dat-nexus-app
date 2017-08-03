const html = require('choo/html')
const {getViewProfileURL, getAvatarUrl} = require('../util')

module.exports = function createProfileModal (state, emit, profile) {
  return html`
    <div class="modal register" onsubmit=${onSubmit}>
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

  function onSubmit (e) {
    e.preventDefault()
    state.updateProfile({
      name: e.target.name.value || '',
      bio: e.target.bio.value || ''
    })
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
