export interface Student {
  studentId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  maternalSurname?: string;
  email: string;
  status: string;
  birthDate: string; // ISO string (e.g. '2025-06-18')
}