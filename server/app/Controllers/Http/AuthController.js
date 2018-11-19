'use strict'

const User = use('App/Models/User');

class AuthController {

    async register({ request, auth }) {

        return await User.register(request, auth)

    }

    async login ({ request, auth, response }) {

        const access = await User.login(request, auth)
        
        response.json(access); 
        
    }

}

module.exports = AuthController
