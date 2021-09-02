import React, { useEffect } from 'react'
import { Route, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import Unauthorized from './Unauthorised'
import CommonLayout from '../layout/CommonLayout'

const Auth = ({
    component: Component,
    path,
    roles,
    authRequired,
    layout: Layout,
    ...rest
}) => {
    const history = useHistory()
    useEffect(() => {
        const userToken = localStorage.getItem('token');
        if (userToken === null && authRequired === true) {
            history.push('/')
        }
        
    }, [])
    return localStorage.getItem('role') === roles || roles === 'all' ? ( // change this condition to === roles
        <Route
            {...rest}
            render={(props) => (
                <>
                    {Layout !== false ? (
                        <Layout>
                            <Component {...props} />
                        </Layout>
                    ) : (
                        <Component {...props} />
                    )}
                </>
            )}
        />
    ) : (
        <Route
            render={() => (
                <>
                    <CommonLayout>
                        <Unauthorized />
                    </CommonLayout>
                </>
            )}
        />
    )
}
Auth.propTypes = {
    component: PropTypes.elementType.isRequired,
    roles: PropTypes.string.isRequired,
    authRequired: PropTypes.bool.isRequired,
    layout: PropTypes.oneOfType([PropTypes.elementType, PropTypes.bool])
        .isRequired,
}
export default Auth
