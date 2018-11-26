import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import * as actions from 'actions/'

import Avatar from 'react-avatar'

import Search from 'components/wtsp/left/Search'
import List from 'components/wtsp/left/List'
import template from 'templates/wtsp/left/index.pug'


import 'components/wtsp/left/fix.css'

class LeftSide extends Component {

    render() {
        const button = {
            friends: this.props.toggleStatus ? 'active' : null,
            groups: this.props.toggleStatus ? null : 'active'
        }
        return template.call(this, { button ,Search, Avatar, List, NavLink })
    }

}

const mapStateToProps = ({ chats }) => chats

export default compose(connect(mapStateToProps, actions))(withRouter(LeftSide))
