'use strict'

const { test, trait, before } = use('Test/Suite')('Auth')
const Factory = use('Factory')

trait('Test/ApiClient')

test('user can register and is login automatically', async ({ client, assert }) => {
  

  const registerResponse = await client.post('api/auth/register').send({
    email: "skylab@email.com",
    username: "coders",
    password: "secret",
    password_confirmation: "secret"
  }).end()

  registerResponse.assertStatus(200)

  let { jwt } = JSON.parse(registerResponse.text)

  assert.equal(jwt.type, 'bearer');
  assert.typeOf(jwt.token, 'string')

  registerResponse.assertHeader('content-type', 'application/json; charset=utf-8')

  registerResponse.assertJSONSubset({
    user: {
      email:'skylab@email.com',
      username: 'coders'
    }
  })

})


test('user can login', async ({ client, assert }) => {
  
  const user = await Factory.model('App/Models/User').create()

  const loginResponse = await client.post('api/auth/login').send({
    email: user.email,
    password: 'secret',
  }).end()

  loginResponse.assertStatus(200)

  let { jwt } = JSON.parse(loginResponse.text)

  assert.equal(jwt.type, 'bearer');
  assert.typeOf(jwt.token, 'string')

  loginResponse.assertHeader('content-type', 'application/json; charset=utf-8')

  loginResponse.assertJSONSubset({
    user: {
      email: user.email,
      username: user.username
    }
  }) 

})
