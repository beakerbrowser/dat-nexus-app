const html = require('choo/html')

module.exports = function renderCreateProfilePrompt (state, emit) {
  return html`
    <div>
      <p><a class="link" href="/#new-profile">Create a profile</a></p>
      <p>TODO: explain what Nexus is.</p>
    </div>
  `
}
