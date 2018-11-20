'use strict'

const User = use('App/Models/User')

class FriendShipController {

    async add({ auth, params: { recipientId }, response }) {

        const currentUser = await auth.getUser()

        const status = await User.addFriend(recipientId, currentUser.id);

        response.json({ status }) 

    }

    async accept({ auth, params: { senderId }, response }) {

        const currentUser = await auth.getUser()

        const status = await User.acceptFriend(senderId, currentUser.id);

        response.json({ status })

    }

    async reject({ auth, params: { userId }, response }) {

        const currentUser = await auth.getUser()

        const status = await User.rejectFriendship(userId, currentUser.id);

        response.json({ status }) 

    }

    async check({ auth, params: { userId }, response }) {

        const currentUser = await auth.getUser()

        const status = await User.checkFriendship(userId, currentUser.id)

        response.json({ status })

    }

    async chats ({ auth, response }) {

        const user = await auth.getUser()

        const friends = await User.chats(user.id)

        response.json({ friends })

    }

}

module.exports = FriendShipController
