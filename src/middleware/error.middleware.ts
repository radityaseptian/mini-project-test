import { Response, Request, NextFunction } from 'express'
import { ZodError } from 'zod'
import { ResponseError } from '../utils/errors'

export async function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ZodError) {
    res.status(422).json({ status: 'error', message: 'Validation error' })
  } else if (error instanceof ResponseError) {
    res.status(error.status).json({ status: 'error', message: error.message, data: error.body })
  } else {
    console.error(error)
    res.status(500).json({ status: 'error', message: 'Internal Server Error' })
  }
}
