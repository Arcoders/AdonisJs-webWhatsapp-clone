import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import * as actions from 'actions/'

import Avatar from 'react-user-avatar'
import ListUsers from 'components/wtsp/right/profile/ListUsers'
import Friendship from 'components/wtsp/right/profile/Friendship'
import EditProfile from 'components/wtsp/right/profile/EditProfile'

import template from 'templates/wtsp/right/profile/profile.pug'

class Profile extends Component {

   state = { 
       user: this.props.users.activeUser || this.props.auth.authenticated.user,
       editProfile: false
     }

    componentDidMount() {

        this.getProfileById()
        window.pusher.$on('new_user_profile', user => this.setState({ user }))
        window.pusher.$on('avatarUploaded', avatarSrc => {
            let user = Object.assign({}, this.state.user)
            user.avatar = avatarSrc
            this.setState({ user })
        })
        window.pusher.$on('coverUploaded', coverSrc => {
            let user = Object.assign({}, this.state.user)
            user.cover = coverSrc
            this.setState({ user })
        })
        window.pusher.$on('username', username => {
            let user = Object.assign({}, this.state.user)
            user.username = username || '!'
            this.setState({ user })
        })
        window.pusher.$on('description', description => {
            let user = Object.assign({}, this.state.user)
            user.description = description
            this.setState({ user })
        })
    }

    toggleEdit() {
        this.setState({ 
            user: this.props.auth.authenticated.user,
            editProfile: !this.state.editProfile
         })
    }

    getProfileById() {
        if (this.props.match.params.profileId) this.props.getUserById(this.props.match.params.profileId)
    }

    render() {
        const isProfile = this.props.history.location.pathname === '/wtsp/profile'
        return template.call(this, { isProfile, Friendship, Avatar, Link, ListUsers, EditProfile })
    }

}

const mapStateToProps = (state) => state

export default compose(connect(mapStateToProps, actions))(withRouter(Profile))


