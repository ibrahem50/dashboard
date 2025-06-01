import { ActivatedRoute, Router } from '@angular/router';
import {
  AttractionInterface,
  AttractionResponseInterface,
} from '../../interfaces/attraction';
import { BehaviorSubject, Observable, filter, skip, switchMap } from 'rxjs';
import { Component, ViewChild, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { AttractionService } from '../../services/attraction.service';
import { DeleteDialogComponent } from '../../../../shared/components/delete-dialog/delete-dialog.component';
import { GenericSearchCriteria } from '../../../../shared/models/filter';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-attraction-list',
  templateUrl: './attraction-list.component.html',
  styleUrl: './attraction-list.component.scss',
  standalone: false,
})
export class AttractionListComponent {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);
  private attractionService = inject(AttractionService);
  readonly sortOptions: { label: string; value: string }[] = [
    {
      label: 'name',
      value: 'name',
    },
  ];

  attractions$!: Observable<AttractionResponseInterface>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filterCriteria$ = new BehaviorSubject<GenericSearchCriteria>({
    page: 0,
    size: 10,
  });

  ngOnInit(): void {
    this.listenForFilters();
  }

  onFilterChanged(criteria: GenericSearchCriteria): void {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }

    const prevFilter$ = this.filterCriteria$.value;

    this.filterCriteria$.next({
      ...criteria,
      page: 0,
      size: prevFilter$.size || 10,
    });
  }

  pageChanged(event: PageEvent): void {
    const prev = this.filterCriteria$.value;
    this.filterCriteria$.next({
      ...prev,
      page: event.pageIndex + 1,
      size: event.pageSize,
    });
  }

  listenForFilters(): void {
    this.attractions$ = this.filterCriteria$.pipe(
      skip(1),
      switchMap((criteria) => this.attractionService.getAttractions(criteria))
    );
  }

  add() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  edit(attraction: AttractionInterface) {
    this.router.navigate([`${attraction.id}`], { relativeTo: this.route });
  }

  delete(attraction: AttractionInterface) {
    this.dialog
      .open(DeleteDialogComponent)
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.attractionService.deleteAttraction(attraction.id))
      )
      .subscribe({
        next: (res) => {
          this.notificationService.showMessage(
            res.message,
            res.status === 'error'
          );
          this.paginator.pageIndex = 0;
          this.filterCriteria$.next({
            page: 0,
            size: this.filterCriteria$.value.size || 10,
          });
        },
        error: (err) => {
          this.notificationService.showMessage(err.error.message, true);
        },
      });
  }
}
