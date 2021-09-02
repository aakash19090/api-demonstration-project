import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Logo from '../../assets/pe_logo.png'

const Header = ({ isAdminLogged, logoutInit, details }) => {
    const [isDropdownActive, setIsDropdownActive] = useState(false)
    const dropdownRef = useRef(null)
    useEffect(() => {
        const handleClickOutside = (event) =>
            dropdownRef.current && !dropdownRef.current.contains(event.target)
                ? setIsDropdownActive(false)
                : null
        // ? Bind the event listener
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            // ?  Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <>
            <header
                className={`header_desk ${isDropdownActive ? 'show_dropdown' : ''}`}
            >
                <div className="inner">
                    <div className="container">
                        {isAdminLogged ? (
                            <div className="flex_view middle header_wrap">
                                <div className="col-xs-12 col-sm-4">
                                    <h2 className="heading xs-center">
                                        Knowledge Management System
                                    </h2>
                                </div>
                                <div className="col-xs-12 col-sm-4">
                                    <div className="logo_div text-center xs-center">
                                        <img src={Logo} alt="logo" />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-4">
                                    <div className="profile_wrapper flex_view_xs middle right">
                                        {
                                            details ? (
                                            <div className="inner ">
                                                
                                                <div className="profile_info flex_view_xs middle right">
                                                    <div
                                                        ref={dropdownRef}
                                                        className="img"
                                                        onClick={() => setIsDropdownActive(!isDropdownActive)}
                                                        onKeyPress={() =>
                                                            setIsDropdownActive(!isDropdownActive)
                                                        }
                                                    >
                                                        <img src={details.avatar} alt="profile_pic" />
                                                    </div>
                                                    <div className="text">
                                                        <p className="welcome">Welcome,</p>
                                                        <p className="name">{`${details.firstName} ${details.lastName}`}</p>
                                                    </div>
                                                </div>

                                                <div className={`dropdown ${isDropdownActive ? 'active' : '' }`} onClick={logoutInit}>
                                                    <span className="caret_icon">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width={11}
                                                            height={6}
                                                            viewBox="0 0 11 6"
                                                        >
                                                            <path
                                                                data-name="Polygon 1"
                                                                d="M5.5 6L0 0h11z"
                                                                fill="#d4d5d5"
                                                            />
                                                        </svg>
                                                    </span>
                                                    <div className="logout" >Logout</div>
                                                </div>
                                            </div>

                                            ) : null
                                        }
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex_view middle header_wrap">
                                <div className="col-xs-12 col-sm-4">
                                    <h2 className="heading xs-center">
                                        Knowledge Management System
                                    </h2>
                                </div>
                                <div className="col-xs-12 col-sm-8">
                                    <div className="logo_div text-right xs-center">
                                        <img src={Logo} alt="logo" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    )
}

Header.propTypes = {
    isAdminLogged: PropTypes.bool.isRequired,
}

export default Header
