import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'

import reducers from 'reducers/';
import App from 'components/App'
import Signup from 'components/auth/Signup'
import Signout from 'components/auth/Signout'
import Signin from 'components/auth/Signin'

import Whatsapp from 'components/wtsp/Whatsapp'
import ExtendedPusher from 'plugins/pusher'

const auth = JSON.parse(localStorage.getItem('auth'))

let pusher = new ExtendedPusher('60efd870de38efff2291', {
    authEndpoint: 'http://127.0.0.1:3333/api/pusher',
    auth: {
        headers: {
        Authorization: `Bearer ${auth && auth.jwt.token}`,
        },
    },
    cluster: 'eu',
    encrypted: true,
})

window.pusher = pusher

const store = createStore(
    reducers,
    {
        auth: { authenticated: auth }
    },
    applyMiddleware(reduxThunk)
)

ReactDom.render(
    <div className='green_background'>
        <Provider store={store}>
            <BrowserRouter>
                <App>
                    <Route path='/' exact component={Signin} />
                    <Route path='/signup' component={Signup} />
                    <Route path='/wtsp' component={Whatsapp} />
                    <Route path='/signout' component={Signout} />
                    <Route path='/signin' component={Signin} />
                </App>
            </BrowserRouter>
        </Provider>
    </div>
    ,
    document.querySelector('#app')
)