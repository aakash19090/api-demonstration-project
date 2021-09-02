import React, { useState, useEffect, useRef } from 'react'
import IconDownload from '../../../assets/svgs/IconDownload'
import Icon_Accordion from '../../../assets/svgs/Icon_Accordion'
import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import Loader from '../../Loader'

const Pathways = ({ mainData, secondLevelData, level, viewMoreInit, levelName, hasViewMoreData, resetViewMore, itemClickInit, currentLevelClick, levelLoader, viewMoreLoaderLevel, exportSearchResults, hideViewMoreFor, customExport }) => {
    
    const [ currTab, setCurrTab ] = useState('Targets');
    const [ pageNo, setPageNo ] = useState(1);
    const [ isAccordionActive, setIsAccordionActive ] = useState(true);
    const [ showExportDropdown, setShowExportDropdown ] = useState(false);

    const title = secondLevelData[levelName]['mainData']['path_name']
    const tableData = secondLevelData[levelName]['mainData']
    const tabData = secondLevelData[levelName]['currData']
    

    const handleViewMore = (e) => {
        setPageNo(pageNo + 1)
        const level = e.target.getAttribute('data-level')
        const subType = e.target.getAttribute('data-type')
        const parentId = e.target.getAttribute('data-parent')
        viewMoreInit(subType, pageNo, level, parentId, 'pathway')
    }

    // ? Handle Item Click
    const itemClick = (e,itemData, category) => {
        const itemId = e.target.id
        const level = e.target.getAttribute('data-level')
        itemClickInit( category, itemId, level, itemData )
    }

    const parentId = secondLevelData[levelName]['mainData']['_id']
    const targetsCount = tabData.targets && `(${tabData.targets.length})`

    // ? View More logic for each Tab
    let showTargetsViewMore, matchedViewMore

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
        <div className={`search_info_main level${level} ${level > 1 ? 'accordion_item' : ''}`} data-level={level} data-type='pathways'>
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
                                            <li onClick={ () => exportSearchResults('pathways', secondLevelData[levelName]) }> All </li>
                                            <li onClick={ () => customExport('pathways', tableData._id) }> Targets </li>
                                        </ul>
                                    </div>  
                                </div>

                                <div className="cat">
                                    pathways
                                </div>
                            </div>

                            <div className="mainData_table flex_view_xs">

                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value"> {tableData._id} </div>
                                        <div className="cell_item key"> Reactome ID </div>
                                    </div>
                                </div>

                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value"> { tableData.path_name } </div>
                                        <div className="cell_item key"> Pathway Name </div>
                                    </div>
                                </div>

                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value">  <a href={tableData.url} target='_blank'> {tableData.url} </a> </div>
                                        <div className="cell_item key"> Reactome Link </div>
                                    </div>
                                </div>
                            </div>

                            <div className="data_table">
                                <div className="header flex_view_xs middle">
                                    <p className='name active'>
                                        <span className='tab_name'>Targets</span>
                                        <span className='count'> { targetsCount && targetsCount }</span> 
                                    </p>
                                </div>

                                <div className="content documents">
                                    <div className="content_inner">
                                        {
                                            levelLoader && levelLoader === level ? <Loader/> : null
                                        }
                                        <ul className='documents active'>
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
                                                        <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='documents'> View More </p> 
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

export default Pathways
