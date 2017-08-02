const NexusAPI = require('dat-nexus-api')

module.exports = async function dbStore (state, emitter) {
  var userURL = null
  var userDB = null
  var cacheDB = null

  // this method selects an appropriate DB based on the
  // current app state and the given target (target = who we want to read about)
  // the userdb is only for the user and ppl the user follows
  // the cachedb is for unfollowed users
  state.DB = function (target) {
    if (!userDB) {
      // use cachedb if userdb isnt loaded yet
      return cacheDB
    }
    if (target) {
      // check if the target is the user, or is followed by the user
      // if it is, give the main userdb
      // otherwise, give the cachedb
      if (typeof target === 'object' && target._origin) {
        target = target._origin
      }
      if (typeof target === 'object' && target.url) {
        target = target.url
      }
      if (target === userURL) {
        return userDB
      }
      if (userDB.listArchives().find(a => a.url === target)) {
        return userDB
      }
      return cacheDB
    }
    return userDB
  }

  state.loadUserDB = async function (_userURL) {
    userURL = _userURL
    userDB = await NexusAPI.open(new DatArchive(userURL))
    emitter.emit('userdb-ready')
  }

  // load the cache DB by default
  cacheDB = await NexusAPI.open(/* cache db */)
  emitter.emit('cachedb-ready')
}
