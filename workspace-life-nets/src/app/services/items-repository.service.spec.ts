import { TestBed } from '@angular/core/testing';

import { ItemsRepositoryService } from './items-repository.service';

describe('ItemsRepositoryService', () => {
  let service: ItemsRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemsRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
