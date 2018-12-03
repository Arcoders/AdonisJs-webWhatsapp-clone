'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */

const Factory = use('Factory')

Factory.blueprint('App/Models/User', (faker, i, data) => {
  
  return {
    email: (data.email) ? data.email : faker.email(),
    username: (data.username) ? data.username : faker.username(),
    password: 'secret',
    avatar: (data.withoutAvatar) ? null : `https://api.adorable.io/avatars/285/${faker.last()}.png`,
    cover: `https://source.unsplash.com/random?refresh=${Math.random()}-${Date.now()}`
  }

})


Factory.blueprint('App/Models/Friendship', async (faker, i, data) => {

  const requester =  (data.requester) ? data.requester : await Factory.model('App/Models/User').create().id
  const requested = (data.requested) ? data.requested : await Factory.model('App/Models/User').create().id
  const status = (data.status) ? data.status : 0

  return { requester, requested, status }

})


Factory.blueprint('App/Models/Group', async (faker, i, data) => {

  const user_id = (data.user_id) ? data.user_id : await Factory.model('App/Models/User').create().id
  const name = (data.name) ? data.name : faker.name()
  const avatar = (data.avatar) ? data.avatar : `https://api.adorable.io/avatars/285/${faker.last()}.png`

  return { name, avatar, user_id }

})


Factory.blueprint('App/Models/Friendship', async (faker, i, data) => {

  const requester =  (data.requester) ? data.requester : await Factory.model('App/Models/User').create().id
  const requested = (data.requested) ? data.requested : await Factory.model('App/Models/User').create().id
  const status = (data.status) ? data.status : 0

  return { requester, requested, status }

})


Factory.blueprint('App/Models/Message', async (faker, i, data) => {

  const user_id =  (data.user_id) ? data.user_id : await Factory.model('App/Models/User').create().id
  const friend_chat = (data.friend_chat) ? data.friend_chat : null
  const group_chat = (data.group_chat) ? data.group_chat : null
  const body = faker.sentence({ words: 5 })
  const photo = (Math.random() > 0.3) ? null : `https://source.unsplash.com/random?refresh=${Math.random()}-${Date.now()}`
  
  return { user_id, friend_chat, group_chat, body, photo  }

})