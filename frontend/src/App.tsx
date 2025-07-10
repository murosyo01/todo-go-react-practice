import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import TaskList from './pages/TaskList'
import './App.css'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskList />} />
      </Routes>
    </Router>
  )
}

export default App
