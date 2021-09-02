import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import * as adminAction from '../../redux/actions/adminAction'
import DataTable from './dataTable'
import Loader from '../Loader'

const toastSettings = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
}
class AdminDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount = () => {

        const { getAdminDetailsAction, fileHistoryAction, pwdChangedFlag } = this.props
        // ? Check if admin is logged in & store its details in state

        const storageToken = localStorage.getItem('token');
        if(storageToken){
            getAdminDetailsAction()
            fileHistoryAction() // ? Call File history List api
        }
        if(this.props.pwdChanged){
            toast.success('Password changed successfully', toastSettings)
            pwdChangedFlag(false)
        }
        
    }
    

    // ? Handle File Upload Action
    handleFileUpload = (fileList) => {
        const { fileUploadAction } = this.props
        fileUploadAction(fileList)
    }

    // ? Handle File Replace Action
    handleFileReplace = (fileToReplace, replaceFileId) => {
        const { fileUploadAction } = this.props
        const fileList = [fileToReplace]
        fileUploadAction(fileList, true, replaceFileId)
    }

    // ? Handle File Delete Action
    handleFileDelete = (fileToDelete) => {
        const { deleteFileAction } = this.props
        const fileId = { _id: fileToDelete.fileId }
        deleteFileAction(fileId)
    }
    
    // ? Handle Cancel Request on Cancel Button in File Upload Popup

    handleCancelFileUploadInit = (fileName, flag) => {
        const { cancelFileUpload } = this.props
        if(fileName){
            this.props.filesUploadingList[fileName].cancelToken.cancel()
            cancelFileUpload(fileName)
            toast.error('File Uploading Cancelled!', toastSettings)
        }else if(flag === 'All'){
            Object.values(this.props.filesUploadingList).forEach(item => item.cancelToken.cancel() )
            toast.error('File Uploading Cancelled!', toastSettings)
            cancelFileUpload('All')
        }
    }

    render() {
        const fileListData = this.props.fileHistoryList
        return this.props.showLoader ? (
            <Loader/>
        ) : fileListData ? (
            <div id="admin_dashboard">
                <ToastContainer />
                <DataTable 
                    dataList={fileListData} 
                    uploadFileInit={(fileList) => this.handleFileUpload(fileList)} 
                    replaceFileInit={(fileToReplace, replaceFileId) => this.handleFileReplace(fileToReplace, replaceFileId)} 
                    deleteFileInit={(fileToDelete) => this.handleFileDelete(fileToDelete)} 
                    uploadProgress={this.props.fileUploadProgress}
                    cancelRequest={this.cancelFileUpload}
                    filesUploadingList={this.props.filesUploadingList}
                    cancelFileUploadInit={(fileName, flag) => this.handleCancelFileUploadInit(fileName,flag)}
                />
            </div>
        ) : null
    }
}


const mapStateToProps = (state) => ({
    showLoader: state.admin.isLoading,
    fileHistoryList: state.admin.fileHistoryList,
    fileUploadProgress: state.admin.fileUploadProgress,
    dashboard: state.admin,
    pwdChanged: state.admin.pwdChanged,
    filesUploadingList: state.admin.filesToupload
})

export default connect(mapStateToProps, {...adminAction })(AdminDashboard)

