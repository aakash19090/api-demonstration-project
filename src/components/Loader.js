import React from 'react'
import LoaderImg from '../assets/loader.gif'

const Loader = () => {
    return (
        <div id='loader' className='flex_view_xs middle center'>
            <div className='img'>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    margin: "auto",
                    background: "0 0",
                }}
                width={80}
                height={80}
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid"
                display="block"
            >
                <circle
                    cx={50}
                    cy={50}
                    fill="none"
                    stroke="#39bca9"
                    strokeWidth={10}
                    r={35}
                    strokeDasharray="164.93361431346415 56.97787143782138"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        repeatCount="indefinite"
                        dur="1s"
                        values="0 50 50;360 50 50"
                        keyTimes="0;1"
                    />
                </circle>
            </svg>
            </div>
        </div>
    )
}

export default Loader
