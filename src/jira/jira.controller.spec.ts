import { Test, TestingModule } from '@nestjs/testing';
import { JiraController } from './jira.controller';
import { JiraService } from './jira.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

describe('JiraController', () => {
  let controller: JiraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), HttpModule],
      controllers: [JiraController],
      providers: [JiraService],
    }).compile();

    controller = module.get<JiraController>(JiraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be get jira statics', async () => {
    const response = await controller.getIssueStatistics();
    expect(response.success).toBe(true);
    expect(response.code).toBe('SUCCESS');
  });
});
