import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Welcome from 'components/wtsp/right/Welcome'
import RightSide from 'components/wtsp/right/RightSide'
import LeftSide from 'components/wtsp/left/LeftSide'

import requireAuth from 'components/auth/RequireAuth'


const Home = ({ match }) => {
    return (
        <div className='wrap'>

            <div className='left'>
                <LeftSide />
            </div>

            <div className='right'> 
                
                <BrowserRouter>
                    <RightSide>
                        <Route exact path={match.path} component={Welcome} />
                    </RightSide>
                </BrowserRouter>

            </div>

        </div>
    )
}

export default requireAuth(Home)