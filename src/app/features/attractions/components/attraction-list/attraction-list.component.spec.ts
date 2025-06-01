import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AttractionListComponent } from './attraction-list.component';
import { AttractionService } from '../../services/attraction.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AttractionInterface, AttractionResponseInterface } from '../../interfaces/attraction';

describe('AttractionListComponent', () => {
  let component: AttractionListComponent;
  let fixture: ComponentFixture<AttractionListComponent>;
  let attractionService: jasmine.SpyObj<AttractionService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockAttractions: AttractionResponseInterface = {
    data: [
      {
        id: 1,
        name: 'Test Attraction',
        detail: 'Test Description',
        coverimage: 'test.jpg',
        latitude: 40.7128,
        longitude: -74.0060
      }
    ],
    total: 1,
    page: 1,
    per_page: 10,
    total_pages: 1
  };

  beforeEach(async () => {
    const attractionServiceSpy = jasmine.createSpyObj('AttractionService', ['getAttractions', 'deleteAttraction']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showMessage']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [AttractionListComponent],
      imports: [
        MatPaginatorModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AttractionService, useValue: attractionServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    attractionService = TestBed.inject(AttractionService) as jasmine.SpyObj<AttractionService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttractionListComponent);
    component = fixture.componentInstance;
    attractionService.getAttractions.and.returnValue(of(mockAttractions));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load attractions on init', fakeAsync(() => {
    component.ngOnInit();
    component.attractions$.subscribe(attractions => {
      expect(attractions).toEqual(mockAttractions);
    });
    tick();
  }));

  it('should update filter criteria when filter changes', () => {
    const newCriteria = { search: 'test', page: 0, size: 10 };
    component.onFilterChanged(newCriteria);
    expect(component.filterCriteria$.value).toEqual(newCriteria);
  });

  it('should update page when pageChanged is called', () => {
    const pageEvent = { pageIndex: 1, pageSize: 10, length: 100 };
    component.pageChanged(pageEvent);
    expect(component.filterCriteria$.value).toEqual({
      page: 2,
      size: 10
    });
  });

  it('should navigate to create page when add is called', () => {
    component.add();
    expect(router.navigate).toHaveBeenCalledWith(['create'], { relativeTo: jasmine.any(Object) });
  });

  it('should navigate to edit page when edit is called', () => {
    const attraction = mockAttractions.data[0];
    component.edit(attraction);
    expect(router.navigate).toHaveBeenCalledWith([`${attraction.id}`], { relativeTo: jasmine.any(Object) });
  });

  describe('delete', () => {
    beforeEach(() => {
      const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
      dialog.open.and.returnValue(dialogRefSpyObj);
    });

    it('should delete attraction when confirmed', fakeAsync(() => {
      const attraction = mockAttractions.data[0];
      const deleteResponse = { status: 'success', message: 'Deleted successfully' };
      attractionService.deleteAttraction.and.returnValue(of(deleteResponse));

      component.delete(attraction);
      tick();

      expect(attractionService.deleteAttraction).toHaveBeenCalledWith(attraction.id);
      expect(notificationService.showMessage).toHaveBeenCalledWith(deleteResponse.message, false);
    }));

    it('should show error message when delete fails', fakeAsync(() => {
      const attraction = mockAttractions.data[0];
      const errorResponse = { error: { message: 'Delete failed' } };
      attractionService.deleteAttraction.and.returnValue(of({ status: 'error', message: 'Delete failed' }));

      component.delete(attraction);
      tick();

      expect(notificationService.showMessage).toHaveBeenCalledWith('Delete failed', true);
    }));
  });
});
