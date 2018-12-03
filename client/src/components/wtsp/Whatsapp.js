import React, { Component } from 'react'

import { Route, Switch } from 'react-router-dom'

import Welcome from 'components/wtsp/right/Welcome'
import Profile from 'components/wtsp/right/profile/Profile'
import RightSide from 'components/wtsp/right/RightSide'
import Box from 'components/wtsp/right/chat/Box'
import LeftSide from 'components/wtsp/left/LeftSide'
import Groups from 'components/wtsp/right/groups/Groups'

import AddGroup from 'components/wtsp/right/groups/AddGroup'
import EditGroup from 'components/wtsp/right/groups/EditGroup'
import MyGroups from 'components/wtsp/right/groups/MyGroups'

import requireAuth from 'components/auth/RequireAuth'


class Home extends Component {

    render () {
        return (
            <div className='wrap'>
    
                <div className='left'><LeftSide /></div>
    
                <div className='right'>
                    <RightSide>

                        <Switch>
                            <Route exact path='/wtsp' component={Welcome}/>
                            <Route path='/wtsp/profile/:profileId?' component={Profile}/>
                            <Route path='/wtsp/chats/:roomType/:chatName' component={Box}/>
                            <Route exact path='/wtsp/groups' component={Groups}/>
                            <Route path='/wtsp/groups/add' component={AddGroup}/>
                            <Route path='/wtsp/groups/edit/:groupId' component={EditGroup}/>
                            <Route path='/wtsp/groups/all' component={MyGroups}/>
                            <Route exact path='/wtsp/*' component={Welcome}/>
                        </Switch>

                    </RightSide>
                </div>
    
            </div>
        )
    }

}

export default requireAuth(Home)
