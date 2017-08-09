module.exports = function broadcastsStore (state, emitter) {
  state.currentBroadcast = null
  state.expandedBroadcasts = []

  emitter.on('pushState', () => {
    // clear page state
    state.expandedBroadcasts = []
    state.currentBroadcast = null
    state.currentBroadcastParent = null
  })

  state.loadCurrentBroadcast = async function (url) {
    try {
      state.currentBroadcast = await state.DB().getBroadcast(url)
      if (state.currentBroadcast.threadParent) {
        state.currentBroadcastParent = await state.DB().getBroadcast(state.currentBroadcast.threadParent)
      }
    } catch (e) {
      state.error = e
    }
    emitter.emit('render')
  }
}
