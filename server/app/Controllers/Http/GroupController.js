'use strict'

const Group = use('App/Models/Group')

class GroupController {

    async create ({ auth, request, response }) {

        const user = await auth.getUser()

        const { name, usersId } = request.all();

        const group = await Group.create({ name, user_id: user.id })

        usersId.push(user.id)

        group.users = await group.users().attach((() => [...new Set(usersId)])())

        response.json({
            status: 'Group created successfully', 
            group 
        })


    }

}

module.exports = GroupController
