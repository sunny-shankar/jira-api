import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JiraService {
  private readonly logger = new Logger(JiraService.name);

  constructor(private readonly httpService: HttpService) {}
  async getIssueStatistics(): Promise<any> {
    let response = {};
    let assignedCount = 0;
    const assignedIssue = await this.getAssignedIssue();
    const unassignedIssue = await this.getUnassignedIssue();
    this.logger.log({
      assignedIssue,
      unassignedIssue,
    });
    for (const issue of assignedIssue.issues) {
      const assignee = issue['fields']['assignee'];
      if (assignee.displayName in response) {
        response[assignee.displayName] += 1;
      } else {
        response[assignee.displayName] = 1;
      }
      assignedCount += 1;
    }
    const unassigned = unassignedIssue.issues.length;
    return { ...response, unassigned, total: assignedCount + unassigned };
  }

  async getUnassignedIssue(): Promise<any> {
    try {
      const { JIRA_URL, JIRA_AUTH_TOKEN, JIRA_USER_EMAIL } = process.env;
      const config: AxiosRequestConfig = {
        url: `${JIRA_URL}/rest/api/3/search?jql=assignee=null`,
        auth: {
          username: JIRA_USER_EMAIL,
          password: JIRA_AUTH_TOKEN,
        },
        method: 'GET',
      };
      const response = await firstValueFrom(this.httpService.request(config));
      return response.data;
    } catch (err) {
      this.logger.error({ error: err.message });
      return err.response.data;
    }
  }
  async getAssignedIssue(): Promise<any> {
    try {
      const { JIRA_URL, JIRA_AUTH_TOKEN, JIRA_USER_EMAIL } = process.env;

      const config: AxiosRequestConfig = {
        url: `${JIRA_URL}/rest/api/3/search?jql=assignee!=null`,
        auth: {
          username: JIRA_USER_EMAIL,
          password: JIRA_AUTH_TOKEN,
        },
        method: 'GET',
      };
      const response = await firstValueFrom(this.httpService.request(config));
      return response.data;
    } catch (err) {
      this.logger.error({ error: err.message });
      return err.response?.data || {};
    }
  }
}
