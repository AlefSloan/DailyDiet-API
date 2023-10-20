import { fastify } from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoute } from './routes/users'
import { mealsRoute } from './routes/meals'
import { loginRoute } from './routes/login'

export const app = fastify()

app.register(cookie)
app.register(loginRoute, {
  prefix: 'login',
})
app.register(usersRoute, {
  prefix: 'users',
})
app.register(mealsRoute, {
  prefix: 'meals',
})
