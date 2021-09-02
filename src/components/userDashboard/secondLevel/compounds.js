import React, { useState } from 'react'
import IconDownload from '../../../assets/svgs/IconDownload'
import Icon_Accordion from '../../../assets/svgs/Icon_Accordion'
import Icon_Download_bg from '../../../assets/svgs/Icon_Download_bg'
import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import Loader from '../../Loader'

const Compounds = ({ mainData, secondLevelData, level, viewMoreInit, levelName, hasViewMoreData, resetViewMore, itemClickInit, currentLevelClick, levelLoader, viewMoreLoaderLevel, exportSearchResults, hideViewMoreFor }) => {
    const [ currTab, setCurrTab ] = useState('Documents');
    const [ pageNo, setPageNo ] = useState(1);
    const [ isAccordionActive, setIsAccordionActive ] = useState(true);

    const [ documentsPage, setDocumentsPage ] = useState(1);
    const [ drugsPage, setDrugsPage ] = useState(1);
    const [ targetsPage, setTargetsPage ] = useState(1);
    const [ biodataDataAccordionActive, setBiodataDataAccordionActive ] = useState(false);
    const [ structureDataAccordionActive, setStructureDataAccordionActive ] = useState(false);


    const setActiveTab = (e) => {
        setCurrTab(e.currentTarget.firstChild.innerText)
        resetViewMore()
    }
    const title = secondLevelData[levelName]['mainData']['smiles']
    const tableData = secondLevelData[levelName]['mainData']
    const tabData = secondLevelData[levelName]['currData']

    const handleViewMore = (e) => {
        setPageNo(pageNo + 1)
        const level = e.target.getAttribute('data-level')
        const subType = e.target.getAttribute('data-type')
        const parentId = e.target.getAttribute('data-parent')
        if(subType === 'documents'){
            setDocumentsPage(documentsPage + 1)
            viewMoreInit(subType, documentsPage, level, parentId, 'compound')
        }else if(subType === 'drugs'){
            setDrugsPage(drugsPage + 1)
            viewMoreInit(subType, drugsPage, level, parentId, 'compound')
        }else{
            setTargetsPage(targetsPage + 1)
            viewMoreInit(subType, targetsPage, level, parentId, 'compound')
        }
    }

    // ? Handle Item Click
    const itemClick = (e,itemData, category) => {
        const itemId = e.target.id
        const level = e.target.getAttribute('data-level')
        const parentType = e.target.getAttribute('data-parent')
        const parentId = e.target.getAttribute('data-parentid')
        // itemClickInit( category, itemId, level, itemData )
        itemClickInit( category, itemId, level, itemData, parentType, parentId ) // ? Uncomment this later
        // ? Issue when extra data from Compounds -> Targets
    }

    const parentId = secondLevelData[levelName]['mainData']['_id']
    const documentsCount = tabData.documents && `(${tabData.documents.length})`
    const drugsCount = tabData.drugs && `(${tabData.drugs.length})`
    const targetsCount = tabData.targets && `(${tabData.targets.length})`

    const hasExtraData =  tabData.extraData

    let biodata
    let structureData
    if(hasExtraData){
        if( tabData.biodata && tabData.biodata.length > 0){
            biodata = tabData.biodata[0]
        }
        if( tabData.structure && tabData.structure.length > 0){
            structureData = tabData.structure[0]
        }
    }

    // ? View More logic for each Tab
    let matchedViewMore, showDocumentsViewMore, showDrugsViewMore, showTargetsViewMore

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

    if(tabData.drugs && tabData.drugs.length > 8){
        matchedViewMore = hideViewMoreFor.filter( item => item.type === 'drugs' && item.level === Number(level) )
        if(matchedViewMore.length > 0){
            showDrugsViewMore = false
        }else{
            showDrugsViewMore = true
        }
    }else{
        showDrugsViewMore = false
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

    return (
        <div className={`search_info_main level${level} ${level > 1 ? 'accordion_item' : ''}`} data-level={level} data-type='compounds'>
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
                                    Details <span className={`icon ${levelLoader && levelLoader === level ? 'disable':''}`} title="Export as CSV" onClick={ () => exportSearchResults('compounds', secondLevelData[levelName]) }> <Icon_Download_bg/> </span> 
                                </div>

                                <div className="cat">compounds</div>
                            </div>
                            
                            <div className="mainData_table flex_view_xs">

                                {
                                    tableData._id ? (
                                    <div className="row_item flex_view_xs one_third">
                                        <div className="row_inner flex_view_xs">
                                            <div className="cell_item value"> {tableData._id}  </div>
                                            <div className="cell_item key"> Inchikey </div>

                                        </div>
                                    </div>
                                    ) : null
                                }


                                {
                                    tableData.smiles ? (
                                    <div className="row_item flex_view_xs one_third">
                                        <div className="row_inner flex_view_xs">
                                            <div className="cell_item value"> {tableData.smiles}  </div>
                                            <div className="cell_item key"> Smiles</div>

                                        </div>
                                    </div>
                                    ) : null
                                }

                                {
                                    tableData.similarity ? (
                                    <div className="row_item flex_view_xs one_third">
                                        <div className="row_inner flex_view_xs">
                                            <div className="cell_item value"> {tableData.similarity}  </div>
                                            <div className="cell_item key"> Similarity </div>
                                        </div>
                                    </div>
                                    ) : null
                                }

                                {
                                    tableData.sources ? (
                                        <div className="row_item flex_view_xs one_third">
                                            <div className="row_inner flex_view_xs">
                                                <div className="cell_item value">  { tableData.sources.join(', ') } </div>
                                                <div className="cell_item key"> Sources </div>

                                            </div>
                                        </div>
                                    ) : null
                                }

                               
                                {/* Extra Data Bio Data */}
                                {
                                    biodata && (
                                        <div className="row_item flex_view_xs full_width">
                                            <div className="row_inner accordion_row  flex_view_xs">
                                                <div className="cell_item left_header_key key" onClick={ () => setBiodataDataAccordionActive(!biodataDataAccordionActive) }>
                                                    <p>Biodata</p> 
                                                    <span className={`toggle_icon ${biodataDataAccordionActive ? 'down' : 'up'}`}>
                                                        <Icon_Accordion/>
                                                    </span>
                                                </div>
                                                <SlideDown className='dropdown_content'>
                                                    {
                                                        biodataDataAccordionActive ? (
                                                        <div className="cell_item value"> 
                                                            <div className='drug_data_row'>
                                                                <div className="extra_data_row flex_view_xs">

                                                                    <div className="drug_card width_25">
                                                                        <div className="drug_card_inner white_bg">
                                                                            <div className="cell_item_inner value"> {biodata.compound} </div>
                                                                            <div className="cell_item_inner cell_item key"> Compound </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="drug_card width_25 no_padding">
                                                                        <div className="drug_card_inner white_bg">
                                                                            <div className="cell_item_inner value"> {biodata.target} </div>
                                                                            <div className="cell_item_inner cell_item key"> Target </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="drug_card width_25">
                                                                        <div className="drug_card_inner white_bg">
                                                                            <div className="cell_item_inner value"> {biodata.pactivity} </div>
                                                                            <div className="cell_item_inner cell_item key"> pActivity </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="drug_card width_25">
                                                                        <div className="drug_card_inner white_bg">
                                                                            <div className="cell_item_inner value"> <a href={biodata.source} target='_blank'> {biodata.source} </a> </div>
                                                                            <div className="cell_item_inner cell_item key"> Source </div>
                                                                        </div>
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

                                {/* Extra Data Structure Data */}
                                {
                                    structureData && (
                                        <div className="row_item flex_view_xs full_width">
                                            <div className="row_inner accordion_row flex_view_xs">
                                                <div className="cell_item left_header_key key" onClick={ () => setStructureDataAccordionActive(!structureDataAccordionActive) }>
                                                    <p>Structure</p> 
                                                    <span className={`toggle_icon ${structureDataAccordionActive ? 'down' : 'up'}`}>
                                                        <Icon_Accordion/>
                                                    </span>
                                                </div>

                                                <SlideDown className='dropdown_content'>
                                                    {
                                                        structureDataAccordionActive ? (
                                                        <div className="cell_item value"> 
                                                            <div className='drug_data_row'>
                                                                <div className="extra_data_row flex_view_xs">

                                                                    <div className="drug_card width_33">
                                                                        <div className="drug_card_inner white_bg">
                                                                            <div className="cell_item_inner value"> {structureData.compound} </div>
                                                                            <div className="cell_item_inner cell_item key"> Compound </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="drug_card width_33 no_padding">
                                                                        <div className="drug_card_inner white_bg">
                                                                            <div className="cell_item_inner value"> {structureData.target} </div>
                                                                            <div className="cell_item_inner cell_item key"> Target </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="drug_card width_33">
                                                                        <div className="drug_card_inner white_bg">
                                                                            <div className="cell_item_inner value"> {structureData.pactivity} </div>
                                                                            <div className="cell_item_inner cell_item key"> Pactivity </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="extra_data_row flex_view_xs">
                                                                    <div className="drug_card width_100">
                                                                        <div className="drug_card_inner white_bg">
                                                                            <div className="cell_item_inner value">
                                                                                <div className='trial_item_inner flex_view_xs'>
                                                                                
                                                                                    <div className="drug_card width_33 margin_bottom">
                                                                                        <div className="drug_card_inner grey_bg">
                                                                                            <div className="cell_item_inner value"> {structureData.structure.pdb} </div>
                                                                                            <div className="cell_item_inner cell_item key"> Pdb </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="drug_card width_33 margin_bottom">
                                                                                        <div className="drug_card_inner grey_bg">
                                                                                            <div className="cell_item_inner value"> {structureData.structure.ligand} </div>
                                                                                            <div className="cell_item_inner cell_item key"> Ligand </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="drug_card width_33 margin_bottom">
                                                                                        <div className="drug_card_inner grey_bg">
                                                                                            <div className="cell_item_inner value"> {structureData.structure.resolution} </div>
                                                                                            <div className="cell_item_inner cell_item key"> Resolution </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="drug_card width_33 margin_bottom">
                                                                                        <div className="drug_card_inner grey_bg">
                                                                                            <div className="cell_item_inner value"> {structureData.structure.year} </div>
                                                                                            <div className="cell_item_inner cell_item key"> Year </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="drug_card width_33 margin_bottom">
                                                                                        <div className="drug_card_inner grey_bg">
                                                                                            <div className="cell_item_inner value">  <a href={structureData.structure.url} target='_blank'> {structureData.structure.url} </a>   </div>
                                                                                            <div className="cell_item_inner cell_item key"> Url </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="drug_card width_33 margin_bottom">
                                                                                        <div className="drug_card_inner grey_bg">
                                                                                            <div className="cell_item_inner value"> {structureData.structure.files} </div>
                                                                                            <div className="cell_item_inner cell_item key"> Files </div>
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                            <div className="cell_item_inner cell_item key"> Structure </div>
                                                                        </div>
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

                            </div>

                            <div className="data_table">
                                <div className="header flex_view_xs middle">
                                    <p className={`name ${currTab === 'Documents' ? 'active' : ''}`} onClick={(e) => setActiveTab(e)}>
                                        <span className='tab_name'>Documents</span>
                                        <span className='count'> { documentsCount && documentsCount }</span> 
                                    </p>
                                    <p className={`name ${currTab === 'Drugs' ? 'active' : ''}`} onClick={(e) => setActiveTab(e)}>
                                        <span className='tab_name'>Drugs</span>
                                        <span className='count'> { drugsCount && drugsCount }</span> 
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
                                        <ul className={`documents ${currTab === 'Documents' ? 'active' : ''}`}>
                                        {
                                            tabData.documents ? tabData.documents.length > 0 ? (
                                                tabData.documents.map(item => (
                                                    <li className="item" key={item._id} > 
                                                        <div className="truncate" title={item._id} id={item._id} data-level={level} onClick={ (e) => itemClick(e, item, 'documents')}> {item._id} </div>  
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
                                            ) : null : level !== viewMoreLoaderLevel ? (
                                                <li className='view_more'> 
                                                    <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='documents'> View More </p> 
                                                </li>
                                            ) : null
                                        } */}
                                        </ul>

                                        <ul className={`drugs ${currTab === 'Drugs' ? 'active' : ''}`}>
                                        {
                                            tabData.drugs ? tabData.drugs.length > 0 ? (
                                                tabData.drugs.map(item => {
                                                    return <li className="item" key={item._id} > 
                                                        <div className="truncate" title={item._id} id={item._id} data-level={level} onClick={ (e) => itemClick(e, item, 'drugs') }> {item._id} </div>  
                                                    </li>
                                                })
                                            ) : (
                                                <li className='no_data'>No Data Found</li>
                                            ) : null
                                        }

                                        {/* View More Section */}

                                        {
                                            showDrugsViewMore ? (
                                                <li className='view_more'> 
                                                    <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='drugs'> View More </p> 
                                                </li>
                                            ) : null
                                        }
                                        
                                        {/* {

                                            hasViewMoreData ? tabData.drugs && tabData.drugs.length > 8 ? (
                                                <li className='view_more'> 
                                                    <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='drugs'> View More </p> 
                                                </li>
                                            ) : null : level !== viewMoreLoaderLevel ? (
                                                <li className='view_more'> 
                                                    <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='drugs'> View More </p> 
                                                </li>
                                            ) : null
                                        } */}
                                        </ul>

                                        <ul className={`targets ${currTab === 'Targets' ? 'active' : ''}`}>
                                        {
                                            tabData.targets ? tabData.targets.length > 0 ? (
                                                tabData.targets.map(item => (
                                                    <li className="item" key={item._id}> 
                                                        <div className="truncate" title={item.target_name} id={item._id} data-parentid={ parentId } data-parent="compound" data-level={level} onClick={ (e) => itemClick(e, item, 'targets') }> {item.target_name} </div>  
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

export default Compounds
