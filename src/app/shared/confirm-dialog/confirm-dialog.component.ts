import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Componente de diálogo de confirmación reutilizable
 * Se puede usar en cualquier parte de la aplicación para confirmaciones
 */
@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">{{ data.cancelText }}</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">{{ data.confirmText }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-actions {
      padding: 16px 0;
    }
    
    button {
      margin-left: 8px;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      message: string;
      confirmText: string;
      cancelText: string;
    }
  ) {}
}