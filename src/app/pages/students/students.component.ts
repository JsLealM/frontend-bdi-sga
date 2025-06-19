/**
 * StudentsComponent
 * ---------------------
 * This component manages the student form interface, allowing users to:
 * - Create new students
 * - Update existing students
 * - Delete students
 * - Display a list of all students
 * 
 * It interacts with the following services:
 * - StudentService (CRUD operations for students)
 * - FormBuilder (for building reactive forms with validation)
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../services/student/student.service';
import { Student } from '../../shared/models/student.model';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  // Reactive form group for student form
  studentForm!: FormGroup;
  // List of all students
  students: Student[] = [];
  // Flag to indicate if the form is in update mode
  isUpdateMode = false;
  // ID of the selected student (when updating)
  selectedStudentId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService
  ) {}

  /** Called once after component initialization */
  ngOnInit(): void {
    this.initializeForm();
    this.loadStudents();
  }

  /** Initializes the reactive form with validation rules */
  initializeForm(): void {
    this.studentForm = this.fb.group({
      studentId: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      maternalSurname: [''],
      email: ['', [Validators.required, Validators.email]],
      status: ['', Validators.required],
      birthDate: ['', Validators.required],
    });
  }

  /** Loads all students from the backend */
  loadStudents(): void {
    this.studentService.getAll().subscribe({
      next: (resp) => this.students = resp,
      error: (err) => console.error('Error loading students:', err)
    });
  }

  /**
   * Handles form submission: creates or updates a student
   * - If the form is invalid, aborts
   * - Otherwise, submits data and reloads the student list
   */

  saveStudent(): void {
    if (this.studentForm.invalid) return;

    const student: Student = this.studentForm.getRawValue();

    if (this.isUpdateMode && this.selectedStudentId !== null) {
      // Update existing student
      this.studentService.save(student).subscribe({
        next: () => {
          alert('Student updated successfully');
          this.resetForm();
          this.loadStudents();
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Error updating student');
        }
      });
    } else {
      // Create new student
      this.studentService.save(student).subscribe({
        next: () => {
          alert('Student created successfully');
          this.resetForm();
          this.loadStudents();
        },
        error: (err) => {
          console.error('Save error:', err);
          alert('Error creating student');
        }
      });
    }
  }

  /**
   * Deletes a student after confirmation
   * Updates the local list on success
   */
  deleteStudent(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this student?');
    if (!confirmed) return;

    this.studentService.delete(id).subscribe({
      next: () => {
        this.students = this.students.filter(s => s.studentId !== id);
        alert('Student deleted successfully');
      },
      error: (err) => {
        console.error('Delete error:', err);
        alert('Error deleting student');
      }
    });
  }

  /**
   * Loads the selected student's data into the form for editing
   * - Switches the form to update mode
   * - Disables the studentId field
   * - Scrolls to the form for better UX
   */
  editStudent(student: Student): void {
    this.isUpdateMode = true;
    this.selectedStudentId = student.studentId;
    this.studentForm.patchValue({ ...student });
    this.studentForm.get('studentId')?.disable();
    document.querySelector('.form-card')?.scrollIntoView({ behavior: 'smooth' });
  }
  
  /** Cancels the update process and resets the form to its default state */
  cancelUpdate(): void {
    this.resetForm();
  }

  /** Resets the form, clears update state, and re-enables the studentId field */
  private resetForm(): void {
    this.studentForm.reset();
    this.studentForm.get('studentId')?.enable();
    this.isUpdateMode = false;
    this.selectedStudentId = null;
  }
}