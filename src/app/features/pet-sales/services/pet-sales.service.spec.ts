import { TestBed } from '@angular/core/testing';

import { PetSalesService } from './pet-sales.service';

describe('PetSalesService', () => {
  let service: PetSalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetSalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
