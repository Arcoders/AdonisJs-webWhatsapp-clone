import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

import * as actions from 'actions/'

import axios from 'plugins/axios'

import Avatar from 'react-user-avatar'

import Paginate from 'components/wtsp/right/groups/Paginate'

import template from 'templates/wtsp/right/groups/myGroups.pug'

class Groups extends Component {
    
    state = {
        groups: null
    }

    componentDidMount() {
        this.getGroups()
    }

    getGroups(page = 1) {
        return axios().get(`/groups?page=${page}`)
            .then(({data}) => {
                this.setState({ groups: data.groups })
            })
            .catch(error => console.log(error)) 
    }

    deleteGroup(id) {
        return axios().delete(`/groups/${id}`)
            .then(() => {
                let page = (this.state.groups.data.length === 1) ? this.state.groups.page - 1 : this.state.groups.page
                this.getGroups(page)
            })
            .catch(error => console.log(error)) 
    }

    render() {
        return template.call(this, { Avatar, NavLink, Paginate })
    }

}

const mapStateToProps = state => state

export default compose(connect(mapStateToProps, actions))(Groups)


