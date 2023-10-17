import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest'
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
        email: 'johndoe@hotmail.com',
        password: 'dailydiet',
      })
      .expect(201)
  })

  it('', async () => {})

  it('', async () => {})
})
