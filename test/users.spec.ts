import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import { execSync } from 'child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Users Route', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  beforeEach(() => {
    execSync('npm run resetdb')
  })

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
