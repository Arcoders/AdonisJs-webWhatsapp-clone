'use strict'

const User = use('App/Models/User')
const Group = use('App/Models/Group')
const Friendship = use('App/Models/Friendship')


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

        const friends = await this.withLastMessage(await User.chats(user.id), Friendship)

        const groups = await this.withLastMessage((await user.groups().fetch()).toJSON(), Group)

        response.json({ friends, groups })

    }

    async withLastMessage(chats, Model) {

        let result = []

        for (const i of Object.keys(chats)) {
        
            const msg = await (await Model.find(chats[i].id)).messages().orderBy('id', 'desc').first()

            result.push({ ...chats[i], ...{message: msg} })

        }

        return result

    }

}

module.exports = FriendShipController
