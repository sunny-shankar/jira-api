import { Controller, Post } from '@nestjs/common';
import { JiraService } from './jira.service';

@Controller('jira')
export class JiraController {
  constructor(private readonly jiraService: JiraService) {}
  @Post()
  getIssueStatistics() {
    return this.jiraService.getIssueStatistics();
  }
}
