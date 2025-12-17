import { Request, Response, NextFunction } from 'express'
import { NewsService } from '../services/index'
import { NewsSource } from '../model/news.model'
import z from 'zod'

export class NewsController {
  static async createNews(req: Request, res: Response, next: NextFunction) {
    try {
      const createNewsSchema = z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        author: z.string().min(1),
        source: z.enum(NewsSource)
      })

      const payload = createNewsSchema.parse(req.body)

      const news = await NewsService.createNews(payload)

      res.status(201).json({ status: 'ok', message: 'News stored and queued', id: news.id })
    } catch (error) {
      next(error)
    }
  }

  static async getNewsPagination(req: Request, res: Response, next: NextFunction) {
    try {
      const getNewsPaginationSchema = z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(50).default(10),
        source: z.enum(NewsSource).optional()
      })

      const payload = getNewsPaginationSchema.parse(req.query)

      const news = await NewsService.getNewsPagination(payload)

      res.status(200).json(news)
    } catch (error) {
      next(error)
    }
  }

  static async searchNews(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        q: z.string().optional(),
        source: z.enum(NewsSource).optional(),
        author: z.string().optional()
      })

      const parsed = schema.parse(req.query)

      const result = await NewsService.searchNews({
        q: parsed.q,
        filters: { source: parsed.source, author: parsed.author }
      })

      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}
