import { TestBed } from '@angular/core/testing';

import { DefaultBackendService } from './default-backend.service';

describe('BackendServiceService', () => {
  let service: DefaultBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
