import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'
import * as actions from 'actions/'

import responsive from 'assets/style'


import Avatar from 'react-user-avatar'
import arraySort from 'array-sort'
import Moment from 'react-moment'

import Preview from 'components/wtsp/left/Preview'

import template from 'templates/wtsp/left/list.pug'

class List extends Component {

    state = { 
            room: {
            friends: [],
            groups: []
        } 
    }

    componentDidMount() {
        
        this.getChats()

        window.pusher.subscribe(`user${this.props.auth.authenticated.user.id}`, channel => {
            channel.bind('refreshList', async data => {
                this.getChats()
                this.props.toggleChatTo(data)
            })
        })

        window.pusher.$on('filter', (data) => {

            let room = {
                friends: data.friends,
                groups: data.groups
            }

            this.setState({ room })

        })

    }

    async getChats() {
        
        await this.props.getChats()

        this.setState({ 
            room: {
                friends: arraySort(this.props.chats.chatsList.friends, 'message.created_at').reverse(),
                groups: arraySort(this.props.chats.chatsList.groups, 'message.created_at').reverse()
            }
        }, () => {
            this.listenRooms(this.state.room.friends.map(friend => friend.id), 'friend_chat', 'friends')
            this.listenRooms(this.state.room.groups.map(groups => groups.id), 'group_chat', 'groups')
        })
        
    }

    listenRooms(object, type, roomType) {

        object.forEach(id => {

            window.pusher.subscribe(`${type}${id}`, channel => {
                channel.bind('updatePreviewMessage', message => {
                    this.setPreviewMessageAndPushUp({ message, type: roomType })
                })
            })

        })
    }

    setPreviewMessageAndPushUp(data) {
        const chatType = (data.type === 'friends') ? 'friend_chat' : 'group_chat'
        let friends = Object.assign({}, this.state.room)
        let i = friends[data.type].findIndex(room => room.id === Number(data.message[chatType]))
        if (i < 0) return
        let room = friends[data.type][i]
        room.message = data.message
        friends[data.type].splice(i, 1)
        friends[data.type].splice(friends[data.type].filter(room => !room.message).length, 0, room)
        this.setState({ room: friends })
    }

    format(name) {
        return name.replace(' ', '_')
    }

    render() {
        return template.call(this, { responsive, Avatar, NavLink, Moment, Preview })
    }

}

const mapStateToProps = state => state

export default compose(connect(mapStateToProps, actions))(withRouter(List))
