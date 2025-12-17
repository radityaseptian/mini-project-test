import amqp, { Channel } from 'amqplib'
import { rabbitMQConfig } from './environment'

let channel: Channel | null = null
let connecting: Promise<Channel> | null = null

export async function getRabbitChannel(shouldExit = false): Promise<Channel> {
  if (channel) return channel

  if (!connecting) {
    connecting = (async () => {
      const conn = await amqp.connect(rabbitMQConfig.url)

      conn.on('close', () => {
        console.warn('RabbitMQ closed')
        if (shouldExit) process.exit(1)
        channel = null
        connecting = null
      })

      conn.on('error', (error) => {
        console.error('RabbitMQ error', error)
        if (shouldExit) process.exit(1)
        channel = null
        connecting = null
      })

      const ch = await conn.createChannel()
      channel = ch

      ch.connection.on('error', (err) => {
        console.error('Connection error:', err)
        process.exit(1)
      })

      ch.connection.on('close', () => {
        console.log('Connection closed, exiting...')
        process.exit(1)
      })

      await ch.assertQueue('news_index', { durable: true })

      return ch
    })()
  }

  return connecting
}
