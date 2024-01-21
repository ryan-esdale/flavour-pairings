import { TestBed } from '@angular/core/testing';

import { GenerateRibbonDataService } from './generate-ribbon-data.service';

describe('GenerateRibbonDataService', () => {
  let service: GenerateRibbonDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateRibbonDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
