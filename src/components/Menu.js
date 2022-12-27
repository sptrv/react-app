import React from 'react';
import { Navbar, Container } from "react-bootstrap";
import {Link, useNavigate} from 'react-router-dom';
import {auth} from '../firebase';
import {Icon} from 'react-icons-kit';
import {shoppingCart} from 'react-icons-kit/feather/shoppingCart';

export const Menu = ({user,totalProducts}) => {

    const navigate = useNavigate();

    const handleLogout=()=>{
        auth.signOut().then(()=>{
            navigate('/login');
        })
    }

    return (
        <Navbar className='navbar' fixed='top'>
            <Container>
                <div className='name'>
                    <div><Link to="/" className='link1'>
                    <h1>Flower Shop</h1></Link></div>
                </div>
                <div className='rightside'>
                    {!user&&<>
                    <div><Link className='navlink' to="signup">ЗАРЕЄСТРУВАТИСЬ</Link></div>
                    <div><Link className='navlink' to="login">УВІЙТИ</Link></div>
                    </>} 
                    {user&&<>
                    <div className='cart-menu-btn'>
                        <Link className='navlink' to="/cart">
                            <Icon icon={shoppingCart} size={20}/>
                        </Link>
                        <span className='cart-indicator'>{totalProducts}</span> 
                    </div> 
                    <div><Link className='navlink' to="">{user}</Link></div>
                    <div className='btn btn-danger btn-md' 
                    onClick={handleLogout}>ВИЙТИ</div>
                    </>}                     
                </div>
            </Container>
        </Navbar>
    )
}


