import * as actionTypes from './Types'
import UserService from '../../api/services/UserService'

/**
 * will return users list
 * @author Yamin Lawar
 * @params
 * @returns post list
 */

// ? APIS INIT & FAIL

export const fetchApiInit = () => ({
    type: actionTypes.FETCH_API_INIT
})
export const fetchApiFail = () => ({
    type: actionTypes.FETCH_API_FAIL
})

export const updateSearchResultData = (data, responseData, loadMore, compoundsPage) => ({
    type: actionTypes.UPDATE_SEARCH_DATA,
    payload: data,
    mainData: responseData,
    isLoadMore: loadMore,
    compoundsPage
})

export const hasNoData = () => ({
    type: actionTypes.NO_DATA
})

export const loadMoreInit = () => ({
    type: actionTypes.LOAD_MORE_INIT
})

export const loadMoreSuccess = () => ({
    type: actionTypes.LOAD_MORE_SUCCESS
})

export const resetSearchPage = () => ({
    type: actionTypes.RESET_SEARCH_PAGE
})

// ? First Level Search
export const searchInitAction = (page,stringType,searchString, loadMore) => async (dispatch) => {
    if(loadMore){
        dispatch(loadMoreInit())
    }else{
        dispatch(resetSearchPage()) 
        dispatch(fetchApiInit()) 
    }
    const encodedSearchString = encodeURIComponent(searchString)
    const responseData = await UserService.firstLevelSearch(page, stringType, encodedSearchString);
    let firstLevelDataArr = [];
    switch (stringType) {
        case 'companies':
                responseData.map( responseItem => {
                    const synoymsData = responseItem.synonyms.join(', ');
                    firstLevelDataArr.push({
                        title: responseItem._id, 
                        id: responseItem._id,
                        description:{
                            synonyms: synoymsData
                        },
                        originalData: responseItem
                    })
                })
                await dispatch(updateSearchResultData(firstLevelDataArr, responseData, loadMore))
                loadMore && dispatch(loadMoreSuccess())
                
                if(responseData.length < 10){
                    dispatch(hasNoData())
                }
            break;

        case 'drugs':
                responseData.map( responseItem => {
                    const synoymsData = responseItem.synonyms.join(', ');
                    firstLevelDataArr.push({
                        title: responseItem._id, 
                        id:responseItem._id, 
                        description:{
                            drug_type: responseItem.drug_type,
                            inchikey: responseItem.inchikey,
                            smiles: responseItem.ori_smiles,
                            synonyms: synoymsData,
                        },
                        originalData: responseItem
                    })
                })
                await dispatch(updateSearchResultData(firstLevelDataArr, responseData, loadMore))
                loadMore && dispatch(loadMoreSuccess())
                if(responseData.length < 10){
                    dispatch(hasNoData())
                }

            break;

        case 'diseases':
                responseData.map( responseItem => {
                    firstLevelDataArr.push({
                        title: responseItem.dis_name, 
                        id:responseItem._id, 
                        description:{
                            url: responseItem.url,
                        },
                        originalData: responseItem
                    })
                })
                await dispatch(updateSearchResultData(firstLevelDataArr, responseData, loadMore))
                loadMore && dispatch(loadMoreSuccess())
                if(responseData.length < 10 ){
                    dispatch(hasNoData())
                }

            break;
        
        case 'targets':
                responseData.map( responseItem => {

                    const organismData = responseItem.organism.join(', ');

                    firstLevelDataArr.push({
                        title: responseItem.target_name, 
                        id:responseItem._id, 
                        description:{
                            gene_name: responseItem.gene_name,
                            organism: organismData,
                        },
                        originalData: responseItem
                    })
                })
                
                await dispatch(updateSearchResultData(firstLevelDataArr, responseData, loadMore))
                loadMore && dispatch(loadMoreSuccess())
                if(responseData.length < 10){
                    dispatch(hasNoData())
                }

            break;

        case 'pathways':
                responseData.map( responseItem => {
                    const targetsData = responseItem.targets.join(', ');
                    firstLevelDataArr.push({
                        title: responseItem.path_name, 
                        id:responseItem._id,
                        description:{
                            url: responseItem.url,
                            targets: targetsData
                        },
                        originalData: responseItem
                    })
                })
                
                await dispatch(updateSearchResultData(firstLevelDataArr, responseData, loadMore))
                loadMore && dispatch(loadMoreSuccess())
                if(responseData.length < 10 ){
                    dispatch(hasNoData())
                }
            break;


        case 'compounds':
            
                responseData.data.map( responseItem => {
                    const documentsData = responseItem.documents.join(', ');
                    const sourcesData = responseItem.sources.join(', ');
                    firstLevelDataArr.push({
                        title: responseItem.smiles, 
                        id:responseItem._id, 
                        description:{
                            similarity: responseItem.similarity,
                            sources: sourcesData,
                            documents: documentsData,
                            smiles: responseItem.smiles
                        },
                        originalData: responseItem
                    })
                })
                await dispatch(updateSearchResultData(firstLevelDataArr, responseData.data, loadMore, responseData.page))
                loadMore && dispatch(loadMoreSuccess())
                if(responseData.data.length < 10 ){
                    dispatch(hasNoData())
                }

            break;


        case 'documents':
                responseData.map( responseItem => {
                    firstLevelDataArr.push({
                        title: responseItem._id, 
                        id:responseItem._id, 
                        description:{
                            type: responseItem.type,
                            year: responseItem.year,
                            url: responseItem.url,
                        },
                        originalData: responseItem
                    })
                })
                await dispatch(updateSearchResultData(firstLevelDataArr, responseData, loadMore))
                loadMore && dispatch(loadMoreSuccess())
                if(responseData.length < 10 ){
                    dispatch(hasNoData())
                }

            break;
        
        default:
            break;
    }
    // dispatch(fetchApiFail()) 
}

