'use strict'

const Group = use('App/Models/Group')
const User = use('App/Models/User')
const Event = use('Event')
const Env = use('Env')

const Authorization = use('App/Services/Authorization')

class Crud {

  register (Model) {

    Model.getUserGroups = async (request, auth) => {

      const user = await auth.getUser()

      const groups = await Group.query().where('user_id', user.id).paginate(request.input('page'), 3)

      return { groups }

    }

    Model.add = async (request, auth) => {

      const user = await auth.getUser()

      const { name, usersId } = request.all()

      const avatarUploaded = request.file('avatarUploaded', {
        types: ['image'],
        size: '2mb'
      })

      let avatar = null

      if (avatarUploaded) {
        avatar = `${new Date().getTime()}.${avatarUploaded.subtype}`
        await avatarUploaded.move(`public/upload/${user.id}/avatars/groups/`, {name: avatar})
      }

      if (avatar) avatar = `${Env.get('APP_URL', '')}/upload/${user.id}/avatars/groups/${avatar}`
        
      const group = await Group.create({ name, user_id: user.id, avatar })

      group.users = await group.users().attach(this.friendsId(usersId, user.id))

      this.notifyUsers(usersId)

      return {
        status: 'Group created successfully', 
        group 
      }

    }

    Model.edit = async (request, auth, group) => {

      let { usersId, avatarStatus } = request.all();

      const user = await auth.getUser()

      Authorization.check(group.user_id, user)

      const avatarUploaded = request.file('avatarUploaded', {
        types: ['image'],
        size: '2mb'
      })

      if (avatarUploaded) {
        let avatar = `${new Date().getTime()}.${avatarUploaded.subtype}`
        await avatarUploaded.move(`public/upload/${user.id}/avatars/groups/`, {name: avatar})
        group.avatar = `${Env.get('APP_URL', '')}/upload/${user.id}/avatars/groups/${avatar}`
      }

      if (avatarStatus === 'none') group.avatar = null
        
      group.merge(request.only('name'))

      await group.save()
      
      const friendsId = this.friendsId(usersId, user.id)
      const old = (await group.users().fetch()).toJSON().map(user => user.id)

      group.users = await group.users().sync(friendsId)

      this.notifyEditedUsers(old, friendsId)

      return {
        status: 'Group updated successfully', 
        group
      }

    }

    Model.remove = async (auth, group) => {

      const user = await auth.getUser()

      Authorization.check(group.user_id, user)

      await group.users().detach()
      await group.delete()

      this.notifyUsers(usersId)

      return { 
        status: 'Group deleted successfully'
      }

    }

    Model.getGroup = async (auth, group) => {

      const user = await auth.getUser()

      Authorization.check(group.user_id, user)

      group.users = await group.users().fetch()

      const friends = await User.friends(user.id)

      return { group, friends }

    }

  }

  friendsId(usersId, userId) {

    if (typeof usersId === 'string') usersId = usersId.split(',').map(id => Number(id))

    if (!(usersId instanceof Array)) return [userId]

    usersId.push(userId)

    return [...new Set(usersId)]
  }

  async notifyEditedUsers(old, news) {

    const allUsers = old.filter(x => !news.includes(x)).concat(news)

    for (const userId of allUsers) await Event.fire('group', userId)

}

  async notifyUsers(usersId) {
    for (const userId of usersId) await Event.fire('group', userId)
  }

}

module.exports = Crud
