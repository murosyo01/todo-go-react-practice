import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import TaskList from './pages/TaskList'
import Login from './pages/Login'
import Register from './pages/Register'
import { getCurrentUser } from '@/services/authService'
import './App.css'

// 認証ガードコンポーネント
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <TaskList />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
