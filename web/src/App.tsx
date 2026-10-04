import { Routes, Route } from 'react-router'
import TasksPage from './pages/TasksPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<TasksPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />
    </Routes>
  )
}

export default App
