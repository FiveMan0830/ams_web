import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Error from '../Components/Error'
import Home from '../Components/Home'
import TeamManage from '../Components/TeamManage'
import MemberManage from '../Components/MemberManage'
import Navbar from './Navbar'
import './MainContent.scss'
import Sidebar from '../Layouts/Sidebar'
import UserManage from '../Components/UserManage'

interface MainContentProps {}

interface MainContentStates {
  isSidebarOpen: boolean
}

class MainContent extends React.Component<MainContentProps, MainContentStates> {
  constructor(props: MainContentProps) {
    super(props)

    this.state = {
      isSidebarOpen: true
    }
  }

  toggleSidebar = () => {
    this.setState({isSidebarOpen: !this.state.isSidebarOpen})
  }

  render() {
    return (
      <div className="main">
        <Navbar toggleSidebar={this.toggleSidebar}/>
        <div className="content">
          <div className={`sidebar ${this.state.isSidebarOpen ? 'active' : ''}`}>
            <Sidebar />
          </div>
          <div
            className={`content-right ${this.state.isSidebarOpen ? 'active' : ''}`}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/user-manage" element={<UserManage />} />
              <Route path="/team-manage" element={<Navigate to="/team-manage/teams" />} />
              <Route path="/team-manage/teams" element={<TeamManage />} />
              <Route path="/team-manage/members" element={<MemberManage />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </div>
        </div>
      </div>
    )
  }
}

export default MainContent