import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function loginRoute(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const loginBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = loginBodySchema.parse(req.body)

    const user = await knex('users').where({ email, password }).select().first()

    res.cookie('userId', user.id, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    res.status(200).send()
  })
}
