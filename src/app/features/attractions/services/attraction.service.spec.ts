import { TestBed } from '@angular/core/testing';
import { AttractionService } from './attraction.service';
import { ApiService } from '../../../core/api/api.service';
import { of } from 'rxjs';
import { AttractionInterface, AttractionResponseInterface } from '../interfaces/attraction';
import { GenericSearchCriteria } from '../../../shared/models/filter';

describe('AttractionService', () => {
  let service: AttractionService;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockAttraction: AttractionInterface = {
    id: 1,
    name: 'Test Attraction',
    detail: 'Test Description',
    coverimage: 'test.jpg',
    latitude: 40.7128,
    longitude: -74.0060
  };

  const mockAttractionResponse: AttractionResponseInterface = {
    data: [mockAttraction],
    total: 1,
    page: 1,
    per_page: 10,
    total_pages: 1
  };

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'getRequest',
      'postRequest',
      'putRequest',
      'deleteRequest'
    ]);

    TestBed.configureTestingModule({
      providers: [
        AttractionService,
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(AttractionService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAttractions', () => {
    it('should call getRequest with correct parameters', () => {
      const criteria: GenericSearchCriteria = {
        page: 1,
        size: 10,
        sortBy: 'name',
        orderBy: 'asc',
        searchName: 'test'
      };

      apiService.getRequest.and.returnValue(of(mockAttractionResponse));

      service.getAttractions(criteria).subscribe(response => {
        expect(response).toEqual(mockAttractionResponse);
      });

      expect(apiService.getRequest).toHaveBeenCalledWith(
        'attractions?page=1&per_page=10&sort_column=name&sort_order=asc&search=test'
      );
    });

    it('should handle minimal criteria', () => {
      const criteria: GenericSearchCriteria = {
        page: 1,
        size: 10
      };

      apiService.getRequest.and.returnValue(of(mockAttractionResponse));

      service.getAttractions(criteria).subscribe(response => {
        expect(response).toEqual(mockAttractionResponse);
      });

      expect(apiService.getRequest).toHaveBeenCalledWith(
        'attractions?page=1&per_page=10'
      );
    });
  });

  describe('addAttraction', () => {
    it('should call postRequest with correct parameters', () => {
      const { id, ...newAttraction } = mockAttraction;

      apiService.postRequest.and.returnValue(of([mockAttraction]));

      service.addAttraction(newAttraction as AttractionInterface).subscribe(response => {
        expect(response).toEqual([mockAttraction]);
      });

      expect(apiService.postRequest).toHaveBeenCalledWith(
        'auth/attractions/create',
        newAttraction,
        true
      );
    });
  });

  describe('updateAttraction', () => {
    it('should call putRequest with correct parameters', () => {
      const updateResponse = {
        status: 'success',
        attraction: mockAttraction,
        message: 'Updated successfully'
      };

      apiService.putRequest.and.returnValue(of(updateResponse));

      service.updateAttraction(mockAttraction).subscribe(response => {
        expect(response).toEqual(updateResponse);
      });

      expect(apiService.putRequest).toHaveBeenCalledWith(
        'auth/attractions/update',
        mockAttraction,
        true
      );
    });
  });

  describe('getAttraction', () => {
    it('should call getRequest with correct parameters', () => {
      const response = {
        status: 'success',
        attraction: mockAttraction
      };

      apiService.getRequest.and.returnValue(of(response));

      service.getAttraction(1).subscribe(attraction => {
        expect(attraction).toEqual(mockAttraction);
      });

      expect(apiService.getRequest).toHaveBeenCalledWith('attractions/1');
    });
  });

  describe('deleteAttraction', () => {
    it('should call deleteRequest with correct parameters', () => {
      const deleteResponse = {
        status: 'success',
        message: 'Deleted successfully'
      };

      apiService.deleteRequest.and.returnValue(of(deleteResponse));

      service.deleteAttraction(1).subscribe(response => {
        expect(response).toEqual(deleteResponse);
      });

      expect(apiService.deleteRequest).toHaveBeenCalledWith(
        'attractions/delete',
        { id: 1 }
      );
    });
  });
});
