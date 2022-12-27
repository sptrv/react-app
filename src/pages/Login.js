import React,{useState} from 'react';
import {auth} from '../firebase';
import {Link, useNavigate} from 'react-router-dom';

export const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');

    const [errorMsg, setErrorMsg]=useState('');
    const [successMsg, setSuccessMsg]=useState('');

    const handleLogin=(e)=>{
        e.preventDefault();

        auth.signInWithEmailAndPassword(email,password).then(()=>{
            setSuccessMsg('Ви ввійшли успішно!');
            setEmail('');
            setPassword('');
            setErrorMsg('');
            setTimeout(()=>{
                setSuccessMsg('');
                navigate('/');
            },3000)
        }).catch(error=>setErrorMsg(error.message));
    }

    return (
        <div className='l-s-container'> 
            <div className='box'> 
            <h1>Вхід</h1>
            <hr></hr>
            <br></br>

            {successMsg&&<>
                <div className='success-msg'>{successMsg}</div>
                <br></br>
            </>}

            <form autoComplete="off"onSubmit={handleLogin}>               
                
                <label>E-mail</label>
                <input type="email" className='form-control' required
                onChange={(e)=>setEmail(e.target.value)} value={email}></input>
                <br></br>

                <label>Пароль</label>
                <input type="password" className='form-control' required
                onChange={(e)=>setPassword(e.target.value)} value={password}></input>
                <br></br>

                <div className='btn-box'>
                    <span>У вас ще немає облікового запису?  
                    <Link to="/signup" className='link'>Зареєструватися</Link></span>
                    <br></br>
                </div>

                <div style={{display:'flex', justifyContent:'flex-end'}}>
                    <button type="submit" className='btn btn-success btn-md'>
                       Увійти
                    </button>
                </div>
            </form>

            {errorMsg&&<>
                <br></br>
                <div className='error-msg'>{errorMsg}</div>                
            </>}
            </div> 
        </div> 
    )
}