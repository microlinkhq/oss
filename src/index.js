'use strict'

const githubRepositories = require('github-repositories')
const pTimeout = require('p-timeout')
const pReflect = require('p-reflect')
const { orderBy } = require('lodash')
const { send } = require('micri')

const { REQ_TIMEOUT, GITHUB_USER, ONE_DAY_SECONDS } = process.env

let CACHE = {}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader(
    'cache-control',
    `public, must-revalidate, max-age=${ONE_DAY_SECONDS}, s-maxage=${ONE_DAY_SECONDS}, stale-while-revalidate=60`
  )

  const { isFulfilled, value } = await pReflect(
    pTimeout(githubRepositories(GITHUB_USER), REQ_TIMEOUT)
  )

  if (isFulfilled) CACHE = orderBy(value, 'stargazers_count', 'desc')

  return send(res, 200, CACHE)
}
