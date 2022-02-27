import React from 'react'
import './UserManage.scss'
import { validate } from 'isemail'
import UserService, { User } from '../Services/UserService'
import UserProfileCard from './UserProfileCard'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'

import {
  PersonSearch as PersonSearchIcon,
  AddBox as AddBoxIcon,
} from '@mui/icons-material'

interface AddUserFormData {
  username: string
  name: string
  surname: string
  email: string
  password: string
  repassword: string
}

interface UserManageProps { }

interface UserManageState {
  users: User[]
  searchString: string
  selectedDeleteUser: User | null
  isDeleteUserPopupOpen: boolean
  isAddUserDialogOpen: boolean
  addUserFormData: AddUserFormData
  isSubmitAddUserClicked: boolean
}

class UserManage extends React.Component<UserManageProps, UserManageState> {
  constructor(props: UserManageProps) {
    super(props)

    this.state = {
      users: [],
      searchString: '',
      selectedDeleteUser: null,
      isDeleteUserPopupOpen: false,
      isAddUserDialogOpen: false,
      addUserFormData: {
        username: '',
        name: '',
        surname: '',
        email: '',
        password: '',
        repassword: ''
      },
      isSubmitAddUserClicked: false
    }
  }

  async componentDidMount() {
    try {
      const res = await UserService.getAllUsers()

      let users = JSON.parse(JSON.stringify(res.data))
      users.sort((userA: User, userB: User) => {
        const userALower = userA.username.toLowerCase()
        const userBLower = userB.username.toLowerCase()
        if (userALower > userBLower) return 1
        if (userALower < userBLower) return -1
        return 0
      })

      this.setState({ users: users })
    } catch (err) {
      alert('failed to fetch all users')
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // function for field validation
  //
  //////////////////////////////////////////////////////////////////////////////
  isValidFormData = () => {
    return (
      this.state.addUserFormData.username !== '' &&
      this.state.addUserFormData.name !== '' &&
      this.state.addUserFormData.surname !== '' &&
      this.isValidEmail(this.state.addUserFormData.email) &&
      this.state.addUserFormData.password !== ''
    )
  }
  
  isValidEmail = (email: string) => {
    return validate(email)
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // functions for event handling
  //
  //////////////////////////////////////////////////////////////////////////////
  handleClickDeleteUser = (user: User) => {
    this.setState({
      selectedDeleteUser: user,
      isDeleteUserPopupOpen: true
    })
  }

  handleCancelDeleteUser = () => {
    this.setState({
      selectedDeleteUser: null,
      isDeleteUserPopupOpen: false,
    })
  }

  handleConfirmDeleteUser = async () => {
    try {
      if (this.state.selectedDeleteUser !== null) {
        await UserService.deleteUser(this.state.selectedDeleteUser.userId)
        window.location.reload()
      }
    } catch (err: any) {
      if (err.response.status === 403)
        alert(err.response.data.error)
      else
        alert('failed to delete user')
    } finally {
      this.setState({
        isDeleteUserPopupOpen: false,
        selectedDeleteUser: null
      })
    }
  }

  handleTypeInSearchBar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.toLowerCase()
    this.setState({ searchString: text })
  }

  handleClickAddUser = () => {
    this.setState({ isAddUserDialogOpen: true })
  }

  handleCloseAddUserDialog = () => {
    this.setState({
      isAddUserDialogOpen: false,
      isSubmitAddUserClicked: false
    })
  }

  handleChangeFormData = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    this.setState(prevState => {
      return {
        ...prevState,
        addUserFormData: {
          ...prevState.addUserFormData,
          [field]: event.target.value
        }
      }
    })
  }

  handleConfirmAddUser = async () => {
    this.setState({ isSubmitAddUserClicked: true })
    if (!this.isValidFormData()) return

    try {
      await UserService.createUser({
        username: this.state.addUserFormData.username,
        givenname: this.state.addUserFormData.name,
        surname: this.state.addUserFormData.surname,
        email: this.state.addUserFormData.email,
        password: this.state.addUserFormData.password
      })

      window.location.reload()
    } catch (err: any) {
      if (err.response.status === 403 || err.response.status === 409)
        alert(err.response.data.error)
      else
        alert('failed to create user')
    } finally {
      this.setState({
        isSubmitAddUserClicked: false,
        isAddUserDialogOpen: false
      })
    }
  }

  render(): React.ReactNode {
    return (
      <div className="user-manage-wrapper">
        <div className="user-manage-search-area">
          <TextField
            id="search-user-input"
            label="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonSearchIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
            onChange={this.handleTypeInSearchBar}
          />
          <span>
            <IconButton
              onClick={this.handleClickAddUser} 
            >
              <AddBoxIcon />
            </IconButton>
          </span>
        </div>

        <div className="user-list-area">
          <div className="user-list">
            {this.state.users
              .filter(user => user.username.toLowerCase().includes(this.state.searchString) || user.displayName.toLowerCase().includes(this.state.searchString))
              .map(user => (
                <UserProfileCard
                  user={user}
                  key={user.userId}
                  onClickRemoveMember={this.handleClickDeleteUser}
                />
              ))
            }
          </div>
        </div>

        <Dialog
          open={this.state.isDeleteUserPopupOpen} 
          onClose={this.handleCancelDeleteUser}
          aria-labelledby="cancel-delete-user-dialog-title"
          aria-describedby="cancel-delete-user-dialog-desc"
        >
          <DialogContent>
            <DialogContentText>
              {"Are you sure to delete user "}
              <span className="highlight-text">
                {this.state.selectedDeleteUser?.username}
              </span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={this.handleCancelDeleteUser}>Cancel</Button>
            <Button variant="contained" color="success" onClick={this.handleConfirmDeleteUser} autoFocus>Confirm</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.isAddUserDialogOpen}
          onClose={this.handleCloseAddUserDialog}
          aria-labelledby="add-user-dialog-title"
          aria-describedby="add-user-dialog-desc"
          className="dialog-add-user"
        >
          <DialogTitle>Create User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Provide the following required data to create a new user in AMS.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              error={this.state.addUserFormData.username === '' && this.state.isSubmitAddUserClicked}
              helperText={this.state.addUserFormData.username === '' && this.state.isSubmitAddUserClicked ? 'name should not be empty' : ''}
              id="username"
              label="User Name"
              type="text"
              fullWidth
              variant="standard"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                this.handleChangeFormData(event, 'username')
              }
            />
            <div>
              <TextField
                margin="dense"
                error={this.state.addUserFormData.name === '' && this.state.isSubmitAddUserClicked}
                helperText={this.state.addUserFormData.name === '' && this.state.isSubmitAddUserClicked ? 'name should not be empty' : ''}
                id="name"
                label="Name"
                type="text"
                variant="standard"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  this.handleChangeFormData(event, 'name')
                }
                style={{ width: '48%', marginRight: '2%'}}
              />
              <TextField
                margin="dense"
                error={this.state.addUserFormData.surname === '' && this.state.isSubmitAddUserClicked}
                helperText={this.state.addUserFormData.surname === '' && this.state.isSubmitAddUserClicked ? 'surname should not be empty' : ''}
                id="surname"
                label="Surname"
                type="text"
                variant="standard"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  this.handleChangeFormData(event, 'surname')
                }
                style={{ width: '48%', marginLeft: '2%'}}
              />
            </div>
              <TextField
                margin="dense"
                error={this.state.addUserFormData.email === '' && this.state.isSubmitAddUserClicked}
                helperText={this.state.addUserFormData.email === '' && this.state.isSubmitAddUserClicked ? 'email should not be empty' : ''}
                id="email"
                label="Email"
                type="email"
                fullWidth
                variant="standard"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  this.handleChangeFormData(event, 'email')
                }
              />
              <TextField
                margin="dense"
                error={this.state.addUserFormData.password === '' && this.state.isSubmitAddUserClicked}
                helperText={this.state.addUserFormData.password === '' && this.state.isSubmitAddUserClicked ? 'password should not be empty' : ''}
                id="password"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  this.handleChangeFormData(event, 'password')
                }
              />
              <TextField
                margin="dense"
                error={this.state.addUserFormData.password !== this.state.addUserFormData.repassword && this.state.addUserFormData.repassword !== ''}
                helperText={this.state.addUserFormData.password !== this.state.addUserFormData.repassword && this.state.addUserFormData.repassword !== '' ? 'password don\'t match' : ''}
                id="repassword"
                label="Confirm Password"
                type="password"
                fullWidth
                variant="standard"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  this.handleChangeFormData(event, 'repassword')
                }
              />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={this.handleCloseAddUserDialog}>Cancel</Button>
            <Button variant="contained" color="success" onClick={this.handleConfirmAddUser}>Create User</Button>
          </DialogActions>
        </Dialog>
      </div>
    ) 
  }
}

export default UserManage