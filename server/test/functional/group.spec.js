'use strict'

const { test, trait } = use('Test/Suite')('Group')

const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')

test('user can create and add friends to the group', async ({ client }) => {

  const admin = await Factory.model('App/Models/User').create()
  const user = await Factory.model('App/Models/User').create()

  // Create group
  
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

