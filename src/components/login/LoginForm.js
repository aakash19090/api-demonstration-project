import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'
import IconEmail from '../../assets/svgs/IconEmail'
import IconPassword from '../../assets/svgs/IconPassword'
import IconEye from '../../assets/svgs/IconEye'
import IconEyeSlash from '../../assets/svgs/IconEyeSlash'

const LoginForm = ({ loginInit }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful },
    } = useForm({
        mode: 'onBlur',
    })
    const [passwordShown, setPasswordShown] = useState(false)

    // ? Handle Submit Action
    const onSubmit = (credentials) => {
        loginInit(credentials)
        reset({ email: '' }, { password: '' })
    }

    return (
        <div className="form_wrapper login_form">
            
            <div className="title_bar"> Login to KMS </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="field_row">
                    <label htmlFor="email">Email</label>

                    <div className="input_div">
                        <span className="input_icon">
                            {' '}
                            <IconEmail />{' '}
                        </span>
                        <input
                            type="text"
                            id="email"
                            placeholder="Enter your email"
                            name="email"
                            {...register('email', {
                                required: 'Please enter email',
                                pattern: {
                                    value: /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/,
                                    message: 'Please enter a valid email Id',
                                },
                            })}
                        />
                    </div>
                    {errors.email && (
                        <span className="error_msg">{errors.email.message}</span>
                    )}
                </div>

                <div className="field_row">
                    <label htmlFor="password">Password</label>

                    <div className="input_div">
                        <span className="input_icon">
                            {' '}
                            <IconPassword />{' '}
                        </span>
                        <input
                            type={`${passwordShown ? 'text' : 'password'}`}
                            id="password"
                            placeholder="Enter your password"
                            name="password"
                            {...register('password', {
                                required: 'Please enter password',
                            })}
                        />
                        <span
                            className="input_icon eye_icon"
                            onClick={() => setPasswordShown(!passwordShown)}
                            onKeyPress={() => setPasswordShown(!passwordShown)}
                        >
                            {passwordShown ? <IconEyeSlash /> : <IconEye />}
                        </span>
                    </div>
                    {errors.password && (
                        <span className="error_msg">{errors.password.message}</span>
                    )}
                </div>

                <div className="text-right forgot_pwd">
                    <Link to="/forgotpassword"> Forgot password? </Link>
                </div>

                <div className="submit_div">
                    <button type="submit" className="submit_btn">
                        Login
                    </button>
                </div>
            </form>
        </div>
    )
}

export default LoginForm
