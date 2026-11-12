import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import './district.css'
import './scene.css'
import './compact.css'

document.documentElement.classList.add('has-js')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
