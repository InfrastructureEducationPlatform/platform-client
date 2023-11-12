import { Route, Routes } from "react-router-dom"
import { Login } from "./Pages/Login"
import { LoginCallback } from "./Pages/LoginCallback"
import { Join } from "./Pages/Join"
import { CreateChannel } from "./Pages/CreateChannel"
import { OnBoarding } from "./Pages/Onboarding"
import { Home } from "./Pages/Home"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/auth/callback" element={<LoginCallback/>}/>
      <Route path="/register" element={<Join/>}/>
      <Route path="/createChannel" element={<CreateChannel/>}/>
      <Route path="/onBoarding" element={<OnBoarding/>}/>
      <Route path="/home" element={<Home/>}/>
    </Routes>
  )
}

export default App
