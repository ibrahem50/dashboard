import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from './auth.service';
import { ApiService } from '../api/api.service';
import { AuthInterface } from '../interfaces/auth';

describe('AuthService', () => {
  let service: AuthService;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;

  const mockToken = 'mock-jwt-token';
  const mockExpiresIn = 600000; // 10 minutes

  const mockLoginData: AuthInterface = {
    username: 'testuser',
    password: 'password123'
  };

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['postRequest']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    const mockResponse = {
      status: 'success',
      message: 'Login successful',
      accessToken: mockToken,
      expiresIn: mockExpiresIn,
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      }
    };

    beforeEach(() => {
      apiService.postRequest.and.returnValue(of(mockResponse));
    });

    it('should store token and expiry in localStorage after successful login', () => {
      service.login(mockLoginData).subscribe(() => {
        expect(localStorage.getItem('jwt_token')).toBe(mockToken);
        expect(localStorage.getItem('jwt_expiry')).toBeTruthy();
      });
    });

    it('should update auth state after successful login', () => {
      service.login(mockLoginData).subscribe(() => {
        service.isAuthenticated$.subscribe(isAuth => {
          expect(isAuth).toBe(true);
        });
      });
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      localStorage.setItem('jwt_token', mockToken);
      localStorage.setItem('jwt_expiry', (Date.now() + mockExpiresIn).toString());
    });

    it('should clear token and expiry from localStorage', () => {
      service.logout();
      expect(localStorage.getItem('jwt_token')).toBeNull();
      expect(localStorage.getItem('jwt_expiry')).toBeNull();
    });

    it('should navigate to login page', () => {
      service.logout();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should update auth state', () => {
      service.logout();
      service.isAuthenticated$.subscribe(isAuth => {
        expect(isAuth).toBe(false);
      });
    });
  });

  describe('auto logout', () => {
    it('should auto logout after token expiry', fakeAsync(() => {
      const shortExpiryTime = 1000; // 1 second
      apiService.postRequest.and.returnValue(of({
        status: 'success',
        message: 'Login successful',
        accessToken: mockToken,
        expiresIn: shortExpiryTime,
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com'
        }
      }));

      service.login(mockLoginData).subscribe();
      
      expect(service.isAuthenticatedSync()).toBe(true);
      
      tick(shortExpiryTime + 100);
      
      expect(service.isAuthenticatedSync()).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    }));
  });

  describe('token validation', () => {
    it('should return false for isAuthenticated when token is expired', () => {
      localStorage.setItem('jwt_token', mockToken);
      localStorage.setItem('jwt_expiry', (Date.now() - 1000).toString()); // expired 1 second ago

      expect(service.isAuthenticatedSync()).toBe(false);
    });

    it('should return true for isAuthenticated with valid token', () => {
      localStorage.setItem('jwt_token', mockToken);
      localStorage.setItem('jwt_expiry', (Date.now() + mockExpiresIn).toString());

      expect(service.isAuthenticatedSync()).toBe(true);
    });
  });

  describe('getToken', () => {
    it('should return null when no token exists', () => {
      expect(service.getToken()).toBeNull();
    });

    it('should return token when it exists', () => {
      localStorage.setItem('jwt_token', mockToken);
      expect(service.getToken()).toBe(mockToken);
    });
  });
});
