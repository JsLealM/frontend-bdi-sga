import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EvaluationComponent } from './pages/evaluation/evaluation.component';
import { StudentsComponent } from './pages/students/students.component';
import { ProfessorsComponent } from './pages/professors/professors.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Ruta por defecto
  { path: 'evaluations', component: EvaluationComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'professors', component: ProfessorsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
