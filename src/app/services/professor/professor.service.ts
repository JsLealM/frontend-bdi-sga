import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service responsible for handling HTTP requests related to Professor operations.
 * Communicates with the backend API to perform CRUD operations.
 */
@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  /** Base URL for the Professor REST API */
  private API_SERVER = "http://localhost:8080/professors/";

  constructor(private httpClient: HttpClient) { }

  /**
   * Retrieve all professors.
   * @returns Observable containing the list of all professors.
   */
  public getAllProfessors(): Observable<any> {
    return this.httpClient.get(this.API_SERVER);
  }

  /**
   * Retrieve a professor by ID.
   * @param id The ID of the professor.
   * @returns Observable containing the professor data.
   */
  public getProfessorById(id: string): Observable<any> {
    return this.httpClient.get(this.API_SERVER + id);
  }

  /**
   * Save a new professor.
   * @param professor The professor object to be saved.
   * @returns Observable containing the saved professor.
   */
  public saveProfessor(professor: any): Observable<any> {
    return this.httpClient.post(this.API_SERVER, professor);
  }

  /**
   * Update an existing professor by ID.
   * @param id The ID of the professor to update.
   * @param professor The updated professor data.
   * @returns Observable containing the updated professor.
   */
  public updateProfessor(id: string, professor: any): Observable<any> {
    return this.httpClient.put(this.API_SERVER + "update/" + id, professor);
  }

  /**
   * Delete a professor by ID.
   * @param id The ID of the professor to delete.
   * @returns Observable containing a text response from the backend.
   */
  public deleteProfessor(id: string): Observable<string> {
    return this.httpClient.delete(this.API_SERVER + "delete/" + id, {
      responseType: 'text'
    });
  }
}
