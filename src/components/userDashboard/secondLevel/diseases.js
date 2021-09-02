import React, { useState, useEffect, useRef } from 'react'
import IconDownload from '../../../assets/svgs/IconDownload'
import Icon_Accordion from '../../../assets/svgs/Icon_Accordion'
import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import Loader from '../../Loader'

const Diseases = ({ mainData, secondLevelData, level, viewMoreInit, levelName, hasViewMoreData, resetViewMore, itemClickInit, currentLevelClick, levelLoader, viewMoreLoaderLevel, exportSearchResults, hideViewMoreFor, customExport }) => {
    const levelNo = Number(level) + 1 
    const [ currTab, setCurrTab ] = useState('Targets');
    const [ pageNo, setPageNo ] = useState(1);
    const [ showExportDropdown, setShowExportDropdown ] = useState(false);
    const [ isAccordionActive, setIsAccordionActive ] = useState(true);
    const [ drugDataAccordionActive, setDrugDataAccordionActive ] = useState(false);
    const [ pathwayDataAccordionActive, setPathwayDataAccordionActive ] = useState(false);
    const [ evidenceDataAccordionActive, setEvidenceDataAccordionActive ] = useState(false);
    const [ accordionArray, setAccordionArray ] = useState([]);

    const title = secondLevelData[levelName]['mainData']['dis_name']
    const tableData = secondLevelData[levelName]['mainData']
    const tabData = secondLevelData[levelName]['currData']
    
    const handleViewMore = (e) => {
        setPageNo(pageNo + 1)
        const level = e.target.getAttribute('data-level')
        const subType = e.target.getAttribute('data-type')
        const parentId = e.target.getAttribute('data-parent')
        viewMoreInit(subType, pageNo, level, parentId, 'disease')
    }
    
    // ? Handle Item Click
    const itemClick = (e,itemData, category) => {
        const itemId = e.target.id
        const parentType = e.target.getAttribute('data-parent')
        const parentId = e.target.getAttribute('data-parentid')
        const level = e.target.getAttribute('data-level')
        itemClickInit( category, itemId, level, itemData, parentType, parentId )
    }

    const parentId = secondLevelData[levelName]['mainData']['_id']

    const hasExtraData =  tabData.extraData
    const targetsCount = tabData.targets && `(${tabData.targets.length})` 

    let drugData
    let pathwayData
    let evidenceData
    let urls
    if(hasExtraData){
        if( tabData.targetDisease && tabData.targetDisease.length > 0){
            drugData = tabData.targetDisease[0].drug_data
            pathwayData = tabData.targetDisease[0].pathway_data
            evidenceData = tabData.targetDisease[0].evidence_type
            urls = tabData.targetDisease[0].urls && tabData.targetDisease[0].urls 
        }

    }

    const toggleExtraDataAccordion = (e) => {
        const dataItem = e.currentTarget.getAttribute('data-extra')
        let newData
        if(accordionArray.includes(dataItem)){
            newData = accordionArray.filter( item => item !== dataItem )
        }else{
            newData = [...accordionArray, dataItem]
        }
        setAccordionArray(newData)
    }

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
        <div className={`search_info_main level${level} ${level > 1 ? 'accordion_item' : ''}`} data-level={level} data-type='diseases'>
            <div className='info_descr'>
                <div className="info_header" onClick={ () => setIsAccordionActive(!isAccordionActive) }  >
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
                                            <li onClick={ () => exportSearchResults('diseases', secondLevelData[levelName]) }> All </li>
                                            <li onClick={ () => customExport('diseases', tableData._id, 'targets') }> Targets </li>
                                        </ul>
                                    </div> 
                                </div>

                                <div className="cat">
                                    diseases
                                </div>
                                 
                            </div>

                            <div className="mainData_table flex_view_xs">

                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value"> { tableData._id } </div>
                                        <div className="cell_item key"> MESH </div>
                                    </div>
                                </div>

                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value"> { tableData.dis_name } </div>
                                        <div className="cell_item key"> Disease Name </div>
                                    </div>
                                </div>

                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value"> <a href={tableData.url} target='_blank'> { tableData.url } </a> </div>
                                        <div className="cell_item key"> URL </div>
                                    </div>
                                </div>

                                {
                                    tableData.dis_info && tableData.dis_info.length > 0 ?  (
                                        <div className="row_item flex_view_xs full_width">
                                            <div className="row_inner flex_view_xs">
                                                <div className="cell_item value">
                                                    <div className='drug_data_row'>

                                                        {
                                                            tableData.dis_info.map( disease =>  (
                                                            <div className="extra_data_row flex_view_xs" key={disease.description}>
                                                                <div className="drug_card width_33">
                                                                    <div className="drug_card_inner white_bg">
                                                                        <div className="cell_item_inner value"> <a href={disease.efo_url} target='_blank'> { disease.efo_url } </a>  </div>
                                                                        <div className="cell_item_inner cell_item key"> Efo Link </div>
                                                                    </div>
                                                                </div>

                                                                <div className="drug_card width_33">
                                                                    <div className="drug_card_inner white_bg">
                                                                        <div className="cell_item_inner value"> { disease.description } </div>
                                                                        <div className="cell_item_inner cell_item key"> Description </div>
                                                                    </div>
                                                                </div>

                                                                <div className="drug_card width_33">
                                                                    <div className="drug_card_inner white_bg">
                                                                        <div className="cell_item_inner value"> { disease.cross_refs.join(', ') } </div>
                                                                        <div className="cell_item_inner cell_item key"> Cross References </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            ))
                                                        }

                                                    </div>
                                                </div>

                                                
                                                <div className="cell_item key"> Disease Info </div>
                                            </div>
                                        </div>      
                                    ) : null 
                                }
                               

                                {/*  Show Extradata */}
                                {
                                    hasExtraData ? (
                                    <>
                                        <hr className='seperator'></hr>

                                        <div className="row_item flex_view_xs half_width">
                                            <div className="row_inner flex_view_xs">
                                                <div className="cell_item value"> { tabData.targetDisease[0].global_score } </div>
                                                <div className="cell_item key"> Global Score </div>
                                            </div>
                                        </div>
                                    </>
                                    ) : null
                                }

                                {/* Extra Data Evidence Type */}
                                {
                                    evidenceData && (
                                        <div className="row_item flex_view_xs full_width">
                                            <div className="row_inner accordion_row flex_view_xs">
                                                <div className="cell_item left_header_key key "  onClick={ () => setEvidenceDataAccordionActive(!evidenceDataAccordionActive) }>
                                                    <p>Evidence Type</p> 
                                                    <span className={`toggle_icon ${evidenceDataAccordionActive ? 'down' : 'up'}`}>
                                                        <Icon_Accordion/>
                                                    </span>
                                                </div>
                                                <SlideDown className='dropdown_content'>
                                                {
                                                    evidenceDataAccordionActive ? (
                                                    <div className="cell_item value"> 
                                                        <div className='drug_data_row evidence_data_row' >
                                                            <div className="extra_data_row flex_view_xs">
                                                                <div className="drug_card width_100">

                                                                    <div className="drug_card_inner white_bg margin_bottom">
                                                                        <div className="cell_item_inner value">
                                                                            <div className='trial_item_inner flex_view_xs'>
                                                                            
                                                                                <div className="drug_card width_50">
                                                                                    <div className="drug_card_inner grey_bg">
                                                                                        <div className="cell_item_inner reduce_height value"> { evidenceData.genetic_association.ndocs }  </div>
                                                                                        <div className="cell_item_inner cell_item key"> Nr docs </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="drug_card no_padding width_50">
                                                                                    <div className="drug_card_inner grey_bg">
                                                                                        <div className="cell_item_inner reduce_height value"> { evidenceData.genetic_association.score } </div>
                                                                                        <div className="cell_item_inner cell_item key"> Score </div>
                                                                                    </div>
                                                                                </div>                                                                        

                                                                            </div>
                                                                        </div>
                                                                        <div className="cell_item_inner cell_item key"> Genetic Association </div>
                                                                    </div>

                                                                    <div className="drug_card_inner white_bg margin_bottom">
                                                                        <div className="cell_item_inner value">
                                                                            <div className='trial_item_inner flex_view_xs'>
                                                                            
                                                                                <div className="drug_card width_50">
                                                                                    <div className="drug_card_inner grey_bg">
                                                                                        <div className="cell_item_inner reduce_height value"> { evidenceData.somatic_mutation.ndocs }  </div>
                                                                                        <div className="cell_item_inner cell_item key"> Nr docs </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="drug_card no_padding width_50">
                                                                                    <div className="drug_card_inner grey_bg">
                                                                                        <div className="cell_item_inner reduce_height value"> { evidenceData.somatic_mutation.score } </div>
                                                                                        <div className="cell_item_inner cell_item key"> Score </div>
                                                                                    </div>
                                                                                </div>                                                                        

                                                                            </div>
                                                                        </div>
                                                                        <div className="cell_item_inner cell_item key"> Somatic Mutation </div>
                                                                    </div>
                                                                    
                                                                    <div className="drug_card_inner white_bg margin_bottom">
                                                                        <div className="cell_item_inner value">
                                                                            <div className='trial_item_inner flex_view_xs'>
                                                                            
                                                                                <div className="drug_card width_50">
                                                                                    <div className="drug_card_inner grey_bg">
                                                                                        <div className="cell_item_inner reduce_height value"> { evidenceData.known_drug.ndocs }  </div>
                                                                                        <div className="cell_item_inner cell_item key"> Nr docs </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="drug_card no_padding width_50">
                                                                                    <div className="drug_card_inner grey_bg">
                                                                                        <div className="cell_item_inner reduce_height value"> { evidenceData.known_drug.score } </div>
                                                                                        <div className="cell_item_inner cell_item key"> Score </div>
                                                                                    </div>
                                                                                </div>                                                                        

                                                                            </div>
                                                                        </div>
                                                                        <div className="cell_item_inner cell_item key"> Known Drug </div>
                                                                    </div>
                                                                    
                                                                    <div className="drug_card_inner white_bg margin_bottom">
                                                                        
                                                                        <div className="cell_item_inner value">
                                                                            <div className='trial_item_inner flex_view_xs'>
                                                                            
                                                                                <div className="drug_card width_50">
                                                                                    <div className="drug_card_inner grey_bg">
                                                                                        <div className="cell_item_inner reduce_height value"> { evidenceData.affected_pathway.ndocs }  </div>
                                                                                        <div className="cell_item_inner cell_item key"> Nr docs </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="drug_card no_padding width_50">
                                                                                    <div className="drug_card_inner grey_bg">
                                                                                        <div className="cell_item_inner reduce_height value"> { evidenceData.affected_pathway.score } </div>
                                                                                        <div className="cell_item_inner cell_item key"> Score </div>
                                                                                    </div>
                                                                                </div>                                                                        

                                                                            </div>
                                                                        </div>
                                                                        <div className="cell_item_inner cell_item key"> Affected Pathway </div>
                                                                        
                                                                    </div>

                                                                    <div className="drug_card_inner white_bg margin_bottom">
                                                                        <div className="cell_item_inner value">
                                                                            <div className='trial_item_inner flex_view_xs'>
                                                                            
                                                                                <div className="drug_card width_50">
                                                                                    <div className="drug_card_inner grey_bg">
                                                                                        <div className="cell_item_inner reduce_height value"> { evidenceData.rna_expression.ndocs }  </div>
                                                                                        <div className="cell_item_inner cell_item key"> Nr docs </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="drug_card no_padding width_50">
                                                                                    <div className="drug_card_inner grey_bg">
                                                                                        <div className="cell_item_inner reduce_height value"> { evidenceData.rna_expression.score } </div>
                                                                                        <div className="cell_item_inner cell_item key"> Score </div>
                                                                                    </div>
                                                                                </div>                                                                        

                                                                            </div>
                                                                        </div>
                                                                        <div className="cell_item_inner cell_item key"> Rna Expression </div>
                                                                    </div>

                                                                    <div className="drug_card_inner white_bg margin_bottom">
                                                                        <div className="cell_item_inner value">
                                                                            <div className='trial_item_inner flex_view_xs'>
                                                                            
                                                                                <div className="drug_card width_50">
                                                                                    <div className="drug_card_inner grey_bg">
                                                                                        <div className="cell_item_inner reduce_height value"> { evidenceData.literature.ndocs }  </div>
                                                                                        <div className="cell_item_inner cell_item key"> Nr docs </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="drug_card no_padding width_50">
                                                                                    <div className="drug_card_inner grey_bg">
                                                                                        <div className="cell_item_inner reduce_height value"> { evidenceData.literature.score } </div>
                                                                                        <div className="cell_item_inner cell_item key"> Score </div>
                                                                                    </div>
                                                                                </div>                                                                        

                                                                            </div>
                                                                        </div>
                                                                        <div className="cell_item_inner cell_item key"> Literature </div>
                                                                    </div>

                                                                    <div className="drug_card_inner white_bg margin_bottom">
                                                                        <div className="cell_item_inner value">
                                                                            <div className='trial_item_inner flex_view_xs'>
                                                                            
                                                                                <div className="drug_card width_50">
                                                                                    <div className="drug_card_inner grey_bg">
                                                                                        <div className="cell_item_inner reduce_height value"> { evidenceData.animal_model.ndocs }  </div>
                                                                                        <div className="cell_item_inner cell_item key"> Nr docs </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="drug_card no_padding width_50">
                                                                                    <div className="drug_card_inner grey_bg">
                                                                                        <div className="cell_item_inner reduce_height value"> { evidenceData.animal_model.score } </div>
                                                                                        <div className="cell_item_inner cell_item key"> Score </div>
                                                                                    </div>
                                                                                </div>                                                                        

                                                                            </div>
                                                                        </div>
                                                                        <div className="cell_item_inner cell_item key"> Animal Model </div>
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

                                {/* Extra Data Urls */}
                                {
                                    urls && urls.length > 0 ? (
                                        <div className="row_item flex_view_xs full_width">
                                            <div className="row_inner flex_view_xs">
                                                <div className="cell_item key"> Urls </div>
                                                <div className="cell_item value"> 
                                                    <div className='drug_data_row'>
                                                        <div className="extra_data_row flex_view_xs">
                                                            {
                                                                urls.map(url => (
                                                                <div className="drug_card width_33" key={url}>
                                                                    <div className="drug_card_inner white_bg">
                                                                        <div className="cell_item_inner reduce_height value"> <a href={url} target='_blank'> {url} </a> </div>
                                                                    </div>
                                                                </div>

                                                                ))
                                                            }

                                                        </div>

                                                    </div>
                                                </div>
                                                
                                                {/* <div className="cell_item key"> Drug Data </div> */}
                                            </div>
                                        </div>      

                                    ): null
                                }

                                {/* Extra Data Drug Type */}
                                {
                                    drugData && drugData.length > 0 ? (
                                        <div className="row_item flex_view_xs full_width">
                                            <div className="row_inner accordion_row flex_view_xs">
                                                <div className="cell_item left_header_key  key" onClick={ () => setDrugDataAccordionActive(!drugDataAccordionActive) }> 
                                                    <p>Drug Data</p> 
                                                    <span className={`toggle_icon ${drugDataAccordionActive ? 'down' : 'up'}`}>
                                                        <Icon_Accordion/>
                                                    </span>
                                                </div>

                                                <SlideDown className='dropdown_content'>
                                                    {
                                                        drugDataAccordionActive ? (
                                                        <div className="cell_item value"> 
                                                        {
                                                            drugData.map( drugitem => {
                                                                return (
                                                                <div className='drug_data_row' key={drugitem.drug._id}>
                                                                    <div className="extra_data_row flex_view_xs">
                                                                        <div className="drug_card width_50">
                                                                            <div className="drug_card_inner white_bg">
                                                                                <div className="cell_item_inner value"> {drugitem.drug._id} </div>
                                                                                <div className="cell_item_inner cell_item key"> Drug Name </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="drug_card width_20">
                                                                            <div className="drug_card_inner white_bg">
                                                                                <div className="cell_item_inner value"> {drugitem.max_phase} </div>
                                                                                <div className="cell_item_inner cell_item key"> Max Phase </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="extra_data_row flex_view_xs">
                                                                        <div className="drug_card width_100">
                                                                            <div className="drug_card_inner accordion_row white_bg">
                                                                                <div className="cell_item_inner cell_item left_header_key key" data-extra={`trial_data_${index}`} onClick={ (e) => toggleExtraDataAccordion(e) }> 
                                                                                    <p>Trial Data</p> 
                                                                                    <span className={`toggle_icon ${ accordionArray.includes(`trial_data_${index}`) ? 'down' : 'up' }`}>
                                                                                        <Icon_Accordion/>
                                                                                    </span>
                                                                                </div>

                                                                                <SlideDown className='dropdown_content'>
                                                                                    {
                                                                                        accordionArray.includes(`trial_data_${index}`) ? (
                                                                                        <div className="cell_item_inner accordion_content_value value">
                                                                                            {
                                                                                                drugitem.trial_data.length > 0 && drugitem.trial_data.map( trialItem => {
                                                                                                    return (
                                                                                                    <div className='trial_item_inner flex_view_xs'>
                                                                                                    
                                                                                                        <div className="drug_card width_80">
                                                                                                            <div className="drug_card_inner grey_bg">
                                                                                                                <div className="cell_item_inner reduce_height value"> <a href={trialItem.url} target='_blank'>{trialItem.url} </a>  </div>
                                                                                                                <div className="cell_item_inner cell_item key"> Url </div>
                                                                                                            </div>
                                                                                                        </div>

                                                                                                        <div className="drug_card no_padding width_20">
                                                                                                            <div className="drug_card_inner grey_bg">
                                                                                                                <div className="cell_item_inner reduce_height value"> {trialItem.status} </div>
                                                                                                                <div className="cell_item_inner cell_item key"> Status </div>
                                                                                                            </div>
                                                                                                        </div>                                                                        

                                                                                                    </div>

                                                                                                    )
                                                                                                } )
                                                                                            }
                                                                                        </div>

                                                                                        ) : null
                                                                                    }
                                                                                </SlideDown>
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                )
                                                            })
                                                        }
                                                        </div>

                                                        ) : null
                                                    }
                                                </SlideDown>
                                                
                                            </div>
                                        </div>      

                                    ): null
                                }

                                {/* Extra Data Pathway Data */}
                                {
                                    pathwayData && pathwayData.length > 0 ? (
                                        <div className="row_item flex_view_xs full_width">
                                            <div className="row_inner accordion_row flex_view_xs">
                                                <div className="cell_item left_header_key key"  onClick={ () => setPathwayDataAccordionActive(!pathwayDataAccordionActive) }>
                                                    <p>Pathway Data</p> 
                                                    <span className={`toggle_icon ${pathwayDataAccordionActive ? 'down' : 'up'}`}>
                                                        <Icon_Accordion/>
                                                    </span>
                                                </div>

                                                <SlideDown className='dropdown_content'>
                                                {
                                                    pathwayDataAccordionActive ? (
                                                    <div className="cell_item value"> 
                                                    {
                                                        pathwayData.map( pathwayItem => {
                                                            return (
                                                            <div className='drug_data_row pathway_data_row' key={pathwayItem.evidence}>
                                                                <div className="extra_data_row flex_view_xs">
                                                                    
                                                                    <div className="drug_card margin_bottom width_33">
                                                                        <div className="drug_card_inner white_bg">
                                                                            <div className="cell_item_inner value"> {pathwayItem.evidence} </div>
                                                                            <div className="cell_item_inner cell_item key"> Evidence </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="drug_card margin_bottom width_33">
                                                                        <div className="drug_card_inner white_bg">
                                                                            <div className="cell_item_inner value"> {pathwayItem.pathway.path_name} </div>
                                                                            <div className="cell_item_inner cell_item key"> Path Name </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="drug_card margin_bottom width_33">
                                                                        <div className="drug_card_inner white_bg">
                                                                            <div className="cell_item_inner value"> {pathwayItem.score} </div>
                                                                            <div className="cell_item_inner cell_item key"> Score </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="drug_card width_100">
                                                                        <div className="drug_card_inner white_bg">
                                                                            <div className="cell_item_inner reduce_height value"> 
                                                                                <div className='drug_data_row'>
                                                                                    <div className="extra_data_row flex_view_xs">
                                                                                        {
                                                                                            pathwayItem.papers && pathwayItem.papers.map(paper => (
                                                                                            <div className="drug_card width_33" key={paper}>
                                                                                                <div className="drug_card_inner grey_bg">
                                                                                                    <div className="cell_item_inner reduce_height value"> <a href={paper} key={paper} target='_blank'> {paper}</a> </div>
                                                                                                </div>
                                                                                            </div>

                                                                                            ))
                                                                                        }

                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                            <div className="cell_item_inner cell_item key"> Papers </div>
                                                                        </div>
                                                                    </div>

                                                                </div>

                                                            </div>
                                                            )
                                                        })
                                                    }
                                                    </div>
                                                    ) : null

                                                }
                                                
                                                </SlideDown> 
                                                
                                            </div>
                                        </div>      

                                    ): null
                                }

                                
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
                                                        <div className="truncate" id={item._id} title={item.target_name} data-parentid={ parentId } data-parent="disease" data-level={level} onClick={ (e) => itemClick(e, item, 'targets')}> {item.target_name} </div> 
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

export default Diseases
