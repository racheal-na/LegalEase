import './App.css'
import {Routes , Route} from 'react-router'
import LawyerSignup from './Pages/LawyerSignup'
import LawyerPage from './Pages/LawyerPage'
import LawyerSignin from './Pages/LawyerSignin'
import LawyerCreateProfile from './Pages/LawyerCreateProfile'
import UserSignup from './Pages/UserSignup'
import UserPage from './Pages/UserPage'
import UserSignin from './Pages/UserSignin'
import CreateAvailableDate from './Pages/CreateAvailableDate'
import DisplayAvailability from './Pages/DisplayAvailability'
import CreateCase from './Pages/CreateCase'
import DisplayCaseUser from './Pages/DisplayCaseUser'
import DisplayCaseLawyer from './Pages/DisplayCaseLawyer'
import FutureWork from './Pages/FutureWork'
import UpdateLawyerProfile from './Pages/UpdateLawyerProfile'
function App() {
  

  return (
    <>
      <Routes>
      
        <Route path='/' element={<UserSignin/>}> </Route>
        <Route path='/userSignup' element={<UserSignup/>}></Route>
        <Route path='/userSignin' element={<UserSignin/>}></Route>
        <Route path='/lawyerSignin' element={<LawyerSignin/>}> </Route>
        <Route path='/lawyerSignup' element={<LawyerSignup/>}> </Route>
         <Route path='/lawyerPage' element={<LawyerPage/>}> </Route>
         <Route path='/lawyerCreateProfile' element={<LawyerCreateProfile/>}></Route>
         <Route path='/userPage' element={<UserPage/>}></Route>
         <Route path='/createAvailability' element={<CreateAvailableDate/>}></Route>
         <Route path='/displayAvailability' element={<DisplayAvailability/>}></Route>
         <Route path='/createCase' element={<CreateCase/>}></Route>
         <Route path='/displayUserCases' element={<DisplayCaseUser/>}></Route>
         <Route path='/displayLawyerCases' element={<DisplayCaseLawyer/>}></Route>
         <Route path='/updateLawyerProfile' element={<UpdateLawyerProfile/>}></Route>
          <Route path='/futureWork' element={<FutureWork/>}></Route>
      </Routes>
    </>
  )
}

export default App
