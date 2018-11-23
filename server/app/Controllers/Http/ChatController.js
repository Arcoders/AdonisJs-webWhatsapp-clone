'use strict'

const User = use('App/Models/User')

class ChatController {

    async chats ({ auth, response }) {

        const chats = await User.getUserChats(auth)

        response.json(chats)

    }

}

module.exports = ChatController
