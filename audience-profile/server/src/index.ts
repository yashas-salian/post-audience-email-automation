import { Hono } from 'hono'
import { audiencerouter } from './routes/audprofile.route'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/",audiencerouter)

export default app
