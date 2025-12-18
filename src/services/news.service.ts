import { prismaClient } from '../utils/prismaClient'
import { CreateNewsInput, NewsData, RequestPaginationQuery } from '../model/news.model'
import { PaginatedResponse } from '../model/pagination.model'
import { getRabbitChannel } from '../utils/rabbitmq'
import { esClient } from '../utils/elasticSearch'

export class NewsService {
  static readonly DEFAULT_LIMIT_PAGINATION = 10
  static readonly DEFAULT_LIMIT_SEARCH = 50

  static async createNews(data: CreateNewsInput): Promise<NewsData> {
    const newNews = await prismaClient.news.create({ data: data })

    const ch = await getRabbitChannel()
    ch.sendToQueue('news_index', Buffer.from(JSON.stringify(newNews)), { persistent: true })

    return this.mapNewsToData(newNews)
  }

  static mapNewsToData(news: any): NewsData {
    return {
      id: news.id,
      title: news.title,
      content: news.content,
      author: news.author,
      source: news.source,
      created_at: news.created_at
    }
  }

  static async getNewsPagination(data: RequestPaginationQuery): Promise<PaginatedResponse<NewsData>> {
    const page = data.page ?? 1
    const limit = data.limit ?? this.DEFAULT_LIMIT_PAGINATION
    const skip = (page - 1) * limit

    const where = data.source ? { source: data.source } : {}

    const [news, total] = await Promise.all([
      prismaClient.news.findMany({ where, skip, take: limit, orderBy: { created_at: 'desc' } }),
      prismaClient.news.count({ where })
    ])

    return { page, limit, total, data: news.map(this.mapNewsToData) }
  }

  static async searchNews(data: { q?: string; filters?: { source?: string; author?: string } }): Promise<NewsData[]> {
    const boolQuery: any = { filter: [], should: [] }

    if (data.q) {
      boolQuery.should.push(
        { match: { title: { query: data.q, boost: 3, fuzziness: 'AUTO' } } },
        { match: { content: { query: data.q, boost: 1, fuzziness: 'AUTO' } } }
      )
    }

    if (data.filters?.source) boolQuery.filter.push({ term: { source: data.filters.source } })
    if (data.filters?.author) boolQuery.filter.push({ term: { author: data.filters.author } })

    const result = await esClient.search({ index: 'news', size: this.DEFAULT_LIMIT_SEARCH, query: { bool: boolQuery } })

    return result.hits.hits.map((res) => this.mapNewsToData(res._source))
  }
}
