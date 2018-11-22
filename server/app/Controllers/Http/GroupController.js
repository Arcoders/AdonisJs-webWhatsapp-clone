'use strict'

const Group = use('App/Models/Group')

class GroupController {

    async groups ({ request, auth, response }) {

        const groups = await Group.getUserGroups(request, auth)

        response.json(groups)

    }

    async create ({ request, auth, response }) {

        const newGroup = await Group.add(request, auth)

        response.json(newGroup)

    }

    async update ({ request, auth, group, response }) {

        const editedGroup = await Group.edit(request, auth, group)

        response.json(editedGroup)

    }

    async destroy ({ auth, group, response }) {

        const removedStatus = await Group.remove(auth, group)

        response.json(removedStatus)

    }

}

module.exports = GroupController
