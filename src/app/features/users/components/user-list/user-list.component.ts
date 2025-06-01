import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, filter, skip, switchMap } from 'rxjs';
import { Component, ViewChild, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UserInterface, UserResponse } from '../../interface/user';

import { DeleteDialogComponent } from '../../../../shared/components/delete-dialog/delete-dialog.component';
import { GenericSearchCriteria } from '../../../../shared/models/filter';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../shared/services/notification.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  standalone: false,
})
export class UserListComponent {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);
  private userService = inject(UserService);
  readonly sortOptions: { label: string; value: string }[] = [
    {
      label: 'id',
      value: 'id',
    },
    {
      label: 'name',
      value: 'fname',
    },
    {
      label: 'last name',
      value: 'lname',
    },
    {
      label: 'user name',
      value: 'username',
    },
  ];
  displayedColumns: string[] = ['id', 'avatar', 'fname', 'username', 'actions'];

  dataSource$!: Observable<UserResponse>;
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
    this.dataSource$ = this.filterCriteria$.pipe(
      skip(1),
      switchMap((criteria) => this.userService.getUsers(criteria))
    );
  }

  add() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  edit(user: UserInterface) {
    this.router.navigate([`${user.id}`], { relativeTo: this.route });
  }

  delete(user: UserInterface) {
    this.dialog
      .open(DeleteDialogComponent)
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.userService.deleteUser(user.id))
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
