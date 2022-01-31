import ApiConnector from "../Utils/ApiConnector";
import { User } from "./UserService";

const apiV1Url = process.env.REACT_APP_AMS_API_V1
// const apiV2Url = process.env.REACT_APP_AMS_API_V2

export interface Team {
  id: string
  name: string
  leader: User
  members: User[]
}

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
      `${apiV1Url}/teams`
    )
    connector.setContentType('application/json')
    return await connector.call()
  }

  public static async getTeamMembers(teamName: string) {
    console.log('teamname', teamName)
    const connector = new ApiConnector(
      'GET',
      `${apiV1Url}/team/${teamName}/members`
    )
    connector.setContentType('application/json')
    connector.setRequestData({
      teamName: teamName
    })
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
    connector.setBearerAuth()
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
    connector.setBearerAuth()
    connector.setRequestData({
      teamName: teamName
    })
    return await connector.call()
  }

  public static async addMember(userId: string, teamId: string) {
    const connector = new ApiConnector(
      'POST',
      `${apiV1Url}/team/${teamId}/member`
    )
    connector.setContentType('application/json')
    connector.setRequestData({
      userId: userId
    })
    return await connector.call()
  }

  public static async removeMember(userId: string, teamId: string) {
    const connector = new ApiConnector(
      'DELETE',
      `${apiV1Url}/team/${teamId}/member`
    )
    connector.setContentType('application/json')
    connector.setBearerAuth()
    connector.setRequestData({
      userId: userId
    })
    return await connector.call()
  }

  public static async transferOwner(newLeaderId: string, teamId: string) {
    const connector = new ApiConnector(
      'POST',
      `${apiV1Url}/team/${teamId}/leader/handover`
    )
    connector.setContentType('application/json')
    connector.setBearerAuth()
    connector.setRequestData({
      newLeaderId: newLeaderId
    })
    return await connector.call()
  }
}