import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import PropTypes from 'prop-types'
import * as userAction from '../../redux/actions/userAction'
import * as adminAction from '../../redux/actions/adminAction'
import * as CryptoJS from 'crypto-js'
import LoginForm from './LoginForm'
import Loader from '../Loader'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'
import UpdatePassword from './UpdatePassword'
import history from '../../routes/history' 


const SECRET_KEY = process.env.SECRET_KEY


class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount = () => {
        const userToken = localStorage.getItem('token');
        const changePwd = this.props.isChangePwd
        if(changePwd && userToken !== null){
            history.push('/updatepassword') 
        }else if(userToken !== null){
            history.push('/dashboard')
        }
        
    }
    // ? Handle Login Click Event
    handleAdminLoginInit = (credentials) => {
        const pwd = credentials.password
        const encryptedPwd = CryptoJS.AES.encrypt(pwd, SECRET_KEY).toString();

        const loginCredentials = {
            email: credentials.email,
            password: encryptedPwd
        }
        const { loginAdminAction } = this.props
        loginAdminAction(loginCredentials)

    }

    // ? Handle Forgot Password Click Event
    handleForgotPassword = (email) => {
        const { forgotPasswordAction } = this.props
        forgotPasswordAction(email)
    }
    // ? Handle Reset Password from Email Link
    handleResetPassword = (password) => {
        const urlParamToken = this.props.history.location.search.split('token=')[1];
        const { resetPasswordAction } = this.props
        const newPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
        resetPasswordAction(newPassword, urlParamToken)
    }

    handleUpdatePassword = (passwordsObj) => {
        const oldPassword = CryptoJS.AES.encrypt(passwordsObj.currentpassword, SECRET_KEY).toString(); 
        const newPassword = CryptoJS.AES.encrypt(passwordsObj.newpassword, SECRET_KEY).toString();
        const pwdObj = { oldPassword, newPassword } 
        const { changePasswordAction } = this.props 
        changePasswordAction(pwdObj)
    }

   

    render() {
        const urlPath = this.props.location.pathname;
        const userToken = localStorage.getItem('token');
        return (

            <div id="login_page" data-path={urlPath}>
                <ToastContainer limit={1} />
                {
                    this.props.showLoader ? (<Loader/>) : null
                }
                <div className="inner">
                    <div className="login_wrapper">
                        {
                            urlPath === '/forgotpassword' ? (
                                <ForgotPassword forgotPasswordInit={ (email) => this.handleForgotPassword(email)}/>
                            ) : urlPath === '/resetpassword' ? (
                                <ResetPassword resetPasswordInit={ (password) => this.handleResetPassword(password)}/>
                            ) : urlPath === '/updatepassword' ? (
                                <UpdatePassword updatePasswordInit={ (passwordsObj) => this.handleUpdatePassword(passwordsObj)}/>
                            )  : urlPath === '/' ? (
                                <LoginForm loginInit={(credentials) => this.handleAdminLoginInit(credentials)} />
                            ) : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    showLoader: state.admin.isLoading,
    users: state,
    isChangePwd : state.admin.changePwd
})

export default connect(mapStateToProps, { ...userAction, ...adminAction })(Login)
