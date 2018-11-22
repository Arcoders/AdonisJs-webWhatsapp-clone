'use strict'

const Message = use('App/Models/Message')

class MessageController {

    async send({ request, auth, response }) {

        const { roomName, chatId, body } = request.all()

        const user = await auth.getUser()

        const message = await Message.create({ 
            body,
            user_id: user.id,
            [roomName]: chatId,
        })

        message.user = user;

        response.json(message)
    }

    async messages ({ params: { roomName, chatId } }) {
        
        const messages = await Message.query().where(roomName, chatId).with('user').orderBy('created_at', 'asc').limit(5).fetch();
        
        return { messages }

    }

}

module.exports = MessageController
