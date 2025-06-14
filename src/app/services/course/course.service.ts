import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private API_SERVER = "http://localhost:8080/course/";

  constructor(
    private httpClient: HttpClient
  ) { }

  public getAllCourses(): Observable<any>{
    return this.httpClient.get(this.API_SERVER)
  }
}
