import { Component } from 'react'
import { NavLink } from 'react-router-dom'

import template from 'templates/wtsp/right/groups/index.pug'

class Groups extends Component {

    render() {
        return template.call(this, { NavLink })
    }

}

export default Groups


