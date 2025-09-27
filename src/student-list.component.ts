/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { UserRole } from './login.component';

import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { FacultyManagementComponent } from './components/faculty-management.component';
import { SubjectManagementComponent } from './components/subject-management.component';
import { TeacherManagementComponent } from './components/teacher-management.component';
import { AdminClassManagementComponent } from './components/admin-class-management.component';
import { CreditClassManagementComponent } from './components/credit-class-management.component';
import { StudentManagementComponent } from './components/student-management.component';
import { TeacherDashboardComponent } from './components/teacher-dashboard.component';

type View = 'dashboard' | 'khoa' | 'monHoc' | 'lopHanhChinh' | 'giaoVien' | 'lopTinChi' | 'sinhvien';

@Component({
  selector: 'app-dashboard',
  imports: [
    AdminDashboardComponent,
    FacultyManagementComponent,
    SubjectManagementComponent,
    TeacherManagementComponent,
    AdminClassManagementComponent,
    CreditClassManagementComponent,
    StudentManagementComponent,
    TeacherDashboardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './student-list.component.html',
})
export class DashboardComponent {
  readonly userRole = input.required<UserRole>();
  
  readonly isAdmin = computed(() => this.userRole() === 'admin');
  
  currentView = signal<View>('dashboard');

  changeView(view: View): void {
    this.currentView.set(view);
  }
}