module.exports = function commentsStore (state, emitter) {
  emitter.on('change-comment-text', ({parentURL, text}) => {
    state.commentDrafts[parentURL] = text
    emitter.emit('render')
  })

  emitter.on('submit-comment', async (parent) => {
    try {
      // add the comment, which is just a broadcast
      await state.DB().broadcast(
        state.userProfile._origin,
        {text: state.commentDrafts[parent._url], threadParent: parent._url})
      state.userProfile.numBroadcasts++
    } catch (e) {
      console.error(e)
      return
    }

    // clear form
    state.commentDrafts[parent._url] = ''
    emitter.emit('render')
    state.loadMainFeed() // TODO?
  })
}
