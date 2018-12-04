import { Component } from 'react'
import axios from 'plugins/axios'
import pusher from 'plugins/pusher'
import event from 'plugins/bus'

import template from 'templates/wtsp/right/profile/friendship.pug'


class Friendship extends Component {

    state = { status: 'not_friends'}

    componentDidMount() {
        this.relationshipStatus()
        pusher.subscribe(`user${this.props.authenticatedUserId}`, channel => {
            channel.bind('friendship', () => this.relationshipStatus())
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.currentUserId !== nextProps.currentUserId) this.relationshipStatus(nextProps.currentUserId)
    }

    relationshipStatus(userId = this.props.currentUserId) {
        return axios().get(`/friends/check/${userId}`).then(({ data }) => {
            this.setState({ status: data.status })
        })
        .catch(() => this.alertError()) 
    }

    addFriend() {
        return axios().post(`/friends/add/${this.props.currentUserId}`).then(({ data }) => {
            this.setState({ status: data.status })
        })
        .catch(() => this.alertError()) 
    }

    rejectFriend() {
        return axios().delete(`/friends/reject/${this.props.currentUserId}`).then(({ data }) => {
            this.setState({ status: data.status })
        })
        .catch(() => this.alertError()) 
    }

    acceptFriend() {
        this.loading = true;
        return axios().post(`/friends/accept/${this.props.currentUserId}`).then(({ data }) => {
            this.setState({ status: data.status })
        })
        .catch(() => this.alertError()) 
    }

    alertError() {
        event.$emit('notificate', { message: 'An error has occurred, please try it later', type: 'error'})
    }

    render() {
        return template.call(this, {})
    }

}

export default Friendship