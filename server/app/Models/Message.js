'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Model = use('Model')

class Message extends Model {

    static boot () {
        super.boot()
        this.addTrait('message/Crud')
    }

    user() {

        return this.belongsTo('App/Models/User')
  
      }

}

module.exports = Message
