import { Test, TestingModule } from '@nestjs/testing';
import { JiraService } from './jira.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

describe('JiraService', () => {
  let service: JiraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), HttpModule],
      providers: [JiraService],
    }).compile();

    service = module.get<JiraService>(JiraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get assigned issue', async () => {
    const response = await service.getAssignedIssue();
    expect(response.total).toBeGreaterThan(0);
  });

  it('should get unassigned issue', async () => {
    const response = await service.getUnassignedIssue();
    expect(response.total).toBeGreaterThan(0);
  });

  it('should get unassigned issue - random auth token', async () => {
    process.env['JIRA_AUTH_TOKEN'] = '1';
    const response = await service.getAssignedIssue();
    expect(response).toHaveProperty('errorMessages');
  });
});
