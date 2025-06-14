import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private API_SERVER = "http://localhost:8080/evaluation/";

  constructor(private httpClient: HttpClient  ) { }

  public getAllEvaluationByCourse(courseId: string): Observable<any>{
    return this.httpClient.get(this.API_SERVER+"course/"+courseId)
  }

  public getAllEvaluation(): Observable<any>{
    return this.httpClient.get(this.API_SERVER);
  }

  public saveEvaluation (evaluation:any): Observable<any>{
    return this.httpClient.post(this.API_SERVER,evaluation);
  }

  // Nuevo método para actualizar evaluación
  public updateEvaluation (id: string, evaluation:any): Observable<any>{
      const url = this.API_SERVER + "update/" + id;
      console.log('URL de actualización:', url); // Para debug
      return this.httpClient.put(url, evaluation);
  }

public deleteEvaluation(id: string): Observable<string> {
  return this.httpClient.delete(this.API_SERVER + "delete/" + id, {
    responseType: 'text' // Esto es crucial para manejar respuestas de texto
  });
}
}