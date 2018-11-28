import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'

import * as actions from 'actions/'

import event from 'plugins/bus'

import template from 'templates/wtsp/right/profile/editProfile.pug'

class EditProfile extends Component {

    state = { avatar: null }

    handleFileChange(e) {
        let files = e.target.files
        let reader = new FileReader()
        reader.readAsDataURL(files[0])
        reader.onload = e => event.$emit('preview_avatar', e.target.result)
    }

    handleUsername(e) {
        event.$emit('preview_username', e.target.value)
    }
    
    render() {
        return template.call(this, { Field })
    }

}

const mapStateToProps = ({ users }) => users

export default compose(connect(mapStateToProps, actions), reduxForm({ form: 'signin' }))(EditProfile)


