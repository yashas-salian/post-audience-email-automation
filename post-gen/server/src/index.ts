import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { imageRouter } from './Routes/Image-gen'

const app = new Hono()

app.use(cors())
app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.route("/",imageRouter)
export default app