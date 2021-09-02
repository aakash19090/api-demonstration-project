import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import IconPassword from '../../assets/svgs/IconPassword'
import IconEye from '../../assets/svgs/IconEye'
import IconEyeSlash from '../../assets/svgs/IconEyeSlash'

const UpdatePassword = ({ updatePasswordInit }) => {
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
    })

    const watchPassword = watch('newpassword', '') // ? This will watch value of Password Field
    // const watchConfirmPassword = watch("confirmnewpassword", ''); // ? This will watch value of Password Field

    const [currentPasswordShown, setcurrentPasswordShown] = useState(false)
    const [newPasswordShown, setNewPasswordShown] = useState(false)
    const [confirmPasswordShown, setConfirmPasswordShown] = useState(false)

    // ? Handle Submit Action
    const onSubmit = (passwordsObj) => { updatePasswordInit(passwordsObj) }

    return (
        <div className="form_wrapper reset_form">
            <div className="title_bar"> Update Password </div>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="field_row">
                    <label htmlFor="currentpassword">Current Password</label>

                    <div className="input_div">
                        <span className="input_icon">
                            <IconPassword />
                        </span>
                        <input
                            type={`${currentPasswordShown ? 'text' : 'password'}`}
                            id="currentpassword"
                            placeholder="Enter current password"
                            name="currentpassword"
                            {...register('currentpassword', {
                                required: 'Please enter current password',
                            })}
                        />

                        <span
                            className="input_icon eye_icon"
                            onClick={() => setcurrentPasswordShown(!currentPasswordShown)}
                            onKeyPress={() => setcurrentPasswordShown(!currentPasswordShown)}
                        >
                            {currentPasswordShown ? <IconEyeSlash /> : <IconEye />}
                        </span>
                    </div>
                    {errors.currentpassword && (
                        <span className="error_msg">{errors.currentpassword.message}</span>
                    )}
                </div>

                <div className="field_row">
                    <label htmlFor="newpassword">New Password</label>

                    <div className="input_div">
                        <span className="input_icon">
                            {' '}
                            <IconPassword />{' '}
                        </span>
                        <input
                            type={`${newPasswordShown ? 'text' : 'password'}`}
                            id="newpassword"
                            placeholder="Enter new password"
                            name="newpassword"
                            {...register('newpassword', {
                                required: 'Please enter new password',
                                minLength: {
                                    value: 8,
                                    message:
                                        'Password should be atleast 8 characters including 1 alphabet, 1 number and 1 special symbol.',
                                },
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                    message:
                                        'Password should be atleast 8 characters including 1 alphabet, 1 number and 1 special symbol.',
                                },
                            })}
                        />
                        <span
                            className="input_icon eye_icon"
                            onClick={() => setNewPasswordShown(!newPasswordShown)}
                            onKeyPress={() => setNewPasswordShown(!newPasswordShown)}
                        >
                            {newPasswordShown ? <IconEyeSlash /> : <IconEye />}
                        </span>
                    </div>
                    {errors.newpassword && (
                        <span className="error_msg">{errors.newpassword.message}</span>
                    )}
                </div>

                <div className="field_row">
                    <label htmlFor="confirmnewpassword">Confirm New Password</label>

                    <div className="input_div">
                        <span className="input_icon">
                            {' '}
                            <IconPassword />{' '}
                        </span>
                        <input
                            type={`${confirmPasswordShown ? 'text' : 'password'}`}
                            id="confirmnewpassword"
                            placeholder="Enter new password"
                            name="confirmnewpassword"
                            {...register('confirmnewpassword', {
                                required: 'Please enter new password',
                                validate: (value) =>
                                    value === watchPassword ||
                                    'New password and confirm password should match',
                            })}
                        />
                        <span
                            className="input_icon eye_icon"
                            onClick={() => setConfirmPasswordShown(!confirmPasswordShown)}
                            onKeyPress={() => setConfirmPasswordShown(!confirmPasswordShown)}
                        >
                            {confirmPasswordShown ? <IconEyeSlash /> : <IconEye />}
                        </span>
                    </div>
                    {errors.confirmnewpassword && (
                        <span className="error_msg">
                            {errors.confirmnewpassword.message}
                        </span>
                    )}
                </div>

                <div className="submit_div">
                    <button type="submit" className="submit_btn flex_view_xs">
                        Update
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UpdatePassword
