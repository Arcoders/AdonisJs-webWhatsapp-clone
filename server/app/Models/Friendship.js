'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Model = use('Model')

class Friendship extends Model {

    static scopeWhereSender(query, senderId) {

        return query.where('requester', senderId)

    }

    static scopeWhereRecipient(query, recipientId) {

        return query.where('requested', recipientId)

    }

    static scopeBetweenUsers(query, userId, currentUserId) {

        query.where(function (queryIn) {
            queryIn.where(function(q) {
                q.whereSender(currentUserId).whereRecipient(userId)
            }).orWhere(function(q) {
                q.whereSender(userId).whereRecipient(currentUserId)
            })
        })

    }

    static scopeRooms(query, currentUserId) {

        query.where(function (queryIn) {
            queryIn.where(function(q) {
                q.whereSender(currentUserId).accepted()
            }).orWhere(function(q) {
                q.whereRecipient(currentUserId).accepted()
            })
        })
        .select('id', 'requester', 'requested').with('sender').with('recipient')

    }

    static scopeAccepted(query) {

        return query.where('status', 1)

    }

    sender() {

      return this.belongsTo('App/Models/User', 'requester')

    }

    recipient() {

      return this.belongsTo('App/Models/User', 'requested')

    }

}

module.exports = Friendship
