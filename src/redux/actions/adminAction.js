import { toast } from 'react-toastify';
import axios from 'axios';
import * as actionTypes from './Types'
import { createBrowserHistory } from 'history'
import AdminService from '../../api/services/adminService'
import history from '../../routes/history' 
import store from '../store'

/**
 * will return users list
 * @author Akash Sharma
 * @params
 * @returns post list
 */

const toastSettings = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
}

// ? APIS INIT & FAIL

export const fetchApiInit = () => ({
    type: actionTypes.FETCH_API_INIT
})
export const fetchApiFail = () => ({
    type: actionTypes.FETCH_API_FAIL
})


// ? File History List API on Login
export const fileHistorySuccess = (fileList) => ({
    type: actionTypes.FETCH_FILE_LIST_SUCCESS,
    payload: fileList
})

export const fileHistoryAction = () => async (dispatch) => {
    dispatch(fetchApiInit()) 
    const response = await AdminService.fileHistoryList();
    // ? Check if response has error
    const errorMsg = response[0] ? response[0].message : null;
    if(errorMsg == null){
        dispatch(fileHistorySuccess(response))
    }else{
        dispatch(fetchApiFail()) 
    }

}


// ?  Login Actions
export const loginAdminSuccess = (response) => ({
    type: actionTypes.LOGIN_SUCCESS,
    payload: response
})
export const changePasswordFlag = (isChange) => ({
    type: actionTypes.CHANGE_PWD_FLAG,
    payload: isChange
})

export const loginAdminAction = (loginCredentials) => async (dispatch) => {
    dispatch(fetchApiInit()) 
    const response = await AdminService.loginAdmin(loginCredentials);
    // ? Check if response has error
    const errorMsg = response[0] ? response[0].message : null
    const token = errorMsg ? null : response.token
    if(errorMsg){
        dispatch(fetchApiFail())
        toast.error(errorMsg, toastSettings)
    }else{
        if(token){
            const shouldChangePassword = response.resetPassword
            localStorage.setItem('token',token);
            localStorage.setItem('role',response.role); // ? Need to set role Later & also In Auth.js
            dispatch(changePasswordFlag(shouldChangePassword))
            shouldChangePassword ? history.push('/updatepassword') : history.push('/dashboard')
            dispatch(loginAdminSuccess(response))
            dispatch(fileHistoryAction())
        }
        
    }
}

// ?  Logout Actions

export const logoutAdminAction = () => async (dispatch) => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    dispatch({
        type: actionTypes.LOGOUT_ADMIN
    })
    history.push('/')
}

// ?  Forgot Password Actions
export const forgotPasswordSuccess = () => ({
    type: actionTypes.FORGOT_PWD_SUCCESS
})

export const forgotPasswordAction = (email) => async (dispatch) => {
    dispatch(fetchApiInit()) 
    const userEmail = {email};
    const response = await AdminService.forgotPassword(userEmail);
    
    // ? Check if response has error
    const hasError = Object.keys(response).length > 0;
    const errorMsg = response[0] ? response[0].message : null;
    
    if(hasError){
        dispatch(fetchApiFail()) 
        toast.error(errorMsg, toastSettings)
        
    }else{
        dispatch(forgotPasswordSuccess()) 
        toast.success('Reset password link has been sent to your email address', toastSettings)
    }
}

// ? Reset Password Action 

export const resetPasswordSuccess = () => ({
    type: actionTypes.RESET_PWD_SUCCESS
})

export const resetPasswordAction = (password, token) => async (dispatch) => {
    dispatch(fetchApiInit()) 
    const bodyData = { token, password };
    const response = await AdminService.resetPassword(bodyData);

    // ? Check if response has error
    const hasError = Object.keys(response).length > 0;
    const errorMsg = response[0] ? response[0].message : null;

    if(hasError){
        dispatch(fetchApiFail()) 
        toast.error(errorMsg, toastSettings)
        
    }else{
        dispatch(resetPasswordSuccess()) 
        history.push('/');
        toast.success('Password changed successfully', toastSettings)
    }
}

// ? Change Password Action 
export const updatePasswordSuccess = () => ({
    type: actionTypes.CHANGE_PWD_SUCCESS
})


export const pwdChangedFlag = (isChanged) => ({
    type: actionTypes.PWD_CHANGED,
    payload: isChanged
})


export const changePasswordAction = (pwdObj) => async (dispatch) => {
    // dispatch(fetchApiInit()) 
    const response = await AdminService.updatePassword(pwdObj);
    // ? Check if response has error
    const hasError = Object.keys(response).length > 0;
    const errorMsg = response[0] ? response[0].message : null;

    if(hasError){
        dispatch(fetchApiFail()) 
        toast.error(errorMsg, toastSettings)
        
    }else{
        dispatch(updatePasswordSuccess()) 
        dispatch(changePasswordFlag(false))
        dispatch(pwdChangedFlag(true))
        history.push('/dashboard');
        //  dispatch(pwdChangedFlag(true))
    }
}




