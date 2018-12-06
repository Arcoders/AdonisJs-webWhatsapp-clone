import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

import template from 'templates/wtsp/left/search.pug'

class Search extends Component {

    state = { name: '' }

    handleChange(e) {
        this.setState({ name: e.target.value })
    }

    filter() {
        let obj = this.props.chats.chatsList
        if (Object.keys(obj).length) {
            let type = 'friends'
        
            const friends = obj.friends.filter(f => f.user.username.match(new RegExp(this.state.name, 'i')))
            
            const groups = obj.groups.filter(g => g.name.match(new RegExp(this.state.name, 'i')))
            
            type = (groups.length > 0 && groups.length > friends.length) ? 'group' : 'friends'
            
            if (this.state.name === '') type = 'friends'
            
            window.pusher.$emit('filter', { type, friends, groups })
        }
      }

    render() {
        return template.call(this, {})
    }

}

const mapStateToProps = state => state

export default compose(connect(mapStateToProps))(Search)