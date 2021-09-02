import * as actionTypes from '../actions/Types'

const initialState = {
    isLoading: false,
    searchPage: 1,
    searchData:{
        firstLevelData:[],
        loadMore: false,
        hasData: false,
        compoundsPage: null
    },
    popupLoader: false,
    viewMoreLoader: false,
    hasViewMoreData: true,
    levelLoader: false,
    secondLevelData: {},
    secondLevelLoader: null,
    viewMoreLevel: null,
    compoundsToExport: null,
    hideViewMoreFor: [],
    customExport:null,
    documentDataLoader:false,
    documentsRelationalData: null
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
        
        case actionTypes.UPDATE_SEARCH_DATA: 
            const firstLevelSearchData = state.searchData.firstLevelData
            const isLoadMoreActive = action.isLoadMore
            return { 
                ...state, 
                isLoading: false,
                searchData:{
                    ...state.searchData,
                    // ? Check if Load More is Clicked Then Append new Data to Previous Data in state  Otherwise simply update response in state
                    firstLevelData: isLoadMoreActive ? firstLevelSearchData.length > 0 ? firstLevelSearchData.concat(action.payload) : action.payload : action.payload,
                    hasData: true,
                    compoundsPage: action.compoundsPage ? action.compoundsPage : null
                }
            }


        case actionTypes.NO_DATA: 
            return { 
                ...state, 
                isLoading: false,
                searchData: {
                    ...state.searchData,
                    // firstLevelData: [],
                    hasData: false,
                    loadMore: false,
                },
            }

        case actionTypes.LOAD_MORE_INIT: 
            return { 
                ...state, 
                searchData: {
                    ...state.searchData,
                    loadMore: true,
                },
            }

        case actionTypes.LOAD_MORE_SUCCESS: 
            return { 
                ...state, 
                searchPage: state.searchPage + 1,
                searchData: {
                    ...state.searchData,
                    loadMore: false,
                },
            }
            
        case actionTypes.RESET_SEARCH_PAGE: 
            return { 
                ...state, 
                searchPage: 1,
            }

        case actionTypes.UPDATE_LEVEL: 
            return { 
                ...state, 
                secondLevelData: {
                    ...state.secondLevelData,
                    [`level${action.level}`]: {
                        mainData: action.mainData,
                        type: action.typeOfSearch,
                        currData: {}
                    }
                },
            }

        case actionTypes.DOCUMENTS_LOADER: 
            return { 
                ...state, 
                documentDataLoader: action.payload
            }

        case actionTypes.UPDATE_LEVEL_TWO: 
            return { 
                // ? Concatenate here data in SEcondlevel
                ...state, 
                popupLoader: false,
                secondLevelLoader: null,
                documentDataLoader: false,
                secondLevelData: {
                    ...state.secondLevelData,
                    [`level${action.level}`]: {
                        mainData: action.mainData,
                        type: action.typeOfSearch,
                        currData: action.payload,
                        documentsRelationalData: action.documentData
                    }
                },
            }

        case actionTypes.SECOND_LEVEL_VIEW_MORE_DATA: 
            const levelText = action.apiLevelText
            const subType = action.subType
            const viewMoreData = action.payload

            const existingMainDataArr = state.secondLevelData[levelText]['mainData']

            const existingType = state.secondLevelData[levelText]['type']
            
            const updatedCurrDataTypeArr = state.secondLevelData[levelText]['currData'][subType].concat(action.payload[subType])

            const existingCurrData = state.secondLevelData[levelText]['currData']
            existingCurrData[subType] = updatedCurrDataTypeArr

            const currDataObj = existingCurrData

            return  {
                ...state, 
                popupLoader: false,
                secondLevelData : {
                    ...state.secondLevelData,
                    [levelText]: {
                        mainData: existingMainDataArr,
                        type: existingType,
                        currData: currDataObj
                    } 
                }
                // a: state.a.concat(action.payload)
            }

        case actionTypes.POPUP_LOADER_TRUE: 
            return { 
                ...state, 
                popupLoader: true,
            }


        case actionTypes.POPUP_LOADER_FALSE: 
            return { 
                ...state, 
                popupLoader: false,
            }


        case actionTypes.VIEW_MORE_LOADER_TRUE: 
            return { 
                ...state, 
                viewMoreLoader: true,
            }

        case actionTypes.VIEW_MORE_LOADER_FALSE: 
            return { 
                ...state, 
                viewMoreLoader: false,
            }

        case actionTypes.NO_VIEW_MORE_DATA: 
            return { 
                ...state, 
                hasViewMoreData: action.payload,
            }

        case actionTypes.CLEAR_SECOND_LEVEL_POPUP_DATA: 
            return { 
                ...state, 
                hideViewMoreFor: [],
                secondLevelData:{}
            }

        case actionTypes.RESET_LEVELS: 
            const resetLevelStart = action.payload
            const levelCount = Object.entries(state.secondLevelData).length
            let existingSecondLevelState = state.secondLevelData
            for (let i = 1; i <= levelCount; i++) {
                if( i > resetLevelStart){
                    let levelObj = `level${i}`
                    delete existingSecondLevelState[levelObj]
                }
            }
            return{
                ...state,
                hideViewMoreFor: state.hideViewMoreFor.filter(item => item.level !== (resetLevelStart + 1) )
            }

        case actionTypes.UPDATE_LEVEL_LOADER: 
            return { 
                ...state, 
                secondLevelLoader: action.payload
            }

        case actionTypes.UPDATE_VIEW_MORE_LEVEL: 
            return { 
                ...state, 
                viewMoreLevel: action.payload
            }

        case actionTypes.EXPORT_FIRST_LEVEL_DATA: 
            return { 
                ...state, 
                isLoading: false,
                compoundsToExport: action.payload
            }

        case actionTypes.EXPORT_CUSTOM: 
            return { 
                ...state, 
                isLoading: false,
                customExport: action.payload
            }

        case actionTypes.HIDE_VIEW_MORE: 
            return { 
                ...state, 
                hideViewMoreFor: [...state.hideViewMoreFor, action.payload] 
            }


        default:
            return state
    }
}
