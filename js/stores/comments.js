module.exports = function commentsStore (state, emitter) {
  emitter.on('change-comment-text', text => {
    state.commentText = text
    emitter.emit('render')
  })

  emitter.on('submit-comment', async (parent) => {
    try {
      // add the comment, which is just a broadcast
      await state.DB().broadcast(
        state.userProfile._origin,
        {text: state.commentText, threadRoot: parent._url, threadParent: parent._url})
      state.userProfile.numBroadcasts++
    } catch (e) {
      console.error(e)
      return
    }

    // clear form
    state.commentText = ''
    emitter.emit('render')
    state.loadMainFeed() // TODO?
  })
}
