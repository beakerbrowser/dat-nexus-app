module.exports = function feedStore (state, emitter) {
  state.error = null
  state.broadcasts = null

  emitter.on('pushState', () => {
    // clear page state
    state.error = null
    state.broadcasts = null
  })

  state.loadMainFeed = async () => {
    try {
      state.broadcasts = await state.DB().listBroadcasts({fetchAuthor: true, reverse: true})
    } catch (e) {
      state.error = e
    }
    emitter.emit('render')
  }

  state.loadUserBroadcasts = async () => {
    try {
      state.broadcasts = await state.DB(state.currentProfile).listBroadcasts({
        fetchAuthor: true,
        reverse: true,
        author: state.currentProfile._origin
      })
    } catch (e) {
      state.error = e
    }
    emitter.emit('render')
  }
}
