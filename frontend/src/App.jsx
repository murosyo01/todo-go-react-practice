import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AddTask from './pages/AddTask'
import UpdateTask from './pages/UpdateTask'
import TaskList from './pages/TaskList'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/add" element={<AddTask />} />
        <Route path="/update/:id" element={<UpdateTask />} />
      </Routes>
    </Router>
  )
}

export default App
