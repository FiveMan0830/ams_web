import ApiConnector from "../Utils/ApiConnector";

const apiV1Url = process.env.REACT_APP_AMS_API_V1
// const apiV2Url = process.env.REACT_APP_AMS_API_V2

export default class TeamService {
  public static async getBelongingTeams() {
    const connector = new ApiConnector(
      'POST',
      `${apiV1Url}/team/get/belonging-teams`
    )
    connector.setContentType('application/x-www-form-urlencoded')
  }

  public static async getAllTeams() {
    const connector = new ApiConnector(
      'GET',
      `${apiV1Url}/team`
    )
    connector.setContentType('application/json')
    return await connector.call()
  }

  public static async getTeam(teamId: string) {
    const connector = new ApiConnector(
      'POST',
      `${apiV1Url}/team`
    )
    connector.setContentType('application/x-www-form-urlencoded')
    connector.setRequestData(teamId)
    return await connector.call()
  }

  public static async createTeam(teamName: string, teamLeader: string) {
    const connector = new ApiConnector(
      'POST',
      `${apiV1Url}/team/create`
    )
    connector.setContentType('application/json')
    connector.setRequestData({
      teamName: teamName,
      teamLeader: teamLeader
    })
    return await connector.call()
  }

  public static async deleteTeam(teamName: string) {
    const connector = new ApiConnector(
      'POST',
      `${apiV1Url}/team/delete`
    )
    connector.setContentType('application/json')
    connector.setRequestData({
      teamName: teamName
    })
    return await connector.call()
  }
}