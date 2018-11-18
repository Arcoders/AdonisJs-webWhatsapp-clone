'use strict'

const User = use('App/Models/User');

class AuthController {

    async register({ request }) {

        const { email, password, username } = request.all();

        await User.create({email, password, username})

        return this.login(...arguments)

    }

    async login ({ request, auth, response }) {

        const { email, password } = request.all()

        const token = await auth.attempt(email, password)
    
        const user = await this.getUserBy(email);
        
        response.json({ token, user });
        
    }

    async getUserBy(email) {

        return await User.query().where('email', email).first()

    }

}

module.exports = AuthController
