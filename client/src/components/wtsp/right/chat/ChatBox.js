import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

import Avatar from 'react-user-avatar'

import * as actions from 'actions/'

import event from 'plugins/bus'
import pusher from 'plugins/pusher'

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
        onlineUsers: []
     }

     
    componentDidMount() {

        this.getChatByUserName()

        event.$on('show_chat', () => {
            let rooms = this.props.chats.chatsList
            this.setState({ rooms })
            this.getChatByUserName()
        })
    }

    toggleModal() {
        this.setState({ modal: !this.state.modal })
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
        pusher.subscribe(`presence-${roomName}${chatId}`, channel => {
            channel.bind('newMessage', message => this.pushConversation(message))
            channel.bind('pusher:subscription_succeeded', () => this.pushOnlineUsers(channel.members))
            channel.bind('pusher:member_added', () => this.pushOnlineUsers(channel.members))
            channel.bind('pusher:member_removed', () => this.pushOnlineUsers(channel.members))
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
        }) 
    }

    getChatByUserName() {

        if (Object.keys(this.state.rooms).length) {
            let room = this.props.chats.chatsList[this.state.roomType].find(room => {
                const roomName = (room.user) ? room.user.username : room.name
                return roomName === this.friendName()
            })
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

    pushConversation(data) {
        let allMessages = [...this.state.allMessages]
        allMessages.push({
            id: data.user.id,
            name: data.user.username,
            avatar: data.user.avatar,
            photo: data.photo,
            text: data.body,
            time: data.created_at
        })
        this.setState({ allMessages })
    }


    render() {
        return template.call(this, { Avatar, Send, Messages })
    }

}

const mapStateToProps = state => state

export default compose(connect(mapStateToProps, actions))(ChatBox)


