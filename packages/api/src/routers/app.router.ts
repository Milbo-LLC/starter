import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { emailRouter } from './email.router'

const t = initTRPC.create()

const publicProcedure = t.procedure
const router = t.router

export const appRouter = router({
  hello: publicProcedure.input(z.string().nullish()).query(({ input }) => {
    return `Hello ${input ?? 'World'}!`
  }),
  email: emailRouter,
})

export type AppRouter = typeof appRouter