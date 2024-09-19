import { TestBed } from '@angular/core/testing';

import { TarjetaMuscalService } from './tarjeta-muscal.service';

describe('TarjetaMuscalService', () => {
  let service: TarjetaMuscalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarjetaMuscalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
