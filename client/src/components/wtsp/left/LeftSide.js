import { Component } from 'react'
import Avatar from 'react-avatar'

import Search from 'components/wtsp/left/Search'
import List from 'components/wtsp/left/List'
import template from 'templates/wtsp/left/index.pug'


import 'components/wtsp/left/fix.css'

class LeftSide extends Component {

    render() {
        return template.call(this, { Search, Avatar, List })
    }

}

export default LeftSide