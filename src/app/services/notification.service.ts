import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

/**
 * Servicio para manejar notificaciones y confirmaciones
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
   * Muestra mensaje de éxito
   */
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Muestra mensaje de error
   */
  showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Muestra diálogo de confirmación
   */
  showConfirmDialog(title: string, message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title,
        message,
        confirmText: 'Confirmar',
        cancelText: 'Cancelar'
      }
    });

    return dialogRef.afterClosed();
  }

  /**
   * Muestra diálogo de confirmación para eliminación
   */
  showDeleteConfirmDialog(itemName: string): Observable<boolean> {
    return this.showConfirmDialog(
      'Confirmar eliminación',
      `¿Estás seguro de que deseas eliminar "${itemName}"?`
    );
  }
}