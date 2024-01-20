import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import About from "./pages/About"
import Profile from "./pages/Profile"
import Header from "./components/Header"
import { Toaster } from 'react-hot-toast';
import PrivateRoute from "./components/PrivateRoute"
import CreateListing from "./pages/CreateListing"
import UpdateListing from "./pages/UpdateListing"
import Listing from "./pages/Listing"
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
    <Route exact path='/listing/:listingId' element={<Listing />}/>
    <Route  element={<PrivateRoute />}>
    <Route path='/profile' element={<Profile />}/>
    <Route path='/create-listing' element={<CreateListing />}/>
    <Route path='/update-listing/:listingId' element={<UpdateListing />}/>
    </Route>
  </Routes>
  </BrowserRouter>
  )
}
export default App