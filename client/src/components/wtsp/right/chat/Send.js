import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

import * as actions from 'actions/'

import template from 'templates/wtsp/right/chat/send.pug'

class Send extends Component {
    
    state = {}

    render() {
        return template.call(this, {})
    }

}

const mapStateToProps = ({ users }) => users

export default compose(connect(mapStateToProps, actions))(Send)


