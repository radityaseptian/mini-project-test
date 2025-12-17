import express from 'express'
import { NewsController } from '../controllers'

export const newsRouter = express.Router()

newsRouter.post('/news', NewsController.createNews)

newsRouter.get('/news', NewsController.getNewsPagination)

newsRouter.get('/search', NewsController.searchNews)
