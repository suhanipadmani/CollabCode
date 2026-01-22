import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import EditorPage from './pages/EditorPage.jsx'
import { Toaster } from 'react-hot-toast'
import { initSocket } from './socket.js'

function App() {

  return (
    <>
      <div>
        <Toaster 
          position='top-right'
          toastOptions={{
            success: {
              theme: {
                primary:'#4aee88',
              },
            },
          }}
        ></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} ></Route>
          <Route path="/editor/:roomId" element={<EditorPage/>} ></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
