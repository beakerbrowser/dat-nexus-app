const choo = require('choo')
const html = require('choo/html')
const {ProfileSite, listFeed} = require('dat-nexus-api')
const {niceDate, pluralize} = require('./util')

const SUGGESTED_PROFILE_URLS = [
  'dat://5d7f172d6a0c8fb69eb61f836087e761d87b2174ebe96f10b9954814087a8552/'
]

// globals
// =

var app = choo()
app.use(profileStore)
app.use(newPostStore)
app.use(feedStore)
app.route('/', mainView)
app.route('/profile/:key', profileView)
app.route('/profile/:key/follows', followsView)
app.route('/profile/:key/edit', profileView)
app.mount('main')

// views
// =

function mainView (state, emit) {
  if (!state.isAppLoaded) {
    return loadingView(state, emit)
  }
  if (!state.broadcasts) {
    emit('load-feed')
  }
  return html`
    <main>
      <div class="grid">
        <div class="feed-container">
          ${renderError(state, emit)}
          ${state.userProfile ? renderPostForm(state, emit) : ''}
          ${renderFeed(state, emit)}
        </div>
        <div class="sidebar">
          ${state.userProfile
            ? renderProfile(state, emit, state.userProfile)
            : renderProfileEditor(state, emit)}
        </div>
      </div>
    </main>
  `
}

function profileView (state, emit) {
  if (!state.isAppLoaded) {
    return loadingView(state, emit)
  }
  if (!state.currentProfile) {
    emit('load-profile', {url: 'dat://' + state.params.key})
    return loadingView(state, emit)
  }
  if (!state.broadcasts) {
    emit('load-broadcasts')
    return loadingView(state, emit)
  }
  var isEditMode = window.location.hash.endsWith('/edit')
  return html`
    <main>
      <div class="grid">
        <div class="feed-container">
          ${renderError(state, emit)}
          <p><a href="#"><i class="fa fa-caret-left"></i> Back to feed</a></p>
          <h2>${state.currentProfile.profile.name + "'"}s broadcasts</h2>
          ${renderFeed(state, emit)}
        </div>
        <div class="sidebar">
          ${isEditMode
            ? renderProfileEditor(state, emit, state.currentProfile)
            : renderProfile(state, emit, state.currentProfile)}
        </div>
      </div>
    </main>
  `
}

function followsView (state, emit) {
  if (!state.userProfile) {
    return loadingView(state, emit)
  }
  if (!state.currentProfile) {
    emit('load-profile', {url: 'dat://' + state.params.key, following: true})
    return loadingView(state, emit)
  }
  return html`
    <main>
      <div class="grid">
        <div class="feed-container">
          ${renderError(state, emit)}
          <p><a href="#"><i class="fa fa-caret-left"></i> Back to feed</a></p>
          <h2>${state.currentProfile.profile.name + "'"}s follows</h2>
          ${renderFollows(state, emit, state.currentProfile)}
        </div>
        <div class="sidebar">
          ${renderProfile(state, emit, state.currentProfile)}
        </div>
      </div>
    </main>
  `
}

function loadingView (state, emit) {
  return html`
    <main>
      <div class="grid">
        <div class="feed-container">
          ${state.error ? renderError(state, emit) : 'Loading...'}
        </div>
      </div>
    </main>
  `
}

// components
// =

function renderError (state, emit) {
  if (!state.error) {
    return ''
  }
  return html`
    <p class="message error">${state.error.toString()}</p>
  `
}

function renderFeed (state, emit) {
  if (!state.broadcasts) {
    return html`
      <p class="feed">
        Loading...
      </p>
    `
  } else if (state.broadcasts.length) {
    return html`
      <ul class="feed">
        ${state.broadcasts.map(renderBroadcast)}
      </ul>
    `
  } else {
    return html`
      <p class="feed">
        No broadcasts.
      </p>
    `
  }
}

function renderBroadcast (broadcast) {
  if (!broadcast.content.text) {
    return ''
  }
  return html`
    <li class="update">
      <a href=${getViewProfileURL(broadcast.author)}><img src=${getAvatarURL(broadcast.author, broadcast.authorProfile)} class="avatar" style=${getAvatarStyle(broadcast.author)}/></a>
      <div class="container">
        <div class="metadata">
          <a href=${getViewProfileURL(broadcast.author)} class="name">${broadcast.author.profile.name}</span>
          <a href=${broadcast.url} target="_blank"><span class="date">${niceDate(broadcast.publishTime)}</span></a>
        </div>
        <p class="content">${broadcast.content.text}</p>
      </div>
    </li>
  `
}

function renderFollows (state, emit, site) {
  if (site.following.length) {
    return html`
      <div class="follows">
        ${site.following.map(f => renderFollow(state, emit, f))}
      </div>
    `
  } else {
    return html`
      <p class="follows">
        Not following any sites.
      </p>
    `
  }
}

