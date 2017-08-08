const html = require('choo/html')
const renderAvatar = require('./avatar')
const {getViewProfileURL} = require('../util')

module.exports = function renderPostForm (state, emit) {
  var textareaCls = state.newPostText ? 'has-content' : ''
  return html`
    <form id="new-post" onsubmit=${onPostSubmit}>
      <div class="header">Post a broadcast</div>

      <div class="main">
        ${renderAvatar(state.userProfile)}

        <textarea rows=${state.textareaRows} class="editor ${textareaCls}" onkeyup=${onChangePostText} onfocus=${onFocus} onblur=${onBlur} placeholder="What's new?">${state.newPostText}</textarea>
      </div>

      <div class="footer ${state.isFooterVisible ? 'visible' : ''}">
        ${''/* TODO <button class="btn">Share a file<i class="fa fa-file-text-o"></i></button>
        <button class="btn">Share an image<i class="fa fa-picture-o"></i></button> */}
        ${state.newPostText ? html`<button type="button" class="btn" onclick=${onCancel}>Cancel</button>` : ''}
        <button type="submit" class="btn primary" disabled=${state.newPostText ? 'false' : 'true'}>Post</button>
      </div>
    </form>
  `

  function onCancel () {
    emit('change-post-text', '')
  }

  function onChangePostText (e) {
    emit('change-post-text', e.target.value)
  }

  function onFocus (e) {
    emit('show-footer')
  }

  function onBlur (e) {
    if (!e.target.value.length) {
      emit('hide-footer')
    }
  }

  function onPostSubmit (e) {
    e.preventDefault()
    emit('hide-footer')
    emit('submit-post')
  }
}
