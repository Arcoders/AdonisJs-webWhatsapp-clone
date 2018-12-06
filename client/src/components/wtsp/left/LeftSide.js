import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import * as actions from 'actions/'

import Avatar from 'react-user-avatar'

import Search from 'components/wtsp/left/Search'
import List from 'components/wtsp/left/List'
import template from 'templates/wtsp/left/index.pug'

import responsive from 'assets/style'

import 'components/wtsp/left/fix.css'

class LeftSide extends Component {

    componentDidMount() {
        window.pusher.$on('filter', data => this.props.toggleChatTo(data))
    }

    render() {
        const button = {
            friends: this.props.chats.toggleStatus ? 'active' : null,
            groups: this.props.chats.toggleStatus ? null : 'active'
        }
        return template.call(this, { responsive, button ,Search, Avatar, List, NavLink })
    }

}

const mapStateToProps = state => state

export default compose(connect(mapStateToProps, actions))(withRouter(LeftSide))
