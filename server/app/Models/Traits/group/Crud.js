'use strict'

const Group = use('App/Models/Group')
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

      const { name, usersId } = request.all();
        
      const group = await Group.create({ name, user_id: user.id })

      group.users = await group.users().attach(this.friendsId(usersId, user.id))

      return {
        status: 'Group created successfully', 
        group 
      }

    }

    Model.edit = async (request, auth, group) => {

      let { usersId } = request.all();

      const user = await auth.getUser()

      Authorization.check(group.user_id, user)

      group.merge(request.only('name'))

      await group.save()
      
      group.users = await group.users().sync(this.friendsId(usersId, user.id))

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

      return { 
        status: 'Group deleted successfully'
      }

    }

  }

  friendsId(usersId, userId) {

    if (!(usersId instanceof Array)) return [userId]

    usersId.push(userId)

    return [...new Set(usersId)]
  }

}

module.exports = Crud
