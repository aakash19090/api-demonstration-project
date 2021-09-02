import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import * as userAction from '../../redux/actions/userAction'
import SearchForm from './SearchForm'
import SearchCard from './SearchCard'
import Loader from '../Loader'
import IconClosePopup from '../../assets/svgs/IconClosePopup'
import Icon_Download_bg from '../../assets/svgs/Icon_Download_bg'

import Companies from './secondLevel/companies'
import Drugs from './secondLevel/drugs'
import Targets from './secondLevel/targets'
import Diseases from './secondLevel/diseases'
import Pathways from './secondLevel/pathways'
import Compounds from './secondLevel/compounds'
import Documents from './secondLevel/documents'
const moment= require('moment') 

class UserDashboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeSearchType: null,
            loaded: false,
            activeDropdownVal: 'companies',
            searchInputVal: '',
            choosedDropdownVal: null,
            choosedSearchedVal: null,
            showPopup: false,
            mainPopupTitle: '',
            mainId: '',
            currLevelClick: null
        }
    }
    
    // ? Handle Search & Call Api
    async handleSearch(stringType,searchString){
        const { searchInitAction } = this.props
        let page
        if(stringType === 'compounds'){
            page = 0
        }else{
            page = 1
        }
        if( stringType ){
            await searchInitAction(page, stringType,searchString,false)
            this.setState({
                ...this.state,
                activeSearchType: stringType,
                choosedDropdownVal: stringType,
                choosedSearchedVal: searchString,
                loaded: true,
            })
        }
    } 
    

    // ? Change Dropdown value on select
    handleDropdownChange = (val) => {
        this.setState({
            ...this.state,
            activeDropdownVal: val
        })
    }
    
    // ? Search Input Change
    handleSearchInputChange = (val) => {
        this.setState({
            ...this.state,
            searchInputVal: val
        })
    }

    // ? Load More Results
    loadMoreResults = async () => {
        const stringType = this.state.activeSearchType
        const searchString = this.state.searchInputVal
        let page
        if(stringType === 'compounds'){
            page = this.props.compoundsPage
        }else{
            page = this.props.searchPageNo + 1;
        }
        
        const { searchInitAction } = this.props
        if( stringType ){
            await searchInitAction(page, stringType,searchString, true)
            this.setState({
                ...this.state,
                loaded: true,
                activeSearchType: stringType
            })
        }
    }

    // ? Handle Card Item Click
    handleCardClick = (cardId,title, originalData) => {
        this.setState({
            ...this.state,
            showPopup: true,
            mainPopupTitle: title,
            mainId: cardId
        },
        () => {
            document.body.classList.add('overflow_hidden')
            const { secondLevelSearchAction } = this.props
            const page = 1
            const level = 0
            const popupItemClick = false
            const parentType = this.state.activeSearchType
            secondLevelSearchAction(this.state.activeSearchType, page, this.state.mainId, level, originalData, popupItemClick, parentType )
        })
    }

    // ? Close Search Results Popup
    closePopup = () => {
        this.setState({
            ...this.state,
            showPopup: false
        })
        document.body.classList.remove('overflow_hidden')
        const { clearSecondLevel } = this.props
        clearSecondLevel()
    }

    // ? Handle View More api inside Second level Popup 
    
    handleViewMore = (subType, pageNo, level, mainId, mainType) => {
        const page = pageNo + 1
        const { viewMoreAction } = this.props
        const levelText = `level${level}`
        const levelNo = Number(level)
        viewMoreAction(subType, page, levelText, mainId, mainType, levelNo)
    }

    // ? View More hides on showing all results from api. ON switching tabs, we have to reset it again.
    handleResetViewMore = () => {
        const { resetViewMoreData } = this.props
        resetViewMoreData()
    }

    // ? Handle Item Click from Popup
    handleItemClick = async( category, itemId, level, itemData, parentType, parentId, title ) => {
        const page = 1
        const popupItemClick = true
        const { secondLevelSearchAction } = this.props
        const levelNo = Number(level)
        await secondLevelSearchAction( category, page, itemId, levelNo, itemData, popupItemClick, parentType, parentId )
        document.querySelector(`.search_info_main.level${levelNo + 1}`).scrollIntoView(true);
    }

    // ? Reset Search Value on 'X click in input
    handleResetSearchVal = () => {
        this.setState({
            ...this.state,
            searchInputVal: ''
        })
    }

    exportTargetDiseaseData = async(targetDiseaseData, csvArray) => {
        csvArray.push(['URLs', targetDiseaseData ? targetDiseaseData[0].urls : '-'])
        //evidences
        const evidenceType = targetDiseaseData[0].evidence_type
        Object.keys(evidenceType).forEach(function(evidenceKey) {
            csvArray.push(['', ''])
            const nDocTitle = `Evidence%20Type%20>%20${evidenceKey.replaceAll('_','%20')}%20>%20Ndocs` 
            const scoreTitle = `Evidence%20Type%20>%20${evidenceKey.replaceAll('_','%20')}%20>%20Score` 

            if(evidenceType && targetDiseaseData[0]['evidence_type'][evidenceKey]['ndocs'] !== null ){
                csvArray.push([nDocTitle, evidenceType ? targetDiseaseData[0]['evidence_type'][evidenceKey]['ndocs'] : ''])
            }
            if(evidenceType && targetDiseaseData[0]['evidence_type'][evidenceKey]['score'] !== null ){
                csvArray.push([scoreTitle, evidenceType ? targetDiseaseData[0]['evidence_type'][evidenceKey]['score'] : ''])
            }
            
        })
        //drug data
        const drugData = targetDiseaseData[0].drug_data
        if(drugData.length>0){
            drugData.map(drugDataArray => {
                csvArray.push(['', ''])
                if(drugDataArray.drug._id){
                    csvArray.push(['Drug%20Data%20>%20Drug', drugDataArray.drug._id])
                }
                if(drugDataArray.max_phase !== null){
                    csvArray.push(['Drug%20Data%20>%20Max%20Phase', drugDataArray.max_phase])
                }
                let trailDataUrl = [];
                let trailDataStatus = [];
                drugDataArray.trial_data.map(trialData => {
                    trailDataUrl.push(trialData.url)
                    trailDataStatus.push(trialData.status)
                })
                if(trailDataUrl){
                    csvArray.push(['Drug%20Data%20>%20Trial%20Data%20>%20URL', trailDataUrl])
                }
                if(trailDataStatus){
                    csvArray.push(['Drug%20Data%20>%20Trial%20Data%20>%20Status', trailDataStatus])
                }
                
            })
        }
        //pathway data
        const pathwayData = targetDiseaseData[0].pathway_data
        if(pathwayData.length>0){
            pathwayData.map(pathwayDataArray => {
                csvArray.push(['', ''])
                if(pathwayDataArray.pathway.path_name){
                    csvArray.push(['Pathway%20Data%20>%20Pathway', `\"${pathwayDataArray.pathway.path_name}\"`.replaceAll('#', '%23').replaceAll(' ', '%20')])
                }
                if(pathwayDataArray.score !== null){
                    csvArray.push(['Pathway%20Data%20>%20Score', pathwayDataArray.score])
                }
                if(pathwayDataArray.evidence){
                    csvArray.push(['Pathway%20Data%20>%20Evidence', `\"${pathwayDataArray.evidence}\"`.replaceAll('#', '%23').replaceAll(' ', '%20')])
                }
                if(pathwayDataArray.papers.length > 0){
                    csvArray.push(['Pathway%20Data%20>%20Papers', pathwayDataArray.papers.join(",")])
                }
            })
        }
        return csvArray
    }

    // ? Export Search Results as CSV on click
    handleExportSearchResults = async(type, data) => {
        const currDate = moment().format(`DD-MM-YYYY`)
        let csvArray, documentsTabData, synonymsData, compoundsTabData, companiesTabData, diseaseTabData, pathwaysTabData, targetsTabData, drugsTabData
        let downloadElem = document.createElement("a")
        switch(type){
            case 'companies': 
                documentsTabData = data.currData.documents.map( tabItem =>  tabItem._id.replaceAll('#', '%23').replaceAll(' ', '%20'))
                synonymsData = data.mainData.synonyms.map( item => item.replaceAll('#', '%23').replaceAll(' ', '%20') )
                csvArray = [['', '']]
                
                if(data.mainData._id){
                   csvArray.push(['Name', data.mainData._id.replaceAll('#', '%23').replaceAll(' ', '%20')]) 
                }

                if(synonymsData.length > 0){
                   csvArray.push(['Synonyms', synonymsData]) 
                }

                if(data.mainData.npatents !== null){
                   csvArray.push(['Npatents', data.mainData.npatents ]) 
                }

                if(documentsTabData.length > 0){
                   csvArray.push(['Documents',documentsTabData.map(string => string === null ? '' : `\"${string}\"`)]) 
                }
                downloadElem.download = `Companies - ${data.mainData._id} ${currDate}.csv`;
                
                break;

            case 'documents':

                compoundsTabData = data.currData.compounds.map( tabItem => tabItem.smiles.replaceAll('#', '%23').replaceAll(' ', '%20')) 
                companiesTabData = data.currData.companies.map( tabItem => tabItem._id.replaceAll('#', '%23').replaceAll(' ', '%20'))
                csvArray = [['', '']]
                
                if(data.mainData._id){
                   csvArray.push(['Name', data.mainData._id.replaceAll('#', '%23').replaceAll(' ', '%20')]) 
                }

                if(data.mainData.url){
                   csvArray.push(['URL', encodeURIComponent(data.mainData.url) ]) 
                }

                if(data.mainData.type){
                   csvArray.push(['Type', data.mainData.type.replaceAll('#', '%23').replaceAll(' ', '%20')]) 
                }

                if(data.mainData.year !== null){
                   csvArray.push(['Year', data.mainData.year]) 
                }

                let relatedDiseases = []
                if(data.mainData.data.rel_diseases.length > 0){
                    relatedDiseases = data.mainData.data.rel_diseases.map( disease => {
                    if(disease.disease){
                            return `${disease.disease.dis_name.replaceAll('#', '%23').replaceAll(' ', '%20')} , %20 Score: %20 ${disease.score}`
                        }
                    })
                }
                if(relatedDiseases.length > 0){
                    csvArray.push(['Related%20Diseases', relatedDiseases.map(string => string === null ? '' : `\"${string}\"`)])
                }

                let relatedTargets = []
                if(data.mainData.data.rel_targets.length > 0){
                    relatedTargets = data.mainData.data.rel_targets.map( target => {
                        if(target.target){
                            return `${target.target.target_name.replaceAll('#', '%23').replaceAll(' ', '%20')} , %20 Score: %20 ${target.score}`
                        }
                    })
                }
                if(relatedTargets.length > 0){
                    csvArray.push(['Related%20Targets', relatedTargets.map(string => string === null ? '' : `\"${string}\"`)])
                }

                if(compoundsTabData.length > 0){
                    csvArray.push(['Compounds', compoundsTabData ? compoundsTabData.map(string => string === null ? '' : `\"${string}\"`) : '-'])
                }

                if(companiesTabData.length > 0){
                    csvArray.push(['Companies', companiesTabData ? companiesTabData.map(string => string === null ? '' : `\"${string}\"`) : '-'])
                }

                downloadElem.download = `Documents - ${data.mainData._id} ${currDate}.csv`;
                break;

            case 'targets':
                compoundsTabData = []
                diseaseTabData = []
                pathwaysTabData = []

                data.currData.compounds.map( tabItem => compoundsTabData.push(tabItem.smiles.replaceAll('#', '%23').replaceAll(' ', '%20'))) // ? Stringify Each Tab Data
                data.currData.diseases.map( tabItem => diseaseTabData.push(tabItem.dis_name.replaceAll('#', '%23').replaceAll(' ', '%20')))
                data.currData.pathways.map( tabItem => pathwaysTabData.push(tabItem.path_name.replaceAll('#', '%23').replaceAll(' ', '%20')))
                
                csvArray = [['', '']]
                
                if(data.mainData.target_name){
                   csvArray.push(['Name', data.mainData.target_name.replaceAll('#', '%23').replaceAll(' ', '%20')]) 
                }
                if(data.mainData._id){
                    csvArray.push(['Uniprot%20Id', data.mainData._id.replaceAll('#', '%23').replaceAll(' ', '%20')]) 
                }

                if(data.mainData.gene_name){
                    csvArray.push(['Gene%20Name', data.mainData.gene_name.replaceAll('#', '%23').replaceAll(' ', '%20')]) 
                }

                if(data.mainData.organism.length > 0){
                    csvArray.push(['Organism', data.mainData.organism.map(item=>item.replaceAll('#', '%23').replaceAll(' ', '%20')) .join(',')]) 
                }

                if(data.mainData.sec_acc.length > 0){
                    csvArray.push(['Sec%20Acc', data.mainData.sec_acc.map(item=>item.replaceAll('#', '%23').replaceAll(' ', '%20')) .join(',')]) 
                }

                csvArray.push(['Bioact%20Data', data.mainData.bioact_data ]) 

                csvArray.push(['Struct%20Data', data.mainData.struct_data ]) 

                if(compoundsTabData.length > 0){
                    csvArray.push(['Compounds', compoundsTabData.map(string => string === null ? '' : `\"${string}\"`)]) 
                }

                if(diseaseTabData.length > 0){
                    csvArray.push(['Diseases', diseaseTabData.map(string => string === null ? '' : `\"${string}\"`)]) 
                }

                if(pathwaysTabData.length > 0){
                    csvArray.push(['Pathways', pathwaysTabData.map(string => string === null ? '' : `\"${string}\"`)]) 
                }

                if(data.currData.targetDisease){
                    const targetDiseaseExportedData = await this.exportTargetDiseaseData(data.currData.targetDisease, csvArray)
                    csvArray = targetDiseaseExportedData
                }

               //compound bio data
               if(data.currData.biodata){
                data.currData.biodata.map(bioData => {
                    csvArray.push(['', ''])
                    if(bioData.compound){
                        csvArray.push(['Compound%20>%20Bio%20Data%20>Compound', encodeURIComponent(bioData.compound) ])
                    }
                    if(bioData.pactivity !== null){
                        csvArray.push(['Compound%20>%20Bio%20Data%20>Pactivity',bioData.pactivity])
                    }
                    if(bioData.source[0]){
                        csvArray.push(['Compound%20>%20Bio%20Data%20>Source', encodeURIComponent(bioData.source[0]) ])
                    }
                })
                
                }
                //compound structure
                if(data.currData.structure){
                    data.currData.structure.map(structureData => {
                        csvArray.push(['', ''])
                        if(structureData.compound){
                            csvArray.push(['Compound%20>%20Structure%20>%20Compound', encodeURIComponent(structureData.compound) ])
                        }
                        if(structureData.pactivity !== null) {
                            csvArray.push(['Compound%20>%20Structure%20>%20Pactivity',structureData.pactivity])
                        }
                        if(structureData.structure.files){
                            csvArray.push(['Compound%20>%20Structure%20>%20Structure%20>%20Files',`\"${structureData.structure.files}\"`.replaceAll('#', '%23').replaceAll(' ', '%20')])
                        }
                        if(structureData.structure.ligand){
                            csvArray.push(['Compound%20>%20Structure%20>%20Structure%20>%20Ligand',structureData.structure.ligand])
                        }
                        if(structureData.structure.pdb){
                            csvArray.push(['Compound%20>%20Structure%20>%20Structure%20>%20pdb',structureData.structure.pdb])
                        }
                        if(structureData.structure.resolution !== null ){
                            csvArray.push(['Compound%20>%20Structure%20>%20Structure%20>%20resolution',structureData.structure.resolution])
                        }
                        if(structureData.structure.url){
                            csvArray.push(['Compound%20>%20Structure%20>%20Structure%20>%20url',structureData.structure.url.replaceAll('#', '%23').replaceAll(' ', '%20')])
                        }
                        if(structureData.structure.year !== null ){
                            csvArray.push(['Compound%20>%20Structure%20>%20Structure%20>%20year',structureData.structure.year])
                        }
                    })
                }
                downloadElem.download = `Targets - ${data.mainData.target_name} ${currDate}.csv`;
                break;

            case 'drugs': 
                compoundsTabData = data.currData.compounds.map( tabItem => tabItem.smiles.replaceAll('#', '%23').replaceAll(' ', '%20')) // ? Stringify Each Tab Data
                documentsTabData = data.currData.documents.map( tabItem => tabItem._id.replaceAll('#', '%23').replaceAll(' ', '%20'))
                targetsTabData = data.currData.targets.map( tabItem => tabItem.target_name.replaceAll('#', '%23').replaceAll(' ', '%20'))

                csvArray = [['', '']]

                if(data.mainData._id){
                    csvArray.push(['Name', data.mainData._id.replaceAll('#', '%23').replaceAll(' ', '%20')]) 
                }

                if(data.mainData.chembl_card){
                    csvArray.push(['Chembl%20Card', data.mainData.chembl_card.replaceAll('#', '%23').replaceAll(' ', '%20')]) 
                }

                if(data.mainData.drug_type){
                    csvArray.push(['Drug%20Type', data.mainData.drug_type.replaceAll('#', '%23').replaceAll(' ', '%20')]) 
                }

                if(data.mainData.inchikey){
                    csvArray.push(['Inchikey', data.mainData.inchikey.replaceAll('#', '%23').replaceAll(' ', '%20') ]) 
                }

                if(data.mainData.ori_smiles){
                    csvArray.push(['Ori%20Smiles', data.mainData.ori_smiles.replaceAll('#', '%23').replaceAll(' ', '%20') ]) 
                }

                if(data.mainData.synonyms.length > 0){
                    csvArray.push(['Synonyms', data.mainData.synonyms.map(item=>`\"${item}\"`.replaceAll('#', '%23').replaceAll(' ', '%20')).join(',')]) 
                }

                if(data.mainData.admin_route.length > 0){
                    csvArray.push(['Admin%20Route', data.mainData.admin_route.map(item=>`\"${item}\"`.replaceAll('#', '%23').replaceAll(' ', '%20')).join(',')]) 
                }

                if(compoundsTabData.length > 0){
                    csvArray.push(['Compounds', compoundsTabData.map(string => string === null ? '' : `\"${string}\"`) ]) 
                }

                if(documentsTabData.length > 0){
                    csvArray.push(['Documents', documentsTabData.map(string => string === null ? '' : `\"${string}\"`)]) 
                }

                if(targetsTabData.length > 0){
                    csvArray.push(['Targets', targetsTabData.map(string => string === null ? '' : `\"${string}\"`)]) 
                }

                downloadElem.download = `Drugs - ${data.mainData._id} ${currDate}.csv`;
                break;

            case 'diseases': 
                let diseasesInfo = []
                diseasesInfo['crossRefs'] = []
                diseasesInfo['description'] = []
                diseasesInfo['efoURL'] = []
                data.mainData.dis_info.map(disInfo =>{
                    diseasesInfo['crossRefs'].push(`\"${disInfo.cross_refs}\"`.replaceAll('#', '%23').replaceAll(' ', '%20'))
                    diseasesInfo['description'].push(`\"${disInfo.description}\"`.replaceAll('#', '%23').replaceAll(' ', '%20'))
                    diseasesInfo['efoURL'].push(`\"${disInfo.efo_url}\"`.replaceAll('#', '%23').replaceAll(' ', '%20'))
                })
                targetsTabData = data.currData.targets.map( tabItem => tabItem.target_name.replaceAll('#', '%23').replaceAll(' ', '%20'))

                csvArray = [['', '']]
                if(data.mainData.dis_name){
                    csvArray.push(['Name', `\"${data.mainData.dis_name}\"`]) 
                }

                if(data.mainData.url){
                    csvArray.push(['URL', encodeURIComponent(data.mainData.url) ]) 
                }

                if(data.currData.targetDisease && data.currData.targetDisease[0].global_score !== null ){
                    csvArray.push(['Global%20Score', data.currData.targetDisease[0].global_score ]) 
                }

                if(targetsTabData.length > 0){
                    csvArray.push(['Targets',  targetsTabData.map(string => string === null ? '' : `\"${string}\"`) ]) 
                }

                if(diseasesInfo.crossRefs){
                    csvArray.push(['Dis%20Info%20-%20Cross%20Refs', diseasesInfo.crossRefs]) 
                }

                if(diseasesInfo.description){
                    csvArray.push(['Dis%20Info%20-%20Description', diseasesInfo.description]) 
                }
                
                if(diseasesInfo.efoURL){
                    csvArray.push(['Dis%20Info%20-%20Efo%20URL', diseasesInfo.efoURL]) 
                }

                if(data.currData.targetDisease){
                    const targetDiseaseExportedData = await this.exportTargetDiseaseData(data.currData.targetDisease, csvArray)
                    csvArray = targetDiseaseExportedData
                }
                downloadElem.download = `Diseases - ${data.mainData.dis_name} ${currDate}.csv`;
                break;

            case 'pathways':
                targetsTabData = data.currData.targets.map( tabItem => tabItem.target_name.replaceAll('#', '%23').replaceAll(' ', '%20'))
                csvArray = [['', '']]
                if(data.mainData.path_name){
                    csvArray.push(['Name', data.mainData.path_name.replaceAll('#', '%23').replaceAll(' ', '%20')]) 
                }

                if(data.mainData._id){
                    csvArray.push(['Reactome%20ID', data.mainData._id.replaceAll('#', '%23').replaceAll(' ', '%20')]) 
                }

                if(data.mainData.url){
                    csvArray.push(['URL', encodeURIComponent(data.mainData.url) ]) 
                }

                if(targetsTabData.length > 0){
                    csvArray.push(['Targets', targetsTabData.map(string => string === null ? '' : `\"${string}\"`.replaceAll('#', '%23').replaceAll(' ', '%20'))]) 
                }

                downloadElem.download = `Pathways - ${data.mainData.path_name} ${currDate}.csv`;
                break;

            case 'compounds':
                documentsTabData = data.currData.documents.map( tabItem => tabItem._id.replaceAll('#', '%23').replaceAll(' ', '%20'))
                drugsTabData = data.currData.drugs.map( tabItem => tabItem._id.replaceAll('#', '%23').replaceAll(' ', '%20'))
                targetsTabData = data.currData.targets.map( tabItem => tabItem.target_name.replaceAll('#', '%23').replaceAll(' ', '%20'))

                csvArray = [['', '']]

                if(data.mainData.smiles){
                    csvArray.push(['Name', data.mainData.smiles.replaceAll('#', '%23').replaceAll(' ', '%20')]) 
                }

                if(data.mainData._id){
                    csvArray.push(['Inchikey', data.mainData._id.replaceAll('#', '%23').replaceAll(' ', '%20')]) 
                }

                if(data.mainData.similarity !== null ){
                    csvArray.push(['Similarity', data.mainData.similarity]) 
                }

                if(data.mainData.smiles){
                    csvArray.push(['Smiles', data.mainData.smiles.replaceAll('#', '%23').replaceAll(' ', '%20')]) 
                }

                if(data.mainData.sources.length > 0){
                    csvArray.push(['Sources', data.mainData.sources.map(item=>item.replaceAll('#', '%23').replaceAll(' ', '%20')) .join(',')]) 
                }

                if(documentsTabData.length > 0){
                    csvArray.push(['Documents', documentsTabData.map(string => string === null ? '' : `\"${string}\"`)]) 
                }

                if(drugsTabData.length > 0){
                    csvArray.push(['Drugs', drugsTabData.map(string => string === null ? '' : `\"${string}\"`)]) 
                }

                if(targetsTabData.length > 0){
                    csvArray.push(['Targets', targetsTabData.map(string => string === null ? '' : `\"${string}\"`)]) 
                }

                //compound bio data
                if(data.currData.biodata){
                    data.currData.biodata.map(bioData => {
                        csvArray.push(['', ''])
                        if(bioData.compound){
                            csvArray.push(['Compound%20>%20Bio%20Data%20>Compound', encodeURIComponent(bioData.compound) ])
                        }
                        if(bioData.pactivity !== null){
                            csvArray.push(['Compound%20>%20Bio%20Data%20>Pactivity',bioData.pactivity])
                        }
                        if(bioData.source[0]){
                            csvArray.push(['Compound%20>%20Bio%20Data%20>Source', encodeURIComponent(bioData.source[0]) ])
                        }
                    })
                    
                }
                //compound structure
                if(data.currData.structure){
                    data.currData.structure.map(structureData => {
                        csvArray.push(['', ''])
                        if(structureData.compound){
                            csvArray.push(['Compound%20>%20Structure%20>%20Compound', encodeURIComponent(structureData.compound) ])
                        }
                        if(structureData.pactivity !== null) {
                            csvArray.push(['Compound%20>%20Structure%20>%20Pactivity',structureData.pactivity])
                        }
                        if(structureData.structure.files){
                            csvArray.push(['Compound%20>%20Structure%20>%20Structure%20>%20Files',`\"${structureData.structure.files}\"`.replaceAll('#', '%23').replaceAll(' ', '%20')])
                        }
                        if(structureData.structure.ligand){
                            csvArray.push(['Compound%20>%20Structure%20>%20Structure%20>%20Ligand',structureData.structure.ligand])
                        }
                        if(structureData.structure.pdb){
                            csvArray.push(['Compound%20>%20Structure%20>%20Structure%20>%20pdb',structureData.structure.pdb])
                        }
                        if(structureData.structure.resolution !== null ){
                            csvArray.push(['Compound%20>%20Structure%20>%20Structure%20>%20resolution',structureData.structure.resolution])
                        }
                        if(structureData.structure.url){
                            csvArray.push(['Compound%20>%20Structure%20>%20Structure%20>%20url',structureData.structure.url.replaceAll('#', '%23').replaceAll(' ', '%20')])
                        }
                        if(structureData.structure.year !== null ){
                            csvArray.push(['Compound%20>%20Structure%20>%20Structure%20>%20year',structureData.structure.year])
                        }
                    })
                }
                downloadElem.download = `Compounds - ${data.mainData.smiles} ${currDate}.csv`;
                break;
        }
        const csvArrayString = csvArray.join('\n') 
        
        downloadElem.href = 'data:text/csv; charset=utf-8' + csvArrayString;
        downloadElem.target = "_blank";
        downloadElem.click();
    }

    // ? Handle Custom Export 
    handleCustomExport = async(type, id, subtype) => {
        const { customExportPopup } = this.props
        await customExportPopup(type, id, subtype)
        const toastSettings = {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        }

        let csvArray
        let data = this.props.customExportPopupData
        
        let downloadElem = document.createElement("a")
        const currDate = moment().format(`DD-MM-YYYY`)
        switch(type){
            case 'diseases':
                if(!data || data.length === 0){
                    toast.error(`No data will be exported for global score <=0.25`, toastSettings)    
                }else{
                    csvArray = [['', 'Target Name', 'Uniprot ID', 'Global Score', 'Genetic Association', 'Somatic Mutation', 'Known Drug', 'Affected Pathway', 'RNA Expression', 'Literature', 'Animal Model', 'URLs']];
                    data.map( data => {
                        const targetName = `\"${data.target.target_name}\"`
                        const uniprotID = `\"${data.target._id}\"`
                        const globalScore = `\"${data.global_score}\"`
                        const geneticAssoc = `\"${data.evidence_type.genetic_association.score}(${data.evidence_type.genetic_association.ndocs})\"`
                        const somaticMutation = `\"${data.evidence_type.somatic_mutation.score}(${data.evidence_type.somatic_mutation.ndocs})\"`
                        const knownDrug = `\"${data.evidence_type.known_drug.score}(${data.evidence_type.known_drug.ndocs})\"`
                        const affectedPathway = `\"${data.evidence_type.affected_pathway.score}(${data.evidence_type.affected_pathway.ndocs})\"`
                        const rnaExpression = `\"${data.evidence_type.rna_expression.score}(${data.evidence_type.rna_expression.ndocs})\"`
                        const literature = `\"${data.evidence_type.literature.score}(${data.evidence_type.literature.ndocs})\"`
                        const animalModel = `\"${data.evidence_type.animal_model.score}(${data.evidence_type.animal_model.ndocs})\"`
                        const urls = `\"${data.urls}\"`
                        csvArray.push([targetName,uniprotID,globalScore,geneticAssoc,somaticMutation,knownDrug,affectedPathway,rnaExpression,literature,animalModel,urls])
                    })
                    
                    downloadElem.download = `Diseases_Targets_${currDate}.csv`;
                    toast.success(`The data will be exported for global score >=0.25`, toastSettings)    
                }
                break;

            case 'targets':
                if(subtype === 'diseases'){
                    if(!data || data.length === 0){
                        toast.error(`No data will be exported for global score >=0.25`, toastSettings)    
                    }else{
                        csvArray = [['', 'Disease Name', 'MESH ID', 'Global Score', 'Genetic Association', 'Somatic Mutation', 'Known Drug', 'Affected Pathway', 'RNA Expression', 'Literature', 'Animal Model', 'URLs']];
                            data.map( data => {
                                const diseaseName = `\"${data.disease.dis_name}\"`
                                const meshId = `\"${data.disease._id}\"`
                                const globalScore = `\"${data.global_score}\"`
                                const geneticAssoc = `\"${data.evidence_type.genetic_association.score}(${data.evidence_type.genetic_association.ndocs})\"`
                                const somaticMutation = `\"${data.evidence_type.somatic_mutation.score}(${data.evidence_type.somatic_mutation.ndocs})\"`
                                const knownDrug = `\"${data.evidence_type.known_drug.score}(${data.evidence_type.known_drug.ndocs})\"`
                                const affectedPathway = `\"${data.evidence_type.affected_pathway.score}(${data.evidence_type.affected_pathway.ndocs})\"`
                                const rnaExpression = `\"${data.evidence_type.rna_expression.score}(${data.evidence_type.rna_expression.ndocs})\"`
                                const literature = `\"${data.evidence_type.literature.score}(${data.evidence_type.literature.ndocs})\"`
                                const animalModel = `\"${data.evidence_type.animal_model.score}(${data.evidence_type.animal_model.ndocs})\"`
                                const urls = `\"${data.urls}\"`
                                csvArray.push([diseaseName,meshId,globalScore,geneticAssoc,somaticMutation,knownDrug,affectedPathway,rnaExpression,literature,animalModel,urls])
                            })
                        downloadElem.download = `Targets_Diseases_${currDate}.csv`;
                        toast.success(`The data will be exported for global score <=0.25`, toastSettings)    
                    }
                }
                else if(subtype === 'biodata'){
                    if(!data || data.length === 0){
                        toast.error(`No data found for ${subtype} in ${type}`, toastSettings)    
                    }else{

                        csvArray = [['', 'Smiles', 'Inchikey', 'pActivity', 'Source']];
                            data.map( data => {
                                const smiles = `\"${encodeURIComponent(data.compound.smiles)}\"`
                                const inchikey = `\"${encodeURIComponent(data.compound._id)}\"`
                                const pactivity = `\"${encodeURIComponent(data.pactivity)}\"`
                                const source = `\"${encodeURIComponent(data.source)}\"`
                                csvArray.push([smiles,inchikey,pactivity,source])
                            })
                        downloadElem.download = `Targets_Bioactivity_${currDate}.csv`;
                    }
                }
                else if(subtype === 'structure'){
                    if(!data || data.length === 0){
                        toast.error(`No data found for ${subtype} in ${type}`, toastSettings)    
                    }else{
                        csvArray = [['', 'Pdb', 'Ligand', 'Resolution', 'Year', 'Inchikey', 'pActivity', 'Smiles']];
                            data.map( data => {
                                const pdb = `\"${data.structure.pdb}\"`
                                const ligand = `\"${data.structure.ligand}\"`
                                const resolution = `\"${data.structure.resolution}\"`
                                const year = `\"${data.structure.year}\"`
                                const inchikey = `\"${data.compound._id}\"`
                                const pActivity = `\"${data.pactivity}\"`
                                const smiles = `\"${encodeURIComponent(data.compound.smiles)}\"`
                                csvArray.push([pdb,ligand,resolution,year,inchikey,pActivity,smiles])
                            })
                        downloadElem.download = `Targets_Structure_${currDate}.csv`;
                    }
                }
                break;

            case 'drugs':
                if(!data || data.length === 0){
                    toast.error(`No data found for ${subtype} in ${type}`, toastSettings)    
                }else{
                    csvArray = [['', 'MESH', 'UNIPROT', 'Max Phase']];
                        data.map( data => {
                            const meshId = `\"${data.disease}\"`
                            const uniprotID = `\"${data.target}\"`
                            const maxPhase = `\"${data.max_phase}\"`
                            csvArray.push([meshId,uniprotID,maxPhase])
                        })
                    downloadElem.download = `Drugs_Disease-Target_Associations_${currDate}.csv`;
                }

            
                break;

            case 'pathways':
                if(!data[0].targets || data[0].targets.length === 0){
                    toast.error(`No data found for ${subtype} in ${type}`, toastSettings)    
                }else{
                    csvArray = [['', 'UNIPROT', 'Target Name']];
                        data[0].targets.map( target => {
                            const uniprotId = `\"${target._id}\"`
                            const targetName = `\"${target.target_name}\"`
                            csvArray.push([uniprotId,targetName])
                        })
                        
                    downloadElem.download = `Pathways_Targets_${currDate}.csv`;
                }
                break;

            case 'documents':
                if(subtype === 'compounds'){
                    if(!data[0].data.compounds || data[0].data.compounds.length === 0){
                        toast.error(`No data found for ${subtype} in ${type}`, toastSettings)    
                    }else{
                        csvArray = [['', 'Smiles', 'Inchikey']];
                        data[0].data.compounds.map( compound => {
                            const smiles = `\"${encodeURIComponent(compound.smiles)}\"`
                            const inchikey = `\"${encodeURIComponent(compound._id)}\"`
                            csvArray.push([smiles,inchikey])
                        })
                        downloadElem.download = `Documents_Compounds_${currDate}.csv`;
                    }
                }
                else if(subtype === 'targets'){
                    if(!data[0].data.rel_targets || data[0].data.rel_targets.length === 0){
                        toast.error(`No data found for ${subtype} in ${type}`, toastSettings)    
                    }else{
                        csvArray = [['', 'UNIPROT', 'Target Name', 'Score']];
                            data[0].data.rel_targets.map( targetItem => {
                                if(targetItem.target){
                                    const uniprotId = `\"${encodeURIComponent(targetItem.target._id)}\"`
                                    const targetName = `\"${encodeURIComponent(targetItem.target.target_name)}\"`
                                    const score = `\"${encodeURIComponent(targetItem.score)}\"`
                                    csvArray.push([uniprotId,targetName,score])
                                }
                            })
                        downloadElem.download = `Documents_Targets_${currDate}.csv`;
                    }
                }
                else if(subtype === 'diseases'){
                    if(!data[0].data.rel_diseases || data[0].data.rel_diseases.length === 0){
                        toast.error(`No data found for ${subtype} in ${type}`, toastSettings)    
                    }else{
                        csvArray = [['', 'MESH', 'Disease Name', 'Score']];
                            data[0].data.rel_diseases.map( diseaseItem => {
                                if(diseaseItem.disease){
                                    const meshId = `\"${encodeURIComponent(diseaseItem.disease._id)}\"`
                                    const diseaseName = `\"${encodeURIComponent(diseaseItem.disease.dis_name)}\"`
                                    const score = `\"${encodeURIComponent(diseaseItem.score)}\"`
                                    csvArray.push([meshId,diseaseName,score])
                                }
                            })
                        downloadElem.download = `Documents_Diseases_${currDate}.csv`;
                    }
                }
                break;
        }

        if(data && data.length>0){
            if( type==='documents' && (subtype === 'targets' || 'diseases' || 'compounds')){
                if(( data[0].data.rel_diseases && data[0].data.rel_diseases.length > 0) || (data[0].data.rel_targets &&  data[0].data.rel_targets.length > 0) || (data[0].data.compounds &&  data[0].data.compounds.length > 0) ){
                    const csvArrayString = csvArray.join('\n') 
                    downloadElem.href = 'data:text/csv; charset=utf-8' + csvArrayString;
                    downloadElem.target = "_blank";
                    downloadElem.click();
                }
            }
            else{
                const csvArrayString = csvArray.join('\n') 
                downloadElem.href = 'data:text/csv; charset=utf-8' + csvArrayString;
                downloadElem.target = "_blank";
                downloadElem.click();
            }
        }
        
    }

    // ? Handle First Level
    handleFirstLevelExport = async() => {
        const { exportAllFirstLevelData } = this.props
        await exportAllFirstLevelData(this.state.choosedSearchedVal, this.state.choosedDropdownVal)
        
        let csvArray
        let data = this.props.exportCompounds
        let downloadElem = document.createElement("a")
        const currDate = moment().format(`DD-MM-YYYY`)

        switch(this.state.choosedDropdownVal){
            case 'diseases':
                csvArray = [['', 'Mesh ID', 'Disease Name', 'URL']];
                data.map( data => {
                    const meshId = `\"${data._id}\"`
                    const diseaseName = `\"${data.dis_name}\"`
                    const url = `\"${data.url}\"`
                    csvArray.push([meshId,diseaseName,url])
                })
                if(this.state.choosedSearchedVal){
                    downloadElem.download = `Diseases_${this.state.choosedSearchedVal}_${currDate}.csv`;
                }else{
                    downloadElem.download = `Diseases_${currDate}.csv`;
                }
                
                break;

            case 'targets':
                    csvArray = [['', 'Uniport ID', 'Gene Name', 'Organism', 'Target Name', 'Bioactivity Data', 'Structural Data']];
                    data.map( data => {
                        const uniportId = `\"${data._id}\"`
                        const geneName = `\"${data.gene_name}\"`
                        const targetName = `\"${data.target_name}\"`
                        const nBio = `\"${data.bioact_data}\"`
                        const nStruct = `\"${data.struct_data}\"`
                        const organism = `\"${data.organism}\"`

                        csvArray.push([uniportId,geneName,organism,targetName,nBio,nStruct])
                    })
                    if(this.state.choosedSearchedVal){
                        downloadElem.download = `Targets_${this.state.choosedSearchedVal}_${currDate}.csv`;
                    }else{
                        downloadElem.download = `Targets_${currDate}.csv`;
                    }
                    
                break;

            case 'companies':
                    csvArray = [['', 'Company Name', 'Total Patents']];
                    data.map( data => {
                        const companyName = `\"${data._id}\"`
                        const nrPatents = `\"${data.npatents}\"`
                        csvArray.push([companyName,nrPatents])
                    })
                    if(this.state.choosedSearchedVal){
                        downloadElem.download = `Companies_${this.state.choosedSearchedVal}_${currDate}.csv`;
                    }else{
                        downloadElem.download = `Companies_${currDate}.csv`;
                    }
                break;

            case 'pathways':
                    csvArray = [['', 'Reactome ID', 'Pathway Name', 'URL']];
                    data.map( data => {
                        const reactomeId = `\"${data._id}\"`
                        const pathName = `\"${data.path_name}\"`
                        const url = `\"${data.url}\"`
                        csvArray.push([reactomeId,pathName,url])
                    })
                    if(this.state.choosedSearchedVal){
                        downloadElem.download = `Pathways_${this.state.choosedSearchedVal}_${currDate}.csv`;
                    }else{
                        downloadElem.download = `Pathways_${currDate}.csv`;
                    }
                break;

            case 'documents':
                    csvArray = [['', 'Document ID', 'Type', 'Year', 'Company', 'Total Compounds', 'Total Targets', 'Total Diseases', 'URL']];
                    data.map( data => {
                        const docId = `\"${data._id}\"`
                        const type = `\"${data.type}\"`
                        const year = `\"${data.year}\"`
                        const company = `\"${data.data.company ? data.data.company : '-'}\"`
                        const compounds = `\"${data.data.compounds.length}\"`
                        const targets = `\"${data.data.rel_targets.length}\"`
                        const diseases = `\"${data.data.rel_diseases.length}\"`
                        const url = `\"${data.url}\"`
                        csvArray.push([docId,type,year,company,compounds,targets,diseases,url])
                    })
                    if(this.state.choosedSearchedVal){
                        downloadElem.download = `Documents_${this.state.choosedSearchedVal}_${currDate}.csv`;
                    }else{
                        downloadElem.download = `Documents_${currDate}.csv`;
                    }
                break;

            case 'drugs':
                    csvArray = [['', 'Smiles', 'Drug Name', 'Type', 'Inchikey', 'URL']];
                    data.map( data => {
                        const smiles = `\"${encodeURIComponent(data.ori_smiles)}\"`
                        const drugName = `\"${data._id}\"`
                        const drugType = `\"${data.drug_type}\"`
                        const inchikey = `\"${data.inchikey}\"`
                        const url = `\"${data.chembl_card}\"`
                        csvArray.push([smiles,drugName,drugType,inchikey,url])
                    })
                    if(this.state.choosedSearchedVal){
                        downloadElem.download = `Drugs_${this.state.choosedSearchedVal}_${currDate}.csv`;
                    }else{
                        downloadElem.download = `Drugs_${currDate}.csv`;
                    }
                break;

            case 'compounds':
                    csvArray = [['', 'Smiles', 'Inchikey', 'Similarity', 'Sources', 'Documents']];
                    data.map( data => {
                        const smiles = `\"${encodeURIComponent(data.smiles)}\"`
                        const inchikey = `\"${data._id}\"`
                        const similarity = `\"${data.similarity}\"`
                        const sources = `\"${data.sources}\"`
                        const documents = `\"${data.documents}\"`
                        csvArray.push([smiles,inchikey,similarity,sources,documents])
                    })
                    if(this.state.choosedSearchedVal){
                        downloadElem.download = `Compounds_${this.state.choosedSearchedVal}_${currDate}.csv`;
                    }else{
                        downloadElem.download = `Compounds_${currDate}.csv`;
                    }
                break;
        }
        const csvArrayString = csvArray.join('\n') 
        downloadElem.href = 'data:text/csv; charset=utf-8' + csvArrayString;
        downloadElem.target = "_blank";
        downloadElem.click();
    }

    render() {
        // console.log('Render', this.props.documentsLoader)
        const secondSearchData = this.props.appState.users.secondLevelData
        return (
            <div id="user_dashboard">
                <ToastContainer/>
                <div className='inner'>
                    <div className="container">
                        <SearchForm 
                            defaultSearchType={this.state.activeDropdownVal} 
                            searchVal={this.state.searchInputVal} 
                            searchInit={(stringType,searchString) => this.handleSearch(stringType,searchString)}
                            dropdownChangeInit={(val) => this.handleDropdownChange(val)}
                            searchInputChangeInit={(val) => this.handleSearchInputChange(val)}
                            resetSearchVal={() => this.handleResetSearchVal()}
                        />
                        
                        <div className={`global_loader_div ${this.props.showLoader ? 'show': 'hide'}`}>
                            <Loader/>
                        </div>   

                        <div className='result_div'>
                            {
                                this.state.loaded ? (
                                    <div className="wrap">
                                        <div className="export_wrapper flex_view_xs middle space-between">
                                            <p className='title'>Search Results for : <span className='cat'> {this.state.choosedDropdownVal} </span> 
                                            {
                                                this.state.choosedSearchedVal ? (
                                                    <span className='searched' title={this.state.choosedSearchedVal} > {this.state.choosedSearchedVal} </span>
                                                ) : null
                                            }
                                            </p>
                                            {   
                                                this.props.searchDataFirstLevel.length > 0 ? this.state.choosedSearchedVal === '' &&  this.state.choosedDropdownVal === 'compounds' ? null : (
                                                <div className="export" onClick={this.handleFirstLevelExport}>
                                                    <span className={`icon`} title="Export as CSV"> <Icon_Download_bg/> </span>
                                                </div>   
                                                ) : null
                                            }
        
                                        </div>
                                        
                                        <div className='result_cards' >
                                            <div className='row'>
                                            {
                                                this.props.searchDataFirstLevel.map( item => (
                                                    <SearchCard title={item.title} key={item.id} itemDetails={item} itemId={item.id} cardClickInit={ (cardId, title, item) => this.handleCardClick(cardId,title, item) } />
                                                ))
                                            }
                                            </div>
                                        </div>

                                    </div>
                                ) : null
                            }   

                            {
                                this.state.loaded ? this.props.hasSearchData && this.props.searchDataFirstLevel.length > 9 ? (
                                    <div className="load_more flex_view_xs middle center">
                                        <button className='flex_view_xs middle center' onClick={this.loadMoreResults}>
                                            {
                                                this.props.loadMore ? ( 
                                                    <span className='loader_icon'><Loader/></span>
                                                ) : (
                                                    <span className="txt">Load More Results</span>
                                                )
                                            }
                                        </button>
                                    </div>
                                ) : this.props.searchDataFirstLevel.length === 0 ? (
                                    <div className="no_results text-center">
                                        <h3> No data found for the searched criteria </h3>
                                    </div>
                                ) : (
                                    <div className="no_results text-center">
                                        <h3>No further data to display</h3>
                                    </div>
                                ) : (
                                    <p className='text-center initial_note_txt'> Please enter any search criteria to see results here </p>
                                )
                            }
                        </div>
                    </div>
                </div>


                {/* Search Result Sidebar */}
                <div id="search_results_sidebar" className={`popup ${this.state.showPopup ? 'show': ''}`}>
                    {
                        this.state.showPopup ? (
                            <div className='sidebar_wrapper'>
                                
                                <div className='sidebar'>
                                    <span className="closePopup_icon" onClick={ this.closePopup }> <IconClosePopup/> </span>
                                    <div className="search_result_wrapper">
                                    {
                                        Object.entries(secondSearchData).map(([key,value],i) => {

                                            switch(value.type){
                                                case 'companies': 
                                                    return <Companies 
                                                            mainData={this.props.secondSearchLevelData} 
                                                            secondLevelData={ secondSearchData } 
                                                            level={i+1} 
                                                            viewMoreInit={(subType, pageNo, level, mainId, mainType) => this.handleViewMore(subType, pageNo, level, mainId, mainType)} 
                                                            levelName={key}
                                                            hasViewMoreData={this.props.hasViewMoreData}
                                                            resetViewMore={this.handleResetViewMore}
                                                            itemClickInit={ ( category, itemId, level, itemData, parentType ) => this.handleItemClick( category, itemId, level, itemData, parentType ) }
                                                            currentLevelClick = { this.state.currLevelClick }
                                                            levelLoader={this.props.loaderLevel}
                                                            viewMoreLoaderLevel={this.props.viewMoreLoaderLevel}
                                                            exportSearchResults={ (type, data) => this.handleExportSearchResults(type,data) }
                                                            hideViewMoreFor = {this.props.hideViewMoreFor}
                                                            />
                                                    break;

                                                case 'drugs': 
                                                    return <Drugs 
                                                            mainData={this.props.secondSearchLevelData} 
                                                            secondLevelData={ secondSearchData } 
                                                            level={i+1} 
                                                            viewMoreInit={(subType, pageNo, level, mainId, mainType) => this.handleViewMore(subType, pageNo, level, mainId, mainType)} 
                                                            levelName={key}
                                                            hasViewMoreData={this.props.hasViewMoreData}
                                                            resetViewMore={this.handleResetViewMore}
                                                            itemClickInit={ ( category, itemId, level, itemData, parentType ) => this.handleItemClick( category, itemId, level, itemData, parentType ) }
                                                            currentLevelClick = { this.state.currLevelClick }
                                                            levelLoader={this.props.loaderLevel}
                                                            viewMoreLoaderLevel={this.props.viewMoreLoaderLevel}
                                                            exportSearchResults={ (type, data) => this.handleExportSearchResults(type,data) }
                                                            hideViewMoreFor = {this.props.hideViewMoreFor}
                                                            customExport={ (type, id, subtype) => this.handleCustomExport(type, id, subtype) }
                                                            />
                                                    break;

                                                case 'targets': 
                                                    return <Targets 
                                                            mainData={this.props.secondSearchLevelData} 
                                                            secondLevelData={ secondSearchData } 
                                                            level={i+1} 
                                                            viewMoreInit={(subType, pageNo, level, mainId, mainType) => this.handleViewMore(subType, pageNo, level, mainId, mainType)} 
                                                            levelName={key}
                                                            hasViewMoreData={this.props.hasViewMoreData}
                                                            resetViewMore={this.handleResetViewMore}
                                                            itemClickInit={ ( category, itemId, level, itemData, parentType, parentId ) => this.handleItemClick( category, itemId, level, itemData, parentType, parentId ) }
                                                            currentLevelClick = { this.state.currLevelClick }
                                                            levelLoader={this.props.loaderLevel}
                                                            viewMoreLoaderLevel={this.props.viewMoreLoaderLevel}
                                                            exportSearchResults={ (type, data) => this.handleExportSearchResults(type,data) }
                                                            hideViewMoreFor = {this.props.hideViewMoreFor}
                                                            customExport={ (type, id, subtype) => this.handleCustomExport(type, id, subtype) }
                                                            />
                                                    break;
                                                    
                                                case 'diseases': 
                                                    return <Diseases 
                                                            mainData={this.props.secondSearchLevelData} 
                                                            secondLevelData={ secondSearchData } 
                                                            level={i+1} 
                                                            viewMoreInit={(subType, pageNo, level, mainId, mainType) => this.handleViewMore(subType, pageNo, level, mainId, mainType)} 
                                                            levelName={key}
                                                            hasViewMoreData={this.props.hasViewMoreData}
                                                            resetViewMore={this.handleResetViewMore}
                                                            itemClickInit={ ( category, itemId, level, itemData, parentType, parentId ) => this.handleItemClick( category, itemId, level, itemData, parentType, parentId ) }
                                                            currentLevelClick = { this.state.currLevelClick }
                                                            levelLoader={this.props.loaderLevel}
                                                            viewMoreLoaderLevel={this.props.viewMoreLoaderLevel}
                                                            exportSearchResults={ (type, data) => this.handleExportSearchResults(type,data) }
                                                            hideViewMoreFor = {this.props.hideViewMoreFor}
                                                            customExport={ (type, id, subtype) => this.handleCustomExport(type, id, subtype) }
                                                            />
                                                    break;

                                                case 'pathways': 
                                                    return <Pathways 
                                                            mainData={this.props.secondSearchLevelData} 
                                                            secondLevelData={ secondSearchData } 
                                                            level={i+1} 
                                                            viewMoreInit={(subType, pageNo, level, mainId, mainType) => this.handleViewMore(subType, pageNo, level, mainId, mainType)} 
                                                            levelName={key}
                                                            hasViewMoreData={this.props.hasViewMoreData}
                                                            resetViewMore={this.handleResetViewMore}
                                                            itemClickInit={ ( category, itemId, level, itemData, parentType ) => this.handleItemClick( category, itemId, level, itemData, parentType ) }
                                                            currentLevelClick = { this.state.currLevelClick }
                                                            levelLoader={this.props.loaderLevel}
                                                            viewMoreLoaderLevel={this.props.viewMoreLoaderLevel}
                                                            exportSearchResults={ (type, data) => this.handleExportSearchResults(type,data) }
                                                            hideViewMoreFor = {this.props.hideViewMoreFor}
                                                            customExport={ (type, id, subtype) => this.handleCustomExport(type, id, subtype) }
                                                            />
                                                    break;

                                                case 'compounds': 
                                                    return <Compounds 
                                                            mainData={this.props.secondSearchLevelData} 
                                                            secondLevelData={ secondSearchData } 
                                                            level={i+1} 
                                                            viewMoreInit={(subType, pageNo, level, mainId, mainType) => this.handleViewMore(subType, pageNo, level, mainId, mainType)} 
                                                            levelName={key}
                                                            hasViewMoreData={this.props.hasViewMoreData}
                                                            resetViewMore={this.handleResetViewMore}
                                                            itemClickInit={ ( category, itemId, level, itemData, parentType, parentId ) => this.handleItemClick( category, itemId, level, itemData, parentType, parentId ) }
                                                            currentLevelClick = { this.state.currLevelClick }
                                                            levelLoader={this.props.loaderLevel}
                                                            viewMoreLoaderLevel={this.props.viewMoreLoaderLevel}
                                                            exportSearchResults={ (type, data) => this.handleExportSearchResults(type,data) }
                                                            hideViewMoreFor = {this.props.hideViewMoreFor}
                                                            />
                                                    break;

                                                case 'documents': 
                                                    return <Documents 
                                                            mainData={this.props.secondSearchLevelData} 
                                                            secondLevelData={ secondSearchData } 
                                                            level={i+1} 
                                                            viewMoreInit={(subType, pageNo, level, mainId, mainType) => this.handleViewMore(subType, pageNo, level, mainId, mainType)} 
                                                            levelName={key}
                                                            hasViewMoreData={this.props.hasViewMoreData}
                                                            resetViewMore={this.handleResetViewMore}
                                                            itemClickInit={ ( category, itemId, level, itemData, parentType, title ) => this.handleItemClick( category, itemId, level, itemData, parentType, title ) }
                                                            currentLevelClick = { this.state.currLevelClick }
                                                            levelLoader={this.props.loaderLevel}
                                                            viewMoreLoaderLevel={this.props.viewMoreLoaderLevel}
                                                            exportSearchResults={ (type, data) => this.handleExportSearchResults(type,data) }
                                                            hideViewMoreFor = {this.props.hideViewMoreFor}
                                                            customExport={ (type, id, subtype) => this.handleCustomExport(type, id, subtype) }
                                                            documentsLoader={this.props.documentsLoader}
                                                            />
                                                    break;
                                                
                                                default:
                                                    break;
                                            }

                                            
                                        })
                                    }

                                    </div>
                                    
                                </div>
                            </div>
                        ) : null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    appState: state,
    searchPageNo: state.users.searchPage,
    loadMore: state.users.searchData.loadMore,
    hasSearchData: state.users.searchData.hasData,
    showLoader: state.users.isLoading,
    searchData: state.users.searchData,
    searchDataFirstLevel: state.users.searchData.firstLevelData,  
    popupLoader: state.users.popupLoader,
    hasViewMoreData: state.users.hasViewMoreData,
    secondSearchLevelData: state.users.secondLevelData,
    loaderLevel: state.users.secondLevelLoader,
    viewMoreLoaderLevel: state.users.viewMoreLevel,
    compoundsPage: state.users.searchData.compoundsPage,
    exportCompounds: state.users.compoundsToExport,
    hideViewMoreFor: state.users.hideViewMoreFor,
    customExportPopupData: state.users.customExport,
    documentsLoader: state.users.documentDataLoader,
})

export default connect(mapStateToProps, {...userAction })(UserDashboard)