function renderFollow (state, emit, site) {
  return html`
    <div class="profile">
      <a href=${getViewProfileURL(site)}><img class="avatar" src=${getAvatarURL(site, site.profile)} style=${getAvatarStyle(site)} /></a>
      <div class="profile-info">
        <h1 class="name"><a href=${getViewProfileURL(site)}>${site.profile.name}</a></h1>
        <div class="description">${site.profile.description}</div>
        <p>${renderFollowBtn(state, emit, site)}</p>
      </div>
    </div>
  `
}

function renderProfile (state, emit, site) {
  if (!site) {
    return ''
  }
  var numFollows = site.profile.follows ? site.profile.follows.length : 0
  var isUser = site.url === state.userProfile.url
  return html`
    <div class="profile">
      <a href=${getViewProfileURL(site)}><img class="avatar" src=${getAvatarURL(site, site.profile)} style=${getAvatarStyle(site)} /></a>
      <div class="profile-info">
        <h1 class="name"><a href=${getViewProfileURL(site)}>${site.profile.name}</a></h1>
        <div class="description">
          ${site.profile.description}
          ${isUser ? html`<a href=${getEditProfileURL(site)}>Edit profile</a>` : ''}
        </div>
        ${isUser ? '' : html`<hr />`}
        ${isUser ? '' : html`<p>${renderFollowBtn(state, emit, site)}</p>`}
        <hr />
        <div>Posted <a href=${getViewProfileURL(site)}>${site.numBroadcasts} ${pluralize(site.numBroadcasts, 'broadcast')}</a></div>
        <div>Following <a href=${getViewFollowsURL(site)}>${numFollows} ${pluralize(numFollows, 'site')}</a></div>
        <p><a target="_blank" href=${site.url}><i class="fa fa-external-link"></i> View site</a></p>
      </div>
    </div>
  `
}

function renderProfileEditor (state, emit, site) {
  return html`
    <div class="profile">
      <img class="avatar" src=${getAvatarURL(site, site ? site.profile : false)} />
      <div class="profile-info edit">
        <form onsubmit=${onSubmit}>
          <p>
            <label for="name">Your name</label>
            <input id="name" name="name" type="text" autofocus value=${site ? site.profile.name : ''} />
          </p>
          <p>
            <label for="description">Your bio</label>
            <textarea id="description" name="description" placeholder="Optional">${site ? site.profile.description : ''}</textarea>
          </p>
          <p>
            <a href=${getViewProfileURL(site)} class="btn">Cancel</a>
            <button type="submit" class="btn primary">Save</button>
          </p>
        </form>
      </div>
    </div>
  `

  function onSubmit (e) {
    e.preventDefault()
    emit('update-profile', {
      name: e.target.name.value || '',
      description: e.target.description.value || ''
    })
  }
}

function renderCreateProfilePrompt (state, emit) {
  return html`
    <div>
      <p><a class="link" href="/#new-profile">Create a profile</a></p>
      <p>TODO: explain what Nexus is.</p>
    </div>
  `
}

function renderFollowBtn (state, emit, site) {
  if (site.isFollowed) {
    return html`
      <div><a onclick=${toggleFollow}><i class="fa fa-user-times"></i> Unfollow</a></div>
    `
  } else {
    return html`
      <div><a onclick=${toggleFollow}><i class="fa fa-user-plus"></i> Follow</a></div>
    `
  }

  function toggleFollow () {
    emit('toggle-follow', site)
  }
}

function renderPostForm (state, emit) {
  var textareaCls = state.newPostText ? 'has-content' : ''
  return html`
    <form id="new-post" onsubmit=${onPostSubmit}>
      <textarea class=${textareaCls} placeholder="Post a broadcast" onkeyup=${onChangePostText}>${state.newPostText}</textarea>
      ${state.newPostText ? html`
        <div class="new-post-btns">
          <div>
            ${''/* TODO <button class="btn">Share a file<i class="fa fa-file-text-o"></i></button>
            <button class="btn">Share an image<i class="fa fa-picture-o"></i></button> */}
          </div>
          <div>
            <input type="submit" value="Post to feed" class="btn primary" />
          </div>
        </div>
      ` : ''}
    </form>
  `

  function onChangePostText (e) {
    emit('change-post-text', e.target.value)
  }

  function onPostSubmit (e) {
    e.preventDefault()
    emit('submit-post')
  }
}

// stores
// =

