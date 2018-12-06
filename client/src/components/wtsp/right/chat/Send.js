import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

import * as actions from 'actions/'
import axios from 'plugins/axios'

import template from 'templates/wtsp/right/chat/send.pug'

class Send extends Component {
    
    state = {
        message: '',
        typing: false
    }

    async sendForm(event) {
        event.preventDefault()

        let formData = new FormData()
        formData.append('roomName', `${this.props.roomType}_chat`)
        formData.append('chatId', this.props.chatId)
        formData.append('body', this.state.message)
        if (this.props.messagePhoto) formData.append('messagePhoto', this.props.messagePhoto)
        await this.props.sendMessage(formData)
        this.props.toggleModal(true)
        this.setState({ message: '', typing: false })

    }

    handleMessage(event) {
        if (this.state.message.length >= 1) {
            if (!this.state.typing) this.usersTyping();
            this.setState({ message: '', typing: true })
        } else {
            this.setState({ typing: false })
        }
        this.setState({ message: event.target.value})
    }

    usersTyping() {
        axios().post('/messages/typing', { roomName: this.props.roomType, chatId: this.props.chatId })
    }

    render() {
        return template.call(this, {})
    }

}

const mapStateToProps = ({ users }) => users

export default compose(connect(mapStateToProps, actions))(Send)


