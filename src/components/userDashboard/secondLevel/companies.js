import React, { useState } from 'react'
import IconDownload from '../../../assets/svgs/IconDownload'
import Icon_Accordion from '../../../assets/svgs/Icon_Accordion'
import Icon_Download_bg from '../../../assets/svgs/Icon_Download_bg'
import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import Loader from '../../Loader'


const Companies = ({ mainData, secondLevelData, level, viewMoreInit, levelName, hasViewMoreData, resetViewMore, itemClickInit, currentLevelClick, levelLoader, viewMoreLoaderLevel, exportSearchResults, hideViewMoreFor }) => {

    const [ currTab, setCurrTab ] = useState('Compounds');
    const [ pageNo, setPageNo ] = useState(1);
    const [ isAccordionActive, setIsAccordionActive ] = useState(true);

    const title = secondLevelData[levelName]['mainData']['_id']
    const tableData = secondLevelData[levelName]['mainData']
    const tabData = secondLevelData[levelName]['currData']

    const handleViewMore = (e) => {
        setPageNo(pageNo + 1)
        const level = e.target.getAttribute('data-level')
        const subType = e.target.getAttribute('data-type')
        const parentId = e.target.getAttribute('data-parent')
        viewMoreInit(subType, pageNo, level, parentId, 'company')
    }

    // ? Handle Item Click
    const itemClick = (e,itemData, category) => {
        const itemId = e.target.id
        const level = e.target.getAttribute('data-level')
        itemClickInit( category, itemId, level, itemData )
    }
    const parentId = secondLevelData[levelName]['mainData']['_id']
    const documentsCount = tabData.documents && `(${tabData.documents.length})`

    // ? View More logic for each Tab
    let showDocumentsViewMore, matchedViewMore

    if(tabData.documents && tabData.documents.length > 8){
        matchedViewMore = hideViewMoreFor.filter( item => item.type === 'documents' && item.level === Number(level) )
        if(matchedViewMore.length > 0){
            showDocumentsViewMore = false
        }else{
            showDocumentsViewMore = true
        }
    }else{
        showDocumentsViewMore = false
    }

    // console.log('hideViewMoreFor',hideViewMoreFor)

    return (
        <div className={`search_info_main level${level} ${level > 1 ? 'accordion_item' : ''}`} data-level={level} data-type='companies'>
            <div className='info_descr'>
                <div className="info_header" onClick={ () => setIsAccordionActive(!isAccordionActive) }>
                    <h3 className='title'> { title } </h3>

                    <span className={`toggle_icon ${isAccordionActive ? 'down' : 'up'}`}>
                        <Icon_Accordion/>
                    </span>

                    <div className="export_results">
                        <button className="fileupload_btn" type="button">
                            <span className="text"> Export Results </span>
                            <span className="icon"> <IconDownload /> </span>
                        </button>
                    </div>
                </div>
                
                <SlideDown className={'my-dropdown-slidedown'}>
                    { isAccordionActive ? (
                    <div className="info_content">
                        <div className='table_title flex_view_xs middle space-between'> 
                            <div className="export">
                                Details <span className={`icon ${levelLoader && levelLoader === level ? 'disable':''}`} title="Export as CSV" onClick={ () => exportSearchResults('companies', secondLevelData[levelName]) }> <Icon_Download_bg/> </span>
                            </div>   

                            <div className="cat">
                                companies
                            </div>
                        </div>

                        <div className="mainData_table companies flex_view_xs">

                            <div className={`row_item row_item_company flex_view_xs`}>
                                <div className="row_inner flex_view_xs">
                                    <div className="cell_item value"> { tableData.synonyms.join(', ') } </div>
                                    <div className="cell_item key"> Synonyms </div>
                                </div>
                            </div>

                            <div className="row_item  row_item_company flex_view_xs one_third">
                                <div className="row_inner flex_view_xs">
                                    <div className="cell_item value"> { tableData.npatents } </div>
                                    <div className="cell_item key"> Nr patents </div>
                                </div>
                            </div>

                        </div>

                        <div className="data_table">
                            <div className="header flex_view_xs middle">
                                <p className='name active'>
                                    <span className='tab_name'>Documents</span>
                                    <span className='count'> { documentsCount && documentsCount }</span> 
                                </p>
                            </div>

                            <div className="content documents">
                                <div className="content_inner">
                                    
                                    {
                                        levelLoader && levelLoader === level ? <Loader/> : null
                                    }
                                    <ul className='documents active'>
                                    {
                                        tabData.documents ? tabData.documents.length > 0 ? (
                                            
                                            tabData.documents.map(item => (
                                                <li className="item" key={item._id}>
                                                    <div className="truncate" id={item._id} title={item._id} data-level={level} onClick={ (e) => itemClick(e, item, 'documents') }> {item._id} </div>  
                                                </li>
                                            ))
                                            
                                        ) : (
                                            <li className='no_data'>No Data Found</li>
                                        ) : null
                                    }
                                    {/* View More Section */}

                                    {
                                        showDocumentsViewMore ? (
                                            <li className='view_more'> 
                                                <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='documents'> View More </p> 
                                            </li>
                                        ) : null
                                    }
                                    
                                    {/* {

                                        hasViewMoreData ? tabData.documents && tabData.documents.length > 8 ? (
                                            <li className='view_more'> 
                                                <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='documents'> View More </p> 
                                            </li>
                                        ) : null : level === viewMoreLoaderLevel ? (
                                            null
                                        ) : (
                                            <li className='view_more'> 
                                                <p onClick={ (e) => handleViewMore(e) } data-level={level} data-type='documents'> View More </p> 
                                            </li>
                                        )
                                    } */}
                                    </ul>
                                </div>
                                
                                
                            </div>
                        </div>
                        
                    </div>

                    ) : null}
                </SlideDown>
            </div>

        </div>
    )
}

export default Companies
