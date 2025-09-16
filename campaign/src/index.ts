import { Hono } from 'hono'
import { campaignRouter } from './routes/campaign'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/",campaignRouter)
export default app
