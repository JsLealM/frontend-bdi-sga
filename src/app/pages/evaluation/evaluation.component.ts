/**
 * EvaluationComponent
 * ---------------------
 * This component manages the Evaluation form UI, allowing users to:
 * - Create, update, delete evaluations
 * - Filter evaluations by course
 * - Display notifications
 * 
 * It interacts with multiple services:
 * - EvaluationService (CRUD operations)
 * - CourseService (fetching available courses)
 * - NotificationService (user alerts and confirmations)
 * - EvaluationFilterService (state management for filters)
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { EvaluationService } from '../../services/evaluation/evaluation.service';
import { CourseService } from '../../services/course/course.service';
import { NotificationService } from '../../services/notification.service';
import { EvaluationFilterService } from '../../services/evaluation/evaluation-filter.service';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrl: './evaluation.component.css'
})
export class EvaluationComponent implements OnInit, OnDestroy {
  // Reactive form group for the evaluation form
  evaluationForm!: FormGroup;

  // List of all available courses
  courses: any[] = [];

  // List of all evaluations (used for reset and filtering)
  evaluations: any[] = [];

  // Evaluations shown on screen (can be filtered)
  filteredEvaluations: any[] = [];

  // Allowed date range for evaluation input
  minDate: Date = new Date(2025, 0, 20);
  maxDate: Date = new Date(2025, 5, 20);

  // Currently selected filter (course ID)
  selectedCourseFilter: string = '';

  // Flag to indicate whether we are updating (true) or creating (false)
  isUpdateMode: boolean = false;

  // Stores the ID of the evaluation being updated
  selectedEvaluationId: string = '';

  // Subject to clean up subscriptions on destroy
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private evaluationService: EvaluationService,
    private courseService: CourseService,
    private notificationService: NotificationService,
    private filterService: EvaluationFilterService
  ) {}

  /** Called once after component initialization */
  ngOnInit(): void {
    this.initializeForm();
    this.loadInitialData();
    this.subscribeToFilters();
  }

  /** Called once before component is destroyed */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Initializes the reactive form with validation rules */
  private initializeForm(): void {
    this.evaluationForm = this.fb.group({
      id: [''],
      type: ['', Validators.required],
      date: ['', Validators.required],
      courseId: ['', Validators.required],
    });
  }

  /** Loads all required data: courses and evaluations */
  private loadInitialData(): void {
    this.loadCourses();
    this.loadAllEvaluations();
  }

  /** Subscribes to filter service for course selection and evaluations */
  private subscribeToFilters(): void {
    this.filterService.selectedCourse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(id => this.selectedCourseFilter = id);

    this.filterService.filteredEvaluations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(evals => this.filteredEvaluations = evals);
  }

  /** Loads all available courses from the backend */
  private loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (resp) => this.courses = resp,
      error: () => this.notificationService.showError('Failed to load courses')
    });
  }

  /** Loads all evaluations and applies current filter */
  loadAllEvaluations(): void {
    this.evaluationService.getAllEvaluation().subscribe({
      next: (resp) => {
        this.evaluations = resp;
        this.applyCourseFilter(this.selectedCourseFilter);
      },
      error: () => this.notificationService.showError('Failed to load evaluations')
    });
  }

  /** Applies the selected course filter */
  private applyCourseFilter(courseId: string): void {
    courseId
      ? this.loadEvaluationsByCourse(courseId)
      : this.filterService.setFilteredEvaluations([...this.evaluations]);
  }

  /** Called when course dropdown filter changes */
  onCourseFilterChange(courseId: string): void {
    this.filterService.setSelectedCourse(courseId);
    this.applyCourseFilter(courseId);
  }

  /** Resets all filters */
  clearFilter(): void {
    this.filterService.clearFilters();
    this.filterService.setFilteredEvaluations([...this.evaluations]);
  }

  /** Loads evaluations related to a specific course */
  private loadEvaluationsByCourse(courseId: string): void {
    this.evaluationService.getAllEvaluationByCourse(courseId).subscribe({
      next: (resp) => this.filterService.setFilteredEvaluations(resp),
      error: () => {
        this.notificationService.showError('Failed to filter evaluations');
        this.filterService.setFilteredEvaluations([...this.evaluations]);
      }
    });
  }

  /** Formats a given date using the filter service */
  formatDate(date: string): string {
    return this.filterService.formatDate(date);
  }

  /**
   * Handles evaluation submission (create or update).
   * Displays error if form is invalid.
   */
  saveEvaluation(): void {
    if (this.evaluationForm.invalid) {
      this.markFormGroupTouched();
      this.notificationService.showError('Please fill in all required fields');
      return;
    }

    const evaluation = this.buildEvaluationObject();
    const action = this.isUpdateMode
      ? this.evaluationService.updateEvaluation(this.selectedEvaluationId, evaluation)
      : this.evaluationService.saveEvaluation(evaluation);

    action.subscribe({
      next: () => {
        const msg = this.isUpdateMode
          ? 'Evaluation updated successfully'
          : 'Evaluation saved successfully';
        this.notificationService.showSuccess(msg);
        this.resetForm();
        this.loadAllEvaluations();
      },
      error: () => {
        const msg = this.isUpdateMode
          ? 'Failed to update evaluation'
          : 'Failed to save evaluation';
        this.notificationService.showError(msg);
      }
    });
  }

  /** Converts form data into the expected evaluation object format */
  private buildEvaluationObject(): any {
    const formValue = this.evaluationForm.value;
    return {
      type: formValue.type,
      date: formValue.date,
      course: { courseID: formValue.courseId }
    };
  }

  /**
   * Shows confirmation dialog and deletes evaluation if confirmed.
   */
  deleteEvaluation(evaluation: any): void {
    this.notificationService.showDeleteConfirmDialog(evaluation.type)
      .subscribe(confirmed => {
        if (confirmed) this.performDeleteEvaluation(evaluation);
      });
  }

  /**
   * Performs backend deletion and updates local state.
   */
  private performDeleteEvaluation(evaluation: any): void {
    this.evaluationService.deleteEvaluation(evaluation.evaluationID.toString()).subscribe({
      next: () => {
        this.removeEvaluationFromLists(evaluation.evaluationID);
        this.notificationService.showSuccess('Evaluation deleted successfully');
      },
      error: (error) => this.handleDeleteError(error)
    });
  }

  /** Removes deleted evaluation from both lists (filtered and full) */
  private removeEvaluationFromLists(id: string): void {
    this.evaluations = this.evaluations.filter(item => item.evaluationID !== id);
    this.filteredEvaluations = this.filteredEvaluations.filter(item => item.evaluationID !== id);
  }

  /** Shows specific error messages based on error code */
  private handleDeleteError(error: any): void {
    const msg =
      error.status === 404 ? 'Evaluation not found' :
      error.status === 500 ? 'Server error while deleting evaluation' :
      'Failed to delete evaluation';
    this.notificationService.showError(msg);
    if (error.status === 404) this.loadAllEvaluations();
  }

  /**
   * Fills form with evaluation data to allow update.
   * Scrolls to form smoothly.
   */
  updateEvaluation(evaluation: any): void {
    this.isUpdateMode = true;
    this.selectedEvaluationId = evaluation.evaluationID;
    this.evaluationForm.setValue({
      id: evaluation.evaluationID,
      type: evaluation.type,
      date: evaluation.date,
      courseId: evaluation.course.courseID,
    });
    document.querySelector('.form-card')?.scrollIntoView({ behavior: 'smooth' });
  }

  /** Cancels the update process and resets the form */
  cancelUpdate(): void {
    this.resetForm();
  }

  /** Clears the form and resets the update state */
  private resetForm(): void {
    this.evaluationForm.reset();
    this.isUpdateMode = false;
    this.selectedEvaluationId = '';
  }

  /** Marks all form fields as touched to trigger validation messages */
  private markFormGroupTouched(): void {
    Object.keys(this.evaluationForm.controls).forEach(key => {
      this.evaluationForm.get(key)?.markAsTouched();
    });
  }
}