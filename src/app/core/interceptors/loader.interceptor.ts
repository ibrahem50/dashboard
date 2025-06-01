import { HttpInterceptorFn } from '@angular/common/http';
import { LoadingService } from '../../shared/services/loading.service';
import { finalize } from 'rxjs/operators';
import { inject } from '@angular/core';

let activeRequests = 0;

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  activeRequests++;
  if (activeRequests === 1) {
    loadingService.startLoading();
  }

  return next(req).pipe(
    finalize(() => {
      activeRequests--;

      if (activeRequests === 0) {
        loadingService.stopLoading();
      }
    })
  );
};