async function profileStore (state, emitter) {
  state.isAppLoaded = false
  state.userProfile = null
  state.currentProfile = null

  emitter.on('pushState', () => {
    // clear page state
    state.currentProfile = null
  })

  emitter.on('load-profile', async ({url, following}) => {
    try {
      state.currentProfile = await readProfile(url, {following})
    } catch (e) {
      state.error = e
    }
    emitter.emit('render')
  })

  emitter.on('toggle-follow', async (site) => {
    try {
      if (site.isFollowed) {
        await state.userProfile.unfollow(site.url)
        site.isFollowed = false
      } else {
        await state.userProfile.follow(site.url)
        site.isFollowed = true
      }
    } catch (e) {
      state.error = e
    }
    emitter.emit('render')
  })

  emitter.on('update-profile', async (values) => {
    try {
      // create the profile if needed 
      const title = `${values.name || 'Unnamed'} (Nexus Profile)`
      const description = 'User profile for Nexus'
      if (!state.userProfile) {
        let archive = await DatArchive.create({title, description})
        setUserProfileURL(archive.url)
        state.userProfile = await readProfile(archive.url, {following: true})
      } else {
        // do the if() because DatArchive.setInfo isnt implemented by beaker yet
        if (state.userProfile.archive.setInfo) {
          await state.userProfile.archive.setInfo({title, description})
        }
      }

      // write the profile
      await state.userProfile.setProfile(values)
      state.userProfile.profile = await state.userProfile.getProfile()
      state.userProfile.follows = state.userProfile.follows || []
      console.log(state.userProfile.profile)
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
      await (new DatArchive(userProfileURL)).stat('/profile.json') // make sure is valid
      state.userProfile = await readProfile(userProfileURL)
    } catch (e) {
      console.error('Failed to load profile', e)
      setUserProfileURL(false)
    }
  }
  if (!state.userProfile) {
    // load suggested profiles on failure
    state.suggestedProfiles = SUGGESTED_PROFILE_URLS.map(url => new ProfileSite(url))
  }
  state.isAppLoaded = true
  emitter.emit('render')

  async function readProfile (url, opts = {}) {
    // TODO caching
    var site = new ProfileSite(url)
    site.profile = await site.getProfile()
    site.profile.follows = site.profile.follows || []
    site.numBroadcasts = (await site.listBroadcasts({metaOnly: true})).length
    site.isFollowed = await getIsFollowed(state, site)
    if (opts.following) {
      site.following = await site.listFollowing()
      site.following.forEach(s => { s.isFollowed = true })
    }
    return site
  }
}

function feedStore (state, emitter) {
  state.error = null
  state.broadcasts = null

  emitter.on('pushState', () => {
    // clear page state
    state.error = null
    state.broadcasts = null
  })

  emitter.on('load-feed', async () => {
    try {
      if (state.userProfile) {
        state.broadcasts = await state.userProfile.listFeed({reverse: true})
      } else {
        state.broadcasts = await listFeed(state.suggestedProfiles, {reverse: true})
      }
    } catch (e) {
      state.error = e
    }
    emitter.emit('render')
  })

  emitter.on('load-broadcasts', async () => {
    try {
      state.broadcasts = await state.currentProfile.listBroadcasts({reverse: true})
    } catch (e) {
      state.error = e
    }
    emitter.emit('render')
  })
}

function newPostStore (state, emitter) {
  state.newPostText = ''
  emitter.on('change-post-text', text => {
    state.newPostText = text
    emitter.emit('render')
  })
  emitter.on('submit-post', async () => {
    try {
      await state.userProfile.broadcast({text: state.newPostText})
      state.userProfile.numBroadcasts++
    } catch (e) {
      console.error(e)
      return
    }

    // clear form
    state.newPostText = ''
    emitter.emit('render')
    emitter.emit('load-feed')
  })
}

// helpers
// =

function getUserProfileURL () {
  return localStorage.userProfileURL
}

function setUserProfileURL (url) {
  localStorage.userProfileURL = url
}

function getAvatarURL (site, profile) {
  if (!site) return ''
  if (profile && typeof profile.image === 'string') {
    if (profile.image.startsWith('/')) {
      return site.url + profile.image
    }
    return profile.image
  }
  return '' // TODO need a fallback image
}

function getAvatarStyle (site) {
  // derive a fallback color from the author's URL (hey, why not)
  const color = site.url.slice('dat://'.length, 'dat://'.length + 6)
  return 'background-color: #' + color
}

function getViewProfileURL (site) {
  if (!site) return ''
  var url = site.url ? site.url : site
  return '/#profile/' + url.slice('dat://'.length)
}

function getEditProfileURL (site) {
  var url = site.url ? site.url : site
  return '/#profile/' + url.slice('dat://'.length) + '/edit'
}

function getViewFollowsURL (site) {
  var url = site.url ? site.url : site
  return '/#profile/' + url.slice('dat://'.length) + '/follows'
}

async function getIsFollowed (state, site) {
  if (state.userProfile && site.url !== state.userProfile.url) {
    return await state.userProfile.isFollowing(site.url)
  }
  return false
}
