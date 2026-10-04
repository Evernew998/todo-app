import { Routes, Route } from 'react-router'
import SignupPage from './pages/SignupPage'
import TasksPage from './pages/TasksPage'

function App() {
  return (
    <Routes>
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/' element={<TasksPage />} />
    </Routes>
  )
}

export default App
