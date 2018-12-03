'use strict'

const User = use('App/Models/User')

class ProfileController {

    async getUser ({ user, response }) {
        
        response.json({ user })

    }

    async edit ({ auth, request, params: { userId }, response }) {

        const userEdited = await User.editProfile(request, auth, userId)
        
        response.json(userEdited)

    }

    async users ({ auth, response }) {

        const friends = await User.getRandomUsers(auth)

        response.json(friends)

    }


}

module.exports = ProfileController
