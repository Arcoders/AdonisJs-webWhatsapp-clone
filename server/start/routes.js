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

  Route.get('/profile', 'ProfileController.users')
  Route.patch('/profile/:userId', 'ProfileController.edit').validator('EditUser')
  Route.get('/profile/:user', 'ProfileController.getUser').bind('User')

  // Friendship ---------------------------------------------------------

  Route.post('/friends/add/:recipientId', 'FriendShipController.add')
  Route.post('/friends/accept/:senderId', 'FriendShipController.accept')
  Route.delete('/friends/reject/:userId', 'FriendShipController.reject')
  Route.get('/friends/check/:userId', 'FriendShipController.check')

  // Chats ---------------------------------------------------------

  Route.get('/chats', 'ChatController.chats')

  // Groups ---------------------------------------------------------
  
  Route.post('groups/create', 'GroupController.create').validator('ManageGroup')
  Route.patch('groups/:group', 'GroupController.update').validator('ManageGroup').bind('Group')
  Route.delete('groups/:group', 'GroupController.destroy').bind('Group')  
  Route.get('groups', 'GroupController.groups')
  Route.get('groups/get/:group', 'GroupController.group').bind('Group')

  // Messages ---------------------------------------------------------

  Route.get('messages/:roomName/:chatId', 'MessageController.messages');
  Route.post('messages/send', 'MessageController.send')
  Route.post('messages/typing', 'MessageController.typing')

  // Pusher Auth ---------------------------------------------------------

  Route.post('pusher', 'PusherAuthController.auth')
  Route.get('pusher/:channel_name', 'PusherAuthController.onlineUsers')

}).prefix('api').middleware(['auth'])