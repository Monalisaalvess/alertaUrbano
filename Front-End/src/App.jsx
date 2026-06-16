import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Navbar from  './components/Navbar'
import Footer from  './components/Footer'
import about from  './components/About'

import  EmBreve   from './pages/EmBreve'
import  Home      from './pages/Home'
import  Login     from './pages/Login'
import  Complaint from './pages/Complaint'
import  Dashboard from './pages/Dashboard'
import  Profile   from './pages/Profile'
import  Contact   from './pages/Contact'
import  Denuncias from './pages/Denuncias'
import  Denuncia  from './pages/Denuncia'
import About from './components/About'



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
        <Route path='/about'     element={<About/>    }/>
        <Route path='/Denuncias' element={<Denuncias/>}/>
        <Route path='/denuncias/:id'element={<Denuncia/>}/>
     </Routes>
    <Footer/>
    </BrowserRouter>
  )
}

export default App