// ? Update Admin details on Refresh if logged in
export const updateAdminSuccess = (detail) => ({
    type: actionTypes.FETCH_ADMIN_SUCCESS,
    payload: detail
})

export const getAdminDetailsAction = () => async (dispatch) => {
    dispatch(fetchApiInit()) 
    const response = await AdminService.getAdminDetail();
    // ? Check if response has error
    const errorMsg = response[0] ? response[0].message : null;
    if(errorMsg == null){
        dispatch(updateAdminSuccess(response)) 
        // dispatch(fileHistoryAction(token))
    }else{
        localStorage.removeItem('token');
        history.push('/');
        dispatch(fetchApiFail()) 
    }
}


// ? Delete File Action from Admin Dashboard

export const deleteFileSuccess = () => ({
    type: actionTypes.FETCH_ADMIN_SUCCESS
})

export const deleteFileAction = (fileId) => async (dispatch) => {
    const response = await AdminService.deleteFile(fileId);

    // ? Check if response has error
    const errorMsg = response[0] ? response[0].message : null;
    if(errorMsg == null){
        await dispatch(fileHistoryAction())
        toast.success('File Deleted Successfully!', toastSettings)
    }else{
        dispatch(logoutAdminAction())
    }
}

// ? Upload File Action from Admin Dashboard

export const updateFileUploadProgress = (fileObj) => ({
    type: actionTypes.FILE_UPLOAD_PROGRESS,
    payload: fileObj
})

export const updateFileUploadList = (fileObj) => ({
    type: actionTypes.UPDATE_FILE_UPLOAD_LIST,
    payload: fileObj
})

export const clearFileUploadProgress = (fileName) => ({
    type: actionTypes.CLEAR_FILE_UPLOAD_PROGRESS,
    payload: fileName
})

export const fileUploadAction = (fileList, isReplaceAction, replaceFileId) => async(dispatch) => {
    
    const isAdminResponse = await AdminService.getAdminDetail();
    const errorMsg = isAdminResponse[0] ? isAdminResponse[0].message : null;
    let fileItem
    if(errorMsg == null){
        await fileList.forEach( async (file, index) => {
            fileItem = `file_${index}`
            toastSettings.toastId = fileItem
            let url
            if(isReplaceAction){
                url = `${process.env.APIURL}/file/replace?_id=${replaceFileId}`
            }else{
                url = `${process.env.APIURL}/file/upload`
            }
            const token = localStorage.getItem('token')
            const CancelToken = axios.CancelToken.source();

            const fileNameID = `${index}-${file.name}`
            const fileObj =  {              
                fileName: fileNameID,
                percent: 0,
                CancelToken
            }
            dispatch(updateFileUploadList(fileObj))

            let options = {
                cancelToken: CancelToken.token,
                onUploadProgress: (progressEvent) => {
                    const {loaded, total} = progressEvent;
                    let percent = Math.floor( (loaded * 100) / total )
                    const fileDetails =  { fileNameID, percent }
                    dispatch(updateFileUploadProgress(fileDetails))
                },
                headers: {
                    authorization: `Bearer ${token}`
                }
            }

            let fileFormData = new FormData()
            fileFormData.append('file', file)
            

            const apiResponse = await axios.post(url, fileFormData, options)
            .then( async(res) => {
                const fileNameID = `${index}-${file.name}`
                const currFilesToUpload = store.getState().admin.filesToupload
                await dispatch(clearFileUploadProgress(fileNameID))
                toast.success('File Uploaded Successfully!', { toastId : fileItem } )      
                if(Object.entries(currFilesToUpload).length === 0 ){
                    await dispatch(fileHistoryAction())
                    if(isReplaceAction){
                        toast.success('File Replaced Successfully!', toastSettings)      
                    }else{
                        toast.success('All Files Uploaded Successfully!', toastSettings)      

                    }
                }
            })
            .catch( (err) => {
                if(err.isAxiosError){
                    toast.error('The file upload process was interrupted and stopped, please try again', { toastId: "file_1" })      
                }
            })

        })

    }else{
        localStorage.removeItem('token');
        history.push('/');
        dispatch(fetchApiFail()) 
    }
}

// ? Cancel File Upload
export const cancelFileUpload = (fileName) => ({
    type: actionTypes.CANCEL_FILE_UPLOAD,
    payload: fileName
})
