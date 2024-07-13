import { TestBed } from '@angular/core/testing';

import { ImageCacheService } from './image-cache.service';

describe('ImageCache.ServiceService', () => {
  let service: ImageCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
