import React,{useState} from 'react';
import {auth, fs} from '../firebase';
import {Link, useNavigate} from 'react-router-dom';

export const Signup = () => {

    const navigate = useNavigate();

    const [fullName, setFullname]=useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');

    const [errorMsg, setErrorMsg]=useState('');
    const [successMsg, setSuccessMsg]=useState('');

    const handleSignup=(e)=>{
        e.preventDefault();

        auth.createUserWithEmailAndPassword(email,password).then((credentials)=>{
            console.log(credentials);
            fs.collection('users').doc(credentials.user.uid).set({
                FullName: fullName,
                Email: email,
                Password: password
            }).then(()=>{
                setSuccessMsg('Реєстрація пройшла успішно!');
                setFullname('');
                setEmail('');
                setPassword('');
                setErrorMsg('');
                setTimeout(()=>{
                    setSuccessMsg('');
                    navigate('/');
                },3000)
            }).catch(error=>setErrorMsg(error.message));
        }).catch((error)=>{
            setErrorMsg(error.message)
        })
    }

    return (
        <div className='l-s-container'>
            <div className='box'>
                <h1>Реєстрація</h1>
                <hr></hr>
                <br></br>
                
                {successMsg&&<>
                <div className='success-msg'>{successMsg}</div>
                <br></br> 
                </>}
                
                <form autoComplete="off" onSubmit={handleSignup}>
                <label>Повне ім'я</label>
                <input type="text" className='form-control' required
                onChange={(e)=>setFullname(e.target.value)} value={fullName}></input>
                <br></br>

                <label>E-mail</label>
                <input type="email" className='form-control' required
                onChange={(e)=>setEmail(e.target.value)} value={email}></input>
                <br></br>

                <label>Пароль</label>
                <input type="password" className='form-control' required
                onChange={(e)=>setPassword(e.target.value)} value={password}></input>
                <br></br>

                <div className='btn-box'>
                    <span>У вас вже є обліковий запис?  
                    <Link to="/login" className='link'>Увійти</Link></span>
                    <br></br>
                </div>

                <div style={{display:'flex', justifyContent:'flex-end'}}>
                    <button type="submit" className='btn btn-success btn-md'>
                        Зареєструватись
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