import { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { NavLink} from 'react-router-dom'
import * as actions from 'actions/'

import template from 'templates/auth/signin.pug'

class Signin extends Component {

    onSubmit = fromProps => this.props.signin(fromProps, () => this.props.history.push('/wtsp'))

    render() {
        return template.call(this, { Field, NavLink })
    }

}

const mapStateToProps = state => ({ errorMessage: state.auth.errorMessage })

export default compose(connect(mapStateToProps, actions), reduxForm({ form: 'signin' }))(Signin)