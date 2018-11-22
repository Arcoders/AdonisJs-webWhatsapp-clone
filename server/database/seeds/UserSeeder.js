'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')

class UserSeeder {
  async run () {
    
    // .................................................................

    const ismael = await Factory.model('App/Models/User').create({
      email: 'Arcoders@gmail.com',
      username: 'Ismael Haytam',
    })

    const marta = await Factory.model('App/Models/User').create({
      email: 'Marta@gmail.com',
      username: 'Marta Lopez',
    })

    const victor = await Factory.model('App/Models/User').create({
      email: 'Victor@gmail.com',
      username: 'Victor Crack',
    })

    
    await Factory.model('App/Models/Friendship').create({
      requester: marta.id,
      requested: ismael.id,
      status: 0
    })

    await Factory.model('App/Models/Friendship').create({
      requester: ismael.id,
      requested: victor.id,
      status: 0
    })

    await Factory.model('App/Models/Friendship').create({
      requester: victor.id,
      requested: marta.id,
      status: 0
    })

    // ..................................................................

    const users = await Factory.model('App/Models/User').createMany(15)

    for (const user of users) {

      const group = await Factory.model('App/Models/Group').create({
        user_id: user.id
      })

      await group.users().attach([user.id, ismael.id])

      const friendship = await Factory.model('App/Models/Friendship').create({
        requester: ismael.id,
        requested: user.id,
        status: 1
      })

      
      await Factory.model('App/Models/Message').createMany(5, {
        user_id: (Math.random() > 0.5) ? ismael.id : user.id,
        friend_chat: friendship.id,
      })
      
    }

    // ....................................................................

    const arcoders = await Factory.model('App/Models/Group').create({
      name: 'Arcoders',
      user_id: ismael.id,
    })

    await arcoders.users().attach([ismael.id, marta.id])

    await Factory.model('App/Models/Message').create({
      user_id: ismael.id,
      group_chat: arcoders.id
    })

    const fustal = await Factory.model('App/Models/Group').create({
      name: 'Fustal Girona',
      user_id: ismael.id,
    })

    await fustal.users().attach([ismael.id, marta.id, victor.id])

    const javascript = await Factory.model('App/Models/Group').create({
      name: 'Javascript',
      user_id: ismael.id,
    })

    await javascript.users().attach([ismael.id, marta.id, victor.id])

    const tecno = await Factory.model('App/Models/Group').create({
      name: 'Tecnología',
      user_id: marta.id,
    })

    await tecno.users().attach([marta.id, ismael.id])

  }
}

module.exports = UserSeeder
