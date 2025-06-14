import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluationService } from '../../services/evaluation/evaluation.service';
import { CourseService } from '../../services/course/course.service';


@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrl: './evaluation.component.css'
})
export class EvaluationComponent implements OnInit {

  evaluationForm!: FormGroup;
  courses: any;
  evaluations: any;
  minDate: Date = new Date(2025, 0, 20);
  maxDate: Date = new Date(2025, 5, 20);

  // Variable para controlar si estamos en modo actualización
  isUpdateMode: boolean = false;
  selectedEvaluationId: string = '';

  constructor(
    public fb: FormBuilder,
    public evaluationService: EvaluationService,
    public courseService: CourseService
  ) { }


  ngOnInit(): void {
    this.evaluationForm = this.fb.group({
      id: [''],
      type: ['', Validators.required],
      date: ['', Validators.required],
      courseId: ['', Validators.required],
    });

    this.courseService.getAllCourses().subscribe({
      next: (resp) => {
        this.courses = resp;
      },
      error: (err) => {
        console.error('Error al cargar cursos:', err);
      }
    });

    this.evaluationService.getAllEvaluation().subscribe(resp => {
      this.evaluations = resp;
    },
      error => { console.error(error) }
    )
  }
  //Save
  saveEvaluation(): void {
    if (this.evaluationForm.invalid) {
      return;
    }

    const formValue = this.evaluationForm.value;

    const evaluation = {
      type: formValue.type,
      date: formValue.date,
      course: {
        courseID: formValue.courseId
      }
    };
    if (this.isUpdateMode) {
      // Modo actualización
      this.evaluationService.updateEvaluation(this.selectedEvaluationId, evaluation).subscribe({
        next: (resp) => {
          console.log('Evaluación actualizada:', resp);
          alert('¡La evaluación se actualizó con éxito!');
          this.resetForm();
          // Actualizar la lista de evaluaciones
          this.loadAllEvaluations();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('Error al actualizar la evaluación');
        }
      });
    } else {
      // Modo creación
      this.evaluationService.saveEvaluation(evaluation).subscribe({
        next: (resp) => {
          console.log('Evaluación guardada:', resp);
          alert('¡La evaluación se guardó con éxito!');
          this.resetForm();

          this.evaluations = this.evaluations.filter((evaluation: any) =>
            resp.id !== evaluation.evaluationID
          );
          this.evaluations.push(resp);
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
  deleteEvaluation(evaluation: any) {
  const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar la evaluación "${evaluation.type}"?`);
  
  if (!confirmDelete) {
    return;
  }

  console.log('Eliminando evaluación:', evaluation.evaluationID);

  this.evaluationService.deleteEvaluation(evaluation.evaluationID.toString()).subscribe({
    next: (response) => {
      console.log('✅ Respuesta del servidor:', response);
      console.log('✅ Tipo de respuesta:', typeof response);
      
      // Actualizar la lista local
      this.evaluations = this.evaluations.filter((item: any) =>
        item.evaluationID !== evaluation.evaluationID
      );
      
      console.log('✅ Evaluación eliminada de la lista local');
      alert('La evaluación se eliminó con éxito');
    },
    error: (error) => {
      console.error('❌ Error al eliminar:', error);
      console.error('❌ Status:', error.status);
      console.error('❌ Mensaje:', error.error);
      
      if (error.status === 404) {
        alert('Evaluación no encontrada');
        // Actualizar lista por si acaso
        this.loadAllEvaluations();
      } else if (error.status === 500) {
        alert('Error del servidor al eliminar la evaluación');
      } else {
        alert('Error al eliminar la evaluación');
      }
    }
  });
}
  //Update 
  updateEvaluation(evaluation: any) {
    this.isUpdateMode = true;
    this.selectedEvaluationId = evaluation.evaluationID;

    this.evaluationForm.setValue({
      id: evaluation.evaluationID,
      type: evaluation.type,
      date: evaluation.date,
      courseId: evaluation.course.courseID, // Corregido: usar course.courseID
    });
  }
  // Método para cancelar la actualización y volver al modo crear
  cancelUpdate() {
    this.resetForm();
  }
  // Método para resetear el formulario y variables de control
  private resetForm() {
    this.evaluationForm.reset();
    this.isUpdateMode = false;
    this.selectedEvaluationId = '';
  }
  // Método para recargar todas las evaluaciones
  private loadAllEvaluations() {
    this.evaluationService.getAllEvaluation().subscribe(resp => {
      this.evaluations = resp;
    },
      error => { console.error(error) });
  }
  uploadEvaluationsByCourse(id: string) {
    this.evaluationService.getAllEvaluationByCourse(id).subscribe(resp => {
      this.evaluations = resp;
    },
      error => { console.error(error) }
    )
  }
}