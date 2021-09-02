import React,{ useEffect } from 'react'
import { useForm } from 'react-hook-form'
import IconEmail from '../../assets/svgs/IconEmail'
import { Link } from 'react-router-dom'

const ForgotPassword = ({forgotPasswordInit}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful },
    } = useForm({
        mode: 'onBlur',
    })

    
    useEffect( () => {
        if (isSubmitSuccessful) {
            reset({ email: '' })
        }
    }, [isSubmitSuccessful, reset] )
    
    // ? Handle Submit Action
    const onSubmit = (data) => { forgotPasswordInit(data.email) }

    return (
        <div className="form_wrapper forgot_pwd_form">
            <div className="title_bar"> Forgot Password </div>
            <form onSubmit={handleSubmit(onSubmit)} >
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

                     <div className="text-right forgot_pwd">
                        <Link to="/"> Go to Login  </Link>
                    </div>
                </div>

                <div className="submit_div">
                    <button type="submit" className="submit_btn flex_view_xs" >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ForgotPassword
