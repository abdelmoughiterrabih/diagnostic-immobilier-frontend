import logo from './logo.svg';
import './App.css';
import LoginForm from './components/login/login.js';
import { BrowserRouter,Routes,Route,Link } from 'react-router-dom';
//import Test from './components/test.js';
import AppComponent from './AppComponents/index.js';
import Signup from './components/Signup/index.js';
function App() {
  
    return (
     <BrowserRouter>
     <Routes>
        <Route path='/login' element={<LoginForm/>}/>
        <Route path='/*' element={<AppComponent/>}/>
        <Route path='/signup' element={<Signup/>}/>
     </Routes>
     
     
     </BrowserRouter>
    );
  }


export default App;
