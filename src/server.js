'use strict'

const debug = require('debug-logfmt')('oss')
const { createServer } = require('http')

const port = process.env.PORT || process.env.port || 3000

const server = createServer(require('.'))

server.on('error', err => {
  debug({ status: 'error', message: err.message, trace: err.stack })
  process.exit(1)
})

server.listen(port, async () => {
  const { address, port } = server.address()
  debug({
    status: 'listening',
    pid: process.pid,
    address: `${address}:${port}`
  })
})
