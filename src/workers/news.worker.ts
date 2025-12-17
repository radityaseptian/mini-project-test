import { Channel, ConsumeMessage } from 'amqplib'
import { esClient } from '../utils/elasticSearch'
import { getRabbitChannel } from '../utils/rabbitmq'

const QUEUE = 'news_index'
console.log('worker starting...')

async function startConsume(ch?: Channel) {
  if (!ch) ch = await getRabbitChannel(true)

  ch.consume(
    QUEUE,
    async (msg: ConsumeMessage | null) => {
      if (!msg) return
      try {
        const data = JSON.parse(msg.content.toString())
        await esClient.index({ index: 'news', id: data.id, document: data })
        ch.ack(msg)
        console.log('Indexed success, id', data.id)
      } catch (err) {
        console.error('Failed indexing, exiting to retry', err)
        process.exit(1)
      }
    },
    { noAck: false }
  )
}

const errorCallback = (error: any) => {
  console.error(error)
  process.exit(1)
}
process.on('SIGTERM', errorCallback)
process.on('SIGINT', errorCallback)
process.on('uncaughtException', errorCallback)
process.on('unhandledRejection', errorCallback)

getRabbitChannel(true).then(startConsume)
