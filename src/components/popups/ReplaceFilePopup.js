import React from 'react'
import IconClosePopup from '../../assets/svgs/IconClosePopup'
import IconFileUpload from '../../assets/svgs/IconFileUpload'
import IconReplace from '../../assets/svgs/IconReplace'

const ReplaceFilePopup = ({ show, closePopupInit, file, replaceActiveFileInit }) => {
    return (
        <>
            <div className={`popup filereplace_popup flex_view_xs middle center ${show ? 'active':''}`}>
                <div className='popup_inner'>
                    <div className='header'>
                        <h3><span className='icon'> <IconReplace/> </span> <span className='txt'> Replace File </span> 
                            <span className='icon_close' onClick={() => closePopupInit('replacePopup')}> <IconClosePopup/> </span>
                        </h3>
                    </div>

                    <div className='body text-center'>

                        <form id="replaceForm">
                            <div className="file_upload">
                                <button className="fileupload_btn" type="button">
                                    <span className="icon">
                                        <IconFileUpload />
                                    </span>
                                    <span className="text">UPLOAD FILE</span>
                                    <input type='file'  name='filereplace' id='filereplace' accept='application/json' onChange={(e) => replaceActiveFileInit(e)}/>
                                </button>
                            </div>

                            <div className="button_div flex_view_xs middle center">
                                <button type="button" className='cancel' onClick={() => closePopupInit('replacePopup')}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ReplaceFilePopup
