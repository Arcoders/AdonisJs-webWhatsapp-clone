import React, { Component } from 'react'

import Welcome from 'components/wtsp/right/Welcome'
import Profile from 'components/wtsp/right/profile/Profile'
import RightSide from 'components/wtsp/right/RightSide'
import ChatBox from 'components/wtsp/right/chat/ChatBox'
import LeftSide from 'components/wtsp/left/LeftSide'

import requireAuth from 'components/auth/RequireAuth'


class Home extends Component {

    state = { component: (<Welcome />) }

    componentDidMount() {
        this.dinamicComponents()
    }

    dinamicComponents() {
        this.actualRoute()
        this.props.history.listen(location => this.actualRoute(location.pathname))
    }

    actualRoute(location = this.props.history.location.pathname) {
        
        let component = this.state.component

        const profileId = location.split('/').pop()

        if (isNaN(profileId)) {
            
            switch(location) {
                case '/wtsp/profile':
                    component = <Profile />
                    break
                default:
                    component = <Welcome />
            }

        } else {
            component = <Profile profileId={profileId}/>
        }

        const friendChat = location.match(/friends/gi)

        if (friendChat) component = <ChatBox roomType={friendChat[0]} location={location} />

        this.setState({ component })
    }

    render () {
        return (
            <div className='wrap'>
    
                <div className='left'><LeftSide /></div>
    
                <div className='right'><RightSide>{this.state.component}</RightSide></div>
    
            </div>
        )
    }

}

export default requireAuth(Home)
