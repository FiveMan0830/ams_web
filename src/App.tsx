import { Component } from 'react'
import './App.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Components/Login'
import AuthInterceptor from './Helpers/AuthInterceptor'
import MainContent from './Layouts/MainContent'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthInterceptor />}>
            <Route path="/*" element={<MainContent />} />
          </Route>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/error" element={<Error />} /> */}
          {/* <Route path="*" element={<Error />} /> */}
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App;
