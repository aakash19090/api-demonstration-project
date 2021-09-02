import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as adminAction from '../../redux/actions/adminAction'
import Header from './Header'
// import Footer from './Footer'

class LoggedinLayout extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    handleLogout = () => {
        const { logoutAdminAction } = this.props
        logoutAdminAction()
    }

    render() {
        const { children } = this.props
        return (
            <div>
                <Header isAdminLogged={true} logoutInit={ this.handleLogout } details={this.props.adminDetails}/>
                {children}
                {/* <Footer /> */}
            </div>
        )
    }
}

LoggedinLayout.propTypes = {
    children: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    adminDetails: state.admin.currentUser,
    appState: state
})

export default connect(mapStateToProps, {...adminAction })(LoggedinLayout)

