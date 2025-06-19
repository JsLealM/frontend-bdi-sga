import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../../shared/models/student.model';


/**
 * Service responsible for handling HTTP requests related to Student operations.
 * Communicates with the backend API to perform CRUD operations.
 */
@Injectable({
  providedIn: 'root'
})
export class StudentService {

  /** Base URL for the Student REST API */
  private API_SERVER = "http://localhost:8080/students/";

  constructor(private httpClient: HttpClient) {}

  /**
   * Retrieve all students.
   * @returns Observable containing the list of all students.
   */
  public getAll(): Observable<Student[]> {
    return this.httpClient.get<Student[]>(this.API_SERVER);
  }

  /**
   * Save or update a student.
   * If the student ID exists, this acts as an update.
   * @param student The student object to save or update.
   * @returns Observable of the saved student.
   */
  public save(student: Student): Observable<Student> {
    return this.httpClient.post<Student>(this.API_SERVER, student);
  }

  /**
   * Delete a student by ID.
   * @param id The ID of the student to delete.
   * @returns Observable containing a plain text response.
   */
  public delete(id: number): Observable<string> {
    return this.httpClient.delete(`${this.API_SERVER}delete/${id}`, {
      responseType: 'text'
    });
  }
}
