import React, { useState, useEffect, useRef } from 'react'
import IconDownload from '../../../assets/svgs/IconDownload'
import Icon_Accordion from '../../../assets/svgs/Icon_Accordion'
import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import Loader from '../../Loader'

const Targets = ({ mainData, secondLevelData, level, viewMoreInit, levelName, hasViewMoreData, resetViewMore, itemClickInit, currentLevelClick, levelLoader, viewMoreLoaderLevel, exportSearchResults, hideViewMoreFor, customExport }) => {

    const [ currTab, setCurrTab ] = useState('Compounds');
    const [ compoundsPage, setCompoundsPage ] = useState(1);
    const [ diseasesPage, setDiseasesPage ] = useState(1);
    const [ pathwaysPage, setPathwaysPage ] = useState(1);

    const [ isAccordionActive, setIsAccordionActive ] = useState(true);
    const [ showExportDropdown, setShowExportDropdown ] = useState(false);
    const [ drugDataAccordionActive, setDrugDataAccordionActive ] = useState(false);
    const [ pathwayDataAccordionActive, setPathwayDataAccordionActive ] = useState(false);
    const [ evidenceDataAccordionActive, setEvidenceDataAccordionActive ] = useState(false);
    const [ biodataDataAccordionActive, setBiodataDataAccordionActive ] = useState(false);
    const [ structureDataAccordionActive, setStructureDataAccordionActive ] = useState(false);
    const [ accordionArray, setAccordionArray ] = useState([]);

    const setActiveTab = (e) => {
        setCurrTab(e.currentTarget.firstChild.innerText)
        resetViewMore()
    }
    const title = secondLevelData[levelName]['mainData']['target_name']
    const tableData = secondLevelData[levelName]['mainData']
    const tabData = secondLevelData[levelName]['currData']
    

    const handleViewMore = (e) => {
        const level = e.target.getAttribute('data-level')
        const subType = e.target.getAttribute('data-type')
        const parentId = e.target.getAttribute('data-parent')
        if(subType === 'compounds'){
            setCompoundsPage(compoundsPage + 1)
            viewMoreInit(subType, compoundsPage, level, parentId, 'target')
        }else if(subType === 'diseases'){
            setDiseasesPage(diseasesPage + 1)
            viewMoreInit(subType, diseasesPage, level, parentId, 'target')
        }else{
            setPathwaysPage(pathwaysPage + 1)
            viewMoreInit(subType, pathwaysPage, level, parentId, 'target')
        }
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

    const compoundsCount = tabData.compounds && `(${tabData.compounds.length})`   
    const diseasesCount = tabData.diseases && `(${tabData.diseases.length})`  
    const pathwaysCount = tabData.pathways && `(${tabData.pathways.length})` 

    let drugData
    let pathwayData
    let evidenceData
    let biodata
    let structureData
    let urls
    
    if(hasExtraData){
        if( tabData.targetDisease && tabData.targetDisease.length > 0){
            drugData = tabData.targetDisease[0].drug_data
            pathwayData = tabData.targetDisease[0].pathway_data
            evidenceData = tabData.targetDisease[0].evidence_type
            urls = tabData.targetDisease[0].urls && tabData.targetDisease[0].urls 
        }
        if( tabData.biodata && tabData.biodata.length > 0){
            biodata = tabData.biodata[0]
        }
        if( tabData.structure && tabData.structure.length > 0){
            structureData = tabData.structure[0]
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
    let matchedViewMore, showCompoundsViewMore, showDiseasesViewMore, showPathwaysViewMore

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

    if(tabData.diseases && tabData.diseases.length > 8){
        matchedViewMore = hideViewMoreFor.filter( item => item.type === 'diseases' && item.level === Number(level) )
        if(matchedViewMore.length > 0){
            showDiseasesViewMore = false
        }else{
            showDiseasesViewMore = true
        }
    }else{
        showDiseasesViewMore = false
    }

    if(tabData.pathways && tabData.pathways.length > 8){
        matchedViewMore = hideViewMoreFor.filter( item => item.type === 'pathways' && item.level === Number(level) )
        if(matchedViewMore.length > 0){
            showPathwaysViewMore = false
        }else{
            showPathwaysViewMore = true
        }
    }else{
        showPathwaysViewMore = false
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
        <div className={`search_info_main level${level} ${level > 1 ? 'accordion_item' : ''}`} data-level={level} data-type='targets'>
            <div className='info_descr'>
                <div className="info_header"  onClick={ () => setIsAccordionActive(!isAccordionActive) }>
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
                                    <div ref={dropdownRef}  className={`icon export_btn ${levelLoader && levelLoader === level ? 'disable':''}`} onClick={() => setShowExportDropdown(!showExportDropdown)} >
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
                                            <li onClick={ () => exportSearchResults('targets', secondLevelData[levelName]) }> All </li>
                                            <li onClick={ () => customExport('targets', tableData._id, 'diseases') }> Diseases </li>
                                            <li onClick={ () => customExport('targets', tableData._id, 'biodata') }> Bioactivity Data </li>
                                            <li onClick={ () => customExport('targets', tableData._id, 'structure') }> Structural Data </li>
                                        </ul>
                                    </div> 
                                </div> 

                                <div className="cat">
                                    targets
                                </div>
                                
                            </div>

                            <div className="mainData_table flex_view_xs">

                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value"> { tableData._id } </div>
                                        <div className="cell_item key"> Uniprot ID </div>
                                    </div>
                                </div>

                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value"> { tableData.gene_name } </div>
                                        <div className="cell_item key"> Gene Name </div>
                                    </div>
                                </div>

                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value"> { tableData.organism.join(', ') } </div>
                                        <div className="cell_item key"> Organism </div>

                                    </div>
                                </div>

                                
                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value"> { tableData.sec_acc.join(', ') } </div>
                                        <div className="cell_item key"> Secondary IDs </div>
                                    </div>
                                </div> 

                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value"> { tableData.bioact_data } </div>
                                        <div className="cell_item key"> Bioactivity Data </div>

                                    </div>
                                </div>

                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value"> { tableData.struct_data } </div>
                                        <div className="cell_item key"> Structural Data </div>
                                    </div>
                                </div>     

                                {
                                    tableData.alt_names.length > 0 ? ( 

                                    <div className="row_item flex_view_xs one_third">
                                        <div className="row_inner flex_view_xs">
                                            <div className="cell_item value"> {tableData.alt_names.join(', ')} </div>
                                            <div className="cell_item key"> Alternative Names </div>
                                        </div>
                                    </div>      
                                    ) : null
                                }

                                
                                <div className="row_item flex_view_xs one_third">
                                    <div className="row_inner flex_view_xs">
                                        <div className="cell_item value"> { tableData.target_name } </div>
                                        <div className="cell_item key"> Target Names </div>

                                    </div>
                                </div>

                                {
                                    hasExtraData ?  tabData.targetDisease && tabData.targetDisease.length > 0 ?  (
                                    <>  
                                        <hr className='seperator'></hr>
                                        <div className="row_item flex_view_xs half_width">
                                            <div className="row_inner flex_view_xs">
                                                <div className="cell_item value"> { tabData.targetDisease[0].global_score } </div>
                                                <div className="cell_item key"> Global Score </div>
                                            </div>
                                        </div>
                                    </>
                                    ) : null : null
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
                                                            drugData.map( (drugitem, index) => {
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
                                                
                                                {/* <div className="cell_item key"> Drug Data </div> */}
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

                                {/* Extra Data Bio Data */}
                                {
                                    biodata && (
                                        <div className="row_item flex_view_xs full_width">
                                            <div className="row_inner accordion_row flex_view_xs">
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
                                                                            <div className="cell_item_inner cell_item key"> pActivity </div>
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
                                    <p className={`name ${currTab === 'Compounds' ? 'active' : ''}`} onClick={(e) => setActiveTab(e)}>
                                        <span className='tab_name'>Compounds</span>
                                        <span className='count'> { compoundsCount && compoundsCount }</span> 
                                    </p>
                                    <p className={`name ${currTab === 'Diseases' ? 'active' : ''}`} onClick={(e) => setActiveTab(e)}>
                                        <span className='tab_name'>Diseases</span>
                                        <span className='count'> { diseasesCount && diseasesCount }</span> 
                                    </p>
                                    <p className={`name ${currTab === 'Pathways' ? 'active' : ''}`} onClick={(e) => setActiveTab(e)}>
                                        <span className='tab_name'>Pathways</span>
                                        <span className='count'> { pathwaysCount && pathwaysCount }</span> 
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
                                                        <div className="truncate" id={item._id} title={item.smiles} data-parentid={ parentId } data-parent="target" data-level={level} onClick={ (e) => itemClick(e, item, 'compounds') }> {item.smiles} </div> 
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
                                            hideViewMoreFor.type === 'compounds' && hideViewMoreFor.level === Number(level) && hideViewMoreFor.hide && tabData.compounds && tabData.compounds.length < 9 ? null : (
                                                <li className='view_more'> 
                                                    <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='compounds'> View More </p> 
                                                </li>
                                            )
                                        } */}
                                        </ul>


                                        <ul className={`diseases ${currTab === 'Diseases' ? 'active' : ''}`}>
                                        {
                                            tabData.diseases ? tabData.diseases.length > 0 ? (
                                                tabData.diseases.map(item => (
                                                    <li className="item" key={item._id}> 
                                                        <div className="truncate" id={item._id} title={item.dis_name} data-parentid={ parentId } data-parent="target" data-level={level} onClick={ (e) => itemClick(e, item, 'diseases') }> {item.dis_name} </div> 
                                                    </li>  
                                                ))
                                            ) : (
                                                <li className='no_data'>No Data Found</li>
                                            ) : null
                                        }

                                        {/* View More Section */}

                                        {
                                            showDiseasesViewMore ? (
                                                <li className='view_more'> 
                                                    <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='diseases'> View More </p> 
                                                </li>
                                            ) : null
                                        }

                                        {/* {
                                            hideViewMoreFor.type === 'diseases' && hideViewMoreFor.level === Number(level) && hideViewMoreFor.hide && tabData.diseases && tabData.diseases.length < 9 ? null : (
                                                <li className='view_more'> 
                                                    <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='diseases'> View More </p> 
                                                </li>
                                            )
                                        } */}
                                        
                                        </ul>


                                        <ul className={`pathways ${currTab === 'Pathways' ? 'active' : ''}`}>
                                        {
                                            tabData.pathways ? tabData.pathways.length > 0 ? (
                                                tabData.pathways.map(item => (
                                                    <li className="item" key={item._id}> 
                                                        <div className="truncate" id={item._id} data-parent="targets" title={item.path_name} data-level={level} onClick={ (e) => itemClick(e, item, 'pathways') }>{item.path_name}</div>  
                                                    </li>  
                                                ))
                                            ) : (
                                                <li className='no_data'>No Data Found</li>
                                            ) : null
                                        }

                                        {/* View More Section */}

                                        {
                                            showPathwaysViewMore ? (
                                                <li className='view_more'> 
                                                    <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='pathways'> View More </p> 
                                                </li>
                                            ) : null
                                        }
                                        
                                        {/* {
                                            tabData.pathways && tabData.pathways.length > 8 ? 
                                            hideViewMoreFor.type === 'pathways' && hideViewMoreFor.level === Number(level) && hideViewMoreFor.hide ? null
                                            : (
                                                <li className='view_more'> 
                                                    <p onClick={ (e) => handleViewMore(e) } data-parent={parentId} data-level={level} data-type='pathways'> View More </p> 
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

export default Targets
