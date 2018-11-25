import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import * as actions from 'actions/'

import Avatar from 'react-avatar'

import template from 'templates/wtsp/left/list.pug'

class List extends Component {

    async componentDidMount() {
        await this.props.getChats()
    }

    render() {
        const friends = false
        return template.call(this, { friends, Avatar })
    }

}

const mapStateToProps = ({ chats }) => chats

export default compose(connect(mapStateToProps, actions))(List)
