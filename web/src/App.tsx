import { Routes, Route } from 'react-router'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <Routes>
      <Route path='/signup' element={<SignupPage />} />
    </Routes>
  )
}

export default App
