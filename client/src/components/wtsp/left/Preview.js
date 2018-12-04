import React from 'react'

const Preview = (props) => {

    let message = props.message.split('')
    
    if (message.length > 20) {
        message.length = 20
        message = `${message.join('')}...`
    } else {
        message = message.join('')
    }
    
    return(
        <span>{message}</span>
    )

}

export default Preview