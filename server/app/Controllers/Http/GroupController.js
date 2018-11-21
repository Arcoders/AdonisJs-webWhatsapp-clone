'use strict'

const Group = use('App/Models/Group')

class GroupController {

    async create ({ auth, request, response }) {

        const user = await auth.getUser()

        const { name, usersId } = request.all();
        
        const group = await Group.create({ name, user_id: user.id })

        group.users = await group.users().attach(this.friendsId(usersId, user.id))

        response.json({
            status: 'Group created successfully', 
            group 
        })

    }

    friendsId(usersId, userId) {
        if (!(usersId instanceof Array)) return [userId]
        usersId.push(userId)
        return [...new Set(usersId)]
    }

}

module.exports = GroupController
