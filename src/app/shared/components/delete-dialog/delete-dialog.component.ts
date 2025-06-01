import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
  standalone: false,
})
export class DeleteDialogComponent implements OnInit {
  constructor(public dialogref: MatDialogRef<DeleteDialogComponent>) {}

  ngOnInit(): void {}
}
