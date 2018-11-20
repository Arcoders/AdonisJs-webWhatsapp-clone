'use strict'

class Profile {

  register (Model) {

    Model.editProfile = async (request, auth) => {

      const user = await auth.getUser()

      const { username } = request.all();

      user.merge({ username })

      await user.save()

      return { 
        status: 'User edited successfully',
        user
      }

    }

  }

}

module.exports = Profile
