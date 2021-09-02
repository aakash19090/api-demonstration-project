import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
// import Footer from './Footer'

export default class CommonLayout extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { children } = this.props
        return (
            <div>
                <Header isAdminLogged={false} />
                {children}
                {/* <Footer /> */}
            </div>
        )
    }
}

CommonLayout.propTypes = {
    children: PropTypes.object.isRequired,
}
