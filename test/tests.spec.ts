import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import { execSync } from 'child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  beforeEach(() => {
    execSync('npm run resetdb')
  })

  describe('Users Route', () => {
    it('Should create a new user', async () => {
      await request(app.server)
        .post('/users')
        .send({
          email: 'johndoe@example.com',
          password: 'dailydiet',
        })
        .expect(201)
    })

    it('Should be able to list all user', async () => {
      await request(app.server).post('/users').send({
        email: 'johndoe@example.com',
        password: 'dailydiet',
      })

      const listUsersResponse = await request(app.server).get('/users')

      expect(listUsersResponse.body.users).toEqual([
        expect.objectContaining({
          email: 'johndoe@example.com',
        }),
      ])
    })

    it('Should be able to get a specific user', async () => {
      await request(app.server).post('/users').send({
        email: 'johndoe@example.com',
        password: 'dailydiet',
      })

      const listUsersResponse = await request(app.server).get('/users')

      const createdUserId = listUsersResponse.body.users[0].id

      const getUserResponse = await request(app.server).get(
        `/users/${createdUserId}`,
      )

      expect(getUserResponse.body.user).toEqual(
        expect.objectContaining({
          email: 'johndoe@example.com',
        }),
      )
    })
  })

  describe('Login Route', () => {
    it('Should login when given a correct email and password', async () => {
      await request(app.server)
        .post('/users')
        .send({
          email: 'johndoe@example.com',
          password: 'dailydiet',
        })
        .expect(201)

      await request(app.server)
        .post('/login')
        .send({
          email: 'johndoe@example.com',
          password: 'dailydiet',
        })
        .expect(200)
    })
  })

  describe('Meals Route', () => {
    it('Should create a meal', async () => {
      await request(app.server).post('/users').send({
        email: 'johndoe@example.com',
        password: 'dailydiet',
      })

      const loginResponse = await request(app.server).post('/login').send({
        email: 'johndoe@example.com',
        password: 'dailydiet',
      })

      const cookies = loginResponse.get('Set-Cookie')

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send({
          name: 'X-tudo',
          description: 'X-tudo da esquina',
          dateTime: '2023-10-17T08:30:00Z',
          isDiet: false,
        })
        .expect(201)
    })

    it('Should be able to list meals', async () => {
      await request(app.server).post('/users').send({
        email: 'johndoe@example.com',
        password: 'dailydiet',
      })

      const loginResponse = await request(app.server).post('/login').send({
        email: 'johndoe@example.com',
        password: 'dailydiet',
      })

      const cookies = loginResponse.get('Set-Cookie')

      await request(app.server).post('/meals').set('Cookie', cookies).send({
        name: 'X-tudo',
        description: 'X-tudo da esquina',
        dateTime: '2023-10-17T08:30:00Z',
        isDiet: false,
      })

      const mealsListResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)

      expect(mealsListResponse.body.meals).toEqual([
        expect.objectContaining({
          name: 'X-tudo',
          description: 'X-tudo da esquina',
          meal_datetime: '2023-10-17T08:30:00Z',
          is_diet: 0,
        }),
      ])
    })

    it('Should be able to get a specific meal', async () => {
      await request(app.server).post('/users').send({
        email: 'johndoe@example.com',
        password: 'dailydiet',
      })

      const loginResponse = await request(app.server).post('/login').send({
        email: 'johndoe@example.com',
        password: 'dailydiet',
      })

      const cookies = loginResponse.get('Set-Cookie')

      await request(app.server).post('/meals').set('Cookie', cookies).send({
        name: 'X-tudo',
        description: 'X-tudo da esquina',
        dateTime: '2023-10-17T08:30:00Z',
        isDiet: false,
      })

      const mealsListResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)

      const mealId = mealsListResponse.body.meals[0].id

      const getMealsResponse = await request(app.server)
        .get(`/meals/${mealId}`)
        .set('Cookie', cookies)

      expect(getMealsResponse.body.meals).toEqual(
        expect.objectContaining({
          name: 'X-tudo',
          description: 'X-tudo da esquina',
          meal_datetime: '2023-10-17T08:30:00Z',
          is_diet: 0,
        }),
      )
    })

    it('Should be able to update a meal', async () => {
      await request(app.server).post('/users').send({
        email: 'johndoe@example.com',
        password: 'dailydiet',
      })

      const loginResponse = await request(app.server).post('/login').send({
        email: 'johndoe@example.com',
        password: 'dailydiet',
      })

      const cookies = loginResponse.get('Set-Cookie')

      await request(app.server).post('/meals').set('Cookie', cookies).send({
        name: 'X-tudo',
        description: 'X-tudo da esquina',
        dateTime: '2023-10-17T08:30:00Z',
        isDiet: false,
      })

      const mealsListResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)

      const mealId = mealsListResponse.body.meals[0].id

      await request(app.server)
        .put(`/meals/${mealId}`)
        .set('Cookie', cookies)
        .send({
          name: 'X-bacon',
          description: 'X-tudo da esquina',
          dateTime: '2023-10-17T08:30:00Z',
          isDiet: true,
        })

      const updatedMealListResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)

      expect(updatedMealListResponse.body.meals).toEqual([
        expect.objectContaining({
          name: 'X-bacon',
          description: 'X-tudo da esquina',
          meal_datetime: '2023-10-17T08:30:00Z',
          is_diet: 1,
        }),
      ])
    })

    it('Should be able to delete a meal', async () => {
      await request(app.server).post('/users').send({
        email: 'johndoe@example.com',
        password: 'dailydiet',
      })

      const loginResponse = await request(app.server).post('/login').send({
        email: 'johndoe@example.com',
        password: 'dailydiet',
      })

      const cookies = loginResponse.get('Set-Cookie')

      await request(app.server).post('/meals').set('Cookie', cookies).send({
        name: 'X-tudo',
        description: 'X-tudo da esquina',
        dateTime: '2023-10-17T08:30:00Z',
        isDiet: false,
      })

      const mealsListResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)

      const mealId = mealsListResponse.body.meals[0].id

      await request(app.server)
        .delete(`/meals/${mealId}`)
        .set('Cookie', cookies)

      const updatedMealListResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)

      expect(updatedMealListResponse.body.meals).toEqual([])
    })
  })
})
