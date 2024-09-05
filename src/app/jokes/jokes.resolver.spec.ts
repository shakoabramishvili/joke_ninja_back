import { Test, TestingModule } from '@nestjs/testing';
import { JokesResolver } from './jokes.resolver';
import { JokesService } from './jokes.service';

describe('JokesResolver', () => {
  let resolver: JokesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JokesResolver, JokesService],
    }).compile();

    resolver = module.get<JokesResolver>(JokesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
