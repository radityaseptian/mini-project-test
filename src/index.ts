import http from 'http'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import { appConfig } from './utils/environment'
import { newsRouter } from './router'
import { errorMiddleware } from './middleware/error.middleware'
import { getRabbitChannel } from './utils/rabbitmq'

const app = express()

app.use(cors({ origin: '*', optionsSuccessStatus: 200 }))
app.use(morgan('dev'))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('OK'))
app.use('/api', newsRouter)
app.use(errorMiddleware)

const server = http.createServer(app)

const main = async () => {
  const ch = await getRabbitChannel()

  server.listen(appConfig.port, () => {
    console.info(`Environment: ${appConfig.environment} - Port: ${appConfig.port}`)
  })
}

const errorCallback = (error: any) => {
  console.error(error)
  process.exit(1)
}
process.on('SIGTERM', errorCallback)
process.on('SIGINT', errorCallback)
process.on('uncaughtException', errorCallback)
process.on('unhandledRejection', errorCallback)

main()
