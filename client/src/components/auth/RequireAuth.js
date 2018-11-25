import React, { Component } from 'react'
import { connect } from 'react-redux'

export default ChildComponent => {

    class ComposedCompoent extends Component {

        componentDidMount() {
            this.shouldNavigateAway()
        }

        componentDidUpdate() {
            this.shouldNavigateAway()
        }

        shouldNavigateAway() {
            console.log(this.props.auth)
            if (!this.props.auth) this.props.history.push('/')
        }

        render() {
            return <ChildComponent {...this.props} />
        }

    }

    const mapStateToProps = state => ({ auth: state.auth.authenticated})

    return connect(mapStateToProps)(ComposedCompoent)

}