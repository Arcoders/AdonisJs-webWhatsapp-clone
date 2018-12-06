import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import Avatar from 'react-user-avatar'

import * as actions from 'actions/'

import Send from 'components/wtsp/right/chat/Send'
import Messages from 'components/wtsp/right/chat/Messages'

import template from 'templates/wtsp/right/chat/chatbox.pug'

class ChatBox extends Component {
    
    state = { 
        showChat: false,
        chatName:  this.props.chatName,
        roomType: this.props.roomType,
        rooms: this.props.chats.chatsList,
        activeRoom: null,
        allMessages: [],
        modal: false,
        photo: null,
        messagePhoto: null,
        onlineUsers: [],
        typing: []
     }

     
    componentDidMount() {

        this.getChatByUserName()

        window.pusher.$on('show_chat', () => {
            let rooms = this.props.chats.chatsList
            this.setState({ rooms })
            this.getChatByUserName()
        })
        window.pusher.$on('down', () => this.scrollDown('chat'))
        
    }

    toggleModal(hide) {
        this.setState({ modal: !this.state.modal })
        if (hide) this.setState({ modal: false })
        this.resetPhoto()
    }

    handleFileChange(e) {
        let files = e.target.files
        let reader = new FileReader()
        reader.readAsDataURL(files[0])
        reader.onload = e => this.setState({ photo: e.target.result, messagePhoto: files[0] })
    }

    resetPhoto() {
        this.setState({ photo: null, messagePhoto: null })
    }

    listenRealTimeMessage(roomName, chatId) {
        
        window.pusher.subscribe(`presence-${roomName}${chatId}`, channel => {
            channel.bind('newMessage', message => this.pushConversation(message))
            channel.bind('pusher:subscription_succeeded', () => this.pushOnlineUsers(channel.members))
            channel.bind('pusher:member_added', () => this.pushOnlineUsers(channel.members))
            channel.bind('pusher:member_removed', () => this.pushOnlineUsers(channel.members))
        })

        window.pusher.subscribe(`typing-${roomName}${chatId}`,  channel => {
            
            channel.bind('typing', user => {
                let typing = this.state.typing
                let found = typing.filter(t => t.id === user.id)
                if (found.length) return
                typing.push(user)
                this.setState({ typing }, () => {
                    window.pusher.$emit('typing', this.state.typing)
                    setTimeout(() => {
                        typing = typing.filter(t => t.id !== user.id)
                        this.setState({ typing }, () => {
                            window.pusher.$emit('typing', this.state.typing)
                        })
                    }, 10000)
                })

            })

        })

    }

    pushOnlineUsers(members) {
        let onlineUsers = this.state.onlineUsers
        members.each(member => {onlineUsers.push(member.info.username)})
        onlineUsers = [...(new Set(onlineUsers))]
        this.setState({ onlineUsers })
    }

    async getMessages() {
        let roomType = this.state.roomType === 'friends' ? 'friend' : 'group'
        await this.props.getMessages(`${roomType}_chat`, this.state.activeRoom.id) 

        if (this.props.room.messagesList.length === 0) return this.welcomeMessage()

        this.setState({ 
            allMessages: this.props.room.messagesList.reverse().map(message => {
                return {
                    id: message.user.id,
                    name: message.user.username,
                    avatar: message.user.avatar,
                    photo: message.photo,
                    text: message.body,
                    time: message.created_at
                }
            })  
        }, () => this.scrollDown('chat')) 
    }

    getChatByUserName() {

        if (Object.keys(this.state.rooms).length) {
            let room = this.props.chats.chatsList[this.state.roomType].find(room => {
                const roomName = (room.user) ? room.user.username : room.name
                return roomName === this.friendName()
            })
            if (!room) return this.props.history.push('/wtsp/')
            let activeRoom = {
                id: room.id,
                name: room.user ?  room.user.username : room.name,
                avatar: room.user ?  room.user.avatar : room.avatar
            }
            this.setState({ activeRoom }, () => {
                this.getMessages()
                let roomName = this.state.roomType === 'friends' ? 'friend' : 'group'
                this.listenRealTimeMessage(`${roomName}_chat`, this.state.activeRoom.id)
        
            })
        }

    }

    friendName() {
        let chatName = this.state.chatName
        return chatName.replace('_', ' ')
    }

    welcomeMessage() {

        let allMessages = [...this.state.allMessages]

        allMessages.push({
            welcome: true,
            id: this.props.auth.authenticated.user.id,
            name: 'h i...',
            avatar: '../../../images/default/welcome.png',
            photo: null,
            text: 'Be the first to greet...',
            time: new Date()
        })

        this.setState({ allMessages })
    }

    pushConversation(data) {
        let allMessages = [...this.state.allMessages]

        let typing = this.state.typing.filter(t => t.id !== data.user.id)
        
        if (allMessages !== 0 && allMessages[0]['welcome']) allMessages.shift()

        allMessages.push({
            id: data.user.id,
            name: data.user.username,
            avatar: data.user.avatar,
            photo: data.photo,
            text: data.body,
            time: data.created_at
        })
        this.setState({ allMessages, typing: typing }, () => {
            this.scrollDown('chat')
            window.pusher.$emit('typing', this.state.typing)
        })
    }

    scrollDown(ref) {
        window.setTimeout( () => {
            if (this.refs[ref]) {
                let elem = this.refs[ref]
                elem.scrollTop = elem.scrollHeight
            }
        }, 500)
    }

    render() {
        return template.call(this, { Avatar, Send, Messages })
    }

}

const mapStateToProps = state => state

export default compose(connect(mapStateToProps, actions))(withRouter(ChatBox))


