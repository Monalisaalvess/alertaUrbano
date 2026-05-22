import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Navbar from  './components/Navbar'
import Footer from  './components/Footer'
import EmBreve from './pages/EmBreve'
import Home from './pages/Home'
import Login from './pages/Login'
import Complaint from './pages/Complaint'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Contact from './pages/Contact'



function App() {

  return (
    <BrowserRouter>
    <Navbar/>
     <Routes>
        <Route path='/'          element={<Home/>     }/>
        <Route path='/login'     element={<Login/>    }/>
        <Route path='/complaint' element={<Complaint/>}/>
        <Route path='/profile'   element={<Profile/>  }/>
        <Route path='/contact'   element={<Contact/>  }/>
        <Route path='/Dashboard' element={<Dashboard/>}/>
        <Route path='/em-breve'  element={<EmBreve/>  }/>
     </Routes>
    <Footer/>
    </BrowserRouter>
  )
}

export default App
