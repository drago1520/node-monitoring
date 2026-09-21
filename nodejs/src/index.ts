import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { trace } from '@opentelemetry/api'

const app = new Hono()

app.onError((err, c) => {
  trace.getActiveSpan()?.recordException(err)
  if (err instanceof HTTPException) return err.getResponse()
  console.error(err)
  return c.text('Internal Server Error', 500)
})

app.get('/', async (c) => {
  const user = await (await fetch('https://randomuser.me/api/')).json()
  console.log(user)
  return c.text(`Hello ${user.results[0].name.first}`)
})

app.get('/error', c => {
  throw new Error('Test otel errors')
})

//prettier-ignore
serve({
  fetch: app.fetch,
  port: 3000
}, info => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
