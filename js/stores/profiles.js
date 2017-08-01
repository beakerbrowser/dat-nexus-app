/* globals DatArchive */

const NexusAPI = require('dat-nexus-api')
const {getUserProfileURL, setUserProfileURL, getViewProfileURL, getIsFollowed} = require('../util')

const SUGGESTED_PROFILE_URLS = [
  // 'dat://5d7f172d6a0c8fb69eb61f836087e761d87b2174ebe96f10b9954814087a8552/'
]

module.exports = async function profileStore (state, emitter) {
  state.isAppLoaded = false
  state.userProfile = null
  state.currentProfile = null

  emitter.on('pushState', () => {
    // clear page state
    state.currentProfile = null
  })

  emitter.on('load-profile', async ({url, getFollowProfiles}) => {
    try {
      state.currentProfile = await readProfile(url, {getFollowProfiles})
    } catch (e) {
      state.error = e
    }
    emitter.emit('render')
  })

  emitter.on('toggle-follow', async (profile) => {
    try {
      if (profile.isFollowed) {
        await NexusAPI.unfollow(state.userProfile._origin, profile._origin)
        profile.isFollowed = false
      } else {
        await NexusAPI.follow(state.userProfile._origin, profile._origin)
        profile.isFollowed = true
      }
    } catch (e) {
      state.error = e
    }
    emitter.emit('render')
  })

  emitter.on('update-profile', async (values) => {
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
      await NexusAPI.addArchive(archive)
      await NexusAPI.setProfile(archive.url, values)

      // reload
      state.userProfile = await readProfile(archive.url, {getFollowProfiles: true})
      console.log(state.userProfile)
    } catch (e) {
      console.error(e)
      state.error = e
      emitter.emit('render')
      return
    }
    emitter.emit('pushState', getViewProfileURL(state.userProfile))
  })

  // read main profile
  const userProfileURL = getUserProfileURL()
  if (userProfileURL) {
    try {
      let userArchive = new DatArchive(userProfileURL)
      await userArchive.stat('/profile.json') // make sure is valid
      await NexusAPI.open(userArchive)
      state.userProfile = await readProfile(userArchive.url)
    } catch (e) {
      console.error('Failed to load profile', e)
      // setUserProfileURL(false) TODO - need to give the user a way to recover
    }
  }
  if (!state.userProfile) {
    // load suggested profiles in a guest session
    await NexusAPI.open(/* guest session */)
    await NexusAPI.addArchives(SUGGESTED_PROFILE_URLS)
  }
  state.isAppLoaded = true
  emitter.emit('render')

  async function readProfile (url, opts = {}) {
    await NexusAPI.addArchive(url)
    var profile = await NexusAPI.getProfile(url)
    profile.numBroadcasts = await NexusAPI.countBroadcasts({author: url})
    profile.isFollowed = await getIsFollowed(state, profile)
    if (opts.getFollowProfiles) {
      profile.followProfiles = await Promise.all(profile.followUrls.map(NexusAPI.getProfile))
      profile.followProfiles.forEach(s => { s.isFollowed = true })
    }
    return profile
  }
}
