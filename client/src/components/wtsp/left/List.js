import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import * as actions from 'actions/'
import pusher from 'plugins/pusher'

import Avatar from 'react-avatar'

import template from 'templates/wtsp/left/list.pug'

class List extends Component {

    async componentDidMount() {
        await this.props.getChats()
        pusher.subscribe(`user${this.props.auth.authenticated.user.id}`, channel => {
            channel.bind('refreshList', async data => {
                await this.props.getChats()
                this.props.toggleChatTo(data)
            })
        })
    }

    render() {
        return template.call(this, { Avatar })
    }

}

const mapStateToProps = state => state

export default compose(connect(mapStateToProps, actions))(List)
