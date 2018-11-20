'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */

const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()
    this.addTrait('user/Auth')
    this.addTrait('user/Friend')
    this.addTrait('user/Profile')

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  groups() {

    return this.belongsToMany('App/Models/Group')

  }

  static get hidden() {
    return ['password']
  }

}

module.exports = User
