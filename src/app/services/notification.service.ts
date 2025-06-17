import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

/**
 * Service for managing user notifications and confirmation dialogs.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  /**
   * Displays a success message using a snackbar.
   * @param message The message to display.
   */
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Displays an error message using a snackbar.
   * @param message The error message to display.
   */
  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Opens a confirmation dialog with custom title and message.
   * @param title Title of the dialog.
   * @param message Message content of the dialog.
   * @returns Observable that emits true if confirmed, false if cancelled.
   */
  showConfirmDialog(title: string, message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title,
        message,
        confirmText: 'Confirm',
        cancelText: 'Cancel'
      }
    });

    return dialogRef.afterClosed();
  }

  /**
   * Opens a confirmation dialog specifically for delete actions.
   * @param itemName The name of the item to be deleted.
   * @returns Observable that emits true if deletion is confirmed.
   */
  showDeleteConfirmDialog(itemName: string): Observable<boolean> {
    return this.showConfirmDialog(
      'Confirm Deletion',
      `Are you sure you want to delete "${itemName}"?`
    );
  }
}
