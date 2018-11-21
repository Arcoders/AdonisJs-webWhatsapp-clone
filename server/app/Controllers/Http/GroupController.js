'use strict'

const Group = use('App/Models/Group')
const Authorization = use('App/Services/Authorization')


class GroupController {

    async groups ({ auth, request, response }) {

        const user = await auth.getUser()

        const groups = await Group.query().where('user_id', user.id).paginate(request.input('page'), 3)

        response.json({ groups })

    }

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

    async update ({ auth, request, group, response }) {

        let { usersId } = request.all();

        const user = await auth.getUser()

        Authorization.check(group.user_id, user)

        group.merge(request.only('name'))

        await group.save()
        
        group.users = await group.users().sync(this.friendsId(usersId, user.id))

        response.json({
            status: 'Group updated successfully', 
            group
        })

    }

    async destroy ({ group, auth }) {

        const user = await auth.getUser()

        Authorization.check(group.user_id, user)

        await group.users().detach()
        await group.delete()

        return { status: 'Group deleted successfully' }

    }

    friendsId(usersId, userId) {
        if (!(usersId instanceof Array)) return [userId]
        usersId.push(userId)
        return [...new Set(usersId)]
    }

}

module.exports = GroupController
