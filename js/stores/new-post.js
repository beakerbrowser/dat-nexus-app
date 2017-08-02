module.exports = function newPostStore (state, emitter) {
  state.newPostText = ''
  emitter.on('change-post-text', text => {
    state.newPostText = text
    emitter.emit('render')
  })
  emitter.on('submit-post', async () => {
    try {
      await state.DB().broadcast(state.userProfile._origin, {text: state.newPostText})
      state.userProfile.numBroadcasts++
    } catch (e) {
      console.error(e)
      return
    }

    // clear form
    state.newPostText = ''
    emitter.emit('render')
    state.loadMainFeed()
  })
}
