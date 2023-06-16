'use strict'

const githubRepositories = require('github-repositories')
const { isEmpty, orderBy } = require('lodash')
const debug = require('debug-logfmt')('oss')
const pTimeout = require('p-timeout')
const pReflect = require('p-reflect')
const send = require('send-http')

const { REQ_TIMEOUT, GITHUB_USER, ONE_DAY_SECONDS } = require('./constants')

let CACHE = Object.create(null)

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('content-type', 'application/json; charset=utf-8')

  const cacheControl = `public, must-revalidate, max-age=${ONE_DAY_SECONDS}, s-maxage=${ONE_DAY_SECONDS}, stale-while-revalidate=60`
  res.setHeader('cache-control', cacheControl)
  res.setHeader('cdn-cache-control', cacheControl)

  const { isFulfilled, value, reason } = await pReflect(
    pTimeout(githubRepositories(GITHUB_USER), REQ_TIMEOUT)
  )

  if (isFulfilled && !isEmpty(value)) {
    CACHE = orderBy(value, 'stargazers_count', 'desc')
  }

  if (!isEmpty(CACHE)) return send(res, 200, CACHE)

  debug.error(reason.message || reason)
  return send(res, 400)
}
