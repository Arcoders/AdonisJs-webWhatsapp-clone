import React, { Component } from 'react'

import event from 'plugins/bus'


class Alert extends Component {

    state = { show: false, message: '', type: '' }

    componentDidMount() {
        
        event.$on('notificate', (data) => {
            const { message, type } = data
            this.setState({ show: true, message, type})
            setTimeout(this.reset.bind(this), 3000)
        })

    }

    reset() {
        this.setState({ show: false, message: '', type: 'done' })
    }

    renderAlert() {
        if (this.state.show) {
            return (
                <div className='alert'>
                    <p className={this.state.type}>{this.state.message}</p>
                </div>
            )
        } else {
            return null
        }
    }

    render () {
        return this.renderAlert()
    }

}

export default Alert
