import { Client } from '@elastic/elasticsearch'
import { elasticSearchConfig } from './environment'

export const esClient = new Client({
  node: elasticSearchConfig.url,
  auth: {
    username: elasticSearchConfig.username,
    password: elasticSearchConfig.password,
  },
})
