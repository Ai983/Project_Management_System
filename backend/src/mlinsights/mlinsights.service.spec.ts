import { Test, TestingModule } from '@nestjs/testing';
import { MlinsightsService } from './mlinsights.service';

describe('MlinsightsService', () => {
  let service: MlinsightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MlinsightsService],
    }).compile();

    service = module.get<MlinsightsService>(MlinsightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
