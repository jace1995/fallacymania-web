import express from 'express'
import * as http from 'http'
import { Server } from 'socket.io'
import { connectApi } from './api'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const publicFolder = process.cwd() + (
  process.env.NODE_ENV === 'production' ?
  '/build' :
  '/public'
)

app.use(express.static(publicFolder))

app.get('/*', ({}, res) => {
  res.sendFile(publicFolder + '/index.html')
})

io.on('connection', connectApi)

server.listen(process.env.PORT ?? 3022, () => {
  console.log('--- Server started ---')
})
