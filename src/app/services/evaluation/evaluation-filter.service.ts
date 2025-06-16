import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Servicio para manejar filtros de evaluaciones
 */
@Injectable({
  providedIn: 'root'
})
export class EvaluationFilterService {

  private selectedCourseSubject = new BehaviorSubject<string>('');
  private filteredEvaluationsSubject = new BehaviorSubject<any[]>([]);

  /** Observable del curso seleccionado para filtrar */
  selectedCourse$ = this.selectedCourseSubject.asObservable();

  /** Observable de las evaluaciones filtradas */
  filteredEvaluations$ = this.filteredEvaluationsSubject.asObservable();

  /**
   * Establece el curso seleccionado para filtrar
   */
  setSelectedCourse(courseId: string): void {
    this.selectedCourseSubject.next(courseId);
  }

  /**
   * Obtiene el curso actualmente seleccionado
   */
  getSelectedCourse(): string {
    return this.selectedCourseSubject.value;
  }

  /**
   * Establece las evaluaciones filtradas
   */
  setFilteredEvaluations(evaluations: any[]): void {
    this.filteredEvaluationsSubject.next(evaluations);
  }

  /**
   * Obtiene las evaluaciones filtradas actuales
   */
  getFilteredEvaluations(): any[] {
    return this.filteredEvaluationsSubject.value;
  }

  /**
   * Limpia todos los filtros
   */
  clearFilters(): void {
    this.selectedCourseSubject.next('');
  }

  /**
   * Filtra evaluaciones localmente por curso
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
   * Formatea fecha para visualización
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