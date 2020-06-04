'use strict'

const githubRepositories = require('github-repositories')
const { orderBy } = require('lodash')
const { send } = require('micri')

const { GITHUB_USER } = process.env

const ONE_DAY_SECONDS = 86400

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', `max-age=${ONE_DAY_SECONDS}, public`)

  const repos = await githubRepositories(GITHUB_USER)
  return send(res, 200, orderBy(repos, 'stargazers_count', 'desc'))
}
