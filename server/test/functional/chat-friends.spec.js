'use strict'

const { test, trait } = use('Test/Suite')('List Of Chats')

const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')


test('get private chat with the last message of the conversation', async ({ client }) => {

  const ismael = await Factory.model('App/Models/User').create({ username: 'Ismael Haytam' })
  const victor = await Factory.model('App/Models/User').create({ username: 'Victor Crack' })


  const chat = await Factory.model('App/Models/Friendship').create({
    requester: ismael.id,
    requested: victor.id,
    status: 1
  })

  await Factory.model('App/Models/Message').create({
    user_id: ismael.id,
    friend_chat: chat.id
  })

  const message = await Factory.model('App/Models/Message').create({
    user_id: victor.id,
    friend_chat: chat.id
  })
  

  const ismaelChats = await client.get('api/chats').loginVia(ismael).end()

  ismaelChats.assertStatus(200)

  ismaelChats.assertJSONSubset({
    friends: [
      {
        requested: victor.id,
        user: {
          id: victor.id,
          email: victor.email,
          username: victor.username
        },
        message: {
          body: message.body,
          friend_chat: chat.id,
          user_id: victor.id
        }
      }
    ]
  })

})



test('verify that there is no conversation between users', async ({ client }) => {

  const marta = await Factory.model('App/Models/User').create({ username: 'Marta Lopez' })
  const fatima = await Factory.model('App/Models/User').create({ username: 'Fatima Chadli' })

  await Factory.model('App/Models/Friendship').create({
    requester: marta.id,
    requested: fatima.id,
    status: 1
  })
  
  const fatimaChats = await client.get('api/chats').loginVia(fatima).end()

  fatimaChats.assertStatus(200)

  fatimaChats.assertJSONSubset({
    friends: [
      {
        requester: marta.id,
        user: {
          id: marta.id,
          email: marta.email,
          username: marta.username
        },
        message: null
      }
    ],
  })

})