import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import SignUp from './pages/signup';
import SignIn from './pages/login';
import Home from './pages/home';
import Meeting from './pages/Meeting';
import Meetings from './pages/meetings';

function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/createaccount' element={<SignUp/>}></Route>
    <Route path='/signin' element={<SignIn/>}></Route>
    <Route path='/' element={ localStorage.getItem("userId")!=undefined?<Home/>:<SignIn/>}></Route>
    <Route path='/home' element={<Home/>}></Route>
    <Route path='/meetings' element={<Meetings/>}></Route>

    <Route path='/meeting/:roomId/:hostId' element={<Meeting/>}></Route>
    </Routes></BrowserRouter>
  );
}

export default App;
