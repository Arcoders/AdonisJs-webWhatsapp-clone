import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

import * as actions from 'actions/'

import template from 'templates/wtsp/right/chat/send.pug'

class Send extends Component {
    
    state = {
        message: '',
    }

    async sendForm(event) {
        event.preventDefault()
        let body = {
            roomName: `${this.props.roomType}_chat`,
            chatId: this.props.chatId,
            body: this.state.message
        }
        await this.props.sendMessage(body)
        this.setState({ message: '' })

    }

    handleMessage(event) {
        this.setState({ message: event.target.value})
    }

    render() {
        return template.call(this, {})
    }

}

const mapStateToProps = ({ users }) => users

export default compose(connect(mapStateToProps, actions))(Send)


