import { TestBed } from '@angular/core/testing';

import { GenerateNetworkDataService } from './generate-network-data.service';

describe('GenerateNetworkDataService', () => {
  let service: GenerateNetworkDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateNetworkDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
