import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { compose } from 'redux'
import { connect } from 'react-redux'
import * as actions from 'actions/'

class Signin extends Component {

    onSubmit = fromProps => this.props.signin(fromProps, () => this.props.history.push('/feature'))

    render() {

        const { handleSubmit } = this.props

        return (
            <form onSubmit={handleSubmit(this.onSubmit)}>
                <fieldset>
                    <label>Email</label>
                    <Field name='email' type='text' component='input'/>
                </fieldset>

                <fieldset>
                    <label>Password</label>
                    <Field name='password' type='password' component='input'/>
                </fieldset>

                {this.props.errorMessage}
                <button>Sign In!</button>
            </form>
        )
    }

}

const mapStateToProps = state => ({ errorMessage: state.auth.errorMessage })

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'signin' })
)(Signin)