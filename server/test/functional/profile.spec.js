'use strict'

const { test, trait } = use('Test/Suite')('Profile')

const User = use('App/Models/User')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')


test('user can get the profile of another user', async ({ client }) => {

  const ismael = await Factory.model('App/Models/User').create()
  const haytam = await Factory.model('App/Models/User').create()

  const getHaytamProfile = await client.get(`api/profile/${haytam.id}`).loginVia(ismael).end()

  getHaytamProfile.assertStatus(200)

  getHaytamProfile.assertJSONSubset({
    user: {
      id: haytam.id,
      email: haytam.email,
      username: haytam.username
    }
  })

  const getIsmaelProfile = await client.get(`api/profile/${ismael.id}`).loginVia(haytam).end()

  getIsmaelProfile.assertStatus(200)

  getIsmaelProfile.assertJSONSubset({
    user: {
      id: ismael.id,
      email: ismael.email,
      username: ismael.username
    }
  })
})


test('user can edit his profile', async ({ client }) => {

  const user = await Factory.model('App/Models/User').create()

  const newUserInfo = { username: 'John Doe'}

  const profileEdited = await client.patch(`api/profile/${user.id}`).send(newUserInfo).loginVia(user).end()

  profileEdited.assertStatus(200)

  profileEdited.assertJSONSubset({
    status: 'User edited successfully',
    user: {
      id: user.id,
      email: user.email,
      username: 'John Doe'
    }
  })

})

test('user can not change their username to another that already exists', async ({ client }) => {

  const marta = await Factory.model('App/Models/User').create()
  const victor = await Factory.model('App/Models/User').create()

  const newMartaInfo = { username: victor.username}

  const profileEdited = await client.patch(`api/profile/${marta.id}`).send(newMartaInfo).loginVia(marta).end()

  profileEdited.assertStatus(422)

  profileEdited.assertJSONSubset([
    {
      message: 'unique validation failed on username',
      field: 'username',
      validation: 'unique'
    }
  ])

})

test('user can not change their username to another that already exists', async ({ client }) => {

  const marta = await Factory.model('App/Models/User').create()
  const victor = await Factory.model('App/Models/User').create()

  const newMartaInfo = { username: victor.username}

  const profileEdited = await client.patch(`api/profile/${marta.id}`).send(newMartaInfo).loginVia(marta).end()

  profileEdited.assertStatus(422)

  profileEdited.assertJSONSubset([
    {
      message: 'unique validation failed on username',
      field: 'username',
      validation: 'unique'
    }
  ])

})

test('the user can not edit another user\'s profile', async ({ client }) => {

  const marta = await Factory.model('App/Models/User').create()
  const victor = await Factory.model('App/Models/User').create()

  const newMartaInfo = { username: 'Doe John'}

  const unauthorized = await client.patch(`api/profile/${victor.id}`).send(newMartaInfo).loginVia(marta).end()

  unauthorized.assertStatus(403)

  unauthorized.assertJSON({
    error: 'Invalid access to resource...'
  })

})
