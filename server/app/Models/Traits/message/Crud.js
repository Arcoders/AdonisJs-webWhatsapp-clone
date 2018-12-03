'use strict'

const Message = use('App/Models/Message')
const Event = use('Event')
const Env = use('Env')

class Crud {

  register (Model) {

    Model.send = async (request, auth) => {

      const user = await auth.getUser()

      const { roomName, chatId, body } = request.all()

      const messagePhoto = request.file('messagePhoto', {
        types: ['image'],
        size: '2mb'
      })

      let photo = null

      if (messagePhoto) {
        photo = `${new Date().getTime()}.${messagePhoto.subtype}`
        await messagePhoto.move(`public/upload/${user.id}/messages/`, {name: photo})
      }

      if (photo) photo = `${Env.get('APP_URL', '')}/upload/${user.id}/messages/${photo}`

      const message = await Message.create({ body, user_id: user.id, [roomName]: chatId, photo })

      message.user = user

      await Event.fire('message', { message, room: `${roomName}${chatId}`})

      console.log(`${roomName}${chatId}`)

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
