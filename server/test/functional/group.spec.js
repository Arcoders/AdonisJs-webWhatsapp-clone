'use strict'

const { test, trait } = use('Test/Suite')('Group')

const Group = use('App/Models/Group')

const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')

test('user can create and add friends to the group', async ({ client }) => {

  const admin = await Factory.model('App/Models/User').create()
  const user = await Factory.model('App/Models/User').create()
  
  const postData = {
    name: 'Adonis',
    usersId: [admin.id, user.id]
  }

  const groupCreated = await client.post('api/groups/create').send(postData).loginVia(admin).end()

  groupCreated.assertStatus(200)

  groupCreated.assertJSONSubset({
    status: 'Group created successfully',
    group: {
      name: 'Adonis',
      user_id: admin.id,
      users: [
        {
          user_id: admin.id
        }, 
        {
          user_id: user.id
        }
      ]
    } 
  })

})



test('group name is required', async ({ client }) => {

  const admin = await Factory.model('App/Models/User').create()
  
  const rejected = await client.post('api/groups/create').send({}).loginVia(admin).end()

  rejected.assertStatus(422)

  rejected.assertJSONSubset([
    {
      message: 'required validation failed on name',
      field: 'name',
      validation: 'required'
    }
  ])

})

test('user can edit his group', async ({ client }) => {

  const admin = await Factory.model('App/Models/User').create()
  const friend = await Factory.model('App/Models/User').create()
  
  const group = await Factory.model('App/Models/Group').create({
    user_id: admin.id
  })

  const postData = {
    name: 'React',
    usersId: [friend.id]
  }

  const groupUpdated = await client.patch(`api/groups/${group.id}`).send(postData).loginVia(admin).end()

  groupUpdated.assertStatus(200)

  groupUpdated.assertJSONSubset({
    status: 'Group updated successfully',
    group: {
      name: 'React',
      user_id: admin.id,
      users: [
        {
          user_id: admin.id
        },
        {
          user_id: friend.id
        },
      ]
    } 
  })

})


test('user can not edit a group that does not belong to him', async ({ client }) => {

  const admin = await Factory.model('App/Models/User').create()
  const friend = await Factory.model('App/Models/User').create()
  
  const group = await Factory.model('App/Models/Group').create({
    user_id: admin.id
  })

  const postData = {
    name: group.name,
    usersId: [friend.id]
  }

  const unauthorized = await client.patch(`api/groups/${group.id}`).send(postData).loginVia(friend).end()

  unauthorized.assertStatus(403)

  unauthorized.assertJSON({
    error: 'Invalid access to resource...'
  })

})

test('user can not edit a group that does not belong to him', async ({ client }) => {

  const admin = await Factory.model('App/Models/User').create()
  const friend = await Factory.model('App/Models/User').create()
  
  const group = await Factory.model('App/Models/Group').create({
    user_id: admin.id
  })

  const postData = {
    name: group.name,
    usersId: [friend.id]
  }

  const unauthorized = await client.patch(`api/groups/${group.id}`).send(postData).loginVia(friend).end()

  unauthorized.assertStatus(403)

  unauthorized.assertJSON({
    error: 'Invalid access to resource...'
  })

})

test('user can delete his group', async ({ client, assert }) => {

  const admin = await Factory.model('App/Models/User').create()
  
  const group = await Factory.model('App/Models/Group').create({
    user_id: admin.id
  })

  const createdGroup = await Group.findBy('name', group.name)

  assert.equal(group.name, createdGroup.name)
  assert.equal(group.user_id, createdGroup.user_id)

  const deletedStatus = await client.delete(`api/groups/${group.id}`).loginVia(admin).end()

  deletedStatus.assertStatus(200)

  deletedStatus.assertJSON({
    status: 'Group deleted successfully',
  })

  const tryToGetDeletedGroup = await Group.findBy('name', group.name)
  assert.typeOf(tryToGetDeletedGroup, 'null')

})

test('user can not delete a group that does not belong to him', async ({ client }) => {

  const admin = await Factory.model('App/Models/User').create()
  const friend = await Factory.model('App/Models/User').create()
  
  const group = await Factory.model('App/Models/Group').create({
    user_id: admin.id
  })

  const unauthorized = await client.delete(`api/groups/${group.id}`).loginVia(friend).end()

  unauthorized.assertStatus(403)

  unauthorized.assertJSON({
    error: 'Invalid access to resource...'
  })

})