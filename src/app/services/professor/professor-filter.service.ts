import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service responsible for managing professor filtering state on the client side.
 * 
 * Provides reactive access to the currently selected department and a filtered list
 * of professors using RxJS BehaviorSubjects. This allows for seamless integration
 * with Angular components via subscription.
 */
@Injectable({
  providedIn: 'root'
})
export class ProfessorFilterService {

  /** Internal subject to hold the currently selected department ID */
  private selectedDepartmentSubject = new BehaviorSubject<string>('');

  /** Internal subject to hold the filtered list of professors */
  private filteredProfessorsSubject = new BehaviorSubject<any[]>([]);

  /** Observable stream exposing the selected department ID */
  selectedDepartment$ = this.selectedDepartmentSubject.asObservable();

  /** Observable stream exposing the filtered professors list */
  filteredProfessors$ = this.filteredProfessorsSubject.asObservable();

  /**
   * Updates the currently selected department for filtering purposes.
   * 
   * @param departmentId - The ID of the department to select.
   */
  setSelectedDepartment(departmentId: string): void {
    this.selectedDepartmentSubject.next(departmentId);
  }

  /**
   * Retrieves the current selected department ID.
   * 
   * @returns The currently selected department ID.
   */
  getSelectedDepartment(): string {
    return this.selectedDepartmentSubject.value;
  }

  /**
   * Updates the list of professors after applying a filter.
   * 
   * @param professors - An array of filtered professor objects.
   */
  setFilteredProfessors(professors: any[]): void {
    this.filteredProfessorsSubject.next(professors);
  }

  /**
   * Retrieves the currently stored list of filtered professors.
   * 
   * @returns An array of professor objects.
   */
  getFilteredProfessors(): any[] {
    return this.filteredProfessorsSubject.value;
  }

  /**
   * Clears all active filters by resetting the selected department.
   */
  clearFilters(): void {
    this.selectedDepartmentSubject.next('');
  }

  /**
   * Filters a given list of professors based on department ID.
   * 
   * @param professors - The full list of professor objects.
   * @param departmentId - The department ID to filter by.
   * @returns A new array containing only professors from the given department.
   */
  filterProfessorsByDepartment(professors: any[], departmentId: string): any[] {
    if (!departmentId || departmentId === '') {
      return [...professors]; // No filter applied
    }
    return professors.filter(professor => 
      professor.department?.id === departmentId
    );
  }

  /**
   * Formats a given date string into a human-readable format.
   * 
   * @param date - The raw date string (e.g., ISO format).
   * @returns A formatted string in "MMM DD, YYYY" format, or an empty string if invalid.
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
