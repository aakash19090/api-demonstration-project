import React, { useState, useMemo } from 'react'
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination  } from 'react-table'
import { toast } from 'react-toastify';
import IconFileUpload from '../../assets/svgs/IconFileUpload'
import IconSearch from '../../assets/svgs/IconSearch'
import IconDownload from '../../assets/svgs/IconDownload'
import IconReplace from '../../assets/svgs/IconReplace'
import IconDelete from '../../assets/svgs/IconDelete'
import IconSortAsc from '../../assets/svgs/IconSortAsc'
import IconSortDesc from '../../assets/svgs/IconSortDesc'
import IconPaginationFirst from '../../assets/svgs/IconPaginationFirst'
import IconPaginationLast from '../../assets/svgs/IconPaginationLast'
import IconClosePopup from '../../assets/svgs/IconClosePopup'
import FileUploadPopup from '../popups/FileUploadPopup'
import DeleteFilePopup from '../popups/DeleteFilePopup'
import ReplaceFilePopup from '../popups/ReplaceFilePopup'
import useFileDownloader from '../../hooks/useFileDownloader'

const moment= require('moment') 

const DataTable = ({ dataList, uploadFileInit, replaceFileInit, deleteFileInit, uploadProgress, cancelRequest, filesUploadingList, cancelFileUploadInit }) => {
    const [searchValue, setSearchValue] = useState('')
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [showReplacePopup, setShowReplacePopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    const [fileToDelete, setFileToDelete] = useState(null);
    const [fileToReplace, setFileToReplace] = useState(null);

    const [downloadFile, downloaderComponentUI] = useFileDownloader();
    const download = (file) => {
        file.file = `${process.env.APIURL}/files/${file.timestampName}`;
        downloadFile(file)
    };
    // ? Table Columns
    const COLUMNS = [
        {
            Header: 'Filename',
            accessor: 'name',
            sortable: true,
            Cell: ({ value }) => {
                return (
                    <span>{value}</span>
                )
            }
        },

        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: ({ row,value }) => {
                const uploadedPercentage = Math.floor(row.original.percentageUploaded) 
                const statusVal = value === 'Processing' ? `Processing... (${uploadedPercentage} %)` : value
                return (
                    <span className={`percentage ${value}`}>{ statusVal }</span>
                ) 
            }
        },
        
        {
            Header: 'Uploaded on',
            accessor: 'uploadedAt',
            sortable: true,
            disableGlobalFilter: true,
            Cell: ( { value } ) => {
                const formatedDate = moment(value).format("DD MMMM YYYY");  
                return (
                    <span>{formatedDate}</span>
                )
            }
        },
        {
            Header: 'Last Updated on',
            accessor: 'updatedAt',
            sortable: true,
            disableGlobalFilter: true,
            Cell: ( { value } ) => {
                const formatedDate = moment(value).format(`DD MMMM YYYY`);  
                return (
                    <span>{formatedDate}</span>
                )
            }
        },
        {
            Header: 'Action',
            accessor: 'action',
            disableGlobalFilter: true,
            sortable: false,
            Cell: ({row}) => {
                return (
                    <div className={`icon_btns flex_view_xs middle left ${row.values.status}`}>
                        <span className='icon_btn' title='Download' onClick={()=>download(row.original)}> <IconDownload /> </span>
                        <span className='icon_btn' title='Replace' onClick={(e) => handleFileOperations('Replace',e)}> <IconReplace /> </span>
                        <span className='icon_btn' title='Delete' onClick={(e) => handleFileOperations('Delete',e)}> <IconDelete /> </span>
                    </div>
                )
            } 
        }

    ]
    const columns = useMemo(() => COLUMNS, []) // ? Memoizing this for performance. It won't create rows on each render.
    const data = useMemo(() => dataList.fileList, [])

    const tableInstance = useTable(
        {
            columns,
            data,
            disableSortRemove:true,
            initialState: {
                pageSize: 20,
                sortBy: [
                    {
                        id: 'updatedAt',
                        desc: true,
                    },
                ],

            },
        },
        useGlobalFilter,
        useFilters,
        useSortBy,
        usePagination
    )

    // ? Destructuring Props from React Table Instance
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        prepareRow,
        state,
        setGlobalFilter,
        setAllFilters
    } = tableInstance

    const { globalFilter, pageIndex } = state;
    const currentPage = pageIndex + 1;

    // ? Handle File Operations
    const handleFileOperations = (flag, e) => {
        const fileId = e.target.closest('.cell_td').getAttribute("data-fileid");
        const fileName = e.target.closest('.cell_td').getAttribute("data-filename");
        if(flag === 'Replace'){
            const fileDetails = { fileId, fileName }
            setShowReplacePopup(true);
            setFileToReplace(fileDetails)
        }
        else if(flag === 'Delete'){
            const fileDetails = { fileId, fileName }
            setShowDeletePopup(true);
            setFileToDelete(fileDetails)
        }
    }

    // ? Handle Close popup
    const closePopup = (flag,cancelUpload) => {
        if(flag === 'deletePopup'){
            setShowDeletePopup(false)
            setFileToDelete(null);
        }else if(flag === 'replacePopup'){
            setShowReplacePopup(false)
            setFileToReplace(null);
            if(cancelUpload){
                cancelRequest()
            }
        }else if(flag === 'uploadPopup'){
            setShowUploadPopup(false)
            if(cancelUpload){
                cancelFileUploadInit(null, 'All')
            }
        }
    }
    
    // ? Handle Coniflrm Delete popup button
    const confirmDeleteButton = (fileToDelete) => {
        deleteFileInit(fileToDelete)
        setShowDeletePopup(false)
    }

    // ? File Input Validation
    const fileValidation = (files) => {
        let filesToSendArr = []
        const nameArr = [ 'companies.json', 'drugs.json', 'pathways.json', 'diseases.json', 'documents.json', 'compounds.json', 'targets.json', 'compound_target.biodata.json', 'compound_target.structure.json', 'target_disease.json' ]
        const toastSettings = {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        }
        Object.values(files).map((file,i) => {
            if(file.type === 'application/json'){
                if( nameArr.includes(file.name)){
                    filesToSendArr.push(file)
                }
                else{
                    toast.error(`Invalid file name for ${file.name}`, toastSettings)
                }
            }else{
                toast.error(`Invalid file format for ${file.name}. Upload only JSON files`, toastSettings)
            }
        })
        return filesToSendArr
    }

    // ? Handle File Upload
    const handleFileUpload = (flag,e) => {
        const files = e.target.files
        const validFiles = fileValidation(files)

        if( validFiles.length > 0 && flag === 'upload' ){
            setShowUploadPopup(true);
            setFileToReplace(null);
            uploadFileInit(validFiles)
        }
        else if( validFiles.length > 0 && flag === 'replace' ){
            setShowReplacePopup(false);
            setShowUploadPopup(true);
            replaceFileInit(validFiles[0],fileToReplace.fileId)
        }
        e.target.value = '' // ? Reset this value to allow same file to be choosed otherwise Onchange will only detect Changed File
    }

    // ? Reset Search Results
    const resetSearchResults = () => {
        setGlobalFilter('')
        setSearchValue('')
    }

    return (
        <div className="inner">
            <div className="container">

                {/* Replace Popup */}
                <ReplaceFilePopup
                    show={showReplacePopup}
                    closePopupInit={ (flag, cancelUpload) => closePopup(flag, cancelUpload) }
                    file={fileToReplace}
                    replaceActiveFileInit={(e)=> handleFileUpload('replace',e) }
                />

                {/*  File Upload Popup  */}
                <FileUploadPopup
                    show={showUploadPopup}
                    closePopupInit={ (flag, cancelUpload) => closePopup(flag,cancelUpload) }
                    progress={uploadProgress}
                    uploadingList={filesUploadingList}
                    cancelFileUpload={(fileName) => cancelFileUploadInit(fileName)}
                />

                {/* Delete Popup */}
                <DeleteFilePopup
                    show={showDeletePopup}
                    closePopupInit={ (flag) => closePopup(flag) }
                    confirmDeleteInit={ (file) => confirmDeleteButton(file) }
                    file={fileToDelete}
                />

                {/*  Search & Upload */}
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="header flex_view_xs middle">
                        <div className="file_upload">
                            <button className="fileupload_btn" type="button">
                                <span className="icon">
                                    <IconFileUpload />
                                </span>
                                <span className="text">UPLOAD FILE</span>
                                <input name='fileupload' type="file" id='fileupload' accept="application/json" onChange={(e) => handleFileUpload('upload',e)} multiple />
                            </button>
                        </div>
                        
                        <div className="searchBar flex_view_xs middle">
                            <div className="search_input">
                                <span className="search_icon">
                                    <IconSearch />
                                </span>
                                <span className={`clear_search_icon ${searchValue ? '' : 'disabled'}`} onClick={ resetSearchResults }>
                                    <IconClosePopup/>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search for files"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="search_btn"
                                onClick={() => setGlobalFilter(searchValue)}
                                onKeyPress={() => setGlobalFilter(searchValue)}
                            >
                                SEARCH{' '}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="info_div">
                    File Details

                    <div className="info_text">
                        <span className="caret_icon">
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
                        <p> The file type must be JSON. The valid file names should be : companies, drugs, diseases, compounds, targets, pathways, documents, compound_target.biodata, compound_target.structure, target_disease </p>
                    </div>
                </div>

                {/*  DataTable */}
                <div className="fileListTable ">
                    <table {...getTableProps()}>
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            className={column.headerClassName}
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            title={ column.isSorted ? column.isSortedDesc ? 'Sorted Descending' : 'Sorted Ascending' : 'Sort by' }
                                        >
                                            <span className='th_txt'> {column.render('Header')}
                                            {
                                                column.sortable ? (
                                                    <span className="sort_icon" data-sort={column.isSortedDesc}>
                                                        {
                                                            column.isSorted ? (
                                                                column.isSortedDesc ? (
                                                                    <IconSortDesc />
                                                                ) : (
                                                                    <IconSortAsc />
                                                                )
                                                        ) : (
                                                            <>
                                                                <IconSortAsc />
                                                                <IconSortDesc />
                                                            </>
                                                        )}
                                                    </span>
                                                ) : null
                                            }
                                            </span>
                                            
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>

                        <tbody {...getTableBodyProps()}>
                            {page.length > 0 ? (
                                page.map((row) => {
                                    prepareRow(row)
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map((cell) =>{
                                                return(
                                                    <td
                                                        className={cell.className}
                                                        {...cell.getCellProps()}
                                                        
                                                    >
                                                        <div className="cell_td" data-filename={cell.row.original.name} data-fileid={cell.row.original._id}>
                                                            {cell.render('Cell')}
                                                        </div>
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td className="no_rows" colSpan="5">
                                        <div className="cell_td no_rows_txt text-center xs-left">
                                            NO FILES FOUND
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/*  Pagination */}

                <div className="pagination ">
                    {
                        page.length > 0 ? (
                        <div className="inner flex_view_xs middle right">
                            <ul className="flex_view_xs middle">
                                <li
                                    className={`firstPage icon_li ${!canPreviousPage ? 'disabled' : ''
                                        }`}
                                    title="first page"
                                    onClick={() => gotoPage(pageOptions[0])}
                                >
                                    <IconPaginationFirst />
                                </li>

                                <li
                                    className={`prevPage ${!canPreviousPage ? 'disabled' : ''}`}
                                    onClick={() => previousPage()}
                                >
                                    Prev
                                </li>

                                <li className="pageStatus">
                                    Page <span className="currPage"> {currentPage} </span> of{' '}
                                    <span className="totalPages"> {pageOptions.length} </span>
                                </li>

                                <li
                                    data-page={currentPage}
                                    className={`nextPage ${!canNextPage ? 'disabled' : ''}`}
                                    onClick={() => nextPage()}
                                >
                                    Next
                                </li>

                                <li
                                    className={`lastPage icon_li ${!canNextPage ? 'disabled' : ''}`}
                                    title="last page"
                                    onClick={() => gotoPage(pageOptions.length - 1)}
                                >
                                    <IconPaginationLast />
                                </li>
                            </ul>
                        </div>
                        ) : null
                    }
                </div>
                {downloaderComponentUI}
            </div>
        </div>
    )
}

export default DataTable
