import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetSalesComponent } from './pet-sales.component';

describe('PetSalesComponent', () => {
  let component: PetSalesComponent;
  let fixture: ComponentFixture<PetSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PetSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
