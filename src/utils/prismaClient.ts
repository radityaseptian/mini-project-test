import { PrismaClient } from '@prisma/client'

export const prismaClient = new PrismaClient({
  log: [{ emit: 'event', level: 'error' }],
})

prismaClient.$on('error', console.error)
