import React from 'react'
import IconClosePopup from '../../assets/svgs/IconClosePopup'

const DeleteFilePopup = ({ show, closePopupInit, confirmDeleteInit, file }) => {
    return (
        <div className={`popup delete_popup flex_view_xs middle center ${show ? 'active':''}`}>
            <div className='popup_inner'>
                <div className='header'>
                    <h3>Delete File
                        <span className='icon_close' onClick={() => closePopupInit('deletePopup')}> <IconClosePopup/> </span>
                    </h3>
                </div>
                <div className='body text-center'>
                    <h4>Are you sure you want to delete this file ?</h4>
                    <div className="button_div flex_view_xs middle center">
                        <button className='yes' onClick={() => confirmDeleteInit(file)}>Yes</button>
                        <button className='cancel' onClick={() => closePopupInit('deletePopup')}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteFilePopup
