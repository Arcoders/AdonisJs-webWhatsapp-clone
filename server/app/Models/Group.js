'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Model = use('Model')

class Group extends Model {

    static boot () {
        super.boot()
        this.addTrait('group/Crud')
    }

    users() {

        return this.belongsToMany('App/Models/User')
    
    }

    messages() {

        return this.hasMany('App/Models/Message', 'id', 'group_chat')
    
    }


}

module.exports = Group
