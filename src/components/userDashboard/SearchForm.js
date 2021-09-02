import React, { useState, useEffect, useRef } from 'react'
import IconDropdown from '../../assets/svgs/IconDropdown'
import IconSearch from '../../assets/svgs/IconSearch'
import IconClosePopup from '../../assets/svgs/IconClosePopup'

const SearchForm = ({ defaultSearchType, searchVal, searchInit, dropdownChangeInit, searchInputChangeInit, resetSearchVal }) => {
    const [isDropdownActive, setIsDropdownActive] = useState(false)
    const dropdownRef = useRef(null)
    useEffect(() => {
        const handleClickOutside = (event) =>
            dropdownRef.current && !dropdownRef.current.contains(event.target)
                ? setIsDropdownActive(false)
                : null
        // ? Bind the event listener
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            // ?  Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])
    
    const handleSearchButton = (e) => {
        e.preventDefault()
        searchInit(defaultSearchType, searchVal)
    }

    // ? Reset Search Input
    const resetSearchResults = () => {
        resetSearchVal()
    }

    return (
        <div className='search_form flex_view_xs middle'>
            <div ref={dropdownRef} className={`dropdown ${isDropdownActive ? 'active': ''}`} onClick={() => setIsDropdownActive(!isDropdownActive)}>
                <span className='active_val'> {defaultSearchType} </span>
                <span className='icon'> <IconDropdown/> </span>

                <div className='dropdown_menu'>
                    <span className={`${defaultSearchType === 'companies' ? 'active' : ''}`} onClick={(e) => dropdownChangeInit(e.target.textContent)}>companies</span>
                    <span className={`${defaultSearchType === 'drugs' ? 'active' : ''}`} onClick={(e) => dropdownChangeInit(e.target.textContent)}>drugs</span>
                    <span className={`${defaultSearchType === 'diseases' ? 'active' : ''}`} onClick={(e) => dropdownChangeInit(e.target.textContent)}>diseases</span>
                    <span className={`${defaultSearchType === 'targets' ? 'active' : ''}`} onClick={(e) => dropdownChangeInit(e.target.textContent)}>targets</span>
                    <span className={`${defaultSearchType === 'pathways' ? 'active' : ''}`} onClick={(e) => dropdownChangeInit(e.target.textContent)}>pathways</span>
                    <span className={`${defaultSearchType === 'compounds' ? 'active' : ''}`} onClick={(e) => dropdownChangeInit(e.target.textContent)}>compounds</span>
                    <span className={`${defaultSearchType === 'documents' ? 'active' : ''}`} onClick={(e) => dropdownChangeInit(e.target.textContent)}>documents</span>
                </div>
            </div>

            <div className='form_wrap'>
                <form>
                    <div className="searchBar flex_view_xs middle">
                        <div className="search_input">
                            <span className="search_icon">
                                <IconSearch />
                            </span>
                            <span className={`clear_search_icon ${searchVal ? '' : 'disabled'}`} onClick={ () => resetSearchVal() }>
                                <IconClosePopup/>
                            </span>
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchVal}
                                onChange={(e) => searchInputChangeInit(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="search_btn"
                            onClick={ (e) => handleSearchButton(e) }
                        >
                            SEARCH
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default SearchForm
