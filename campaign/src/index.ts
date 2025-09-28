import { Hono } from 'hono'
import { campaignRouter } from './routes/campaign'
import { cors } from "hono/cors"

const app = new Hono()

app.use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/",campaignRouter)
export default app
