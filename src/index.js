'use strict'

const githubRepositories = require('github-repositories')
const { orderBy } = require('lodash')
const { send } = require('micri')

const { GITHUB_USER } = process.env

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('content-type', 'application/json; charset=utf-8')

  const repos = await githubRepositories(GITHUB_USER)
  return send(res, 200, orderBy(repos, 'stargazers_count', 'desc'))
}
