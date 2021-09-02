/**
 * Service function to call User APIs here
 * @author Akash Sharma
 * @param {*} Endpoint, Token & Data
 * @returns {JSON}
 */

import api from '../index'

class UserService {
    /**
     * Get first level Search Results from API
     * @author Akash Sharma
     * @param {*} Page Number, Searched String, & Dropdown Type value
     * @returns {JSON}
     */
    static firstLevelSearch(page, stringType, searchString) {
        return api({ endpoint: `/data/firstLevelSearch?page=${page}&stringType=${stringType}&searchString=${searchString}`, usingAuthToken: false })
    }

    /**
     * Get Second level Search Results from API on clicking Eye Icon or Item Click
     * @author Akash Sharma
     * @param {*} Takes Search Type, Page no, Item ID, Parent ID, Parent Type
     * @returns {JSON}
     */
    
    static secondLevelSearch(apiType, page, mainId, parentId, parentType) {
        let endpoint
        if(parentId && parentType){
            endpoint = `/data/${apiType}?page=${page}&_id=${mainId}&parentId=${parentId}&parent=${parentType}&dataFor=all`
        }else{
            endpoint = `/data/${apiType}?page=${page}&_id=${mainId}&dataFor=all`   
        }
        return api({ endpoint, usingAuthToken: false })
    }
    
    /**
     * View More Results on Clicking 'View More'
     * @author Akash Sharma
     * @param {*} Takes Search Type, Page No, Type of Item Clicked, Main Parent ID
     * @returns {JSON}
     */

    static viewMoreResults(mainType, page, subType, mainId) {
        return api({ endpoint: `/data/${mainType}?page=${page}&dataFor=${subType}&_id=${mainId}`, usingAuthToken: false })
    }

    /**
     * View More Results on Clicking 'View More'
     * @author Akash Sharma
     * @param {*} Takes Search String to Get All Compounds
     * @returns {JSON}
     */

     static firstLevelExport(searchString, searchType) {
        return api({ endpoint: `/export/firstLevelExport?searchString=${searchString}&stringType=${searchType}`, usingAuthToken: false })
    }

    /**
     * Custom Export from Second Level Popup
     * @author Akash Sharma
     * @param {*} Takes Main Type, ID & Subtype
     * @returns {JSON}
     */


    static customExport(type,id, dataFor) {
        let endpoint
        if(dataFor){
            endpoint = `/export/secondLevel/${type}?id=${id}&dataFor=${dataFor}`
        }else{
            endpoint = `/export/secondLevel/${type}?id=${id}`   
        }
        return api({ endpoint, usingAuthToken: false })
    }

    static documentRelatedData(id) {
        return api({ endpoint: `/data/document/populate?_id=${id}`, usingAuthToken: false })
    }
}

export default UserService
