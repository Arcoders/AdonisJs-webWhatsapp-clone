import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

import Avatar from 'react-user-avatar'
import ListUsers from 'components/wtsp/right/profile/ListUsers'

import template from 'templates/wtsp/right/profile/profile.pug'

class Profile extends Component {

    render() {
        const isProfile = this.props.history.location.pathname === '/wtsp/profile'
        return template.call(this, { isProfile, Avatar, Link, ListUsers })
    }

}

const mapStateToProps = ({ auth: authenticated }) => authenticated

export default compose(connect(mapStateToProps))(withRouter(Profile))


