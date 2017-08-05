module.exports = function headerStore (state, emitter) {
  state.isDropdownOpen = false
  emitter.on('toggle-dropdown', () => {
    state.isDropdownOpen = !state.isDropdownOpen
    emitter.emit('render')
  })
}
