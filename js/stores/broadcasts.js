module.exports = function broadcastsStore (state, emitter) {
  state.currentBroadcast = null

  emitter.on('pushState', () => {
    // clear page state
    state.currentBroadcast = null
  })

  state.loadCurrentBroadcast = async function (url) {
    try {
      state.currentBroadcast = await state.DB().getBroadcast(url)
    } catch (e) {
      state.error = e
    }
    emitter.emit('render')
  }
}
