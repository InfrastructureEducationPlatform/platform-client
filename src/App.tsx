import { Route, Routes } from "react-router-dom"
import { Login } from "./Pages/Login"
import { LoginCallback } from "./Pages/LoginCallback"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/auth/callback" element={<LoginCallback/>}/>
    </Routes>
  )
}

export default App
