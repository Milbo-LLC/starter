import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { appRouter } from './routers/app.router.js'
import { trpcServer } from '@hono/trpc-server'
import { cors } from "hono/cors";

const app = new Hono()

// Global CORS middleware for all routes
app.use("*", cors({
  origin: ["http://localhost:3000"],
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
}));

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
  })
);

serve({
  fetch: app.fetch,
  port: 3042
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
