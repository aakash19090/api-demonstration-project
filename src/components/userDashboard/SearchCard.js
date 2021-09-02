import React from 'react'
import IconEye from '../../assets/svgs/IconEye'

const SearchCard = ({ title, itemDetails, itemId, cardClickInit }) => {

    const handleItemClick = (e) => {
        const main_id = e.target.closest('.card_inner').id
        cardClickInit(main_id,title, itemDetails.originalData)
    }
    return (
        <div className='col-xs-12 col-sm-6'>
            <div className='card_inner' id={itemId} onClick={(e) => handleItemClick(e)}>
                <div className="header">
                    <h3 className='card_title'>{title}</h3>
                    <span className='show_icon'> <IconEye/> </span>
                </div>

                <div className="body">
                    <div className="descr_wrap">
                    {
                        Object.entries(itemDetails.description).map(([key,value],i) => {
                            if(key === 'similarity'){
                                if(value){
                                    return <>
                                        <p className='key'> { key.replace('_',' ') }: </p>
                                        <p className='value'>{value}</p>
                                    </>
                                }else{
                                    return <>
                                        <p className='key'> { key.replace('_',' ') }: </p>
                                        <p className='value'>NA</p>
                                    </>
                                }
                            }
                            if(key !== 'documents'){
                                return <>
                                    <p className='key'> { key.replace('_',' ') }: </p>
                                    <p className='value'>{value}</p>
                                </>
                            }
                        })  
                    }   
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchCard
