import ApiConnector from '../Utils/ApiConnector' 
import Cookie from 'js-cookie'

const apiV1Url = process.env.REACT_APP_AMS_API_V1
// const apiV2Url = process.env.REACT_APP_AMS_API_V2

export default class AuthService {
  public static async login(account: string, password: string) {
    const connector = new ApiConnector(
      'POST',
      `${apiV1Url}/auth/login`,
    )
    connector.setContentType('application/json')
    connector.setBasicAuth(account, password)

    return await connector.call()
  }

  public static async tryNeedAuth() {
    const connector = new ApiConnector(
      'GET',
      `${process.env.REACT_APP_AMS_API_V2}/need-auth`,
    )
    connector.setBearerAuth()

    return await connector.call()
  }

  public static logout() {
    
  }

  public static isLoggedIn(): boolean {
    return !!Cookie.get('has_token')
  } 
}
