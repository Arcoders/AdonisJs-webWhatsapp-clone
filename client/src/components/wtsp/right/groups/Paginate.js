import { Component } from 'react'

import template from 'templates/wtsp/right/groups/paginate.pug'

class Paginate extends Component {
    
    state = {
        pages: []
    }

    componentDidMount() {
        this.setPages()
    }

    setPages(source = this.props.source) {
        let pages = Array.apply(null, { length: source.lastPage }).map((value, index) => index + 1)
        this.setState({ pages })
    }

    nextPrev(page) {
        if (page === 0 || page === this.props.source.lastPage + 1) return
        this.navigate(page)
    }

    navigate(page) {
        this.props.getGroups(page)
    }

    disableNext() {
        return (
            this.props.source.page === this.props.source.lastPage 
          || 
          this.props.source.page === this.props.source.lastPage + 1
          )
    }
      
    disablePrev() {
        return (this.props.source.page === 1)
    }

    render() {
        return template.call(this, {})
    }

}

export default Paginate


