'use strict'

const Message = use('App/Models/Message')
const Event = use('Event')

class Crud {

  register (Model) {

    Model.send = async (request, auth) => {

      const user = await auth.getUser()

      const { roomName, chatId, body } = request.all()

      const message = await Message.create({ body, user_id: user.id, [roomName]: chatId })

      message.user = user

      await Event.fire('message', { message, room: `${roomName}${chatId}`})

      return { message }

    }

    Model.getMessages = async (params) => {

      const { roomName, chatId } = params

      const messages = await Message.query().where(roomName, chatId).with('user').orderBy('created_at', 'desc').limit(8).fetch();

      return { messages }

    }

  }

}

module.exports = Crud
