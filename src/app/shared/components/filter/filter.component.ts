import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs';

import { CommonModule } from '@angular/common';
import { GenericSearchCriteria } from '../../models/filter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
})
export class FilterComponent implements OnInit {
  private fb = inject(FormBuilder);
  @Output() filterChanged = new EventEmitter<GenericSearchCriteria>();
  filterForm!: FormGroup;
  @Input({ required: true }) sortOptions!: { label: string; value: string }[];
  orderOptions: string[] = ['asc', 'desc'];

  constructor() {
    this.filterForm = this.fb.group({
      searchName: [''],
      sortBy: [''],
      orderBy: ['asc'],
    });
  }

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(startWith(this.filterForm.value), debounceTime(300))
      .subscribe((formValue: GenericSearchCriteria) => {
        this.filterChanged.emit({ ...formValue });
      });
  }
}
