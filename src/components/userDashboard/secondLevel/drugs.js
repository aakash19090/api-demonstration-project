import React, { useState, useEffect, useRef } from 'react'
import IconDownload from '../../../assets/svgs/IconDownload'
import Icon_Accordion from '../../../assets/svgs/Icon_Accordion'
import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import Loader from '../../Loader'

const Drugs = ({ mainData, secondLevelData, level, viewMoreInit, levelName, hasViewMoreData, resetViewMore, itemClickInit, currentLevelClick, levelLoader, viewMoreLoaderLevel, exportSearchResults, hideViewMoreFor, customExport }) => {

    const [ currTab, setCurrTab ] = useState('Compounds');
    const [ pageNo, setPageNo ] = useState(1);
    const [ showExportDropdown, setShowExportDropdown ] = useState(false);
    const [ isAccordionActive, setIsAccordionActive ] = useState(true);
    const [ compoundsPage, setCompoundsPage ] = useState(1);
    const [ documentsPage, setDocumentsPage ] = useState(1);
    const [ targetsPage, setTargetsPage ] = useState(1);


    const setActiveTab = (e) => {
        setCurrTab(e.currentTarget.firstChild.innerText)
        resetViewMore()
    }
    
    const title = secondLevelData[levelName]['mainData']['_id']
    const tableData = secondLevelData[levelName]['mainData']
    const tabData = secondLevelData[levelName]['currData']


    const handleViewMore = (e) => {

        setPageNo(pageNo + 1)
        const level = e.target.getAttribute('data-level')
        const subType = e.target.getAttribute('data-type')
        const parentId = e.target.getAttribute('data-parent')


        if(subType === 'compounds'){

            setCompoundsPage(compoundsPage + 1)
            viewMoreInit(subType, compoundsPage, level, parentId, 'drug')
        }else if(subType === 'documents'){

            setDocumentsPage(documentsPage + 1)
            viewMoreInit(subType, documentsPage, level, parentId, 'drug')
        }else{

            setTargetsPage(targetsPage + 1)
            viewMoreInit(subType, targetsPage, level, parentId, 'drug')
        }

    }

    // ? Handle Item Click
    const itemClick = (e,itemData, category) => {
        const itemId = e.target.id
        const level = e.target.getAttribute('data-level')
        itemClickInit( category, itemId, level, itemData )
    }
    const parentId = secondLevelData[levelName]['mainData']['_id']
    const compoundsCount = tabData.compounds && `(${tabData.compounds.length})`
    const documentsCount = tabData.documents && `(${tabData.documents.length})`
    const targetsCount = tabData.targets && `(${tabData.targets.length})`

    // ? View More logic for each Tab
    let matchedViewMore, showCompoundsViewMore, showDocumentsViewMore, showTargetsViewMore

    if(tabData.compounds && tabData.compounds.length > 8){
        matchedViewMore = hideViewMoreFor.filter( item => item.type === 'compounds' && item.level === Number(level) )
        if(matchedViewMore.length > 0){
            showCompoundsViewMore = false
        }else{
            showCompoundsViewMore = true
        }
    }else{
        showCompoundsViewMore = false
    }

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

    if(tabData.targets && tabData.targets.length > 8){
        matchedViewMore = hideViewMoreFor.filter( item => item.type === 'targets' && item.level === Number(level) )
        if(matchedViewMore.length > 0){
            showTargetsViewMore = false
        }else{
            showTargetsViewMore = true
        }
    }else{
        showTargetsViewMore = false
    }

    const dropdownRef = useRef(null)
    
    useEffect(() => {
        const handleClickOutside = (event) =>
            dropdownRef.current && !dropdownRef.current.contains(event.target)
                ? setShowExportDropdown(false)
                : null
        // ? Bind the event listener
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            // ?  Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside)
        }
    },[])

    
    return (
        <div className={`search_info_main level${level} ${level > 1 ? 'accordion_item' : ''}`} data-level={level} data-type='drugs'>
            <div className='info_descr'>
                <div className="info_header" onClick={ () => setIsAccordionActive(!isAccordionActive) } >
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
                    {
                        isAccordionActive ? (
                        <div className="info_content">

                            <div className='table_title flex_view_xs middle space-between'> 
                                <div className="export">
                                    Details 
                                    <div ref={dropdownRef} className={`icon export_btn ${levelLoader && levelLoader === level ? 'disable':''}`} onClick={() => setShowExportDropdown(!showExportDropdown)} >
                                        Export
                                        <span className={`caret_icon ${showExportDropdown ? 'rotate':''}`}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={11}
                                                height={6}
                                                viewBox="0 0 11 6"
                                            >
                                                <path
                                                    data-name="Polygon 1"
                                                    d="M5.5 6L0 0h11z"
                                                    fill="#d4d5d5"
                                                />
                                            </svg>

                                        </span>
                                        <ul className={`export_dropdown ${showExportDropdown ? 'show':''}`} >
                                            <li onClick={ () => exportSearchResults('drugs', secondLevelData[levelName]) }> All </li>
                                            <li onClick={ () => customExport('drugs', tableData._id) }> Disease-Target Associations </li>
                                        </ul>
                                    </div> 
                                </div>
                                <div className="cat">
                                    drugs
                                </div>
                            </div>

                            <div className="mainData_table flex_view_xs">
                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value"> <a href={tableData.chembl_card} target='_blank'> {tableData.chembl_card} </a> </div>
                                        <div className="cell_item key"> Chembl Card</div>

                                    </div>
                                </div>

                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value"> { tableData.drug_type } </div>
                                        <div className="cell_item key"> Drug Type </div>

                                    </div>
                                </div>

                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">

                                        <div className="cell_item value"> { tableData.inchikey } </div>
                                        <div className="cell_item key"> Inchikey </div>
                                    </div>
                                </div>


                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value overflow"> { tableData.ori_smiles } </div>
                                        <div className="cell_item key"> Original Smiles </div>
                                    </div>
                                </div>

                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value"> { tableData.synonyms.join(', ') } </div>
                                        <div className="cell_item key"> Drug Synonyms </div>

                                    </div>
                                </div>

                                {
                                    tableData.admin_route.length > 0 ? (
                                        <div className="row_item flex_view_xs one_third">
                                            <div className="row_inner flex_view_xs">
                                                <div className="cell_item value"> { tableData.admin_route.join(', ') } </div>
                                                <div className="cell_item key"> Administration Route </div>

                                            </div>
                                        </div>
                                    ) : null
                                }

                            </div>

                            <div className="data_table">
                                <div className="header flex_view_xs middle">
                                    <p className={`name ${currTab === 'Compounds' ? 'active' : ''}`} onClick={(e) => setActiveTab(e)}>
                                        <span className='tab_name'>Compounds</span>
                                        <span className='count'> { compoundsCount && compoundsCount }</span> 
                                    </p>
                                    <p className={`name ${currTab === 'Documents' ? 'active' : ''}`} onClick={(e) => setActiveTab(e)}>
                                        <span className='tab_name'>Documents</span>
                                        <span className='count'> { documentsCount && documentsCount }</span> 
                                    </p>
                                    <p className={`name ${currTab === 'Targets' ? 'active' : ''}`} onClick={(e) => setActiveTab(e)}>
                                        <span className='tab_name'>Targets</span>
                                        <span className='count'> { targetsCount && targetsCount }</span> 
                                    </p>
                                </div>

                                <div className="content">
                                    <div className="content_inner">
                                        {
                                            levelLoader && levelLoader === level ? <Loader/> : null
                                        }
                                            <ul className={`compounds ${currTab === 'Compounds' ? 'active' : ''}`}>
                                            {
                                                tabData.compounds ? tabData.compounds.length > 0 ? (
                                                    tabData.compounds.map(item => (
                                                        <li className="item" key={item._id}>
                                                            <div className="truncate" id={item._id} title={item.smiles} data-level={level} onClick={ (e) => itemClick(e, item, 'compounds')}> {item.smiles} </div>
                                                        </li>  
                                                    ))
                                                ) : (
                                                    <li className='no_data'>No Data Found</li>
                                                ) : null
                                            }

                                            {/* View More Section */}

                                            {
                                                showCompoundsViewMore ? (
                                                    <li className='view_more'> 
                                                        <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='compounds'> View More </p> 
                                                    </li>
                                                ) : null
                                            }
                                            
                                            {/* {

                                                hasViewMoreData ? tabData.compounds && tabData.compounds.length > 8 ? (
                                                    <li className='view_more'> 
                                                        <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='compounds'> View More </p> 
                                                    </li>
                                                ) : null : level !== viewMoreLoaderLevel ? (
                                                    <li className='view_more'> 
                                                        <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='compounds'> View More </p> 
                                                    </li>
                                                ) : null
                                            } */}
                                            </ul>

                                            <ul className={`documents ${currTab === 'Documents' ? 'active' : ''}`}>
                                            {
                                                tabData.documents ? tabData.documents.length > 0 ? (
                                                    tabData.documents.map(item => {
                                                        return <li className="item" key={item._id}> 
                                                            <div className="truncate" id={item._id} title={item._id} data-level={level} onClick={ (e) => itemClick(e, item, 'documents') }> {item._id} </div> 
                                                        </li>
                                                    })
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
                                                ) : null : level !== viewMoreLoaderLevel ? (
                                                    <li className='view_more'> 
                                                        <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='documents'> View More </p> 
                                                    </li>
                                                ) : null
                                            } */}
                                            </ul>

                                            <ul className={`targets ${currTab === 'Targets' ? 'active' : ''}`}>
                                            {
                                                tabData.targets ? tabData.targets.length > 0 ? (
                                                    tabData.targets.map(item => (
                                                        <li className="item" key={item._id}>
                                                            <div className="truncate" title={item.target_name} id={item._id} data-level={level} onClick={ (e) => itemClick(e, item, 'targets') }> {item.target_name} </div> 
                                                        </li>  
                                                    ))
                                                ) : (
                                                    <li className='no_data'>No Data Found</li>
                                                ) : null
                                            }
                                            {/* View More Section */}
                                            
                                            {
                                                showTargetsViewMore ? (
                                                    <li className='view_more'> 
                                                        <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='targets'> View More </p> 
                                                    </li>
                                                ) : null
                                            }

                                            {/* {

                                                hasViewMoreData ? tabData.targets && tabData.targets.length > 8 ? (
                                                    <li className='view_more'> 
                                                        <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='targets'> View More </p> 
                                                    </li>
                                                ) : null : level !== viewMoreLoaderLevel ? (
                                                    <li className='view_more'> 
                                                        <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='targets'> View More </p> 
                                                    </li>
                                                ) : null
                                            } */}
                                        </ul>
                                    </div>
                                    
                                </div>
                            </div>

                        </div>

                        ) : null
                    }
                </SlideDown>
                

            </div>
        </div>
    )
}

export default Drugs
