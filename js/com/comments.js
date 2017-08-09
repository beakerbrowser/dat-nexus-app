const html = require('choo/html')
const debounce = require('debounce')
const {niceDate, getViewBroadcastURL} = require('../util')
const renderAvatar = require('./avatar')

module.exports = function renderComments (state, emit, broadcast) {
  const replies = broadcast.replies || []
  state.commentDrafts = state.commentDrafts || {}
  return html`
    <div class="comments">
      <div class="comments-editor">
        ${renderAvatar(state.userProfile)}
        <textarea onkeypress=${onDetectEnter} onkeyup=${debounce(onChangeComment, 300)} type="text" placeholder="Write a comment...">${state.commentDrafts[broadcast._url]}</textarea>
      </div>

      ${replies.map(r => html`
        <div class="comment">
          <div class="avatar-container">${renderAvatar(r.author)}</div>

          <div class="content">
            <a class="author">${r.author.name}</a>
            <span class="comment-text">${r.text}</span>

            <div class="footer">
              <a href=${getViewBroadcastURL(r)} class="ts">${niceDate(r.createdAt)}</span>
            </div>
          </div>
        </div>`
      )}
    </div>
  `
  function onDetectEnter (e) {
    if (e.which == 13 || e.keyCode == 13) {
      e.preventDefault()
      emit('submit-comment', broadcast)
    }
  }

  function onChangeComment (e) {
    emit('change-comment-text', {parentURL: broadcast._url, text: e.target.value})
  }
}
