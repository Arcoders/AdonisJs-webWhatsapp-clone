import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import event from 'plugins/bus'

import Avatar from 'react-user-avatar'
import ListUsers from 'components/wtsp/right/profile/ListUsers'
import Friendship from 'components/wtsp/right/profile/Friendship'

import template from 'templates/wtsp/right/profile/profile.pug'

class Profile extends Component {

   state = { user: this.props.users.activeUser || this.props.auth.authenticated.user }

    componentDidMount() {
        event.$on('new_user_profile', user => this.setState({ user }))
    }

    render() {
        const isProfile = this.props.history.location.pathname === '/wtsp/profile'
        return template.call(this, { isProfile, Friendship, Avatar, Link, ListUsers })
    }

}

const mapStateToProps = (state) => state


export default compose(connect(mapStateToProps))(withRouter(Profile))


