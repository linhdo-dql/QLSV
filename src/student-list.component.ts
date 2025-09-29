import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { AuthService } from './auth.service';
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
  templateUrl: './student-list.component.html', // Giữ nguyên tên file
})
export class DashboardComponent {
  readonly userRole = input.required<UserRole>();
  readonly isAdmin = computed(() => this.userRole() === 'admin');
  currentView = signal<View>('dashboard');

  showAccountModal = signal(false);

  // Lấy thông tin tài khoản từ localStorage (ưu tiên), fallback theo role
  accountInfo = computed(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Ưu tiên hiển thị họ tên nếu có
        user.displayName = (user.firstName && user.lastName)
          ? `${user.firstName} ${user.lastName}`
          : user.username;
        return user;
      } catch {
        // fallback nếu lỗi
      }
    }
    return {
      username: this.userRole() === 'admin' ? 'admin' : 'teacher',
      role: this.userRole(),
      displayName: this.userRole() === 'admin' ? 'admin' : 'teacher',
    };
  });

  changeView(view: View): void {
    this.currentView.set(view);
  }

  openAccountModal(): void {
    console.log('Opening account modal');
    this.showAccountModal.set(true);
  }

  closeAccountModal(): void {
    console.log('Closing account modal');
    this.showAccountModal.set(false);
  }

  logout(): void {
    // Thực tế sẽ gọi authService.logout() và chuyển hướng
    window.location.reload();
  }
}