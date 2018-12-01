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
        photo: null,
        name: '',
        groupId: this.props.location.pathname.split('/').pop()
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
            this.setState({ selectedOption, name, friends })
        })
        .catch(error => {
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
        let body = {
            name: this.state.name,
            usersId: (this.state.selectedOption) ? this.state.selectedOption.map(ops => ops.value) : [],
        }

        await this.props.editGroup(this.state.groupId, body)

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
        reader.onload = e => this.setState({ photo: e.target.result })
    }

    clearPhoto() {
        this.setState({ photo: null })
    }

    render() {
        return template.call(this, { Avatar, NavLink, Select })
    }

}

const mapStateToProps = state => state

export default compose(connect(mapStateToProps, actions))(withRouter(EditGroup))


