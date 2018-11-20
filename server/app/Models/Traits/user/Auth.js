'use strict'

const User = use('App/Models/User');

class Auth {

  register (Model) {
    
    Model.register = async (request, auth) => {

      const { email, password, username } = request.all();

      await User.create({email, password, username})

      return await Model.login(request, auth)

    }

    Model.login = async (request, auth) => {

      const { email, password } = request.all()

      const jwt = await auth.attempt(email, password)
  
      const user = await Model.getUserBy(email);
      
      return { jwt, user }; 

    }

    Model.getUserBy = async (email) => await User.query().where('email', email).first()


  }

}

module.exports = Auth
