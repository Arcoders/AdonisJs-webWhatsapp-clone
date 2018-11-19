'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FriendshipSchema extends Schema {
  up () {
    this.create('friendships', (table) => {
      table.increments()
      table.integer('requester').notNullable()
      table.integer('requested').notNullable()
      table.integer('status').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('friendships')
  }
}

module.exports = FriendshipSchema
