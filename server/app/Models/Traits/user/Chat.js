'use strict'

const Group = use('App/Models/Group')
const Friendship = use('App/Models/Friendship')
const User = use('App/Models/User')

class Chat {

  register (Model) {

    Model.getUserChats = async (auth) => {

      const user = await auth.getUser()

      const friends = await this.withLastMessage(await User.chats(user.id), Friendship)

      const groups = await this.withLastMessage((await user.groups().fetch()).toJSON(), Group)

      return { friends, groups }

    }

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

module.exports = Chat
