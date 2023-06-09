import ApiConnector from '../Utils/ApiConnector'

const apiV1Url = process.env.REACT_APP_AMS_API_V1

export interface User {
  userId: string
  username: string
  displayName: string
  email: string
}

export interface CreateUserPayload {
  username: string
  givenname: string
  surname: string
  email: string
  password: string
}

export default class UserService {
  public static async getAllUsers() {
    const connector = new ApiConnector(
      'GET',
      `${apiV1Url}/users`
    )
    return await connector.call()
  }

  public static async getUserProfile() {
    const connector = new ApiConnector(
      'GET',
      `${apiV1Url}/profile`
    )
    connector.setBearerAuth()
    
    return await connector.call()
  }

  public static async createUser(payload: CreateUserPayload) {
    const connector = new ApiConnector(
      'POST',
      `${apiV1Url}/user`
    )
    connector.setContentType('application/json')
    connector.setBearerAuth()
    connector.setRequestData(payload)

    return await connector.call()
  }

  public static async deleteUser(userId: string) {
    const connector = new ApiConnector(
      'DELETE',
      `${apiV1Url}/user/${userId}`
    )
    connector.setBearerAuth()

    return await connector.call()
  }
}