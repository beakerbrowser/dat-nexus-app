/* globals DatArchive */

const {getUserProfileURL, setUserProfileURL, getViewProfileURL, getIsFollowed} = require('../util')

const SUGGESTED_PROFILE_URLS = [
  // 'dat://5d7f172d6a0c8fb69eb61f836087e761d87b2174ebe96f10b9954814087a8552/'
]

module.exports = async function profileStore (state, emitter) {
  state.isAppLoaded = false
  state.userProfile = null
  state.userArchive = null
  state.currentProfile = null

  emitter.on('pushState', () => {
    // clear page state
    state.currentProfile = null
  })

  emitter.on('cachedb-ready', async () => {
    // validate the userdb and load it
    const userProfileURL = getUserProfileURL()
    if (userProfileURL) {
      try {
        let userArchive = new DatArchive(userProfileURL)
        await userArchive.stat('/profile.json') // make sure is valid
        state.userArchive = userArchive
        state.loadUserDB(userProfileURL)
      } catch (e) {
        console.error('Failed to load profile', e)
        // setUserProfileURL(false) TODO - need to give the user a way to recover
        emitter.emit('userdb-not-available')
      }
    } else {
      emitter.emit('userdb-not-available')
    }
  })

  emitter.on('userdb-ready', async () => {
    // load the user profile and go
    state.userProfile = await readProfile(state, new DatArchive(getUserProfileURL()))
    state.isAppLoaded = true
    emitter.emit('render')
  })

  emitter.on('userdb-not-available', async () => {
    // load suggested profiles in the cachedb
    await state.DB().addArchives(SUGGESTED_PROFILE_URLS)
    state.isAppLoaded = true
    emitter.emit('render')
  })

  state.loadProfile = async (url, {getFollowProfiles} = {}) => {
    try {
      state.currentProfile = await readProfile(state, url, {getFollowProfiles})
    } catch (e) {
      state.error = e
    }
    emitter.emit('render')
  }

  state.toggleFollow = async profile => {
    try {
      if (profile.isFollowed) {
        await state.DB().unfollow(state.userProfile._origin, profile._origin)
        profile.isFollowed = false
      } else {
        await state.DB().follow(state.userProfile._origin, profile._origin)
        profile.isFollowed = true
      }
    } catch (e) {
      state.error = e
    }
    emitter.emit('render')
  }

  state.updateProfile = async (values) => {
    try {
      // create the profile if needed
      var archive
      const title = `${values.name || 'Unnamed'} (Nexus Profile)`
      const description = 'User profile for Nexus'
      if (!state.userProfile) {
        archive = await DatArchive.create({title, description})
        setUserProfileURL(archive.url)
      } else {
        archive = new DatArchive(state.userProfile._origin)
        if (archive.setInfo) {
          // do the if() because DatArchive.setInfo isnt implemented by beaker yet
          await archive.setInfo({title, description})
        }
      }

      // write the profile
      await state.DB().addArchive(archive)
      await state.DB().setProfile(archive.url, values)

      // reload
      state.userProfile = await readProfile(state, archive.url, {getFollowProfiles: true})
      console.log(state.userProfile)
    } catch (e) {
      console.error(e)
      state.error = e
      emitter.emit('render')
      return
    }
    emitter.emit('pushState', getViewProfileURL(state.userProfile))
  }
}

async function readProfile (state, url, opts = {}) {
  var db = state.DB(url)
  await db.addArchive(url)
  var profile = await db.getProfile(url)
  profile.numBroadcasts = await db.countBroadcasts({author: url})
  profile.isFollowed = await getIsFollowed(state, profile)
  if (opts.getFollowProfiles) {
    profile.followProfiles = await Promise.all(profile.followUrls.map(db.getProfile))
    profile.followProfiles = profile.followProfiles.filter(Boolean)
    profile.followProfiles.forEach(s => { s.isFollowed = true })
  }
  return profile
}
