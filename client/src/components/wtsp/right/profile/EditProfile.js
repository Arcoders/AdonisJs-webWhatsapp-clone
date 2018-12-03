import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

import * as actions from 'actions/'

import event from 'plugins/bus'

import template from 'templates/wtsp/right/profile/editProfile.pug'

class EditProfile extends Component {

    state = { 
        username: this.props.auth.authenticated.user.username,
        description: this.props.auth.authenticated.user.description || '', 
        avatar: null, 
        cover: null, 
        avatarUploaded: null, 
        coverUploaded: null 
    }

    handleFileChange(e) {
        let files = e.target.files
        let reader = new FileReader()
        reader.readAsDataURL(files[0])
        let name = `${e.target.name}Uploaded`
        reader.onload = e => event.$emit(name, e.target.result)
        this.setState({ [name]: files[0] })
    }

    handleInputChange(e) {
        this.setState({ [e.target.name]: e.target.value })
        event.$emit(e.target.name, e.target.value)
    }
    
    async sendForm(event) {
        event.preventDefault()

        let formData = new FormData()
        formData.append('username', this.state.username)
        formData.append('description', this.state.description)
        if (this.state.avatarUploaded) formData.append('avatarUploaded', this.state.avatarUploaded)
        if (this.state.coverUploaded) formData.append('coverUploaded', this.state.coverUploaded)
        await this.props.editProfile(formData, this.props.auth.authenticated.user.id)
        this.setState({ avatarUploaded: null, coverUploaded: null })

    }

    render() {
        return template.call(this, {})
    }

}

const mapStateToProps = (state) => state

export default compose(connect(mapStateToProps, actions))(EditProfile)


