'use strict'

const Message = use('App/Models/Message')


class Crud {

  register (Model) {

    Model.send = async (request, auth) => {

      const user = await auth.getUser()

      const { roomName, chatId, body } = request.all()

      const message = await Message.create({ 
          body,
          user_id: user.id,
          [roomName]: chatId,
      })

      message.user = user

      return { message }

    }

    Model.getMessages = async (params) => {

      const { roomName, chatId } = params

      const messages = await Message.query().where(roomName, chatId).with('user').orderBy('created_at', 'asc').limit(3).fetch();

      return { messages }

    }

  }

}

module.exports = Crud
