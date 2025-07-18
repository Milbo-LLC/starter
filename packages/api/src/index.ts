import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { appRouter, type AppRouter } from './routers'
import { trpcServer } from '@hono/trpc-server'
import { cors } from "hono/cors";
import { auth } from './lib/auth';


const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null
  }
}>();

// Global CORS middleware for all routes
app.use("*", cors({
  origin: ["http://localhost:3000"],
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
}));

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

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

export { appRouter };
export type { AppRouter };
