import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

import * as actions from 'actions/'

import Avatar from 'react-user-avatar'
import Moment from 'react-moment'

import template from 'templates/wtsp/right/chat/messages.pug'

class Messages extends Component {
    
    state = { allMessages: this.props.allMessages }

    messageClass(userId) {
        return (this.props.auth.authenticated.user.id === userId)
    }

    render() {
        return template.call(this, { Avatar, Moment })
    }

}

const mapStateToProps = state => state

export default compose(connect(mapStateToProps, actions))(Messages)


