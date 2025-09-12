import { Hono } from 'hono'
import { audienceProfileRouter } from './routes/audience-profile'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/",audienceProfileRouter)

export default app
