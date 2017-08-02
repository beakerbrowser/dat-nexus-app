/* globals localStorage */

const moment = require('moment')

exports.pluralize = function (num, base, suffix = 's') {
  if (num === 1) { return base }
  return base + suffix
}

exports.niceDate = function (ts, opts) {
  const endOfToday = moment().endOf('day')
  if (typeof ts === 'number') { ts = moment(ts) }
  if (ts.isSame(endOfToday, 'day')) {
    if (opts && opts.noTime) { return 'today' }
    return ts.fromNow()
  } else if (ts.isSame(endOfToday.subtract(1, 'day'), 'day')) { return 'yesterday' } else if (ts.isSame(endOfToday, 'month')) { return ts.fromNow() }
  return ts.format('ll')
}

exports.getUserProfileURL = function () {
  return localStorage.userProfileURL
}

exports.setUserProfileURL = function (url) {
  localStorage.userProfileURL = url
}

exports.getAvatarUrl = function (profile) {
  if (profile && profile.avatar) {
    return profile._origin + profile.avatar
  }
  return ''
}

exports.getAvatarStyle = function (profile) {
  // derive a fallback color from the author's URL (hey, why not)
  const color = profile._origin.slice('dat://'.length, 'dat://'.length + 6)
  return 'background-color: #' + color
}

exports.getViewProfileURL = function (profile) {
  if (!profile) return ''
  var url = profile._origin ? profile._origin : profile
  return '/#profile/' + url.slice('dat://'.length)
}

exports.getEditProfileURL = function (profile) {
  var url = profile._origin ? profile._origin : profile
  return '/#profile/' + url.slice('dat://'.length) + '/edit'
}

exports.getViewFollowsURL = function (profile) {
  var url = profile._origin ? profile._origin : profile
  return '/#profile/' + url.slice('dat://'.length) + '/follows'
}

exports.getViewBroadcastURL = function (broadcast) {
  console.log('broadcast url', broadcast._url)
  return '/#broadcast/' + broadcast._url.slice('dat://'.length)
}

exports.getIsFollowed = async function (state, profile) {
  if (state.userProfile && profile._origin !== state.userProfile._origin) {
    return await state.DB().isFollowing(state.userProfile._origin, profile._origin)
  }
  return false
}
