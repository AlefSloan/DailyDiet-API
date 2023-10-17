import { FastifyInstance } from 'fastify'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { knex } from '../database'

export async function usersRoute(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users').select('id', 'email')

    return { users }
  })

  app.get('/:id', async (req) => {
    const getUserParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = getUserParamsSchema.parse(req.params)

    const user = await knex('users').select('id', 'email').where({ id }).first()

    return { user }
  })

  app.post('/', async (req, res) => {
    const createUsersBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = createUsersBodySchema.parse(req.body)

    const id = randomUUID()

    await knex('users').insert({
      id,
      email,
      password,
    })

    res.cookie('userId', id, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    res.status(201).send()
  })
}
