import React,{useState} from 'react';
import {storage, fs} from '../firebase';

export const AddProducts = () => {
    
    const [title, setTitle]=useState('');
    const [price, setPrice]=useState('');
    const [category, setCategory]=useState('');
    const [image, setImage]=useState(null);

    const [imageError, setImageError]=useState('');
    const [successMsg, setSuccessMsg]=useState('');
    const [uploadError, setUploadError]=useState('');

    const types =['image/jpg','image/jpeg','image/png','image/PNG'];
    const handleProductImg=(e)=>{
        let selectedFile = e.target.files[0];
        if(selectedFile) {
            if(selectedFile&&types.includes(selectedFile.type)) {
                setImage(selectedFile);
                setImageError('');
            }
            else {
                setImage(null);
                setImageError('please select a valid image file type (png or jpg)')
            }
        }
        else {
            console.log('please select your file');
        }
    }

    const handleAddProducts=(e)=>{
        e.preventDefault();

        const uploadTask=storage.ref(`product-images/${image.name}`).put(image);
        uploadTask.on('state_changed',snapshot=>{
            const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
            console.log(progress);
        },error=>setUploadError(error.message),()=>{
            storage.ref('product-images').child(image.name).getDownloadURL().then(url=>{
                fs.collection('Products').add({
                    title,
                    category,
                    price: Number(price),
                    url
                }).then(()=>{
                    setSuccessMsg('Продукт додано успішно!');
                    setTitle('');
                    setCategory('');
                    setPrice('');
                    document.getElementById('file').value='';
                    setImageError('');
                    setUploadError('');
                    setTimeout(()=>{
                        setSuccessMsg('');
                    },3000)
                }).catch(error=>setUploadError(error.message));
            })
        })
    }
  
    return (
        <div className='l-s-container'> 
            <div className='box'>
                <h1 className='text-center'>Додавання товару</h1>
                <hr></hr>
                <br></br>
                
                {successMsg&&<>
                <div className='success-msg'>{successMsg}</div>
                <br></br>
                </>} 
                
                <form autoComplete="off" className='form-group' onSubmit={handleAddProducts}>
                    <label>Назва товару</label>
                    <input type="text" className='form-control' required
                    onChange={(e)=>setTitle(e.target.value)} value={title}></input>
                    <br></br>
                    
                    <label>Ціна товару</label>
                    <input type="number" className='form-control' required
                    onChange={(e)=>setPrice(e.target.value)} value={price}></input>
                    <br></br>
                    
                    <label>Категорія товару</label>
                    <select className='form-control' required
                    value={category} onChange={(e)=>setCategory(e.target.value)}>                                    
                    <option value="">Виберіть категорію</option>                   
                    <option>Кімнатні рослини</option>
                    <option>Еустоми</option>
                    <option>Троянди</option>
                    <option>Півонії</option>
                    <option>Тюльпани</option>
                    </select>
                    <br></br>
                    
                    <label>Завантажте фото товару</label>
                    <input type="file" id="file" className='form-control' required
                    onChange={handleProductImg}></input>
                    {imageError&&<>
                    <br></br>
                    <div className='error-msg'>{imageError}</div>
                    </>}
                    <br></br>
                    
                    <div style={{display:'flex', justifyContent:'flex-end'}}>
                        <button type="submit" className='btn btn-success btn-md'>
                            Додати
                        </button>
                    </div>
                </form>
                
                {uploadError&&<>
                <br></br>
                <div className='error-msg'>{uploadError}</div>
                </>}
            </div>
        </div>
    )
}