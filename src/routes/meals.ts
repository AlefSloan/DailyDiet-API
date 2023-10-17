import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { checkUserIdExists } from '../middlewares/check-userId-exists'

export async function mealsRoute(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (req) => {
      const userId = req.cookies.userId

      const meals = await knex('meals').select().where({ user_id: userId })

      return { meals }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (req) => {
      const userId = req.cookies.userId

      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(req.params)

      const meals = await knex('meals').select().where({ user_id: userId, id })

      return { meals }
    },
  )

  app.post(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (req, res) => {
      const createMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isDiet: z.boolean(),
        dateTime: z.string().datetime(),
      })

      const { name, description, isDiet, dateTime } =
        createMealsBodySchema.parse(req.body)

      const userId = req.cookies.userId

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        is_diet: isDiet,
        meal_datetime: dateTime,
        user_id: userId,
      })

      res.status(201).send()
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (req, res) => {
      const putMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = putMealsParamsSchema.parse(req.params)

      const putMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isDiet: z.boolean(),
        dateTime: z.string().datetime(),
      })

      const { name, description, isDiet, dateTime } = putMealsBodySchema.parse(
        req.body,
      )

      await knex('meals').where({ id }).update({
        name,
        description,
        is_diet: isDiet,
        meal_datetime: dateTime,
        updated_at: new Date().toISOString(),
      })

      res.status(204).send()
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (req, res) => {
      const deleteMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = deleteMealsParamsSchema.parse(req.params)

      await knex('meals').where({ id }).del()

      res.status(204).send()
    },
  )

  app.get(
    '/metrics',
    {
      preHandler: [checkUserIdExists],
    },
    async () => {},
  )
}
