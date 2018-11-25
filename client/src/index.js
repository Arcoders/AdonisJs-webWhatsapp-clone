import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'

import reducers from 'reducers/';
import App from 'components/App'
import Welcome from 'components/Welcome'
import Signup from 'components/auth/Signup'
import Feature from 'components/Feature'
import Signout from 'components/auth/Signout'
import Signin from 'components/auth/Signin'

const store = createStore(
    reducers,
    {
        auth: { authenticated: localStorage.getItem('token') }
    },
    applyMiddleware(reduxThunk)
)

ReactDom.render(
    <div className='green_background'>
        <Provider store={store}>
            <BrowserRouter>
                <App>
                    <Route path='/' exact component={Welcome} />
                    <Route path='/signup' component={Signup} />
                    <Route path='/feature' component={Feature} />
                    <Route path='/signout' component={Signout} />
                    <Route path='/signin' component={Signin} />
                </App>
            </BrowserRouter>
        </Provider>
    </div>
    ,
    document.querySelector('#app')
)