
'use strict'

class RegisterUser {
  
  get rules () {
    
    return {
      email: 'required|email|unique:users,email',
      username: 'required|max:20|unique:users,username',
      password: 'required|min:6|confirmed',
    }

  }

  async fails (errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }

}

module.exports = RegisterUser