export const updateLevelTwo = (data, level, searchType, mainData, documentRelationalData) => ({
    type: actionTypes.UPDATE_LEVEL_TWO,
    payload: data,
    level: level,
    typeOfSearch: searchType,
    mainData: mainData,
    documentData: documentRelationalData 
}) 

export const popupLoaderTrue = () => ({
    type: actionTypes.POPUP_LOADER_TRUE,
}) 

export const popupLoaderFalse = () => ({
    type: actionTypes.POPUP_LOADER_FALSE,
})

export const updateLevel = (level,searchType,mainData) => ({
    type: actionTypes.UPDATE_LEVEL,
    level: level,
    typeOfSearch: searchType,
    mainData: mainData
})

// ? Reset 'View More' back to be visible on clicking Eye Icon
export const viewMoreDataEmpty = (isDataPresent) => ({
    type: actionTypes.NO_VIEW_MORE_DATA,
    payload: isDataPresent
    // noDataFor:
})

// ? Reset 'View More' visibility back to be visible on Changing Tabs 
export const resetViewMoreData = () => ({
    type: actionTypes.NO_VIEW_MORE_DATA,
    payload: true
})

export const resetLevels = (resetFromLevel) => ({
    type: actionTypes.RESET_LEVELS,
    payload: resetFromLevel
})


export const updateLevelLoader = (levelNo) => ({
    type: actionTypes.UPDATE_LEVEL_LOADER,
    payload: levelNo
})

export const updateDocumentsLoader = (isactive) => ({
    type: actionTypes.DOCUMENTS_LOADER,
    payload: isactive
})


