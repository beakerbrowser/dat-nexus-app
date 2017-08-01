const NexusAPI = require('dat-nexus-api')

module.exports = function feedStore (state, emitter) {
  state.error = null
  state.broadcasts = null

  emitter.on('pushState', () => {
    // clear page state
    state.error = null
    state.broadcasts = null
  })

  emitter.on('load-feed', async () => {
    try {
      state.broadcasts = await NexusAPI.listBroadcasts({fetchAuthor: true, reverse: true})
    } catch (e) {
      state.error = e
    }
    emitter.emit('render')
  })

  emitter.on('load-broadcasts', async () => {
    try {
      state.broadcasts = await NexusAPI.listBroadcasts({fetchAuthor: true, reverse: true, author: state.currentProfile._origin})
    } catch (e) {
      state.error = e
    }
    emitter.emit('render')
  })
}
