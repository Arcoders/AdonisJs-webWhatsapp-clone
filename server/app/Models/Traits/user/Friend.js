'use strict'
const Friendship = use('App/Models/Friendship')
const renameKeys = use('rename-keys');
const Event = use('Event')

class Friend {
  register (Model) {

    Model.addFriend = async (recipientId, currentUserId) => {

      let status = await Model.checkFriendship(recipientId, currentUserId)
      
      if (status === 'not_friends') {
        
        await Friendship.create({ requester: currentUserId, requested: recipientId, status: 0 })

        await Event.fire('requestSent', { userId: recipientId, currentUserId })

        return 'waiting'

      }

      return status

    }


    Model.acceptFriend = async (senderId, currentUserId) => {
      
      const status = await Model.checkFriendship(senderId, currentUserId)

      if (status === 'pending') {

        await Friendship.query().betweenUsers(senderId, currentUserId).update({ status: 1 })

        return 'friends'

      }

      return status

    }


    Model.rejectFriendship = async (userId, currentUserId) => {

      const status = await Model.checkFriendship(userId, currentUserId)

      if (status !== 'not_friends') {

        await Friendship.query().betweenUsers(userId, currentUserId).delete()

        return 'not_friends'

      }

      return status

    }


    Model.checkFriendship = async (userId, currentUserId) => {

      if (currentUserId == userId) return 'same_user'
      
      const friendship = await Friendship.query().betweenUsers(userId, currentUserId).first()

      if (!friendship) return 'not_friends'

      if (friendship['status'] === 1) return 'friends'

      if (friendship['requester'] === currentUserId) return 'waiting'

      if (friendship['requested'] === currentUserId) return 'pending'

    }


    Model.areFriends = async (userId, currentUserId) => {

      return await Model.checkFriendship(userId, currentUserId) === 'friends'
      
    }


    Model.chats = async (currentUserId) => {
   
      const rooms = (await Friendship.query().rooms(currentUserId).fetch()).toJSON()

      let result = []

      for (let room of rooms)  result.push(this.changeKeys(this.removeSameUser(room, currentUserId)))

      return result

    }


    Model.chatsId = async (currentUserId) => {

      return (

        await Friendship.query().whereSender(currentUserId).accepted().pluck('id')
     
      ).concat(

        await Friendship.query().whereRecipient(currentUserId).accepted().pluck('id')
      
      )

    }


    Model.friends = async (currentUserId, ids = null) => {

      const rooms = (await Friendship.query().rooms(currentUserId).fetch()).toJSON()

      let result = []

      for (let room of rooms) result.push(this.changeKeys(this.removeSameUser(room, currentUserId)).user)

      if (ids === 'justIds') return result.map(user => user.id)

      return result

    }


  }

  changeKeys(obj) {

    return renameKeys(obj, key => (key === 'sender' || key === 'recipient') ? 'user' : key)

  }

  removeSameUser(obj, authId) {

    (obj.sender.id === authId)? delete obj.sender: delete obj.recipient

    return obj

  }


}

module.exports = Friend