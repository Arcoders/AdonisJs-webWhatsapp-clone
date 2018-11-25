import { Component } from 'react'

import template from 'templates/wtsp/left/search.pug'

class Search extends Component {

    render() {
        return template.call(this, {})
    }

}

export default Search