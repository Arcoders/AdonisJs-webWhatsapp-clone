'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */

const Route = use('Route')

Route.group(() => {

  // Auth ---------------------------------------------------------

  Route.post('auth/register', 'AuthController.register').validator('RegisterUser')
  Route.post('auth/login', 'AuthController.login').validator('LoginUser')

}).prefix('api')


Route.group(() => {

  // Profile ---------------------------------------------------------

  Route.get('/profile', 'UserController.users')
  Route.patch('/profile/:userId', 'ProfileController.edit').validator('EditUser')
  Route.get('/profile/:user', 'ProfileController.getUser').bind('User')

  // Friendship ---------------------------------------------------------

  Route.post('/friends/add/:recipientId', 'FriendShipController.add')
  Route.post('/friends/accept/:senderId', 'FriendShipController.accept')
  Route.delete('/friends/reject/:userId', 'FriendShipController.reject')
  Route.get('/friends/check/:userId', 'FriendShipController.check')
  Route.get('/friends/chats', 'FriendShipController.chats')

}).prefix('api').middleware(['auth'])