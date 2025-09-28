import { Hono } from 'hono'
import { audienceProfileRouter } from './routes/audience-profile'
import { cors } from "hono/cors"
const app = new Hono()

app.use(cors())
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/",audienceProfileRouter)

export default app
