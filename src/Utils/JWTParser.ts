import { Base64 } from 'js-base64'

interface JwtHeader {
  alg: string
  type: string
}

interface JwtPayload {
  uid: string
  exp: string
}

interface Jwt {
  header: JwtHeader
  payload: JwtPayload
  signature: string
}

export function parseJWT(jwtStr: string | null): Jwt | null {
  if (!jwtStr) return null
  if (jwtStr.split('.').length !== 3) return null

  let header = jwtStr.split('.')[0]
  let payload = jwtStr.split('.')[1]
  let signature = jwtStr.split('.')[2]

  header = Base64.decode(header) 
  payload = Base64.decode(payload)
  signature = Base64.decode(signature)

  // console.log(header)
  // console.log(payload)

  const jwt: Jwt = {
    header: JSON.parse(header) as JwtHeader,
    payload: JSON.parse(payload) as JwtPayload,
    signature: signature
  }

  return jwt
}
