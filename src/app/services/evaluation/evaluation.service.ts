import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/**
 * Service responsible for handling HTTP requests related to Evaluation operations.
 * Communicates with the backend API to perform CRUD operations.
 */
@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  /** Base URL for the Evaluation REST API */
  private API_SERVER = "http://localhost:8080/evaluation/";

  constructor(private httpClient: HttpClient) { }

  /**
   * Retrieve all evaluations associated with a specific course.
   * @param courseId The ID of the course.
   * @returns Observable containing the list of evaluations.
   */
  public getAllEvaluationByCourse(courseId: string): Observable<any> {
    return this.httpClient.get(this.API_SERVER + "course/" + courseId);
  }

  /**
   * Retrieve all evaluations.
   * @returns Observable containing the list of all evaluations.
   */
  public getAllEvaluation(): Observable<any> {
    return this.httpClient.get(this.API_SERVER);
  }

  /**
   * Save a new evaluation.
   * @param evaluation The evaluation object to be saved.
   * @returns Observable containing the saved evaluation.
   */
  public saveEvaluation(evaluation: any): Observable<any> {
    return this.httpClient.post(this.API_SERVER, evaluation);
  }

  /**
   * Update an existing evaluation by ID.
   * @param id The ID of the evaluation to update.
   * @param evaluation The updated evaluation data.
   * @returns Observable containing the updated evaluation.
   */
  public updateEvaluation(id: string, evaluation: any): Observable<any> {
    const url = this.API_SERVER + "update/" + id;
    return this.httpClient.put(url, evaluation);
  }

  /**
   * Delete an evaluation by ID.
   * @param id The ID of the evaluation to delete.
   * @returns Observable containing a text response from the backend.
   */
  public deleteEvaluation(id: string): Observable<string> {
    return this.httpClient.delete(this.API_SERVER + "delete/" + id, {
      responseType: 'text'
    });
  }
}
