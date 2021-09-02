import React, { useState, useEffect, useRef } from 'react'
import IconDownload from '../../../assets/svgs/IconDownload'
import Icon_Accordion from '../../../assets/svgs/Icon_Accordion'
import Icon_Download_bg from '../../../assets/svgs/Icon_Download_bg'
import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import Loader from '../../Loader'

const Documents = ({ mainData, secondLevelData, level, viewMoreInit, levelName, hasViewMoreData, resetViewMore, itemClickInit, currentLevelClick, levelLoader, viewMoreLoaderLevel, exportSearchResults, hideViewMoreFor, customExport, documentsLoader }) => {
    const [ currTab, setCurrTab ] = useState('Compounds');
    const [ pageNo, setPageNo ] = useState(1);
    const [ isAccordionActive, setIsAccordionActive ] = useState(true);
    const [ showExportDropdown, setShowExportDropdown ] = useState(false);
    const [ compoundsPage, setCompoundsPage ] = useState(1);
    const [ companiesPage, setCompaniesPage ] = useState(1);

    const setActiveTab = (e) => {
        setCurrTab(e.currentTarget.firstChild.innerText)
        resetViewMore()
    }

    const title = secondLevelData[levelName]['mainData']['_id']
    const tableData = secondLevelData[levelName]['mainData']
    const tabData = secondLevelData[levelName]['currData']

    const hasDocumentsRelationalData = secondLevelData[levelName]['documentsRelationalData'] ? secondLevelData[levelName]['documentsRelationalData']  : null 
    const documentsRelationalData = hasDocumentsRelationalData

    const handleViewMore = (e) => {
        setPageNo(pageNo + 1)
        const level = e.target.getAttribute('data-level')
        const subType = e.target.getAttribute('data-type')
        const parentId = e.target.getAttribute('data-parent')
        if(subType === 'compounds'){
            setCompoundsPage(compoundsPage + 1)
            viewMoreInit(subType, compoundsPage, level, parentId, 'document')
        }else if(subType === 'companies'){
            setCompaniesPage(companiesPage + 1)
            viewMoreInit(subType, companiesPage, level, parentId, 'document')
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
    const companiesCount = tabData.companies && `(${tabData.companies.length})`

    // ? Filter out Related Diseases that dont have null value
    const rel_diseases_data =  tableData.data.rel_diseases.filter( disease => disease.disease !== null ) 
    // ? Filter out Related targets that dont have null value
    const rel_targets_data =  tableData.data.rel_targets.filter( target => target.target !== null ) 

    let gridClass 
    if(rel_diseases_data.length === 0 && rel_targets_data.length === 0 ){
        gridClass = 'one_third'
    }else if(rel_diseases_data.length === 0 || rel_targets_data.length === 0 ){
        gridClass = 'half_width'
    }else{
        gridClass = 'one_third'
    }

    // ? View More logic for each Tab
    let matchedViewMore, showCompoundsViewMore, showCompaniesViewMore

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

    if(tabData.companies && tabData.companies.length > 8){
        matchedViewMore = hideViewMoreFor.filter( item => item.type === 'companies' && item.level === Number(level) )
        if(matchedViewMore.length > 0){
            showCompaniesViewMore = false
        }else{
            showCompaniesViewMore = true
        }
    }else{
        showCompaniesViewMore = false
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

    return  (
        <div className={`search_info_main level${level} ${level > 1 ? 'accordion_item' : ''}`} id={title} data-level={level} data-type='documents'>
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
                                            <li onClick={ () => exportSearchResults('documents', secondLevelData[levelName]) }> All </li>
                                            <li onClick={ () => customExport('documents', tableData._id, 'compounds') }> Compounds </li>
                                            <li onClick={ () => customExport('documents', tableData._id, 'targets') }> Targets </li>
                                            <li onClick={ () => customExport('documents', tableData._id, 'diseases') }> Diseases </li>
                                        </ul>
                                    </div>  
                                </div>

                                <div className="cat">
                                    documents
                                </div>
                            </div>

                            <div className="mainData_table flex_view_xs">

                                {
                                    tableData.url ? (
                                    <div className="row_item flex_view_xs one_third">
                                        <div className="row_inner flex_view_xs">
                                            <div className="cell_item value"> <a href={ tableData.url } target='_blank'> { tableData.url } </a> </div>
                                            <div className="cell_item key"> Url </div>
                                        </div>
                                    </div>
                                    ) : null 
                                }

                                {
                                    tableData.type ? (
                                    <div className="row_item flex_view_xs one_third">
                                        <div className="row_inner flex_view_xs">
                                            <div className="cell_item value"> { tableData.type } </div>
                                            <div className="cell_item key"> Doc Type </div>
                                        </div>
                                    </div>
                                    ) : null   
                                }

                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value"> { tableData.year } </div>
                                        <div className="cell_item key"> Year </div>

                                    </div>
                                </div>
                                {
                                    documentsLoader && levelLoader && levelLoader === level ? (
                                        <div className="loading_div flex_view_xs middle center full_third">
                                                <span>Loading...</span>
                                        </div>
                                    ) : documentsRelationalData ? (documentsRelationalData.rel_diseases && documentsRelationalData.rel_diseases.length > 0) && (documentsRelationalData.rel_targets && documentsRelationalData.rel_targets.length > 0) ? (
                                        <>
                                            <div className="row_item flex_view_xs half_width">
                                                <div className="row_inner flex_view_xs documents_row">
                                                    <div className="cell_item value"> 
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th> Disease </th>
                                                                    <th> Score </th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                            {
                                                                rel_diseases_data.length > 0 ? rel_diseases_data.map( diseaseItem => {

                                                                    return diseaseItem.disease ? (
                                                                        <tr key={diseaseItem.disease._id}>
                                                                            <td> { diseaseItem.disease.dis_name } </td>
                                                                            <td> { diseaseItem.score } </td>
                                                                        </tr>
                                                                    ) : null
                                                                }) : <tr>
                                                                <td colSpan="2" align="center" > No Data Found </td>
                                                            </tr>

                                                            }
                                                            </tbody>
                                                            
                                                        </table>
                                                    
                                                    </div>
                                                    <div className="cell_item key"> Related Diseases </div>
                                                </div>
                                            </div>

                                            <div className="row_item flex_view_xs half_width">
                                                <div className="row_inner flex_view_xs documents_row">
                                                    <div className="cell_item value"> 
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th> Target </th>
                                                                <th> Score </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            rel_targets_data.length > 0 ? rel_targets_data.map( targetItem => {

                                                                return targetItem.target ? (
                                                                    <tr key={targetItem.target._id}>
                                                                        <td> { targetItem.target.target_name } </td>
                                                                        <td> { targetItem.score } </td>
                                                                    </tr>
                                                                ) :  null
                                                            }) : <tr>
                                                                <td colSpan="2" align="center" > No Data Found </td>
                                                            </tr>

                                                        }

                                                        </tbody>
                                                    </table>
                                                    
                                                    </div>
                                                    <div className="cell_item key"> Related Targets </div>

                                                </div>
                                            </div>
                                                    
                                        </>
                                    )
                                    : documentsRelationalData.rel_diseases && documentsRelationalData.rel_diseases.length > 0 ? (
                                        <div className="row_item flex_view_xs half_width">
                                            <div className="row_inner flex_view_xs documents_row">
                                                <div className="cell_item value"> 
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th> Disease </th>
                                                                <th> Score </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                        {
                                                            rel_diseases_data.length > 0 ? rel_diseases_data.map( diseaseItem => {

                                                                return diseaseItem.disease ? (
                                                                    <tr key={diseaseItem.disease._id}>
                                                                        <td> { diseaseItem.disease.dis_name } </td>
                                                                        <td> { diseaseItem.score } </td>
                                                                    </tr>
                                                                ) : null
                                                            }) : <tr>
                                                            <td colSpan="2" align="center" > No Data Found </td>
                                                        </tr>

                                                        }
                                                        </tbody>
                                                        
                                                    </table>
                                                
                                                </div>
                                                <div className="cell_item key"> Related Diseases </div>
                                            </div>
                                        </div>
                                    ) : documentsRelationalData.rel_diseases && documentsRelationalData.rel_diseases.length > 0 ? (
                                        <div className="row_item flex_view_xs half_width">
                                            <div className="row_inner flex_view_xs documents_row">
                                                <div className="cell_item value"> 
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th> Target </th>
                                                            <th> Score </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        rel_targets_data.length > 0 ? rel_targets_data.map( targetItem => {

                                                            return targetItem.target ? (
                                                                <tr key={targetItem.target._id}>
                                                                    <td> { targetItem.target.target_name } </td>
                                                                    <td> { targetItem.score } </td>
                                                                </tr>
                                                            ) :  null
                                                        }) : <tr>
                                                            <td colSpan="2" align="center" > No Data Found </td>
                                                        </tr>

                                                    }

                                                    </tbody>
                                                </table>
                                                
                                                </div>
                                                <div className="cell_item key"> Related Targets </div>

                                            </div>
                                        </div>
                                    ) : null : null
                                }

                            </div>
                        
                            <div className="data_table">
                                <div className="header flex_view_xs middle">
                                    <p className={`name ${currTab === 'Compounds' ? 'active' : ''}`} onClick={(e) => setActiveTab(e)}>
                                        <span className='tab_name'>Compounds</span>
                                        <span className='count'> { compoundsCount && compoundsCount }</span> 
                                    </p>
                                    <p className={`name ${currTab === 'Companies' ? 'active' : ''}`} onClick={(e) => setActiveTab(e)}>
                                        <span className='tab_name'>Companies</span>
                                        <span className='count'> { companiesCount && companiesCount }</span> 
                                    </p>
                                </div>

                                <div className="content compounds">
                                    <div className="content_inner">
                                        {
                                            levelLoader && levelLoader === level ? <Loader/> : null
                                        }
                                        <ul className={`compounds ${currTab === 'Compounds' ? 'active' : ''}`}>
                                        {
                                            tabData.compounds ? tabData.compounds.length > 0 ? (
                                                tabData.compounds.map(item => (
                                                    <li className="item" key={item._id}>
                                                        <div className="truncate" title={item.smiles} id={item._id} data-level={level} onClick={ (e) => itemClick(e, item, 'compounds') } > {item.smiles} </div>  
                                                    </li>
                                                ))
                                            ) : (
                                                <li className='no_data'>No Data Found</li>
                                            ) : null
                                        }
                                        

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
                                            ) : null  : level !== viewMoreLoaderLevel ? (
                                                <li className='view_more'> 
                                                    <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='compounds'> View More </p> 
                                                </li>
                                            ) : null
                                        } */}
                                        </ul>

                                        <ul className={`companies ${currTab === 'Companies' ? 'active' : ''}`}>
                                        {
                                            tabData.companies ? tabData.companies.length > 0 ? (
                                                
                                                tabData.companies.map(item => (
                                                    <li className="item" key={item._id}>
                                                        <div className="truncate" title={item._id} id={item._id} data-level={level} onClick={ (e) => itemClick(e, item, 'companies') }> {item._id} </div>  
                                                    </li>
                                                ))
                                                
                                                
                                            ) : (
                                                <li className='no_data'>No Data Found</li>
                                            ) : null
                                        }

                                        {
                                            showCompaniesViewMore ? (
                                                <li className='view_more'> 
                                                    <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='companies'> View More </p> 
                                                </li>
                                            ) : null
                                        }
                                        
                                        {/* {

                                            hasViewMoreData ? tabData.companies && tabData.companies.length > 8 ? (
                                                <li className='view_more'> 
                                                    <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='companies'> View More </p> 
                                                </li>
                                            ) : null : level !== viewMoreLoaderLevel ? (
                                                <li className='view_more'> 
                                                    <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='companies'> View More </p> 
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

export default Documents
