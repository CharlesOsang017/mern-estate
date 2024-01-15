import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import About from "./pages/About"
import Profile from "./pages/Profile"
import Header from "./components/Header"
import { Toaster } from 'react-hot-toast';
const App = () => {
  return (
  <BrowserRouter>
  <Header />
  <Toaster />
  <Routes>
    <Route path='/' element={<Home />}/>
    <Route path='/sign-in' element={<SignIn />}/>
    <Route path='/sign-up' element={<SignUp />}/>
    <Route path='/about' element={<About />}/>
    <Route path='/profile' element={<Profile />}/>
  </Routes>
  </BrowserRouter>
  )
}

export default App