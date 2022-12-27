import React,{useState, useEffect} from 'react';
import { Products } from '../components/Products';
import {auth,fs} from '../firebase';
import { Menu } from "../components/Menu";
import {useNavigate} from 'react-router-dom';
import { IndividualFilteredProduct } from '../components/IndividualFilteredProduct'

export const Home = (props) => {
 const navigate = useNavigate();

    function GetUserUid(){
        const [uid, setUid]=useState(null);
        useEffect(()=>{
            auth.onAuthStateChanged(user=>{
                if(user){
                    setUid(user.uid);
                }
            })
        },[])
        return uid;
    }

    const uid = GetUserUid();

    function GetCurrentUser(){
        const [user, setUser]=useState(null);
        useEffect(()=>{
        auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('users').doc(user.uid).get().then(snapshot=>{
                    setUser(snapshot.data().FullName);
                })
            }
            else {
                setUser(null);
            }
        })
        },[])
        return user;
    }
    
    const user = GetCurrentUser();
    
    const [products, setProducts]=useState([]);
    
    const getProducts = async ()=>{
    const products = await fs.collection('Products').get();
    const productsArray = [];
    for (var snap of products.docs){
        var data = snap.data();
        data.ID = snap.id;
        productsArray.push({
            ...data
        })
        if(productsArray.length === products.docs.length){
            setProducts(productsArray);
        }}
    }
    
    useEffect(()=>{
        getProducts();
    },[])

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
   
    let Product;
   
    const addToCart = (product)=>{
        
        if(uid!==null){
        Product=product;
        Product['qty']=1;
        Product['TotalProductPrice']=Product.qty*Product.price;
        fs.collection('Cart ' + uid).doc(product.ID).set(Product).then(()=>{
            console.log('successfully added to cart');
        })
        }else{
            navigate('/login');
        }
    }

     const [spans]=useState([
        {id: 'Houseplants', text: 'Кімнатні рослини'},
        {id: 'Eustomas', text: 'Еустоми'},
        {id: 'Roses', text: 'Троянди'},
        {id: 'Peonies', text: 'Півонії'},
        {id: 'Tulips', text: 'Тюльпани'},       
    ])

    const [active, setActive]=useState('');
    const [category, setCategory]=useState('');

    const handleChange=(individualSpan)=>{
        setActive(individualSpan.id);
        setCategory(individualSpan.text);
        filterFunction(individualSpan.text);
    }

    const [filteredProducts, setFilteredProducts]=useState([]);

    const filterFunction = (text)=>{
        if(products.length>1){
            const filter=products.filter((product)=>product.category===text);
            setFilteredProducts(filter);
        }
        else{
            console.log('no products to filter')
        } 
    }

    const returntoAllProducts=()=>{
        setActive('');
        setCategory('');
        setFilteredProducts([]);
    }
    
    return (
        <>
        <Menu user={user} totalProducts={totalProducts}/>
        <br></br>
        <div className='container-fluid filter-products-main-box'>
            
            <div className='filter-box'>
                <h6>Категорії продуктів:</h6>
                {spans.map((individualSpan,index)=>(
                    <span key={index} id={individualSpan.id}
                    onClick={()=>handleChange(individualSpan)}
                    className={individualSpan.id===active ? active:'deactive'}>{individualSpan.text}</span>
                 ))}
            </div>

            {filteredProducts.length > 0&&(
                <div className='my-products'>
                    <h1 className='text-center'>{category}</h1>
                    <a href="/#" className = "link" onClick={returntoAllProducts}>Повернутись до каталогу</a>
                    <div className='l-s-container'>
                        <div className='products-box'>
                            {filteredProducts.map(individualFilteredProduct=>(
                            <IndividualFilteredProduct key={individualFilteredProduct.ID}
                            individualFilteredProduct={individualFilteredProduct}
                            addToCart={addToCart}/>
                            ))}
                        </div>
                    </div>
                </div> 
            )}
            
            {filteredProducts.length < 1&&(
            <>
            {products.length > 0&&(
                <div className='my-products'>
                    <h1 className='text-center'>Каталог товарів</h1>
                    <div className='products-box'>
                        <Products products={products} addToCart={addToCart}/>
                    </div>
                </div>
            )}
            {products.length < 1&&(
                <div className='my-products please-wait'>Почекайте...</div>
            )}
            </>
            )}
        </div>       
        </>
    )
}
