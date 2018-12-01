import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'

import * as actions from 'actions/'

import AddGroup from 'components/wtsp/right/groups/AddGroup'
import EditGroup from 'components/wtsp/right/groups/EditGroup'
import MyGroups from 'components/wtsp/right/groups/MyGroups'

import template from 'templates/wtsp/right/groups/index.pug'

class Groups extends Component {

    render() {
        return template.call(this, { NavLink, AddGroup, MyGroups, EditGroup})
    }

}

const mapStateToProps = state => state

export default compose(connect(mapStateToProps, actions))(withRouter(Groups))


