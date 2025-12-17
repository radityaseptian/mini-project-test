const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development'

export const appConfig = {
  environment,
  port: Number(process.env.PORT || 3000),
  isDev: environment === 'development',
}

export const elasticSearchConfig = {
  host: process.env.ELASTIC_HOST!,
  port: Number(process.env.ELASTIC_PORT || 9200),
  username: process.env.ELASTIC_USERNAME!,
  password: process.env.ELASTIC_PASSWORD!,
  url: `http://${process.env.ELASTIC_HOST}:${process.env.ELASTIC_PORT}`,
}

export const rabbitMQConfig = {
  host: process.env.RABBITMQ_HOST!,
  port: Number(process.env.RABBITMQ_PORT || 5672),
  username: process.env.RABBITMQ_USER!,
  password: process.env.RABBITMQ_PASSWORD!,
  url:
    `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}` +
    `@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
}
