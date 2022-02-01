import React from 'react'
import { User } from '../Services/UserService'
import UserProfileCard from './UserProfileCard'

interface UserManageProps { }

interface UserManageState { }

class UserManage extends React.Component<UserManageProps, UserManageState> {
  constructor(props: UserManageProps) {
    super(props)
  }

  a = (user: User) => {
    console.log('transfer owner')
  }

  b = (user: User) => {
    console.log('delete member')
  }

  render(): React.ReactNode {
    const user: User = {
      userId: '123',
      username: 'mashu',
      email: 'mashu@masu.masu',
      displayName: 'Mashu'
    }

    return (
      <div>user manage page</div>
      // <UserProfileCard
      //   user={user}
      //   showOperations
      //   col="col-1"
      //   handleClickTransferOwner={this.a}
      //   handleClickRemoveMember={this.b}
      // >
      // </UserProfileCard>
    ) 
  }
}

export default UserManage