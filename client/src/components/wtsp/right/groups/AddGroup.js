import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

import * as actions from 'actions/'

import Avatar from 'react-user-avatar'
import Select from 'react-select'



import template from 'templates/wtsp/right/groups/addGroup.pug'

class AddGroup extends Component {
    
    state = {
        selectedOption: null,
        friends: [],
        photo: null,
        photoUploaded: null,
        name: ''
    }

    componentDidMount() {
        this.setFriends()
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
        if (this.state.photoUploaded) formData.append('avatarUploaded', this.state.photoUploaded)

        await this.props.addGroup(formData)
        this.setState({ name: '', selectedOption: null, photo: null, photoUploaded: null })

    }

    componentWillReceiveProps(nextProps) {
        if (Object.keys(this.props.chats.chatsList).length !== Object.keys(nextProps.chats.chatsList).length) this.setFriends(nextProps.chats.chatsList)
    }

    handleChange = (selectedOption) => {
        this.setState({ selectedOption })
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value})
    }

    handleFileChange(e) {
        let files = e.target.files
        let reader = new FileReader()
        reader.readAsDataURL(files[0])
        reader.onload = e => this.setState({ photo: e.target.result, photoUploaded: files[0] })
    }

    clearPhoto() {
        this.setState({ photo: null })
    }

    render() {
        return template.call(this, { Avatar, NavLink, Select })
    }

}

const mapStateToProps = state => state

export default compose(connect(mapStateToProps, actions))(AddGroup)


