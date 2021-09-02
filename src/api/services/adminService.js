/**
 * Service function to call Search APIs here
 * @author Akash Sharma
 * @param {*} Endpoint, Token & Data
 * @returns {JSON}
 */

import api from '../index'
class AdminService {
    /**
     * Login Admin
     * @author Akash Sharma
     * @param {*} Takes Email & Password credentials
     * @returns {JSON}
    */

    static async loginAdmin(loginCredentials) {
        return api({ method: 'POST', endpoint: '/user/login', usingAuthToken: false, data: loginCredentials })
    }

    /**
     * Forgot Password 
     * @author Akash Sharma
     * @param {*} Takes Email to send email
     * @returns {JSON}
    */

    static async forgotPassword(email) {
        return api({ method: 'POST', endpoint: '/user/forgotPassword', usingAuthToken: false, data: email})
    }

    /**
     * Reset Password 
     * @author Akash Sharma
     * @param {*} Takes New Password
     * @returns {JSON}
    */

    static async resetPassword(data) {
        return api({ method: 'POST', endpoint: '/user/resetPassword', usingAuthToken: false, data })
    }

    /**
     * Update Password 
     * @author Akash Sharma
     * @param {*} Takes Old & New Password
     * @returns {JSON}
    */

    static async updatePassword(data) {
        return api({ method: 'POST', endpoint: '/user/changePassword', usingAuthToken: true, data })
    }

    /**
     * Fetch Admin Details
     * @author Akash Sharma
     * @param {*} -
     * @returns {JSON}
    */

    static async getAdminDetail() {
        return api({ endpoint: '/user/userDetails', usingAuthToken: true })
    }

    /**
     * Fetch All Files Datalist
     * @author Akash Sharma
     * @param {*} -
     * @returns {JSON}
    */

    static async fileHistoryList() {
        return api({ endpoint: '/file/list', usingAuthToken: true })
    }

    /**
     * Delete File
     * @author Akash Sharma
     * @param {*} Takes File ID to delete File
     * @returns {JSON}
    */

    static async deleteFile(fileId) {
        return api({ method: 'POST', endpoint: '/file/delete', usingAuthToken: true, data: fileId })
    }
}

export default AdminService
