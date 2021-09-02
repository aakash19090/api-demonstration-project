import * as actionTypes from '../actions/Types'

const initialState = {
    isLoading: false,
    currentUser: null,
    fileHistoryList: null,
    fileUploadProgress: 0,
    changePwd: false,
    pwdChanged: false,
    // shouldChangePassword: false,
    filesToupload: {}
}

export default (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.FETCH_API_INIT:  // ? APIs
            return { 
                ...state, 
                isLoading: true,
            }

        case actionTypes.FETCH_API_FAIL: 
            return { 
                ...state, 
                isLoading: false,
            }

        case actionTypes.FETCH_ADMIN_SUCCESS: // ? Fetch Admin
            return { 
                ...state, 
                isLoading: false,
                currentUser: action.payload
            }

        case actionTypes.LOGOUT_ADMIN:
                return { 
                    ...state, 
                    isLoading: false,
                    currentUser: null,
                    fileHistoryList: null
                }

        case actionTypes.FETCH_FILE_LIST_SUCCESS: // ? Fetch File History List
            return { 
                ...state, 
                isLoading: false,
                fileHistoryList: action.payload
            }

        case actionTypes.LOGIN_SUCCESS: // ? Login
            return { 
                ...state, 
                isLoading: false,
                currentUser: action.payload,
                // shouldChangePassword: true
            }

        case actionTypes.FORGOT_PWD_SUCCESS: // ? Forgot Password
            return { 
                ...state, 
                isLoading: false,
            }
        
        case actionTypes.RESET_PWD_SUCCESS: // ? Reset Password
            return { 
                ...state, 
                isLoading: false,
            }

        case actionTypes.CHANGE_PWD_SUCCESS: // ? Reset Password
            return { 
                ...state, 
                isLoading: false,
            }

        case actionTypes.CHANGE_PWD_FLAG: // ? Change Password flag
            return { 
                ...state, 
                changePwd: action.payload,
            }

        case actionTypes.PWD_CHANGED : // ? Change Password flag
            return { 
                ...state, 
                pwdChanged: action.payload
            }
            

        case actionTypes.DELETE_FILE_SUCCESS: // ? Delete File
            return { 
                ...state, 
                isLoading: false,
            }

        case actionTypes.FILE_UPLOAD_PROGRESS: // ? File Upload Progress
            const newPercent = action.payload.percent
            const fileName = action.payload.fileNameID
            const existingToken = state.filesToupload[fileName]['cancelToken']
            return { 
                ...state,
                filesToupload: {
                    ...state.filesToupload,
                    [fileName]:{
                        fileName: fileName,
                        percent: newPercent,
                        cancelToken: existingToken
                    }
                }
            }

        case actionTypes.UPDATE_FILE_UPLOAD_LIST:
            const fileNameId = action.payload.fileName
            return {
                ...state,
                filesToupload: {
                    ...state.filesToupload,
                    [fileNameId]: {
                        fileName: fileNameId,
                        percent: action.payload.percent,
                        cancelToken: action.payload.CancelToken
                    }
                }
            }

        case actionTypes.CLEAR_FILE_UPLOAD_PROGRESS:
            const fileToRemove =  action.payload
            let filesUploadedObj = state.filesToupload
            delete filesUploadedObj[fileToRemove]
            return {
                ...state,
            }

        case actionTypes.CANCEL_FILE_UPLOAD: // ? Cancel File Upload
            let uploadedFilesObj = state.filesToupload
            if(action.payload === 'All'){
                return { 
                    ...state, 
                    filesToupload: {}
                }
            }else{
                delete uploadedFilesObj[action.payload]
                return { 
                    ...state, 
                }
            }


        default:
            return state
    }
}
