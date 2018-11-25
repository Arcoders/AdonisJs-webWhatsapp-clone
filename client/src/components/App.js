import React from 'react'

import Header from 'components/Header'
import 'assets/sass/app.sass'

export default ({ children }) => {
    return (
        <div>
            <Header />
            {children}
        </div>
    )
}