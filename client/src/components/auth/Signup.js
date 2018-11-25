import { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { compose } from 'redux'
import { connect } from 'react-redux'
import * as actions from 'actions/'

import template from 'templates/auth/signup.pug'

class Signup extends Component {

    onSubmit = fromProps => this.props.signup(fromProps, () => this.props.history.push('/wtsp'))

    render() {
        return template.call(this, { Field })
    }

}

const mapStateToProps = state => ({ errorMessage: state.auth.errorMessage })

export default compose(connect(mapStateToProps, actions), reduxForm({ form: 'signup' }))(Signup)