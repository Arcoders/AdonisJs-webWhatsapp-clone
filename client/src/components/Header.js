import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class Header extends Component {

    renderLinks() {
        
        if (this.props.authenticated) {
            return (
                <div>
                    <Link to='/signout'>Signout</Link>
                    <Link to='/feature'>Feature</Link>
                </div>
            )
        }

        return (
            <div>
                <Link to='/signup'>Signup</Link>
                <Link to='/signin'>Signin</Link>
            </div>
        )
    }

    render() {
        return (
            <div>
                <Link to='/'>Redux Auth</Link>
                {this.renderLinks()}
            </div>
        )
    }

}

const mapStateToProps = state => ({ authenticated: state.auth.authenticated })

export default connect(mapStateToProps)(Header)