// ? Second Level Search On Clicking Eye Icon
export const secondLevelSearchAction = (searchType, page, mainId, level, mainData, isPopupItemClick, parentType, parentId) => async (dispatch) => {
    
    if(isPopupItemClick){
        dispatch(resetLevels(level))
    }else null
    dispatch(updateLevelLoader(level + 1)) // ? Action to show loader at next level in Tabs section till api gets response
    dispatch(viewMoreDataEmpty(true))  // ? Reset 'View More' back to be visible on clicking Eye Icon
    let documentResponseData;
    let documentRelationalData = null;
    let responseData;
    let apiType

    switch (searchType) {
        case 'companies': apiType = 'company'
        break;

        case 'targets': apiType = 'target'
        break;

        case 'drugs': apiType = 'drug'
        break;

        case 'diseases': apiType = 'disease'
        break;
            
        case 'pathways': apiType = 'pathway'
        break;
            
        case 'compounds': apiType = 'compound'
        break;

        case 'documents': apiType = 'document'
        break;
        
        default:
            break;

    }
    await dispatch(updateLevel( level + 1, searchType, mainData ))
    
    if(isPopupItemClick){
        if(parentType === 'disease' || parentType === 'compound' || parentType === 'target' ){
            responseData = await UserService.secondLevelSearch(apiType, page, mainId, parentId, parentType);
        }else{
            if(apiType === 'document'){
                dispatch(updateDocumentsLoader(true))
                
                documentResponseData = await UserService.documentRelatedData(mainId);
                documentRelationalData = documentResponseData.data

                responseData = await UserService.secondLevelSearch(apiType, page, mainId);
            }else{
                responseData = await UserService.secondLevelSearch(apiType, page, mainId);
            }
        }
    }else{
        responseData = await UserService.secondLevelSearch(apiType, page, mainId);
    }
    await dispatch(updateLevelTwo(responseData, level + 1, searchType, mainData, documentRelationalData))
}

// ? VIEW MORE
export const viewMoreUpdateData = (apiData, subType, levelText) => ({
    type: actionTypes.SECOND_LEVEL_VIEW_MORE_DATA,
    payload: apiData,
    subType: subType,
    apiLevelText: levelText
})


export const viewMoreLoaderTrue = () => ({
    type: actionTypes.VIEW_MORE_LOADER_TRUE,
})


export const viewMoreLoaderFalse = () => ({
    type: actionTypes.VIEW_MORE_LOADER_FALSE,
})

export const viewMoreLevel = (levelNo) => ({
    type: actionTypes.UPDATE_VIEW_MORE_LEVEL,
    payload: levelNo
})

export const clearSecondLevelData = () => ({
    type: actionTypes.CLEAR_SECOND_LEVEL_POPUP_DATA,
})

export const clearSecondLevel = () => async (dispatch) => {
    dispatch(clearSecondLevelData())
}

export const hideViewMore = (hideViewMoreFor) => ({
    type: actionTypes.HIDE_VIEW_MORE,
    payload: hideViewMoreFor
})



export const viewMoreAction = (subType, page, levelText, mainId, mainType, level) => async ( dispatch ) => {
    dispatch(updateLevelLoader(level))
    dispatch(viewMoreLevel(level))

    const responseData = await UserService.viewMoreResults(mainType, page, subType, mainId);
    dispatch(viewMoreUpdateData(responseData, subType, levelText))
    dispatch(updateLevelLoader(null))
    // ? If there is no further Data on View More or Empty Response we have to hide the View More
    
    if(responseData[subType].length < 9){
        const hideViewMoreFor = {
            level: level,
            type: subType
        }
        dispatch(hideViewMore(hideViewMoreFor))
        // dispatch(viewMoreDataEmpty(false)) 
    }

}


// ? First Level Export

export const firstLevelExport = (exportData) => ({
    type: actionTypes.EXPORT_FIRST_LEVEL_DATA,
    payload: exportData
})

export const exportAllFirstLevelData = (searchString, searchType) => async ( dispatch ) => {
    dispatch(fetchApiInit()) 
    const responseData = await UserService.firstLevelExport(searchString, searchType);
    if(responseData && responseData.length > 0){
        dispatch(firstLevelExport(responseData))
    }else{
        dispatch(fetchApiFail())
    }
}

// ? Second Level Custom Export

export const customExportData = (exportData) => ({
    type: actionTypes.EXPORT_CUSTOM,
    payload: exportData
})

export const customExportPopup = (type, id, dataFor) => async ( dispatch ) => {
    dispatch(fetchApiInit()) 
    const responseData = await UserService.customExport(type, id, dataFor);
    if(responseData && responseData.length > 0){
        dispatch(customExportData(responseData))
    }else{
        dispatch(customExportData(null))
        dispatch(fetchApiFail())
    }
}
