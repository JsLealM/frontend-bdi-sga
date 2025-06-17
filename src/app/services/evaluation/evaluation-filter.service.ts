import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service responsible for handling client-side evaluation filtering logic.
 * Maintains the selected course and filtered evaluations using observables.
 */
@Injectable({
  providedIn: 'root'
})
export class EvaluationFilterService {

  private selectedCourseSubject = new BehaviorSubject<string>('');
  private filteredEvaluationsSubject = new BehaviorSubject<any[]>([]);

  /** Observable stream of the selected course for filtering. */
  selectedCourse$ = this.selectedCourseSubject.asObservable();

  /** Observable stream of the filtered evaluations list. */
  filteredEvaluations$ = this.filteredEvaluationsSubject.asObservable();

  /**
   * Sets the selected course ID to be used for filtering evaluations.
   * @param courseId The ID of the selected course.
   */
  setSelectedCourse(courseId: string): void {
    this.selectedCourseSubject.next(courseId);
  }

  /**
   * Gets the currently selected course ID.
   * @returns The current course ID.
   */
  getSelectedCourse(): string {
    return this.selectedCourseSubject.value;
  }

  /**
   * Sets the list of filtered evaluations.
   * @param evaluations The filtered evaluations array.
   */
  setFilteredEvaluations(evaluations: any[]): void {
    this.filteredEvaluationsSubject.next(evaluations);
  }

  /**
   * Gets the current list of filtered evaluations.
   * @returns The filtered evaluations array.
   */
  getFilteredEvaluations(): any[] {
    return this.filteredEvaluationsSubject.value;
  }

  /**
   * Clears all filters, resetting the selected course.
   */
  clearFilters(): void {
    this.selectedCourseSubject.next('');
  }

  /**
   * Filters a given list of evaluations by course ID.
   * @param evaluations List of all evaluations.
   * @param courseId Course ID to filter by.
   * @returns A new list of evaluations belonging to the given course.
   */
  filterEvaluationsByCourse(evaluations: any[], courseId: string): any[] {
    if (!courseId || courseId === '') {
      return [...evaluations];
    }
    return evaluations.filter(evaluation => 
      evaluation.course?.courseID === courseId
    );
  }

  /**
   * Formats a date string into a user-friendly format.
   * @param date The raw date string (e.g., ISO format).
   * @returns The formatted date string (e.g., "Jun 17, 2025").
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
