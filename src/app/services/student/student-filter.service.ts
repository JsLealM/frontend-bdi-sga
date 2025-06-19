import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service responsible for handling client-side student filtering logic.
 * Maintains the selected status and filtered students using observables.
 */
@Injectable({
  providedIn: 'root'
})
export class StudentFilterService {

  /** Subject for the currently selected student status filter */
  private selectedStatusSubject = new BehaviorSubject<string>('');

  /** Subject for the filtered students list */
  private filteredStudentsSubject = new BehaviorSubject<any[]>([]);

  /** Observable stream of the selected status for filtering. */
  selectedStatus$ = this.selectedStatusSubject.asObservable();

  /** Observable stream of the filtered students list. */
  filteredStudents$ = this.filteredStudentsSubject.asObservable();

  /**
   * Sets the selected status to be used for filtering students.
   * @param status The selected student status (e.g., ACTIVE, INACTIVE).
   */
  setSelectedStatus(status: string): void {
    this.selectedStatusSubject.next(status);
  }

  /**
   * Gets the currently selected status.
   * @returns The selected status value.
   */
  getSelectedStatus(): string {
    return this.selectedStatusSubject.value;
  }

  /**
   * Sets the list of filtered students.
   * @param students Filtered array of students.
   */
  setFilteredStudents(students: any[]): void {
    this.filteredStudentsSubject.next(students);
  }

  /**
   * Gets the current list of filtered students.
   * @returns Filtered students array.
   */
  getFilteredStudents(): any[] {
    return this.filteredStudentsSubject.value;
  }

  /**
   * Clears all filters (status and list).
   */
  clearFilters(): void {
    this.selectedStatusSubject.next('');
    this.filteredStudentsSubject.next([]);
  }

  /**
   * Filters a given list of students by status.
   * @param students List of all students.
   * @param status Status to filter by (e.g., ACTIVE).
   * @returns New list filtered by the given status.
   */
  filterStudentsByStatus(students: any[], status: string): any[] {
    if (!status || status.trim() === '') {
      return [...students];
    }
    return students.filter(student => student.status === status);
  }

  /**
   * Formats a raw date string into a user-friendly date (e.g., "Jun 17, 2025").
   * @param date Raw ISO date string.
   * @returns A localized date string.
   */
  formatDate(date: string): string {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
