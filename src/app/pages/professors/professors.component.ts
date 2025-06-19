import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfessorService } from '../../services/professor/professor.service';
import { NotificationService } from '../../services/notification.service';

/**
 * Component for managing professor entities via a form interface.
 * 
 * Allows users to create, update, list, and delete professors. 
 * Handles form validation, user notifications, and communicates with the backend service layer.
 */
@Component({
  selector: 'app-professors',
  templateUrl: './professors.component.html',
  styleUrls: ['./professors.component.css']
})
export class ProfessorsComponent implements OnInit {

  /** Reactive form for professor input */
  professorForm!: FormGroup;

  /** List of all professors displayed in the UI */
  professors: any[] = [];

  /** Indicates if the form is in update mode */
  isUpdateMode: boolean = false;

  /** Stores the currently selected professor ID (for updates) */
  selectedProfessorId: string = '';

  constructor(
    private fb: FormBuilder,
    private professorService: ProfessorService,
    private notificationService: NotificationService
  ) {}

  /**
   * Lifecycle hook: initializes the component.
   * Builds the reactive form and loads all professors from the backend.
   */
  ngOnInit(): void {
    this.professorForm = this.fb.group({
      professorId: ['', Validators.required], // Required only in creation mode
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required]
    });

    this.loadAllProfessors();
  }

  /**
   * Handles form submission for both creating and updating a professor.
   * Extracts and formats form data, then delegates to the appropriate service method.
   */
  saveProfessor(): void {
    if (this.professorForm.invalid) {
      this.notificationService.showError('Please fill in all required fields');
      return;
    }

    const formValue = this.professorForm.value;
    const [firstName, ...lastNameParts] = formValue.name.trim().split(' ');
    const lastName = lastNameParts.join(' ') || '';

    const professorPayload: any = {
      firstName,
      lastName,
      email: formValue.email,
      grade: formValue.department
    };

    if (this.isUpdateMode) {
      this.professorService.updateProfessor(this.selectedProfessorId, professorPayload).subscribe({
        next: () => {
          this.notificationService.showSuccess('Professor updated successfully');
          this.resetForm();
          this.loadAllProfessors();
        },
        error: (err) => {
          console.error('Update error:', err);
          this.notificationService.showError('Failed to update professor');
        }
      });
    } else {
      professorPayload.professorId = formValue.professorId; // Required for creation
      this.professorService.saveProfessor(professorPayload).subscribe({
        next: () => {
          this.notificationService.showSuccess('Professor saved successfully');
          this.resetForm();
          this.loadAllProfessors();
        },
        error: (err) => {
          console.error('Creation error:', err);
          this.notificationService.showError('Failed to save professor');
        }
      });
    }
  }

  /**
   * Prepares the form for editing an existing professor.
   * Loads current values into the form and disables the ID field.
   * 
   * @param professor The professor object selected for update.
   */
  updateProfessor(professor: any): void {
    this.isUpdateMode = true;
    this.selectedProfessorId = professor.professorID;

    this.professorForm.setValue({
      professorId: professor.professorID,
      name: professor.name,
      email: professor.email,
      department: professor.department
    });

    this.professorForm.get('professorId')?.disable(); // Prevent editing ID
  }

  /**
   * Displays a confirmation dialog before deleting a professor.
   * If confirmed, triggers the delete operation.
   * 
   * @param professor The professor object selected for deletion.
   */
  deleteProfessor(professor: any): void {
    this.notificationService.showDeleteConfirmDialog(professor.name)
      .subscribe(confirmed => {
        if (confirmed) {
          this.performDeleteProfessor(professor);
        }
      });
  }

  /**
   * Executes the actual deletion of a professor via the service.
   * 
   * @param professor The professor to be deleted.
   */
  private performDeleteProfessor(professor: any): void {
    this.professorService.deleteProfessor(professor.professorID).subscribe({
      next: () => {
        this.professors = this.professors.filter(p => p.professorID !== professor.professorID);
        this.notificationService.showSuccess('Professor deleted successfully');
      },
      error: (err) => {
        console.error(err);
        this.notificationService.showError('Failed to delete professor');
      }
    });
  }

  /**
   * Cancels update mode and resets the form to its default state.
   */
  cancelUpdate(): void {
    this.resetForm();
  }

  /**
   * Resets the form, re-enables the ID field, and clears the update mode state.
   */
  private resetForm(): void {
    this.professorForm.reset();
    this.professorForm.get('professorId')?.enable();
    this.isUpdateMode = false;
    this.selectedProfessorId = '';
  }

  /**
   * Loads all professors from the backend and transforms the data
   * for display in the UI.
   */
  private loadAllProfessors(): void {
    this.professorService.getAllProfessors().subscribe({
      next: (resp: any[]) => {
        this.professors = resp.map(p => ({
          professorID: p.professorId,
          name: `${p.firstName} ${p.lastName}`,
          email: p.email,
          department: p.grade
        }));
      },
      error: (err: any) => {
        console.error('Failed to load professors:', err);
        this.notificationService.showError('Failed to load professors');
      }
    });
  }
}
