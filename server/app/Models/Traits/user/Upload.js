'use strict'

const Env = use('Env')

class Upload {

  register (Model) {
    
    Model.Upload = async (request, type, userId, folder) => {

      const uploaded = request.file(type, { types: ['image'], size: '2mb'})

      if (uploaded) {

        let fileName = `${new Date().getTime()}.${uploaded.subtype}`

        await uploaded.move(`public/upload/${userId}/${folder}/`, {name: fileName})

        return `${Env.get('APP_URL', '')}/upload/${userId}/${folder}/${fileName}`

      }

      return null

    }

  }

}

module.exports = Upload
