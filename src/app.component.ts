/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LoginComponent, UserRole } from './login.component';
import { DashboardComponent } from './student-list.component';

@Component({
  selector: 'app-root',
  // Fix: Use inline template to avoid dependency on a missing file and define component structure
  template: `
    @if (!userRole()) {
      <app-login (loginSuccess)="onLoginSuccess($event)"></app-login>
    } @else {
      <app-dashboard [userRole]="userRole()!"></app-dashboard>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginComponent, DashboardComponent],
  host: {
    'class': 'block h-full',
  },
})
export class AppComponent {
  userRole = signal<UserRole | null>(null);

  onLoginSuccess(role: UserRole): void {
    this.userRole.set(role);
  }
}
