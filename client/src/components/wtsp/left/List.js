import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'
import * as actions from 'actions/'

import pusher from 'plugins/pusher'

import Avatar from 'react-user-avatar'

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

    format(name) {
        return name.replace(' ', '_')
    }

    render() {
        return template.call(this, { Avatar, NavLink })
    }

}

const mapStateToProps = state => state

export default compose(connect(mapStateToProps, actions))(withRouter(List))
