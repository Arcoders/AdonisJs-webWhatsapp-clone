'use strict'

const User = use('App/Models/User')
const Authorization = use('App/Services/Authorization')

class Profile {

  register (Model) {

    Model.editProfile = async (request, auth, userId) => {

      const user = await auth.getUser()

      Authorization.check(userId, user)

      const { username, description } = request.all();

      let avatar = await User.Upload(request, 'avatarUploaded', user.id, 'avatars/profile')
      let cover = await User.Upload(request, 'coverUploaded', user.id, 'covers/profile')

      if (avatar) user.avatar = avatar
      if (cover) user.cover = cover
      user.username = username
      user.description = description

      await user.save()

      return { status: 'User edited successfully', user }

    }

    Model.getRandomUsers = async (auth) => {

      const user = await auth.getUser()

      const friendsId = await User.friends(user.id, 'justIds')

      const friends = await User.query().whereNotIn('id', friendsId.concat([user.id])).limit(20).fetch()

      return { friends }

    }

  }

}

module.exports = Profile
