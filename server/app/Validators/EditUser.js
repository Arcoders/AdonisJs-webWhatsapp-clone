
'use strict'

class EditUser {
  get rules () {

    const { userId } = this.ctx.params

    return {
      username: `required|max:20|min:3|unique:users,username,id,${userId}`
    }

  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }

}

module.exports = EditUser