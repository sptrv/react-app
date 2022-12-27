import React from 'react';

export const IndividualProduct = ({individualProduct, addToCart}) => {

    const handleAddToCart=()=>{
        addToCart(individualProduct);
    } 
      
    return (
        <div className='product'>
            <div className='product-img'>
                <img src={individualProduct.url} alt="product-img"/>
            </div>
            <div className='product-text title'>{individualProduct.title}</div>
            <div className='product-text price'>₴ {individualProduct.price}</div>
            <div className='btn btn-danger btn-md cart-btn' onClick={handleAddToCart}>Додати до корзини</div>
        </div> 
    )
}