import { Route, Routes } from "react-router-dom"
import { Login } from "./Pages/Login"
import { LoginCallback } from "./Pages/LoginCallback"
import { Join } from "./Pages/Join"
import { CreateChannel } from "./Pages/CreateChannel"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/auth/callback" element={<LoginCallback/>}/>
      <Route path="/register" element={<Join/>}/>
      <Route path="/createChannel" element={<CreateChannel/>}/>
    </Routes>
  )
}

export default App
