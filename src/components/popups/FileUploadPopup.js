import React from 'react'
import { Line } from 'rc-progress';
import IconClosePopup from '../../assets/svgs/IconClosePopup'
import IconFileUpload from '../../assets/svgs/IconFileUpload'
import { compoundsToExport } from '../../redux/actions/userAction';

const FileUploadPopup = ({ show, closePopupInit, progress, uploadingList, cancelFileUpload }) => {
    const isMobileDevice = window.matchMedia("(max-width: 767px)"); // ? Check Device Width
    let lineStrokeWidth;
    isMobileDevice.matches ? (lineStrokeWidth = 2 ) : ( lineStrokeWidth = 2 )

    const progressNum = Number(progress);

    return Object.entries(uploadingList).length > 0 ? (
        <div className={`popup upload_popup flex_view_xs middle center ${show ? 'active':''}`}>
            <div className='popup_inner'>
                <div className='header'>
                    <h3> <span className='icon'> <IconFileUpload/> </span> <span className='txt'> Upload File </span> 
                        <span className='icon_close' onClick={() => closePopupInit('uploadPopup',true)}> <IconClosePopup/> </span>
                    </h3>
                </div>
                <div className='body text-center'>
                    {
                        Object.entries(uploadingList).map(([key,value],i) => {
                          return (
                            <div className={`progress_row flex_view middle ${Object.entries(uploadingList).length - 1  === i ? 'last': ''}`}>
                                <div className="nameCol">
                                    <p title={value.fileName.split('-')[1]}> {value.fileName.split('-')[1]} </p>
                                </div>

                                <div className="progressCol flex_view middle">
                                    <Line percent={value.percent} strokeLinecap="square" strokeWidth={`${lineStrokeWidth}`} strokeColor="#39BCA9" trailColor="#d7f2ee" trailWidth={`${lineStrokeWidth}`} />
                                    <span className='percentCount'>{`${value.percent}`}</span><span className='percent'>%</span>
                                    <span title="Cancel upload" className="cancel" data-filename={value.fileName} onClick={ (e) => cancelFileUpload(e.currentTarget.getAttribute('data-filename'))}><IconClosePopup/></span>
                                </div>
                            </div>

                          )  
                        })
                    }

                    <p className='note_text text-center'> Please wait, files are being processed. </p>

                    <div className="button_div flex_view_xs middle center">
                        <button className='cancel' onClick={() => closePopupInit('uploadPopup',true)}>Cancel All</button>
                    </div>
                </div>
            </div>
        </div>
    ) : null
}

export default FileUploadPopup
