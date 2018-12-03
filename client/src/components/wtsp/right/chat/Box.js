import React, { Component }  from 'react'

import { withRouter } from 'react-router-dom'

import ChatBox from 'components/wtsp/right/chat/ChatBox'


class Box extends Component {


    render() {
        return <ChatBox key={Math.random()} chatName={this.props.match.params.chatName} roomType={this.props.match.params.roomType}/>
    }

}


export default withRouter(Box)