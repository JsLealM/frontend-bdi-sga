import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/**
 * Service for handling HTTP requests related to courses.
 */
@Injectable({
  providedIn: 'root'
})
export class CourseService {

  /**
   * Base URL for course-related endpoints.
   */
  private API_SERVER = "http://localhost:8080/course/";

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Retrieves all courses from the backend.
   * @returns An Observable containing the list of courses.
   */
  public getAllCourses(): Observable<any> {
    return this.httpClient.get(this.API_SERVER);
  }
}
