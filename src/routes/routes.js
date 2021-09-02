import React from 'react'
import { Router, Switch } from 'react-router-dom'
import history from './history'
import Auth from '../components/common/Auth'
import Login from '../components/login'
import AdminDashboard from '../components/adminDashboard'
import UserDashboard from '../components/userDashboard'
import CommonLayout from '../components/layout/CommonLayout'
import LoggedinLayout from '../components/layout/LoggedinLayout'

const AppRoutes = () => {
    const userToken = localStorage.getItem('token');
    return (
        <Router history={history}>
            <Switch>
                <Auth
                    exact
                    path="/"
                    component={Login}
                    layout={CommonLayout}
                    roles="all"
                    authRequired={false}
                />
                <Auth
                    exact
                    path="/dashboard"
                    component={AdminDashboard}
                    layout={LoggedinLayout}
                    roles="admin"
                    authRequired={true}
                />
                <Auth
                    exact
                    path="/forgotpassword"
                    component={Login}
                    layout={CommonLayout}
                    roles="all"
                    authRequired={false}
                />
                <Auth
                    exact
                    path="/resetpassword"
                    component={Login}
                    layout={CommonLayout}
                    roles="all"
                    authRequired={false}
                />
                <Auth
                    exact
                    path="/updatepassword"
                    component={Login}
                    layout={LoggedinLayout}
                    roles="admin"
                    authRequired={true}
                />
                <Auth
                    exact
                    path="/user"
                    component={UserDashboard}
                    layout={CommonLayout}
                    roles="all"
                    authRequired={false}
                />
            </Switch>

        </Router>

    )
}

export default AppRoutes
