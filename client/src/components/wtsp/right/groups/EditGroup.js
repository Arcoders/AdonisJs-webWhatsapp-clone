import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'

import axios from 'plugins/axios'

import * as actions from 'actions/'

import Avatar from 'react-user-avatar'
import Select from 'react-select'



import template from 'templates/wtsp/right/groups/editGroup.pug'

class EditGroup extends Component {
    
    state = {
        selectedOption: null,
        friends: [],
        avatar: null,
        avatarStatus: null,
        photoUploaded: null,
        name: '',
        groupId: this.props.match.params.groupId,
        invalid: false
    }

    componentDidMount() {
        this.getGroup()
    }

    getGroup() {
        return axios().get(`groups/get/${this.state.groupId}`)
        .then(({data}) => {
            let selectedOption = data.group.users.map(user => {
                return {
                    label: user.username,
                    value: user.id
                }
            })
            selectedOption = selectedOption.filter(ops => this.props.auth.authenticated.user.id !== ops.value)
            let friends = data.friends.map(friend => {
                return {
                    label: friend.username,
                    value: friend.id
                }
            })
            let name = data.group.name
            let avatar = data.group.avatar
            this.setState({ selectedOption, name, friends, avatar, avatarStatus: (data.group.avatar) ? 'yes' : 'none' })
        })
        .catch((error) => {
            let payload = 'An error has occurred'
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('auth')
                window.location.href = '/signin'
            }
            if (error.response && error.response.status === 422) payload = error.response.data.shift().message

            if (error.response && error.response.status === 403) payload = error.response.data.error
            
            window.pusher.$emit('notificate', { message: payload, type: 'error'})
            this.props.history.push('/wtsp')
        })   

    }

    setFriends(obj = this.props.chats.chatsList) {
        if (Object.keys(obj).length) {
            let friends = obj.friends.map(friend => {
                return {
                    label: friend.user.username,
                    value: friend.user.id
                }
            })
            this.setState({ friends })
        }
    }

    async sendForm(event) {
        event.preventDefault()

        let formData = new FormData()
        formData.append('name', this.state.name)
        formData.append('usersId', (this.state.selectedOption) ? this.state.selectedOption.map(ops => ops.value) : [])
        formData.append('avatarStatus', this.state.avatarStatus)
        if (this.state.photoUploaded) formData.append('avatarUploaded', this.state.photoUploaded)
        await this.props.editGroup(this.state.groupId, formData)

    }

    componentWillReceiveProps(nextProps) {
        if (Object.keys(this.props.chats.chatsList).length !== Object.keys(nextProps.chats.chatsList).length) this.setFriends(nextProps.chats.chatsList)
    }

    handleChange = (selectedOption) => {
        this.setState({ selectedOption })
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value}, () => this.setState({ invalid: (this.state.name.length < 3) }))
    }

    handleFileChange(e) {
        let files = e.target.files
        let reader = new FileReader()
        if (files.length) {
            reader.readAsDataURL(files[0])
            reader.onload = e => {
                this.setState({ avatar: e.target.result, photoUploaded: files[0], avatarStatus: 'yes' })
            }
        }
    }

    clearPhoto() {
        this.setState({ avatar: null, photoUploaded: null, avatarStatus: 'none' })
    }

    render() {
        return template.call(this, { Avatar, NavLink, Select })
    }

}

const mapStateToProps = state => state

export default compose(connect(mapStateToProps, actions))(withRouter(EditGroup))


