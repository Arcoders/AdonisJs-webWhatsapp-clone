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

/** @type {import('@adonisjs/lucid/src/Factory')} */

const Factory = use('Factory')

class UserSeeder {
  async run () {

    // .................................................................

    const ismael = await Factory.model('App/Models/User').create({
      email: 'arcoders@gmail.com',
      username: 'Ismael Haytam',
    })

    const marta = await Factory.model('App/Models/User').create({
      email: 'marta@gmail.com',
      username: 'Marta Lopez',
    })

    const victor = await Factory.model('App/Models/User').create({
      email: 'victor@gmail.com',
      username: 'Victor Crack',
    })

    
    await Factory.model('App/Models/Friendship').create({
      requester: marta.id,
      requested: ismael.id,
      status: 1
    })

    await Factory.model('App/Models/Friendship').create({
      requester: ismael.id,
      requested: victor.id,
      status: 1
    })

    await Factory.model('App/Models/Friendship').create({
      requester: victor.id,
      requested: marta.id,
      status: 1
    })


  }
}

module.exports = UserSeeder
