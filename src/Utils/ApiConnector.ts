import axios, { AxiosRequestConfig } from 'axios'
import { Base64 } from 'js-base64'

axios.defaults.withCredentials = true

type ContentType = 'application/json' | 'application/x-www-form-urlencoded'
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

class ApiConnector {
  private req: AxiosRequestConfig

  constructor(method: RequestMethod, url: string, req: AxiosRequestConfig = {}) {
    this.req = req

    this.req.url = url
    this.req.method = method
    this.req.headers = {}
  }

  public setContentType(contentType: ContentType) {
    (this.req.headers as Record<string, string>)['Content-Type'] = contentType
  }

  public setBasicAuth(account: string, password: string): void {
    const basicAuthStr: string = Base64.encode(`${account}:${password}`)
    const val = `Basic ${basicAuthStr}`;
    (this.req.headers as Record<string, string>)['Authorization'] = val
  }

  public setBearerAuth(): void {
    const accessToken = localStorage.getItem('access_token') || '';
    const val = `Bearer ${accessToken}`;
    (this.req.headers as Record<string, string>)['Authorization'] = val
  }

  public setRequestData(data: any): void {
    this.req.data = data
  }

  public async call() {
    return await axios(this.req)
  }
}

export default ApiConnector