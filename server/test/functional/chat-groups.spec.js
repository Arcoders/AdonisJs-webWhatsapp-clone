'use strict'

const { test, trait } = use('Test/Suite')('Groups Chats')

const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')


test('get chat groups with the last message of the conversation', async ({ client }) => {

  const berto = await Factory.model('App/Models/User').create({ username: 'Berto Romero' })
  const david = await Factory.model('App/Models/User').create({ username: 'David Alva' })

  // Group 1

  const react = (await Factory.model('App/Models/Group').create({
    name: 'React',
    user_id: berto.id
  }))

  await react.users().attach([berto.id, david.id])

  await Factory.model('App/Models/Message').create({
    user_id: berto.id,
    group_chat: react.id
  })

  const react_message = await Factory.model('App/Models/Message').create({
    user_id: david.id,
    group_chat: react.id
  })

  // Group 2

  const angular = await Factory.model('App/Models/Group').create({
    name: 'Angular',
    user_id: berto.id
  })

  await angular.users().attach([berto.id])

  const angular_message = await Factory.model('App/Models/Message').create({
    user_id: berto.id,
    group_chat: angular.id
  })

  // Login as Berto and get groups


  const bertoGroups = await client.get('api/chats').loginVia(berto).end()

  bertoGroups.assertStatus(200)

  bertoGroups.assertJSONSubset({
    groups: [
      {
        name: react.name,
        user_id: react.user_id,
        message: {
          body: react_message.body,
          group_chat: react.id,
          user_id: david.id
        }
      },
      {
        name: angular.name,
        user_id: angular.user_id,
        message: {
          body: angular_message.body,
          group_chat: angular.id,
          user_id: berto.id
        }
      }
    ]
  })

})


test('verify that the group does not contain messages', async ({ client }) => {

  const anna = await Factory.model('App/Models/User').create()


  const group = await Factory.model('App/Models/Group').create({
    user_id: anna.id
  })

  await group.users().attach([anna.id])

  const annaGroups = await client.get('api/chats').loginVia(anna).end()

  annaGroups.assertStatus(200)

  annaGroups.assertJSONSubset({
    groups: [
      {
        name: group.name,
        user_id: group.user_id,
        message: null
      }
    ],
  })

})