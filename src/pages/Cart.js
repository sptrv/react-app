import React,{useState, useEffect} from 'react';
import { Menu } from "../components/Menu";
import {auth,fs} from '../firebase'
import { CartProducts } from '../components/CartProducts';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from '../components/Modal';

toast.configure();

export const Cart = () => {
    
    const [showModal, setShowModal]=useState(false);
    
    const triggerModal=()=>{
        setShowModal(true);
    }

    const hideModal=()=>{
        setShowModal(false);
    }
    
    function GetCurrentUser(){
        const [user, setUser]=useState(null);
        useEffect(()=>{
          auth.onAuthStateChanged(user=>{
              if(user){
                  fs.collection('users').doc(user.uid).get().then(snapshot=>{
                      setUser(snapshot.data().FullName);
                  })
              }
              else{
                  setUser(null);
              }
          })
        },[])
        return user;
    }
    
    const user = GetCurrentUser();
    
    const [cartProducts, setCartProducts]=useState([]);
    
    useEffect(()=>{
      auth.onAuthStateChanged(user=>{
          if(user){
              fs.collection('Cart ' + user.uid).onSnapshot(snapshot=>{
                  const newCartProduct = snapshot.docs.map((doc)=>({
                      ID: doc.id,
                      ...doc.data(),
                  }));
                  setCartProducts(newCartProduct);                    
              })
          }
          else{
              console.log('user is not signed in to retrieve cart');
          }
      })
    },[])
    
    const qty = cartProducts.map(cartProduct=>{
        return cartProduct.qty;
    })
    
    const reducerOfQty = (accumulator, currentValue)=>accumulator+currentValue;
    
    const totalQty = qty.reduce(reducerOfQty,0);

    const price = cartProducts.map((cartProduct)=>{
      return cartProduct.TotalProductPrice;
    })
    
    const reducerOfPrice = (accumulator,currentValue)=>accumulator+currentValue;
    const totalPrice = price.reduce(reducerOfPrice,0);
    
    let Product;

    const cartProductIncrease=(cartProduct)=>{

      Product=cartProduct;
      Product.qty=Product.qty+1;
      Product.TotalProductPrice=Product.qty*Product.price;

      auth.onAuthStateChanged(user=>{
          if(user){
              fs.collection('Cart ' + user.uid).doc(cartProduct.ID).update(Product).then(()=>{
                  console.log('increment added');
              })
          }
          else{
              console.log('user is not logged in to increment');
          }
      })
    }
    
    const cartProductDecrease =(cartProduct)=>{
      Product=cartProduct;
      if(Product.qty > 1){
          Product.qty=Product.qty-1;
          Product.TotalProductPrice=Product.qty*Product.price;

          auth.onAuthStateChanged(user=>{
              if(user){
                  fs.collection('Cart ' + user.uid).doc(cartProduct.ID).update(Product).then(()=>{
                      console.log('decrement');
                  })
              }
              else{
                  console.log('user is not logged in to decrement');
              }
          })
      }
    }


   const [totalProducts, setTotalProducts]=useState(0);
 
   useEffect(()=>{        
       auth.onAuthStateChanged(user=>{
           if(user){
               fs.collection('Cart ' + user.uid).onSnapshot(snapshot=>{
                   const qty = snapshot.docs.length;
                   setTotalProducts(qty);
               })
           }
       })       
    },[])  

    const navigate = useNavigate();
    const handleToken = async(token)=>{
    
    const cart = {name: 'All Products', totalPrice}
    const response = await axios.post('http://localhost:8080/checkout',{
        token,
        cart
    })
    console.log(response);
    let {status}=response.data;
    console.log(status);
    if(status==='success'){
        navigate('/');
        toast.success('Ваш заказ прийнято!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        });     
        const uid = auth.currentUser.uid;
        const carts = await fs.collection('Cart ' + uid).get();
        for(var snap of carts.docs){
            fs.collection('Cart ' + uid).doc(snap.id).delete();
        }
    }else{
            alert('Виникла помилка під час перевірки!');
        }
    }
    
    return (
        <>
        <Menu user={user} totalProducts={totalProducts}/>           
        {cartProducts.length > 0 && (
            <div className='container-fluid filter-products-main-box'>
                <div className='summary-box'>
                    <h5>Загальна сума</h5>
                    <br></br>
                    <div>
                      Кількісь товарів: <span>{totalQty}</span>
                    </div>
                    <div>
                      До оплати: <span>₴ {totalPrice}</span>
                    </div>
                    <br></br>
                    <StripeCheckout
                        stripeKey='pk_test_51MHGyfLFee9zmE0ab4bBw1uXZmmGnq2o9YpVgOAubzVl9kJxIb7oOM0fkNVeJNXahHfY43WGzIo64pg4WuuVV1le000mmRfUIV'
                        token={handleToken}
                        billingAddress
                        shippingAddress
                        name='All Products'
                        amount={totalPrice * 100}            
                    ></StripeCheckout>
                    <h6 className='text-center'style={{marginTop: 20+'px'}}>АБО</h6>
                    <button className='btn btn-dark btn-md' 
                    onClick={()=>triggerModal()}>Cash on Delivery</button>                  
                </div> 

                <div className='my-products'>
                    <h1 className='text-center'>Корзина</h1>
                    <div className='products-box cart'>
                        <CartProducts cartProducts={cartProducts}
                        cartProductIncrease={cartProductIncrease}
                        cartProductDecrease={cartProductDecrease}
                    /></div>
                </div>
            </div>
          )}

          {cartProducts.length < 1 && (
              <div className='container-fluid'>У корзині нема продуктів!</div>
          )}    

           {showModal===true&&(
                <Modal TotalPrice={totalPrice} totalQty={totalQty}
                    hideModal={hideModal}
                />  
            )}      
      </>
  )
}