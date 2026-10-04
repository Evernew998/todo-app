import { Routes, Route } from 'react-router'
import TasksPage from './pages/TasksPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProtectedRoute from './components/ProtectedRoute'
import PublicOnlyRoute from './components/PublicOnlyRoute'

function App() {
  return (
    <Routes>
      <Route
        path='/login'
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path='/signup'
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
