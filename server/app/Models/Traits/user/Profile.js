'use strict'

const User = use('App/Models/User')
const Env = use('Env')


class Profile {

  register (Model) {

    Model.editProfile = async (request, auth) => {

      const user = await auth.getUser()

      const { username } = request.all();

      const avatarUploaded = request.file('avatarUploaded', {
        types: ['image'],
        size: '2mb'
      })

      const coverUploaded = request.file('coverUploaded', {
        types: ['image'],
        size: '2mb'
      })

      let avatar = null
      let cover = null

      if (avatarUploaded) {
        avatar = `${new Date().getTime()}.${avatarUploaded.subtype}`
        await avatarUploaded.move(`public/upload/${user.id}/avatars/profile/`, {name: avatar})
      }

      if (avatar) user.avatar = `${Env.get('APP_URL', '')}/upload/${user.id}/avatars/profile/${avatar}`

      if (coverUploaded) {
        cover = `${new Date().getTime()}.${coverUploaded.subtype}`
        await coverUploaded.move(`public/upload/${user.id}/covers/profile/`, {name: cover })
      }

      if (cover) user.cover = `${Env.get('APP_URL', '')}/upload/${user.id}/covers/profile/${cover}`

      user.username = username

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
