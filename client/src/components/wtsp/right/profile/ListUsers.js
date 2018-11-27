import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import * as actions from 'actions/'

import Avatar from 'react-user-avatar'

import template from 'templates/wtsp/right/profile/listUsers.pug'

class ListUsers extends Component {


    componentDidMount() {
        this.listUsers()
    }

    async listUsers() {
        await this.props.getUsers()
    }

    render() {
        return template.call(this, { Avatar })
    }

}

const mapStateToProps = ({ users }) => users

export default compose(connect(mapStateToProps, actions))(ListUsers)


