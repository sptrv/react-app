import './App.css';
import {Menu} from "./components/Menu";
import {Routes, Route} from "react-router-dom";
import {Home} from './pages/Home';
import {Login} from './pages/Login';
import {Signup} from './pages/SignUp';
import {NotFound} from './pages/NotFound';
import {AddProducts} from './pages/AddProducts';
import {Cart} from './pages/Cart';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Menu/>
      </header>
      <br></br>
      <main className="container">
          <Routes>   
            <Route exact path="/" element={<Home/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/add-product" element={<AddProducts/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route element={<NotFound/>}/>   
          </Routes>
      </main>
    </div>
  );
}

export default App;
